import React from "react";

export default function DataExplorer() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Data Explorer &amp; API Docs</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded p-4 shadow text-gray-700 lg:col-span-2">
          <div className="font-semibold mb-2 text-sm">Key API endpoints (read-only)</div>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>
              <span className="font-mono bg-gray-100 px-1 py-0.5 rounded mr-2">GET /summary</span>
              Latest AQI and congestion snapshot for each city.
            </li>
            <li>
              <span className="font-mono bg-gray-100 px-1 py-0.5 rounded mr-2">GET /sensors</span>
              Sensor registry with locations and metadata (AQI/traffic, labels).
            </li>
            <li>
              <span className="font-mono bg-gray-100 px-1 py-0.5 rounded mr-2">GET /history/summary</span>
              Short historical aggregates used for quick charts and trends.
            </li>
            <li>
              <span className="font-mono bg-gray-100 px-1 py-0.5 rounded mr-2">GET /forecast/{{city_id}}</span>
              Simple AQI + traffic forecasts for a given city.
            </li>
            <li>
              <span className="font-mono bg-gray-100 px-1 py-0.5 rounded mr-2">POST /simulate</span>
              Policy simulation with mock causal logic (vehicle reduction, odd-even).
            </li>
          </ul>
        </div>
        <div className="bg-white rounded p-4 shadow text-gray-700">
          <div className="font-semibold mb-2 text-sm">Planned API playground</div>
          <p className="text-xs text-gray-600 mb-2">
            A small in-browser console will let you issue authenticated GET requests to selected
            endpoints, inspect JSON responses, and copy curl snippets.
          </p>
          <ul className="text-xs text-gray-600 list-disc ml-5 space-y-1">
            <li>City-level summaries (AQI, congestion, last update).</li>
            <li>Sensor-level time series slices (PM2.5, NO<sub>2</sub>, speed, volume).</li>
            <li>Model outputs (forecasts, scenario deltas) with version tags.</li>
          </ul>
        </div>
      </div>
      <div className="bg-white rounded p-4 shadow text-gray-700">
        <div className="font-semibold mb-2 text-sm">Downloadable datasets (roadmap)</div>
        <ul className="text-xs text-gray-600 list-disc ml-5 space-y-1">
          <li>Daily AQI summary by city and ward (CSV / Parquet).</li>
          <li>Traffic speed and congestion indices on key corridors.</li>
          <li>Policy experiment logs with configuration, metrics, and outcomes.</li>
        </ul>
        <div className="mt-2 text-xs text-gray-500">
          Bulk access will likely require registration and an API key; details will appear here.
        </div>
      </div>
    </div>
  );
}
