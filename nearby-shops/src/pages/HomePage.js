import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

export default function HomePage() {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      () => {
        alert("⚠️ Please enable location access.");
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="spinner"></div>
        <p>Detecting your location...</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      <h1 className="main-title">Show My shop</h1>
      <p className="subtitle">
        Discover nearby shops and connect with trusted vendors near you.
      </p>

      <div className="roles">
        <div
          className="card"
          onClick={() => navigate("/user-login")}
          style={{ borderTop: "4px solid #0072ff" }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="User Login"
          />
          <h3 style={{ color: "#0072ff" }}>User Login</h3>
          <p>Explore nearby shops & rate vendors.</p>
          <button style={{ background: "#0072ff" }}>Continue</button>
        </div>

        <div
          className="card"
          onClick={() => navigate("/vendor-login")}
          style={{ borderTop: "4px solid #ff9800" }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/869/869636.png"
            alt="Vendor Login"
          />
          <h3 style={{ color: "#ff9800" }}>Vendor Login</h3>
          <p>Register your shop and reach more customers.</p>
          <button style={{ background: "#ff9800" }}>Continue</button>
        </div>
      </div>

      {coords && (
        <p className="location">
          📍 Location detected: {coords.lat.toFixed(3)}, {coords.lng.toFixed(3)}
        </p>
      )}

      <footer className="footer">
        © 2025 Show my shop — Empowering Local Businesses 💙
      </footer>
    </div>
  );
}
