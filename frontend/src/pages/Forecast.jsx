import React from "react";

export default function Forecast() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Forecasts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* District forecast cards */}
        {["Kathmandu", "Lalitpur", "Bhaktapur"].map((city) => (
          <div key={city} className="bg-white rounded p-4 shadow border">
            <div className="font-bold mb-2">{city}</div>
            <div className="mb-1">Traffic: --</div>
            <div className="mb-1">AQI: --</div>
            <div className="text-xs text-gray-500">Select horizon: 1h, 3h, 6h, 24h</div>
            <div className="text-xs text-gray-400">[Model comparison, CI toggles, CSV export soon]</div>
          </div>
        ))}
      </div>
    </div>
  );
}
