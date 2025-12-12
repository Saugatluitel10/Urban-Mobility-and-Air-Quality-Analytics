import React from "react";

export default function AdminOps() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">Admin &amp; Model Ops</h2>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded p-4 shadow text-gray-700">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Model status</div>
          <div className="font-semibold mb-1">Urban AQI forecaster (mock)</div>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>Current version: <span className="font-mono">aqi-v0.1.0</span></li>
            <li>Last retrain: 2025-11-30 (demo date)</li>
            <li>Online latency (p95): ~60ms</li>
          </ul>
        </div>
        <div className="bg-white rounded p-4 shadow text-gray-700">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Drift &amp; alerts</div>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>Input drift: <span className="text-green-600 font-semibold">OK</span> (traffic, meteorology)</li>
            <li>Label drift: <span className="text-yellow-600 font-semibold">Watch</span> (few high-AQI days)</li>
            <li>Alerts: 0 open, 3 resolved (mock)</li>
          </ul>
        </div>
        <div className="bg-white rounded p-4 shadow text-gray-700">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Datasets</div>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>urban-aqi-sensors: v3 (2023-2025)</li>
            <li>urban-traffic-loops: v2 (2024-2025)</li>
            <li>meteorology-reanalysis: v1</li>
          </ul>
        </div>
      </div>
      <div className="bg-white rounded p-4 shadow text-gray-700 mb-3">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Experiment history (mock)</div>
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-1 pr-2 font-semibold">Run</th>
              <th className="py-1 pr-2 font-semibold">Model</th>
              <th className="py-1 pr-2 font-semibold">Metric</th>
              <th className="py-1 pr-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-1 pr-2 font-mono">exp-012</td>
              <td className="py-1 pr-2">aqi-v0.1.0</td>
              <td className="py-1 pr-2">RMSE: 14.2</td>
              <td className="py-1 pr-2 text-green-600">Promoted</td>
            </tr>
            <tr className="border-b">
              <td className="py-1 pr-2 font-mono">exp-011</td>
              <td className="py-1 pr-2">aqi-v0.0.9</td>
              <td className="py-1 pr-2">RMSE: 15.8</td>
              <td className="py-1 pr-2 text-gray-500">Archived</td>
            </tr>
            <tr>
              <td className="py-1 pr-2 font-mono">exp-010</td>
              <td className="py-1 pr-2">traffic-baseline</td>
              <td className="py-1 pr-2">MAPE: 9.1%</td>
              <td className="py-1 pr-2 text-gray-500">Archived</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-xs text-gray-500">
        This page is access-controlled. Production deployments will integrate with your auth system
        and experiment tracker (e.g., MLflow) rather than hard-coded values.
      </div>
    </div>
  );
}
