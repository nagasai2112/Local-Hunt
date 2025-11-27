import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { auth } from "../firebase";
import {
  createShop,
  getVendorShops,
  updateShop,
  deleteShop,
} from "../services/api";
import "../styles/VendorDashboard.css";


export default function VendorDashboard() {
  const vendorEmail = auth.currentUser?.email || "";
  const [form, setForm] = useState({
    name: "",
    products: "",
    description: "",
    timings: "",
    address: "",
    number: "",
    lat: "",
    lng: "",
  });
  const [myShops, setMyShops] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load vendor's shops
  const loadMyShops = useCallback(async () => {
    if (!vendorEmail) return;
    try {
      const data = await getVendorShops(vendorEmail);
      setMyShops(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch shops");
    }
  }, [vendorEmail]);

  useEffect(() => {
    loadMyShops();
  }, [vendorEmail, loadMyShops]);

  // Prefill location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) =>
        setForm((p) => ({
          ...p,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }))
      );
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const clearForm = () =>
    setForm({
      name: "",
      products: "",
      description: "",
      timings: "",
      address: "",
      number: "",
      lat: "",
      lng: "",
    });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, vendorEmail };
      if (editingId) {
        await updateShop(editingId, payload);
        toast.success("✅ Shop updated successfully!");
        setEditingId(null);
      } else {
        await createShop(payload);
        toast.success("✅ Shop registered successfully!");
      }
      clearForm();
      loadMyShops();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save shop");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (shop) => {
    setEditingId(shop._id);
    setForm({
      name: shop.name || "",
      products: shop.products || "",
      description: shop.description || "",
      timings: shop.timings || "",
      address: shop.address || "",
      number: shop.number || "",
      lat: shop.lat || "",
      lng: shop.lng || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeShop = async (id) => {
    if (!window.confirm("Delete this shop?")) return;
    try {
      await deleteShop(id);
      setMyShops((prev) => prev.filter((s) => s._id !== id));
      toast.success("🗑️ Shop deleted");
    } catch {
      toast.error("Failed to delete shop");
    }
  };

  return (
    <motion.div
      className="vendor-dashboard"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="vendor-header">
        <h1>🧑‍💼 Vendor Dashboard</h1>
        <p>Welcome back, {vendorEmail || "Vendor"}!</p>
      </div>

      {/* ---- Shop Registration Form ---- */}
      <motion.div
        className="vendor-form-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2>{editingId ? "✏️ Edit Shop" : "🏪 Register Your Shop"}</h2>
        <form onSubmit={submit} className="vendor-form">
          <input
            name="name"
            placeholder="Shop Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="products"
            placeholder="Products/Services"
            value={form.products}
            onChange={handleChange}
            required
          />
          <input
            name="timings"
            placeholder="Timings (e.g. 9AM - 9PM)"
            value={form.timings}
            onChange={handleChange}
          />
          <input
            name="number"
            placeholder="Contact Number"
            value={form.number}
            onChange={handleChange}
            required
          />
          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            rows="3"
            value={form.description}
            onChange={handleChange}
          />
          <div className="latlng">
            <input
              name="lat"
              placeholder="Latitude"
              value={form.lat}
              onChange={handleChange}
            />
            <input
              name="lng"
              placeholder="Longitude"
              value={form.lng}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="vendor-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Shop"
                : "Register Shop"}
            </button>
            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditingId(null);
                  clearForm();
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* ---- Shops List ---- */}
      <h2 style={{ marginTop: "50px" }}>🗺️ My Registered Shops</h2>
      {myShops.length === 0 ? (
        <p style={{ color: "#777" }}>No shops registered yet.</p>
      ) : (
        <div className="shop-list">
          {myShops.map((shop) => (
            <motion.div
              key={shop._id}
              className="shop-card"
              whileHover={{ scale: 1.02 }}
            >
              <div className="shop-details">
                <h3>{shop.name}</h3>
                <p className="shop-info">{shop.products}</p>
                <p className="shop-address">📍 {shop.address}</p>
                <p className="shop-timing">🕒 {shop.timings}</p>
                {shop.description && (
                  <p className="shop-desc">{shop.description}</p>
                )}
                <p className="shop-rating">
                  ⭐ {shop.averageRating || 0} ({shop.ratingsCount || 0} reviews)
                </p>
              </div>

              <div className="shop-actions">
                <button onClick={() => startEdit(shop)} className="edit-btn">
                  ✏️ Edit
                </button>
                <button
                  onClick={() => removeShop(shop._id)}
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
