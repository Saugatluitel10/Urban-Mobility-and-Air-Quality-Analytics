from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .db import SessionLocal
from .models import City, Sensor, AirQualityReading, TrafficReading
from datetime import datetime, timedelta
import os
import json
import math
import redis
from pydantic import BaseModel

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)

CACHE_TTL_SUMMARY = 30
CACHE_TTL_FORECAST = 300
CACHE_TTL_SENSORS = 300
CACHE_TTL_HISTORY = 300
CACHE_TTL_OVERLAYS = 60


def get_cached_json(key: str):
    if not redis_client:
        return None
    try:
        raw = redis_client.get(key)
        if raw is None:
            return None
        return json.loads(raw)
    except Exception:
        return None


def set_cached_json(key: str, value, ttl: int):
    if not redis_client:
        return
    try:
        redis_client.setex(key, ttl, json.dumps(value, default=str))
    except Exception:
        return


def compute_summary(db: Session):
    cities = db.query(City).all()
    result = []
    for city in cities:
        latest_aqi = (
            db.query(AirQualityReading)
            .join(Sensor)
            .filter(Sensor.city_id == city.id)
            .order_by(AirQualityReading.timestamp.desc())
            .first()
        )
        latest_traffic = (
            db.query(TrafficReading)
            .join(Sensor)
            .filter(Sensor.city_id == city.id)
            .order_by(TrafficReading.timestamp.desc())
            .first()
        )
        last_update = None
        if latest_aqi or latest_traffic:
            last_update_dt = max(
                latest_aqi.timestamp if latest_aqi else datetime.min,
                latest_traffic.timestamp if latest_traffic else datetime.min,
            )
            last_update = last_update_dt.isoformat()
        result.append(
            {
                "city": city.name,
                "aqi": latest_aqi.aqi if latest_aqi else None,
                "traffic": latest_traffic.congestion_index if latest_traffic else None,
                "last_update": last_update,
            }
        )
    return result


def build_history_from_db(db: Session, days: int = 7, start: datetime | None = None, end: datetime | None = None):
    if start is None or end is None:
        end = datetime.utcnow()
        start = end - timedelta(days=days)

    if end <= start:
        return None

    base_date = start.date()
    total_days = (end.date() - base_date).days + 1
    if total_days <= 0:
        total_days = 1

    dates = [base_date + timedelta(days=i) for i in range(total_days)]
    date_ranges = []
    for d in dates:
        day_start = datetime(d.year, d.month, d.day)
        day_end = day_start + timedelta(days=1)
        date_ranges.append((day_start, day_end))

    cities = db.query(City).all()
    aqi_by_city = {}
    congestion_by_city = {}

    for city in cities:
        aqi_rows = (
            db.query(AirQualityReading)
            .join(Sensor)
            .filter(
                Sensor.city_id == city.id,
                AirQualityReading.timestamp >= start,
                AirQualityReading.timestamp < end,
            )
            .all()
        )
        traffic_rows = (
            db.query(TrafficReading)
            .join(Sensor)
            .filter(
                Sensor.city_id == city.id,
                TrafficReading.timestamp >= start,
                TrafficReading.timestamp < end,
            )
            .all()
        )

        aqi_series = []
        congestion_series = []
        for day_start, day_end in date_ranges:
            day_aqi_values = [
                r.aqi
                for r in aqi_rows
                if r.timestamp >= day_start and r.timestamp < day_end and r.aqi is not None
            ]
            aqi_series.append(
                sum(day_aqi_values) / len(day_aqi_values) if day_aqi_values else None
            )

            day_congestion_values = [
                r.congestion_index
                for r in traffic_rows
                if r.timestamp >= day_start
                and r.timestamp < day_end
                and r.congestion_index is not None
            ]
            congestion_series.append(
                sum(day_congestion_values) / len(day_congestion_values)
                if day_congestion_values
                else None
            )

        aqi_by_city[city.name] = aqi_series
        congestion_by_city[city.name] = congestion_series

    correlation_aqi = []
    correlation_congestion = []
    for city_name, aqi_series in aqi_by_city.items():
        city_congestion_series = congestion_by_city.get(city_name, [])
        for idx in range(min(len(aqi_series), len(city_congestion_series))):
            aqi_value = aqi_series[idx]
            congestion_value = city_congestion_series[idx]
            if aqi_value is not None and congestion_value is not None:
                correlation_aqi.append(aqi_value)
                correlation_congestion.append(congestion_value)

    if not aqi_by_city and not congestion_by_city:
        return None

    return {
        "dates": [d.isoformat() for d in dates],
        "aqi": aqi_by_city,
        "congestion": congestion_by_city,
        "correlation": {
            "aqi": correlation_aqi,
            "congestion": correlation_congestion,
        },
    }


