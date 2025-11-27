import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import "../styles/adminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.email === "admin@localhunt.com") {
        toast.success("✅ Welcome, Admin!");
        navigate("/admin");
      } else {
        toast.error("❌ Access denied. Admins only.");
        await auth.signOut();
      }
    } catch (err) {
      console.error(err);
      toast.error("Invalid credentials or network issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="admin-login-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="admin-login-card">
        <h2>🔐 Admin Login</h2>
        <p>Sign in with your admin credentials to access the dashboard.</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ⬅ Back to Home
        </button>
      </div>
    </motion.div>
  );
}
