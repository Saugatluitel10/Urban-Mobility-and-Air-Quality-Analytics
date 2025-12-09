import React, { useEffect, useState } from "react";

const cities = [
  { id: 1, name: "Kathmandu" },
  { id: 2, name: "Lalitpur" },
  { id: 3, name: "Bhaktapur" },
];
const horizons = [1, 3, 6, 24];

export default function Forecast() {
  const [selectedHorizon, setSelectedHorizon] = useState(24);
  const [forecasts, setForecasts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all(
      cities.map((city) =>
        fetch(`/forecast/${city.id}?horizon=${selectedHorizon}`).then((res) => res.json())
      )
    ).then((data) => {
      const fc = {};
      data.forEach((f, i) => {
        fc[cities[i].id] = f;
      });
      setForecasts(fc);
      setLoading(false);
    });
  }, [selectedHorizon]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Forecasts</h2>
      <div className="mb-4 flex gap-2 items-center">
        <span className="text-sm">Select horizon:</span>
        {horizons.map((h) => (
          <button
            key={h}
            className={`px-3 py-1 rounded text-sm font-semibold border ${
              selectedHorizon === h
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-blue-700 border-blue-300"
            }`}
            onClick={() => setSelectedHorizon(h)}
          >
            {h}h
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {cities.map((city) => (
          <div key={city.id} className="bg-white rounded p-4 shadow border">
            <div className="font-bold mb-2">{city.name}</div>
            {loading ? (
              <div className="animate-pulse text-gray-400">Loading...</div>
            ) : (
              <>
                <div className="mb-1">
                  Traffic: {forecasts[city.id]?.traffic_forecast?.[0] ?? "--"}
                </div>
                <div className="mb-1">
                  AQI: {forecasts[city.id]?.aqi_forecast?.[0] ?? "--"}
                </div>
              </>
            )}
            <div className="text-xs text-gray-400">[Model comparison, CI toggles, CSV export soon]</div>
          </div>
        ))}
      </div>
    </div>
  );
}
