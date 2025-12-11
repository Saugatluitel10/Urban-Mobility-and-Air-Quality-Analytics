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

  useEffect(() => {
    fetch("/history/summary?days=7")
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
  }, []);

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded p-4 shadow text-gray-700">
          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-500">
            AQI trends
          </h3>
          <Plot
            data={[
              {
                x: dates,
                y: aqi.Kathmandu,
                type: "scatter",
                mode: "lines+markers",
                name: "Kathmandu",
              },
              {
                x: dates,
                y: aqi.Lalitpur,
                type: "scatter",
                mode: "lines+markers",
                name: "Lalitpur",
              },
              {
                x: dates,
                y: aqi.Bhaktapur,
                type: "scatter",
                mode: "lines+markers",
                name: "Bhaktapur",
              },
            ]}
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
            data={[
              {
                x: dates,
                y: congestion.Kathmandu,
                type: "scatter",
                mode: "lines+markers",
                name: "Kathmandu",
              },
              {
                x: dates,
                y: congestion.Lalitpur,
                type: "scatter",
                mode: "lines+markers",
                name: "Lalitpur",
              },
            ]}
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
        Filters for district and time range will appear here once connected to more detailed
        history APIs.
      </div>
    </div>
  );
}
