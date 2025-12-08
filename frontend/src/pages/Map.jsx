import React from "react";

export default function MapPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Interactive Map</h2>
      <div className="bg-gray-200 rounded h-96 flex items-center justify-center">
        <span className="text-gray-500">[Map placeholder: Kathmandu Valley, sensors, overlays]</span>
      </div>
      <div className="mt-4 text-gray-600">
        Click a sensor for details. Use layer controls for AQI, traffic, wind, and policy overlays.
      </div>
    </div>
  );
}
