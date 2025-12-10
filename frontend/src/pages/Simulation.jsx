import React, { useState } from "react";

export default function Simulation() {
  const [privateVehicleReduction, setPrivateVehicleReduction] = useState(0);
  const [oddEvenPolicy, setOddEvenPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runSimulation = () => {
    setLoading(true);
    fetch("/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        private_vehicle_reduction: privateVehicleReduction,
        odd_even_policy: oddEvenPolicy,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        setLoading(false);
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Simulation Tool</h2>
      <div className="bg-gray-100 rounded p-6 shadow text-gray-600">
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Reduce Private Vehicles (%)</label>
          <input
            type="range"
            min={0}
            max={100}
            value={privateVehicleReduction}
            onChange={(e) => setPrivateVehicleReduction(Number(e.target.value))}
            className="w-full"
          />
          <div>{privateVehicleReduction}%</div>
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={oddEvenPolicy}
              onChange={(e) => setOddEvenPolicy(e.target.checked)}
              className="mr-2"
            />
            Odd-Even Policy
          </label>
        </div>
        <button
          onClick={runSimulation}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow font-semibold"
          disabled={loading}
        >
          {loading ? "Running..." : "Run Simulation"}
        </button>
      </div>
      <div className="mt-4 text-gray-800 text-sm">
        {result && (
          <div className="bg-white rounded shadow p-4">
            <div className="font-bold mb-2">Simulation Results</div>
            <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
