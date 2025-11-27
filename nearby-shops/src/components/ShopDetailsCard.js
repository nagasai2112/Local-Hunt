import React from "react";
import { motion } from "framer-motion";
import "../styles/shopDetails.css";

// Component to render stars dynamically
function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <span className="stars">
      {"★".repeat(fullStars)}
      {halfStar && "☆"}
      {"☆".repeat(emptyStars)}
    </span>
  );
}

export default function ShopDetailsCard({ shop, onClose }) {
  if (!shop) return null;

  // Optional: determine dynamic status from isOpen
  const statusText = shop.isOpen ? "Open Now" : "OPEN";
  const statusClass = shop.isOpen ? "open" : "closed";

  return (
    <motion.div
      className="shopdetails-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="shopdetails-header">
        <div className="shopdetails-main">
          <div className="shopdetails-avatar">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
              alt="shop icon"
            />
          </div>

          <div className="shopdetails-info">
            <h2>{shop.name}</h2>
            <div className="shopdetails-meta">
              <span className="shop-category">{shop.products || "General"}</span>
              <span className="rating">
                <StarRating rating={shop.averageRating || 4} />{" "}
                <small>({shop.ratingsCount || 10} reviews)</small>
              </span>
              <span className={`status ${statusClass}`}>{statusText}</span>
            </div>

            <div className="shopdetails-actions">
              <button
                className="btn primary"
                onClick={() => window.location.href = "/chatbot"}
                >
                  💬 Chat with Assistant
                  </button>
              

              <button className="btn outline">❤ Save to Favourites</button>
              <button
                className="btn call"
                onClick={() => window.open(`tel:${shop.number}`, "_self")}
              >
                📞 Call Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="shopdetails-content">
        {/* Location & Contact */}
        <div className="info-card">
          <h3>📍 Location & Contact</h3>
          <div className="map-preview">
            <img
              src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
              alt="map"
            />
            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps?q=${shop.lat},${shop.lng}`,
                  "_blank"
                )
              }
            >
              View in Maps
            </button>
          </div>
          <p className="address">{shop.address}</p>
          <p className="phone">📞{shop.number}</p>
        </div>

        
        {/* Timings & Services */}
<div className="info-card">
  <h3>🕒 Timings & Services</h3>
  <div className="timings">
    {shop.timings ? (
      typeof shop.timings === "string" ? (
        // ✅ Case 1: If timings is a single string like "Monday - Friday"
        <div className="day">
          <span>{shop.timings}</span>
        </div>
      ) : (
        // ✅ Case 2: If timings is an object like { Monday: "9 AM", ... }
        Object.entries(shop.timings).map(([day, time]) => (
          <div
            key={day}
            className={`${day} ${String(time).toLowerCase() === "closed" ? "closed" : ""}`}
          >
            <span>{day}</span>
            <span className="time">{time}</span>
          </div>
        ))
      )
    ) : (
      // ✅ Default fallback
      <>
        <div className="day">
          <span>Monday - Friday</span>
          <span className="time">9:00 AM - 9:00 PM</span>
        </div>
        <div className="day">
          <span>Saturday</span>
          <span className="time">10:00 AM - 10:00 PM</span>
        </div>
        <div className="day closed">
          <span>Sunday</span>
          <span className="time">Closed</span>
        </div>
      </>
    )}
  </div>
</div>
      <div className="services">
            {[
              "Home Delivery",
              "Discounts & Seasonal Offers",
              "Customer Feedback",
              "Easy Returns",
              "24/7 Support",
            ].map((s, i) => (
              <span key={i} className="service-chip">
                ✅ {s}
              </span>
            ))}
          </div>
          <div className="footer">
        <button className="btn back" onClick={onClose}>
          ← Back to List
        </button>
      </div>
      </div>
    </motion.div>

  );
}