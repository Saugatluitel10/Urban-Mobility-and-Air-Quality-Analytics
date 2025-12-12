import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const fallbackDates = [
  "2025-12-01",
  "2025-12-02",
  "2025-12-03",
  "2025-12-04",
  "2025-12-05",
  "2025-12-06",
  "2025-12-07",
];

const fallbackAqi = {
  Kathmandu: [160, 155, 170, 180, 165, 150, 158],
  Lalitpur: [140, 145, 150, 155, 150, 142, 148],
  Bhaktapur: [150, 152, 160, 168, 160, 155, 150],
};

const fallbackCongestion = {
  Kathmandu: [0.8, 0.78, 0.82, 0.85, 0.8, 0.76, 0.79],
  Lalitpur: [0.6, 0.62, 0.64, 0.66, 0.63, 0.59, 0.61],
};

const fallbackCorrelation = {
  aqi: [140, 150, 160, 170, 180],
  congestion: [0.55, 0.6, 0.7, 0.8, 0.88],
};

export default function HistoricalAnalysis() {
  const [dates, setDates] = useState(fallbackDates);
  const [aqi, setAqi] = useState(fallbackAqi);
  const [congestion, setCongestion] = useState(fallbackCongestion);
  const [correlation, setCorrelation] = useState(fallbackCorrelation);
  const [usingFallback, setUsingFallback] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    const fmt = (d) => d.toISOString().slice(0, 10);
    setStartDate(fmt(sevenDaysAgo));
    setEndDate(fmt(today));
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) {
      return;
    }
    setLoading(true);
    const params = new URLSearchParams();
    params.set("start", startDate);
    params.set("end", endDate);
    fetch(`/history/summary?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data || !Array.isArray(data.dates) || !data.aqi || !data.congestion) {
          throw new Error("Invalid history response");
        }

        setDates(data.dates);
        setAqi({
          Kathmandu: data.aqi.Kathmandu ?? fallbackAqi.Kathmandu,
          Lalitpur: data.aqi.Lalitpur ?? fallbackAqi.Lalitpur,
          Bhaktapur: data.aqi.Bhaktapur ?? fallbackAqi.Bhaktapur,
        });
        setCongestion({
          Kathmandu: data.congestion.Kathmandu ?? fallbackCongestion.Kathmandu,
          Lalitpur: data.congestion.Lalitpur ?? fallbackCongestion.Lalitpur,
        });
        if (
          data.correlation &&
          Array.isArray(data.correlation.aqi) &&
          Array.isArray(data.correlation.congestion)
        ) {
          setCorrelation({
            aqi: data.correlation.aqi,
            congestion: data.correlation.congestion,
          });
        } else {
          setCorrelation(fallbackCorrelation);
        }
        setUsingFallback(false);
      })
      .catch(() => {
        setDates(fallbackDates);
        setAqi(fallbackAqi);
        setCongestion(fallbackCongestion);
        setCorrelation(fallbackCorrelation);
        setUsingFallback(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDate, endDate]);

  const cityOrder = ["Kathmandu", "Lalitpur", "Bhaktapur"];
  const visibleCities = selectedCity === "all" ? cityOrder : [selectedCity];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-1">Historical Analysis</h2>
      <div className="text-xs text-gray-500 mb-3">
        {loading
          ? "Loading historical data from backend..."
          : usingFallback
          ? "Showing illustrative mock data (no history available yet)."
          : "Showing backend historical data (falls back to mock if missing)."}
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">City:</span>
          {[
            { key: "all", label: "All" },
            { key: "Kathmandu", label: "Kathmandu" },
            { key: "Lalitpur", label: "Lalitpur" },
            { key: "Bhaktapur", label: "Bhaktapur" },
          ].map((c) => (
            <button
              key={c.key}
              className={`px-2 py-1 rounded border text-xs font-semibold ${
                selectedCity === c.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-700 border-blue-300"
              }`}
              onClick={() => setSelectedCity(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Range:</span>
          <input
            type="date"
            className="border rounded px-2 py-1 text-xs"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            className="border rounded px-2 py-1 text-xs"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded p-4 shadow text-gray-700">
          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-500">
            AQI trends
          </h3>
          <Plot
            data={visibleCities
              .filter((city) => aqi[city])
              .map((city) => ({
                x: dates,
                y: aqi[city],
                type: "scatter",
                mode: "lines+markers",
                name: city,
              }))}
            layout={{
              margin: { t: 20, r: 10, b: 40, l: 50 },
              xaxis: { title: "Date" },
              yaxis: { title: "AQI" },
              legend: { orientation: "h" },
              paper_bgcolor: "rgba(0,0,0,0)",
              plot_bgcolor: "rgba(0,0,0,0)",
              height: 260,
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        <div className="bg-white rounded p-4 shadow text-gray-700">
          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-500">
            Traffic congestion trends
          </h3>
          <Plot
            data={visibleCities
              .filter((city) => congestion[city])
              .map((city) => ({
                x: dates,
                y: congestion[city],
                type: "scatter",
                mode: "lines+markers",
                name: city,
              }))}
            layout={{
              margin: { t: 20, r: 10, b: 40, l: 50 },
              xaxis: { title: "Date" },
              yaxis: { title: "Congestion index" },
              legend: { orientation: "h" },
              paper_bgcolor: "rgba(0,0,0,0)",
              plot_bgcolor: "rgba(0,0,0,0)",
              height: 260,
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        <div className="bg-white rounded p-4 shadow text-gray-700 lg:col-span-2">
          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-500">
            Correlation: AQI vs congestion
          </h3>
          <Plot
            data={[
              {
                x: correlation.congestion,
                y: correlation.aqi,
                type: "scatter",
                mode: "markers",
                marker: { size: 10, color: "#ef4444" },
                name: "Samples",
              },
            ]}
            layout={{
              margin: { t: 20, r: 10, b: 40, l: 50 },
              xaxis: { title: "Congestion index" },
              yaxis: { title: "AQI" },
              paper_bgcolor: "rgba(0,0,0,0)",
              plot_bgcolor: "rgba(0,0,0,0)",
              height: 260,
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-500">
        Use the filters above to switch between cities and adjust the start/end dates for the
        historical window.
      </div>
    </div>
  );
}
