import React from "react";
import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #4b6cb7, #182848)",
        color: "white",
        textAlign: "center",
      }}
    >
      {/* Logo / App name */}
      <motion.h1
        initial={{ scale: 0.8 }}
        animate={{ scale: 1.05 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ fontSize: "3rem", marginBottom: "20px" }}
      >
        🌍 Show My Shop
      </motion.h1>

      {/* Spinner animation */}
      <motion.div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid rgba(255,255,255,0.3)",
          borderTop: "4px solid #ffb703",
          borderRadius: "50%",
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      ></motion.div>

      <p style={{ marginTop: "20px", fontSize: "1rem", opacity: 0.8 }}>
        Loading your experience…
      </p>
    </motion.div>
  );
}
