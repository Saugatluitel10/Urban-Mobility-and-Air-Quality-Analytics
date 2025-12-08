import React from "react";

export default function Home() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Home</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Summary tiles */}
        <div className="bg-blue-50 rounded p-4 shadow">
          <div className="font-bold">Kathmandu</div>
          <div className="text-3xl">--</div>
          <div className="text-xs text-gray-500">AQI / Traffic</div>
        </div>
        <div className="bg-green-50 rounded p-4 shadow">
          <div className="font-bold">Lalitpur</div>
          <div className="text-3xl">--</div>
          <div className="text-xs text-gray-500">AQI / Traffic</div>
        </div>
        <div className="bg-yellow-50 rounded p-4 shadow">
          <div className="font-bold">Bhaktapur</div>
          <div className="text-3xl">--</div>
          <div className="text-xs text-gray-500">AQI / Traffic</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <a href="/map" className="px-4 py-2 bg-blue-600 text-white rounded shadow">Interactive Map</a>
        <a href="/forecast" className="px-4 py-2 bg-green-600 text-white rounded shadow">Forecasts</a>
        <a href="#simulation" className="px-4 py-2 bg-yellow-500 text-white rounded shadow">Simulation Tool</a>
        <a href="#docs" className="px-4 py-2 bg-gray-700 text-white rounded shadow">Technical Docs</a>
      </div>
    </div>
  );
}
