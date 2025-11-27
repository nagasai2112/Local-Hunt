import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import shopRoutes from "./routes/shopRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();

//Middleware (Fixes chatbot fetch issue)
app.use(
  cors({
    origin: "http://localhost:3000", // allow your React app
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Local MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/localhunt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected (Local)"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/shops", shopRoutes);
app.use("/api/admin", adminRoutes);

// Basic Root Route
app.get("/", (req, res) => {
  res.send("🌍 LocalHunt Backend Running on Localhost!");
});

// Fixed Local Port
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running locally on port ${PORT}`));
