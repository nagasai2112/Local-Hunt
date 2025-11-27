import React from "react";
import { calculateDistance } from "../utils/distance";

export default function ShopList({ userLocation, shops }) {
  if (!userLocation || !shops.length) return null;

  const sorted = shops
    .map(shop => ({
      ...shop,
      distance: parseFloat(calculateDistance(userLocation, shop)),
    }))
    .sort((a, b) => a.distance - b.distance);

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        background: "white",
        padding: "10px",
        borderRadius: "8px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        zIndex: 1000,
        width: "250px",
      }}
    >
      <h3>Nearby Shops</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {sorted.map((shop, idx) => (
          <li
            key={idx}
            style={{
              marginBottom: "8px",
              padding: "5px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <strong>{shop.name}</strong> <br />
            {shop.tags?.shop && (
              <span>Type: {shop.tags.shop}<br /></span>
            )}
            Distance: {shop.distance.toFixed(2)} km
          </li>
        ))}
      </ul>
    </div>
  );
}
