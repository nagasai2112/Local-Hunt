import React from "react";
import { motion } from "framer-motion";
import "../styles/mapPreview.css";

export default function MapPreview() {
  return (
    <section className="map-preview-section">
      <h2>🗺️ Discover Shops Near You</h2>

      <div className="map-preview-container">
        {/* ✅ Background Gradient Map */}
        <div className="map-bg-gradient">
          {/* Animated glowing shop markers */}
          {[
            { top: "35%", left: "45%" },
            { top: "55%", left: "65%" },
            { top: "50%", left: "30%" },
            { top: "60%", left: "55%" },
            { top: "42%", left: "70%" },
          ].map((dot, i) => (
            <motion.div
              key={i}
              className="map-dot"
              style={{ top: dot.top, left: dot.left }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.9, 1, 0.9],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            ></motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
