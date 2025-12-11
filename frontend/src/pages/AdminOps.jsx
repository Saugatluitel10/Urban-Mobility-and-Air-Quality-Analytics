import React from "react";

export default function AdminOps() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin & Model Ops</h2>
      <div className="bg-white rounded p-6 shadow text-gray-700">
        <div>[Model metrics, drift alerts, retraining, datasets, experiment history, promote to prod controls]</div>
        <div className="mt-4 text-sm text-gray-500">Access controlled</div>
      </div>
    </div>
  );
}
