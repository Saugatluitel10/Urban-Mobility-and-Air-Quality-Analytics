import React from "react";

export default function CausalInsights() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">Causal Insights</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded p-4 shadow text-gray-700">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Key driver</div>
          <div className="font-semibold mb-1">Traffic volume 				&rarr; PM2.5 / AQI</div>
          <div className="text-xs text-gray-500 mb-1">Higher congestion and stop-start traffic increases local PM2.5.</div>
          <div className="text-xs bg-red-50 border border-red-100 rounded px-2 py-1 inline-block mt-1">
            +8 to +15 AQI for +10% peak-hour traffic (mock estimate)
          </div>
        </div>
        <div className="bg-white rounded p-4 shadow text-gray-700">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Mitigating factor</div>
          <div className="font-semibold mb-1">Wind speed &amp; direction 			&rarr; AQI</div>
          <div className="text-xs text-gray-500 mb-1">Stronger winds dilute local pollution but may shift plumes across wards.</div>
          <div className="text-xs bg-blue-50 border border-blue-100 rounded px-2 py-1 inline-block mt-1">
            -5 to -10 AQI for +2 m/s wind (mock estimate)
          </div>
        </div>
        <div className="bg-white rounded p-4 shadow text-gray-700">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Background source</div>
          <div className="font-semibold mb-1">Regional emissions &rarr; Valley baseline</div>
          <div className="text-xs text-gray-500 mb-1">Brick kilns, industry, and cross-border transport set a background floor.</div>
          <div className="text-xs bg-yellow-50 border border-yellow-100 rounded px-2 py-1 inline-block mt-1">
            50 to 80 AQI baseline in dry season (mock)
          </div>
        </div>
      </div>
      <div className="bg-white rounded p-4 shadow text-gray-700 mb-4">
        <div className="font-semibold mb-2 text-sm">Example scenario (mock explanation)</div>
        <p className="text-sm text-gray-700 mb-2">
          Suppose we reduce private vehicles on Ring Road by <span className="font-semibold">20%</span> during
          the morning peak while keeping freight and buses unchanged.
        </p>
        <ul className="text-xs text-gray-600 list-disc ml-5 space-y-1">
          <li>
            Local congestion index in the targeted corridor decreases by roughly 10 points, which
            translates to a modest AQI improvement of 5-10 units near the road.
          </li>
          <li>
            Downwind wards may see small secondary benefits if wind pushes the plume away from dense
            residential areas.
          </li>
          <li>
            If traffic diverts into side streets, some locations may experience <span className="font-semibold">higher</span> local
            congestion even as the ring itself improves.
          </li>
        </ul>
        <div className="mt-3 text-xs text-gray-500">
          These numbers are illustrative. The production system will plug in learned effect sizes and
          credible intervals from causal models.
        </div>
      </div>
      <div className="bg-white rounded p-4 shadow text-gray-700">
        <div className="font-semibold mb-2 text-sm">Planned interactive features</div>
        <ul className="text-xs text-gray-600 list-disc ml-5 space-y-1">
          <li>Clickable causal graph to inspect incoming and outgoing effects for each node.</li>
          <li>Sliders for interventions (traffic reduction, kiln controls, fuel standards) with
            updated outcome distributions.</li>
          <li>Downloadable "policy cards" summarizing assumptions, effect sizes, and caveats.</li>
        </ul>
      </div>
    </div>
  );
}
