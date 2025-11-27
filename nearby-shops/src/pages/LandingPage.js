import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/landingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* 🖼️ Small animated GIF */}
      <motion.img
        src={require("../assets/bg.gif")}
        alt="Local Hunt Logo"
        className="hero-gif"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <motion.h1
        className="hero-title"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Show My Shop
      </motion.h1>

      <motion.p
        className="hero-subtitle"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Find, explore, and support local vendors around you
      </motion.p>

      <motion.button
        onClick={() => navigate("/home")}
        className="hero-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Explore Now
      </motion.button>
    </div>
  );
}
