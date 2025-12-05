import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Urban Mobility & Air Quality Analytics</h1>
        <p className="text-gray-600">React + Tailwind base scaffold. Ready for map, chart, and dashboard integration.</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
