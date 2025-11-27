import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import "../styles/login.css";

export default function VendorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome, Vendor 🧑‍💼");
      navigate("/vendor-dashboard");
    } catch (err) {
      toast.error("Login failed! Check your credentials.");
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in with Google 🚀");
      navigate("/vendor-dashboard");
    } catch (err) {
      toast.error("Google Sign-In failed!");
      console.error(err);
    }
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
        <h2>🧑‍💼 Vendor Login</h2>
        <p className="login-subtitle">
          Manage your shop and connect with local customers.
        </p>

        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Vendor Email"
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
          <button type="submit" className="login-btn vendor-btn">
            Login
          </button>
        </form>

        <div className="divider">or</div>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
            alt="google"
          />
          Sign in with Google
        </button>

        <p
          className="register-link"
          onClick={() => navigate("/vendor-register")}
        >
          Don’t have an account? <b>Register</b>
        </p>
      </motion.div>
    </motion.div>
  );
}
