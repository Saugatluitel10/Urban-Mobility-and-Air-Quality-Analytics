import React from "react";

export default function CausalInsights() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Causal Insights</h2>
      <div className="bg-white rounded p-6 shadow text-gray-700">
        <div>[Causal graph placeholder: variables, effect sizes, explanation]</div>
        <div className="mt-4">Try: <span className="bg-blue-100 px-2 py-1 rounded">Reduce traffic on Ring Road by 20%</span> (see local and spillover effects)</div>
      </div>
    </div>
  );
}
