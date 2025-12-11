import React, { useEffect, useRef } from "react";

export default function AnimatedWindArrow({ start, end, color = "#2563eb", duration = 1200 }) {
  const ref = useRef(null);
  useEffect(() => {
    let animFrame;
    let t = 0;
    function animate() {
      t = (t + 0.02) % 1;
      if (ref.current) {
        const lat = start[0] + (end[0] - start[0]) * t;
        const lng = start[1] + (end[1] - start[1]) * t;
        ref.current.setLatLng([lat, lng]);
      }
      animFrame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animFrame);
  }, [start, end]);
  return (
    <>
      {/* This is a placeholder; in real Leaflet, use L.Marker with custom icon and ref */}
      <div ref={ref} style={{ display: "none" }} />
    </>
  );
}