def build_mock_history():
    dates = [
        "2025-12-01",
        "2025-12-02",
        "2025-12-03",
        "2025-12-04",
        "2025-12-05",
        "2025-12-06",
        "2025-12-07",
    ]
    aqi = {
        "Kathmandu": [160, 155, 170, 180, 165, 150, 158],
        "Lalitpur": [140, 145, 150, 155, 150, 142, 148],
        "Bhaktapur": [150, 152, 160, 168, 160, 155, 150],
    }
    congestion = {
        "Kathmandu": [0.8, 0.78, 0.82, 0.85, 0.8, 0.76, 0.79],
        "Lalitpur": [0.6, 0.62, 0.64, 0.66, 0.63, 0.59, 0.61],
    }
    correlation = {
        "aqi": [140, 150, 160, 170, 180],
        "congestion": [0.55, 0.6, 0.7, 0.8, 0.88],
    }
    return {
        "dates": dates,
        "aqi": aqi,
        "congestion": congestion,
        "correlation": correlation,
    }


def build_overlays_from_sensors(db: Session):
    sensors = db.query(Sensor).all()
    heatmap_points = []
    wind_vectors = []
    for s in sensors:
        meta = s.meta or {}
        lat = meta.get("lat")
        lng = meta.get("lng")
        if lat is None or lng is None:
            continue

        if s.type == "air":
            aqi = meta.get("aqi")
            base_radius = 500.0
            radius = base_radius
            if aqi is not None:
                try:
                    radius = base_radius + (float(aqi) / 200.0) * 400.0
                except (TypeError, ValueError):
                    radius = base_radius
            heatmap_points.append(
                {
                    "lat": lat,
                    "lng": lng,
                    "aqi": aqi,
                    "radius_m": radius,
                }
            )

        wind_dir = meta.get("wind_dir_deg", 45.0)
        wind_speed = meta.get("wind_speed", 2.0)
        try:
            wind_dir_f = float(wind_dir)
            wind_speed_f = float(wind_speed)
        except (TypeError, ValueError):
            wind_dir_f = 45.0
            wind_speed_f = 2.0
        scale = 0.005 * (wind_speed_f / 3.0)
        rad = math.radians(wind_dir_f)
        dlat = scale * math.cos(rad)
        dlng = scale * math.sin(rad)
        wind_vectors.append(
            {
                "start": [lat, lng],
                "end": [lat + dlat, lng + dlng],
                "speed": wind_speed_f,
                "direction_deg": wind_dir_f,
            }
        )

    return {"heatmap": heatmap_points, "wind": wind_vectors}


class SimulationRequest(BaseModel):
    private_vehicle_reduction: float = 0.0
    odd_even_policy: bool = False


@router.get("/summary", tags=["summary"])
def get_summary(db: Session = Depends(get_db)):
    cache_key = "summary:v1"
    cached = get_cached_json(cache_key)
    if cached is not None:
        return cached
    result = compute_summary(db)
    set_cached_json(cache_key, result, CACHE_TTL_SUMMARY)
    return result


@router.get("/sensors", tags=["sensors"])
def get_sensors(db: Session = Depends(get_db)):
    cache_key = "sensors:v1"
    cached = get_cached_json(cache_key)
    if cached is not None:
        return cached
    sensors = db.query(Sensor).all()
    result = [
        {
            "id": s.id,
            "city_id": s.city_id,
            "type": s.type,
            "meta": s.meta,
        }
        for s in sensors
    ]
    set_cached_json(cache_key, result, CACHE_TTL_SENSORS)
    return result


@router.get("/overlays/current", tags=["overlays"])
def get_current_overlays(db: Session = Depends(get_db)):
    cache_key = "overlays:current:v1"
    cached = get_cached_json(cache_key)
    if cached is not None:
        return cached

    overlays = build_overlays_from_sensors(db)
    if not overlays["heatmap"] and not overlays["wind"]:
        overlays = {
            "heatmap": [
                {"lat": 27.71, "lng": 85.32, "aqi": 180, "radius_m": 700},
                {"lat": 27.69, "lng": 85.34, "aqi": 140, "radius_m": 500},
                {"lat": 27.7, "lng": 85.29, "aqi": 90, "radius_m": 400},
            ],
            "wind": [
                {"start": [27.7, 85.32], "end": [27.705, 85.325], "speed": 2.0, "direction_deg": 45.0},
                {"start": [27.69, 85.33], "end": [27.695, 85.335], "speed": 3.0, "direction_deg": 60.0},
            ],
        }

    set_cached_json(cache_key, overlays, CACHE_TTL_OVERLAYS)
    return overlays


