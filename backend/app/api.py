from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .db import SessionLocal
from .models import City, Sensor, AirQualityReading, TrafficReading
from datetime import datetime, timedelta

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/summary", tags=["summary"])
def get_summary(db: Session = Depends(get_db)):
    # Example: Return latest AQI/traffic for each city
    cities = db.query(City).all()
    result = []
    for city in cities:
        # Get latest AQI
        latest_aqi = (
            db.query(AirQualityReading)
            .join(Sensor)
            .filter(Sensor.city_id == city.id)
            .order_by(AirQualityReading.timestamp.desc())
            .first()
        )
        # Get latest traffic
        latest_traffic = (
            db.query(TrafficReading)
            .join(Sensor)
            .filter(Sensor.city_id == city.id)
            .order_by(TrafficReading.timestamp.desc())
            .first()
        )
        result.append({
            "city": city.name,
            "aqi": latest_aqi.aqi if latest_aqi else None,
            "traffic": latest_traffic.congestion_index if latest_traffic else None,
            "last_update": max(
                latest_aqi.timestamp if latest_aqi else datetime.min,
                latest_traffic.timestamp if latest_traffic else datetime.min,
            ).isoformat() if latest_aqi or latest_traffic else None
        })
    return result

@router.get("/sensors", tags=["sensors"])
def get_sensors(db: Session = Depends(get_db)):
    sensors = db.query(Sensor).all()
    return [
        {
            "id": s.id,
            "city_id": s.city_id,
            "type": s.type,
            "meta": s.meta,
        } for s in sensors
    ]

@router.get("/forecast/{city_id}", tags=["forecast"])
def get_forecast(city_id: int, horizon: int = 24, db: Session = Depends(get_db)):
    # Placeholder: returns empty forecast (to be filled with real model data)
    return {
        "city_id": city_id,
        "horizon": horizon,
        "aqi_forecast": [],
        "traffic_forecast": []
    }
