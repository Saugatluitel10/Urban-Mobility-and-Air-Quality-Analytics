import React from "react";

export default function About() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">About &amp; Guidance</h2>
      <div className="bg-white rounded p-4 shadow text-gray-700 mb-4">
        <p className="text-sm text-gray-700 mb-2">
          This demo brings together <span className="font-semibold">urban mobility</span> and
          <span className="font-semibold"> air quality</span> analytics for Kathmandu, Lalitpur, and
          Bhaktapur. It is designed to help planners, researchers, and citizens explore how traffic,
          meteorology, and regional emissions interact.
        </p>
        <p className="text-xs text-gray-500">
          Numbers and models shown here are illustrative unless explicitly marked as validated.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded p-4 shadow text-gray-700">
          <div className="font-semibold mb-1 text-sm">Data sources (planned)</div>
          <ul className="text-xs text-gray-600 list-disc ml-5 space-y-1">
            <li>Regulatory AQI sensors and community monitors within the valley.</li>
            <li>Traffic loop detectors / GPS probes on major corridors.</li>
            <li>Weather reanalysis and local meteorological stations.</li>
            <li>Open data on land use, roads, and population.</li>
          </ul>
        </div>
        <div className="bg-white rounded p-4 shadow text-gray-700">
          <div className="font-semibold mb-1 text-sm">Methods (high level)</div>
          <ul className="text-xs text-gray-600 list-disc ml-5 space-y-1">
            <li>Time-series models for short-horizon AQI and traffic forecasts.</li>
            <li>Simple scenario models for policy changes (vehicle reduction, odd-even).</li>
            <li>Causal analysis to separate weather effects from mobility and emissions.</li>
            <li>Spatial aggregation to city / corridor / ward-level indicators.</li>
          </ul>
        </div>
        <div className="bg-white rounded p-4 shadow text-gray-700">
          <div className="font-semibold mb-1 text-sm">Limitations &amp; safe use</div>
          <ul className="text-xs text-gray-600 list-disc ml-5 space-y-1">
            <li>Forecasts are probabilistic and may be wrong, especially during rare events.</li>
            <li>Sensor coverage is not uniform; some wards may be under-sampled.</li>
            <li>Do not use this demo alone for health-critical or legal decisions.</li>
            <li>Always cross-check with official bulletins and local expertise.</li>
          </ul>
        </div>
      </div>
      <div className="bg-white rounded p-4 shadow text-gray-700">
        <div className="font-semibold mb-1 text-sm">Contact &amp; collaboration</div>
        <p className="text-xs text-gray-600 mb-1">
          This project is intended as a foundation for collaborative, open analytics. If you are
          interested in contributing data, models, or policy use-cases, please reach out.
        </p>
        <ul className="text-xs text-gray-600 list-disc ml-5 space-y-1">
          <li>Share feedback on data quality or model behavior.</li>
          <li>Suggest new scenarios (e.g., pedestrianization, new bus corridors).</li>
          <li>Discuss integration with existing planning tools and dashboards.</li>
        </ul>
      </div>
    </div>
  );
}