@router.get("/forecast/{city_id}", tags=["forecast"])
def get_forecast(city_id: int, horizon: int = 24, db: Session = Depends(get_db)):
    if horizon <= 0:
        horizon = 1
    cache_key = f"forecast:v1:{city_id}:{horizon}"
    cached = get_cached_json(cache_key)
    if cached is not None:
        return cached
    latest_aqi = (
        db.query(AirQualityReading)
        .join(Sensor)
        .filter(Sensor.city_id == city_id)
        .order_by(AirQualityReading.timestamp.desc())
        .first()
    )
    latest_traffic = (
        db.query(TrafficReading)
        .join(Sensor)
        .filter(Sensor.city_id == city_id)
        .order_by(TrafficReading.timestamp.desc())
        .first()
    )
    aqi_value = latest_aqi.aqi if latest_aqi else None
    traffic_value = latest_traffic.congestion_index if latest_traffic else None
    if aqi_value is not None:
        aqi_forecast = [aqi_value for _ in range(horizon)]
    else:
        aqi_forecast = [None for _ in range(horizon)]
    if traffic_value is not None:
        traffic_forecast = [traffic_value for _ in range(horizon)]
    else:
        traffic_forecast = [None for _ in range(horizon)]
    result = {
        "city_id": city_id,
        "horizon": horizon,
        "aqi_forecast": aqi_forecast,
        "traffic_forecast": traffic_forecast,
    }
    set_cached_json(cache_key, result, CACHE_TTL_FORECAST)
    return result


@router.post("/simulate", tags=["simulation"])
def simulate(request: SimulationRequest, db: Session = Depends(get_db)):
    summary = compute_summary(db)
    aqi_values = [item["aqi"] for item in summary if item["aqi"] is not None]
    traffic_values = [item["traffic"] for item in summary if item["traffic"] is not None]
    baseline_aqi = sum(aqi_values) / len(aqi_values) if aqi_values else None
    baseline_traffic = sum(traffic_values) / len(traffic_values) if traffic_values else None
    reduction = max(0.0, min(100.0, request.private_vehicle_reduction))
    vehicle_factor = 1.0 - reduction / 100.0
    odd_even_factor = 0.85 if request.odd_even_policy else 1.0
    scenario_traffic = (
        baseline_traffic * vehicle_factor * odd_even_factor
        if baseline_traffic is not None
        else None
    )
    aqi_factor = 1.0 - (reduction / 100.0) * 0.5
    odd_even_aqi_factor = 0.9 if request.odd_even_policy else 1.0
    scenario_aqi = (
        baseline_aqi * aqi_factor * odd_even_aqi_factor
        if baseline_aqi is not None
        else None
    )
    delta_traffic = (
        scenario_traffic - baseline_traffic
        if scenario_traffic is not None and baseline_traffic is not None
        else None
    )
    delta_aqi = (
        scenario_aqi - baseline_aqi
        if scenario_aqi is not None and baseline_aqi is not None
        else None
    )
    result = {
        "inputs": {
            "private_vehicle_reduction": reduction,
            "odd_even_policy": request.odd_even_policy,
        },
        "baseline": {
            "traffic_congestion_index": baseline_traffic,
            "aqi": baseline_aqi,
        },
        "scenario": {
            "traffic_congestion_index": scenario_traffic,
            "aqi": scenario_aqi,
        },
        "delta": {
            "traffic_congestion_index": delta_traffic,
            "aqi": delta_aqi,
        },
        "meta": {
            "generated_at": datetime.utcnow().isoformat(),
            "horizon_hours": 24,
        },
    }
    return result


@router.get("/history/summary", tags=["history"])
def get_history_summary(
    days: int = 7,
    start: str | None = None,
    end: str | None = None,
    db: Session = Depends(get_db),
):
    start_dt = None
    end_dt = None

    if start and end:
        try:
            start_dt = datetime.fromisoformat(start)
            end_dt = datetime.fromisoformat(end)
            if end_dt <= start_dt:
                start_dt = None
                end_dt = None
        except Exception:
            start_dt = None
            end_dt = None

    if start_dt and end_dt:
        cache_key = f"history:summary:v2:{start_dt.date().isoformat()}:{end_dt.date().isoformat()}"
    else:
        if days <= 0:
            days = 7
        cache_key = f"history:summary:v1:{days}"

    cached = get_cached_json(cache_key)
    if cached is not None:
        return cached

    if start_dt and end_dt:
        history = build_history_from_db(db, start=start_dt, end=end_dt)
    else:
        history = build_history_from_db(db, days=days)

    if history is None:
        history = build_mock_history()
    set_cached_json(cache_key, history, CACHE_TTL_HISTORY)
    return history
