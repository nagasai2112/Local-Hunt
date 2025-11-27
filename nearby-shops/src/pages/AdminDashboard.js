import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth } from "../firebase";
import { getShops } from "../services/api";
import "../styles/adminDashboard.css";

export default function AdminDashboard() {
  const [shops, setShops] = useState([]);
  const [stats, setStats] = useState({ totalShops: 0, totalVendors: 0 });

  // 🔹 Fetch shop data from backend
  useEffect(() => {
    async function fetchData() {
      try {
        const shopData = await getShops(); // Axios call to backend API
        setShops(shopData);
        setStats({
          totalShops: shopData.length,
          totalVendors: new Set(shopData.map((s) => s.vendorEmail)).size,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <motion.div
      className="admin-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <h1 className="admin-title">🧑‍💼 Admin Dashboard</h1>
      <p className="admin-subtitle">
        Welcome, <b>{auth.currentUser?.email}</b>
      </p>

      {/* Statistics Section */}
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Shops</h3>
          <p>{stats.totalShops}</p>
        </div>
        <div className="stat-card">
          <h3>Total Vendors</h3>
          <p>{stats.totalVendors}</p>
        </div>
      </div>

      {/* Registered Shops Table */}
      <div className="admin-section">
        <h2>📍 Registered Shops</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Vendor Email</th>
              <th>Category</th>
              <th>Address</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {shops.length > 0 ? (
              shops.map((shop, i) => (
                <tr key={i}>
                  <td>{shop.name}</td>
                  <td>{shop.vendorEmail}</td>
                  <td>{shop.products || "N/A"}</td>
                  <td>{shop.address}</td>
                  <td>{shop.averageRating?.toFixed(1) || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No shops found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Future Section Placeholder */}
      <div className="admin-chart">
        <h2>📊 Analytics (Coming Soon)</h2>
        <p>
          We’ll show dynamic analytics here — top vendors, shop categories, and
          performance insights.
        </p>
      </div>
    </motion.div>
  );
}
