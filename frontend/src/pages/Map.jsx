import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LAYER_TYPES = [
  { key: "aqi", label: "AQI Sensors" },
  { key: "traffic", label: "Traffic Sensors" },
];

export default function MapPage() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLayer, setActiveLayer] = useState("aqi");

  useEffect(() => {
    fetch("/sensors")
      .then((res) => res.json())
      .then((data) => {
        setSensors(data);
        setLoading(false);
      });
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
      </div>
      <div className="rounded overflow-hidden" style={{ height: 400 }}>
        <MapContainer
          center={markers.length ? [markers[0].lat, markers[0].lng] : defaultCenter}
          zoom={12}
          style={{ height: 400, width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
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
