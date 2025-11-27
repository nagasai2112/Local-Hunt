import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import "../styles/login.css";

export default function VendorRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("✅ Registered Successfully!");
      navigate("/vendor-dashboard");
    } catch (err) {
      toast.error("Registration failed!");
      console.error(err.message);
    }
    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("✅ Google Sign-Up Successful!");
      navigate("/vendor-dashboard");
    } catch (err) {
      toast.error("Google Sign-Up Failed!");
      console.error(err.message);
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="login-card vendor"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2>🧾 Vendor Registration</h2>
        <p className="login-subtitle">
          Create your account to list your shop and reach local customers.
        </p>

        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Enter Vendor Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="login-btn vendor-btn"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="divider">or</div>

        <button
          className="google-btn"
          onClick={handleGoogleRegister}
          disabled={loading}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
            alt="google"
          />
          Sign up with Google
        </button>

        <p
          className="register-link"
          onClick={() => navigate("/vendor-login")}
        >
          Already have an account? <b>Login here</b>
        </p>
      </motion.div>
    </motion.div>
  );
}
