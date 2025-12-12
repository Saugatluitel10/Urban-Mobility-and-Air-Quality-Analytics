import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { Circle, Polyline, useMap } from "react-leaflet";
import AnimatedWindArrow from "../components/AnimatedWindArrow";

const LAYER_TYPES = [
  { key: "aqi", label: "AQI Sensors" },
  { key: "traffic", label: "Traffic Sensors" },
];
const OVERLAY_TYPES = [
  { key: "heatmap", label: "AQI Heatmap" },
  { key: "wind", label: "Wind Arrows" },
  { key: "policy", label: "Policy Zones" },
];

export default function MapPage() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLayer, setActiveLayer] = useState("aqi");
  const [activeOverlays, setActiveOverlays] = useState({ heatmap: false, wind: false, policy: false });
  const [overlays, setOverlays] = useState({
    heatmap: [
      { lat: 27.71, lng: 85.32, aqi: 180, radius_m: 700 },
      { lat: 27.69, lng: 85.34, aqi: 140, radius_m: 500 },
      { lat: 27.7, lng: 85.29, aqi: 90, radius_m: 400 },
    ],
    wind: [
      { start: [27.7, 85.32], end: [27.705, 85.325], speed: 2.0 },
      { start: [27.69, 85.33], end: [27.695, 85.335], speed: 3.0 },
    ],
  });
  const [heatmapPhase, setHeatmapPhase] = useState(0);
  const [windPhase, setWindPhase] = useState(0);

  useEffect(() => {
    fetch("/sensors")
      .then((res) => res.json())
      .then((data) => {
        setSensors(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/overlays/current")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data || typeof data !== "object") return;
        setOverlays((prev) => ({
          heatmap:
            Array.isArray(data.heatmap) && data.heatmap.length ? data.heatmap : prev.heatmap,
          wind: Array.isArray(data.wind) && data.wind.length ? data.wind : prev.wind,
        }));
      })
      .catch(() => {
        // keep fallback overlays
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeatmapPhase((p) => (p + 0.05) % 1);
      setWindPhase((p) => (p + 0.05) % 1);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Default Kathmandu Valley center
  const defaultCenter = [27.7, 85.32];
  // Extract markers with lat/lng from meta if available, filtered by active layer
  const markers = sensors
    .filter((s) => (activeLayer === "aqi" ? s.type === "air" : s.type === "traffic"))
    .map((s) => {
      if (s.meta && s.meta.lat && s.meta.lng) {
        return { ...s, lat: s.meta.lat, lng: s.meta.lng };
      }
      return null;
    })
    .filter(Boolean);

  const colorForAqi = (aqi) => {
    if (aqi == null) return "yellow";
    if (aqi >= 150) return "red";
    if (aqi >= 100) return "orange";
    return "yellow";
  };

  const createWindIcon = (directionDeg, color) => {
    let angle = 45;
    if (typeof directionDeg === "number") {
      angle = directionDeg;
    } else if (typeof directionDeg === "string") {
      const parsed = parseFloat(directionDeg);
      if (!Number.isNaN(parsed)) angle = parsed;
    }
    return L.divIcon({
      className: "wind-arrow-icon",
      html: `<div style="width:0;height:0;border-top:4px solid transparent;border-bottom:4px solid transparent;border-left:10px solid ${color};transform:rotate(${angle}deg);"></div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5],
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Interactive Map</h2>
      <div className="mb-4 flex gap-2 items-center">
        <span className="text-sm">Layer:</span>
        {LAYER_TYPES.map((layer) => (
          <button
            key={layer.key}
            className={`px-3 py-1 rounded text-sm font-semibold border ${
              activeLayer === layer.key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-blue-700 border-blue-300"
            }`}
            onClick={() => setActiveLayer(layer.key)}
          >
            {layer.label}
          </button>
        ))}
        <span className="ml-6 text-sm">Overlays:</span>
        {OVERLAY_TYPES.map((overlay) => (
          <label key={overlay.key} className="inline-flex items-center ml-2">
            <input
              type="checkbox"
              checked={!!activeOverlays[overlay.key]}
              onChange={() => setActiveOverlays((prev) => ({ ...prev, [overlay.key]: !prev[overlay.key] }))}
              className="mr-1"
            />
            {overlay.label}
          </label>
        ))}
      </div>
      <div className="rounded overflow-hidden w-full" style={{ height: 400, maxWidth: '100vw' }}>
        {/* Overlay Legends */}
        <div className="absolute z-10 bg-white bg-opacity-80 rounded shadow px-3 py-2 text-xs flex flex-col gap-1 mt-2 ml-2">
          {activeOverlays.heatmap && (
            <div><span className="inline-block w-3 h-3 rounded-full mr-1" style={{background: 'red'}}></span> AQI High</div>
          )}
          {activeOverlays.heatmap && (
            <div><span className="inline-block w-3 h-3 rounded-full mr-1" style={{background: 'orange'}}></span> AQI Medium</div>
          )}
          {activeOverlays.heatmap && (
            <div><span className="inline-block w-3 h-3 rounded-full mr-1" style={{background: 'yellow'}}></span> AQI Low</div>
          )}
          {activeOverlays.wind && (
            <div><span className="inline-block w-3 h-0.5 bg-blue-500 mr-1" style={{width: '16px'}}></span> Wind direction</div>
          )}
          {activeOverlays.policy && (
            <div><span className="inline-block w-3 h-0.5 bg-green-700 mr-1" style={{width: '16px', borderBottom: '2px dashed'}}></span> Policy zone</div>
          )}
        </div>
        <MapContainer
          center={markers.length ? [markers[0].lat, markers[0].lng] : defaultCenter}
          zoom={12}
          style={{ height: 400, width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {/* Mock AQI Heatmap overlay (replace with backend data) */}
          {activeOverlays.heatmap &&
            overlays.heatmap.map((h, idx) => {
              const baseRadius = h.radius_m || 500;
              const pulse = 0.8 + 0.4 * Math.sin(2 * Math.PI * heatmapPhase);
              const radius = baseRadius * pulse;
              const color = h.color || colorForAqi(h.aqi);
              const fillOpacity = 0.18 + 0.12 * Math.sin(2 * Math.PI * heatmapPhase);
              return (
                <Circle
                  key={`heat-${idx}`}
                  center={[h.lat, h.lng]}
                  radius={radius}
                  pathOptions={{ color, fillOpacity }}
                />
              );
            })}
          {/* Wind overlay (animated arrows using custom icon + polylines) */}
          {activeOverlays.wind &&
            overlays.wind.map((w, idx) => {
              const [lat1, lng1] = w.start;
              const [lat2, lng2] = w.end;
              const phase = (windPhase + idx * 0.2) % 1;
              const headLat = lat1 + (lat2 - lat1) * phase;
              const headLng = lng1 + (lng2 - lng1) * phase;
              const color = w.color || "blue";
              const icon = createWindIcon(w.direction_deg, color);
              return (
                <React.Fragment key={`wind-${idx}`}>
                  <Polyline
                    positions={[[lat1, lng1], [lat2, lng2]]}
                    pathOptions={{ color, weight: 1, opacity: 0.3 }}
                  />
                  <Marker position={[headLat, headLng]} icon={icon} interactive={false} />
                </React.Fragment>
              );
            })}
          {/* Mock policy overlay (polygon boundary) */}
          {activeOverlays.policy && [
            <Polyline key="policy1" positions={[[27.7,85.32],[27.705,85.34],[27.71,85.33],[27.7,85.32]]} pathOptions={{ color: 'green', weight: 4, dashArray: '8 8' }} />
          ]}
          {markers.map((s) => (
            <Marker key={s.id} position={[s.lat, s.lng]}>
              <Popup>
                <div>
                  <div className="font-bold mb-1">Sensor #{s.id} ({s.type === "air" ? "AQI" : "Traffic"})</div>
                  <div>City: {s.city_id}</div>
                  {s.meta && s.meta.label && <div>Label: {s.meta.label}</div>}
                  {s.meta && s.meta.aqi && <div>AQI: <span className="font-mono">{s.meta.aqi}</span></div>}
                  {s.meta && s.meta.traffic && <div>Traffic: <span className="font-mono">{s.meta.traffic}</span></div>}
                  {s.meta && s.meta.last_update && (
                    <div className="text-xs text-gray-500">Last update: {new Date(s.meta.last_update).toLocaleString()}</div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="mt-4 text-gray-600">
        <div className="mb-2">Click a marker for sensor details. Use layer controls for AQI, traffic, wind, and policy overlays.</div>
        {markers.length === 0 && (
          <ul className="text-xs text-gray-500">
            {sensors.map((s) => (
              <li key={s.id}>
                Sensor #{s.id} ({s.type}) in city {s.city_id}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
