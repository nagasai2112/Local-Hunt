// backend/routes/adminRoutes.js
import express from "express";
import Shop from "../models/Shop.js";
const router = express.Router();

// Get all shops
router.get("/shops", async (req, res) => {
  try {
    const shops = await Shop.find().sort({ createdAt: -1 });
    res.json(shops);
  } catch {
    res.status(500).json({ error: "Failed to fetch shops" });
  }
});

// Approve or reject a shop
router.put("/shops/:id/approve", async (req, res) => {
  try {
    const { approved } = req.body;
    const shop = await Shop.findByIdAndUpdate(req.params.id, { approved }, { new: true });
    res.json(shop);
  } catch {
    res.status(500).json({ error: "Failed to update shop status" });
  }
});

// Delete shop
router.delete("/shops/:id", async (req, res) => {
  try {
    await Shop.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete shop" });
  }
});

export default router;
