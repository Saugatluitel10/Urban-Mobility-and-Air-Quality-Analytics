import React, { useEffect, useState } from "react";

export default function Docs() {
  const [openapi, setOpenapi] = useState(null);
  useEffect(() => {
    fetch("/openapi.json")
      .then((res) => res.json())
      .then((data) => setOpenapi(data));
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Technical Documentation</h2>
      <div className="bg-white rounded p-6 shadow text-gray-700">
        {openapi ? (
          <>
            <div className="font-bold mb-2">API Endpoints</div>
            <ul className="mb-4 text-xs">
              {Object.keys(openapi.paths).map((path) => (
                <li key={path} className="mb-1">
                  <span className="font-mono bg-gray-100 px-1 py-0.5 rounded mr-2">{path}</span>
                  {Object.keys(openapi.paths[path]).join(", ")}
                </li>
              ))}
            </ul>
            <div className="font-bold mb-2">Models</div>
            <ul className="mb-4 text-xs">
              {openapi.components && openapi.components.schemas &&
                Object.keys(openapi.components.schemas).map((model) => (
                  <li key={model}>{model}</li>
                ))}
            </ul>
          </>
        ) : (
          <span>Loading API docs...</span>
        )}
      </div>
      <div className="mt-4 text-gray-500 text-sm">
        Find details about data sources, models, and system architecture here.
      </div>
    </div>
  );
}
