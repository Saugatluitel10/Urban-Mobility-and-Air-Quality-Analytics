import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

export default function Home() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    fetch("/summary")
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/history/summary?days=7")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setHistory(data);
      })
      .catch(() => {
        setHistory(null);
      })
      .finally(() => {
        setHistoryLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Home</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {loading
          ? ["Kathmandu", "Lalitpur", "Bhaktapur"].map((city) => (
              <div key={city} className="bg-gray-100 rounded p-4 shadow animate-pulse">
                <div className="font-bold">{city}</div>
                <div className="text-3xl">--</div>
                <div className="text-xs text-gray-400">Loading...</div>
              </div>
            ))
          : summary.map((item) => (
              <div
                key={item.city}
                className={`rounded p-4 shadow ${
                  item.city === "Kathmandu"
                    ? "bg-blue-50"
                    : item.city === "Lalitpur"
                    ? "bg-green-50"
                    : "bg-yellow-50"
                }`}
              >
                <div className="font-bold">{item.city}</div>
                <div className="text-2xl mb-1">
                  AQI: <span className="font-mono">{item.aqi ?? "--"}</span>
                </div>
                <div className="text-2xl mb-1">
                  Traffic: <span className="font-mono">{item.traffic ?? "--"}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Last update: {item.last_update ? new Date(item.last_update).toLocaleString() : "--"}
                </div>
                {!historyLoading &&
                  history &&
                  history.dates &&
                  history.aqi &&
                  history.aqi[item.city] && (
                    <div className="mt-2">
                      <Plot
                        data={[
                          {
                            x: history.dates,
                            y: history.aqi[item.city],
                            type: "scatter",
                            mode: "lines",
                            line: { color: "#2563eb" },
                            hoverinfo: "y",
                          },
                        ]}
                        layout={{
                          margin: { t: 4, r: 4, b: 4, l: 30 },
                          xaxis: { visible: false },
                          yaxis: { title: "AQI", tickfont: { size: 8 } },
                          height: 80,
                          paper_bgcolor: "rgba(0,0,0,0)",
                          plot_bgcolor: "rgba(0,0,0,0)",
                        }}
                        config={{ displayModeBar: false, responsive: true }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  )}
              </div>
            ))}
      </div>
      <div className="flex flex-wrap gap-4">
        <a href="/map" className="px-4 py-2 bg-blue-600 text-white rounded shadow">Interactive Map</a>
        <a href="/forecast" className="px-4 py-2 bg-green-600 text-white rounded shadow">Forecasts</a>
        <a href="/simulation" className="px-4 py-2 bg-yellow-500 text-white rounded shadow">Simulation Tool</a>
        <a href="/docs" className="px-4 py-2 bg-gray-700 text-white rounded shadow">Technical Docs</a>
      </div>
    </div>
  );
}
