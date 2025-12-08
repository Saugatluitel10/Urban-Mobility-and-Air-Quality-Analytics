import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import MapPage from "./pages/Map";
import Forecast from "./pages/Forecast";
import Simulation from "./pages/Simulation";
import Docs from "./pages/Docs";

export default function App() {
  return (
    <Router>
      <nav className="bg-white shadow p-4 flex gap-6 mb-6">
        <Link to="/" className="font-semibold text-blue-700">Home</Link>
        <Link to="/map" className="font-semibold text-blue-700">Map</Link>
        <Link to="/forecast" className="font-semibold text-blue-700">Forecast</Link>
        <Link to="/simulation" className="font-semibold text-blue-700">Simulation Tool</Link>
        <Link to="/docs" className="font-semibold text-blue-700">Technical Docs</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </Router>
  );
}
