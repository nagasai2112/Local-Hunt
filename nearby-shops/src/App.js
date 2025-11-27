import React, { useState, useEffect, useRef } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { Toaster, toast } from "react-hot-toast";

// --- Pages ---
import SplashScreen from "./components/SplashScreen";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import UserLogin from "./pages/UserLogin";
import VendorLogin from "./pages/VendorLogin";
import VendorRegister from "./pages/VendorRegister";
import UserDashboard from "./pages/UserDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import AboutPage from "./pages/AboutPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ChatPage from "./pages/ChatPage";
import ChatBot from "./pages/ChatBot"; // 🤖 Chatbot assistant

// --- Animation Variants ---
const pageVariants = {
  initial: { opacity: 0, y: 40 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -40 },
};
const pageTransition = { type: "tween", ease: "easeInOut", duration: 0.4 };

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
      style={{ minHeight: "100vh" }}
    >
      {children}
    </motion.div>
  );
}

// --- Private Route (Auth & Role Based) ---
function PrivateRoute({ children, role }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>;

  if (!user) return <Navigate to="/vendor-login" />;

  if (role === "admin" && user.email !== "admin@localhunt.com") {
    alert("Access Denied: Admins only.");
    return <Navigate to="/" />;
  }

  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingSplash, setLoadingSplash] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Track Firebase user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  // Splash delay
  useEffect(() => {
    const timer = setTimeout(() => setLoadingSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("👋 Logged out successfully!");
    navigate("/");
  };

  const hideNavbar =
    loadingSplash ||
    location.pathname === "/" ||
    location.pathname === "/splash";

  // Dropdown hide outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loadingSplash) return <SplashScreen />;

  return (
    <>
      {/* === NAVBAR === */}
      {!hideNavbar && (
        <nav
          style={{
            background: "linear-gradient(90deg, #4b6cb7, #182848)",
            color: "white",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          {/* Left Links */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              🏠 HOME
            </Link>
            <Link to="/home" style={{ color: "white", textDecoration: "none" }}>
              🔍 Explore
            </Link>
            <Link to="/about" style={{ color: "white", textDecoration: "none" }}>
              ℹ️ About
            </Link>

            {/* Chatbot shortcut */}
            <Link
              to="/chatbot"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              title="Talk to Local Hunt Assistant"
            >
              🤖 Assistant
            </Link>

            {user?.email === "admin@localhunt.com" ? (
              <Link
                to="/admin"
                style={{ color: "white", textDecoration: "none" }}
              >
                🧑‍💼 Admin
              </Link>
            ) : (
              <Link
                to="/admin-login"
                style={{ color: "white", textDecoration: "none" }}
              >
                🧑‍💼 Admin
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {!user ? (
              <>
                <Link
                  to="/user-login"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  👤 User
                </Link>
                <Link
                  to="/vendor-login"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  🧑‍💼 Vendor
                </Link>
              </>
            ) : (
              <div
                ref={dropdownRef}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={
                    user.photoURL ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="User"
                  title={user.displayName || user.email}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "2px solid white",
                    cursor: "pointer",
                  }}
                />

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: "absolute",
                        top: "50px",
                        right: 0,
                        background: "rgba(255,255,255,0.95)",
                        color: "#333",
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        width: "220px",
                        padding: "12px",
                        textAlign: "left",
                        zIndex: 2000,
                      }}
                    >
                      <p
                        style={{
                          fontWeight: "600",
                          fontSize: "0.95rem",
                          marginBottom: "2px",
                        }}
                      >
                        {user.displayName || "Guest User"}
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#555",
                          marginBottom: "10px",
                        }}
                      >
                        {user.email}
                      </p>
                      <hr
                        style={{ borderColor: "#ccc", marginBottom: "10px" }}
                      />

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate(
                            user.email === "admin@localhunt.com"
                              ? "/admin"
                              : location.pathname.includes("vendor")
                              ? "/vendor-dashboard"
                              : "/user-dashboard"
                          );
                        }}
                        style={{
                          width: "100%",
                          background: "#4b6cb7",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px",
                          cursor: "pointer",
                          marginBottom: "10px",
                        }}
                      >
                        🧭 Go to Dashboard
                      </button>

                      <button
                        onClick={handleLogout}
                        style={{
                          width: "100%",
                          background: "#eee",
                          color: "#333",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px",
                          cursor: "pointer",
                        }}
                      >
                        🚪 Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* === ROUTES === */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><LandingPage /></AnimatedPage>} />
          <Route path="/home" element={<AnimatedPage><HomePage /></AnimatedPage>} />
          <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
          <Route path="/user-login" element={<AnimatedPage><UserLogin /></AnimatedPage>} />
          <Route path="/vendor-login" element={<AnimatedPage><VendorLogin /></AnimatedPage>} />
          <Route path="/vendor-register" element={<AnimatedPage><VendorRegister /></AnimatedPage>} />
          <Route path="/user-dashboard" element={<AnimatedPage><UserDashboard /></AnimatedPage>} />
          <Route path="/vendor-dashboard" element={<PrivateRoute><AnimatedPage><VendorDashboard /></AnimatedPage></PrivateRoute>} />

          {/* ✅ Admin Login & Dashboard */}
          <Route path="/admin-login" element={<AnimatedPage><AdminLogin /></AnimatedPage>} />
          <Route path="/admin" element={<PrivateRoute role="admin"><AnimatedPage><AdminDashboard /></AnimatedPage></PrivateRoute>} />

          {/* ✅ Chat Features */}
          <Route path="/chat/:vendorId" element={<AnimatedPage><ChatPage /></AnimatedPage>} />
          <Route path="/chatbot" element={<AnimatedPage><ChatBot /></AnimatedPage>} />

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <AnimatedPage>
                <div style={{ textAlign: "center", marginTop: 40 }}>
                  <h2>404 - Page Not Found</h2>
                  <p>
                    Return to <Link to="/">Landing Page</Link>
                  </p>
                </div>
              </AnimatedPage>
            }
          />
        </Routes>
      </AnimatePresence>

      <Toaster position="top-center" />
    </>
  );
}
