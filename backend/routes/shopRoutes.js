// backend/routes/shopRoutes.js
import express from "express";
import Shop from "../models/Shop.js";
import fetch from "node-fetch";

const router = express.Router();

/** Create shop (geocode from address if lat/lng missing) */
router.post("/", async (req, res) => {
  try {
    const { vendorEmail, name, products, description, timings, address, number, lat, lng } = req.body;
    if (!vendorEmail || !name || !products || !address || !number) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let finalLat = lat, finalLng = lng;
    if ((finalLat == null || finalLng == null) && address) {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const geo = await geoRes.json();
      if (geo?.[0]) {
        finalLat = parseFloat(geo[0].lat);
        finalLng = parseFloat(geo[0].lon);
      }
    }

    const shop = await Shop.create({
      vendorEmail, name, products, description, timings, address, number,
      lat: finalLat, lng: finalLng,
    });

    res.status(201).json(shop);
  } catch (err) {
    console.error("Create shop error:", err);
    res.status(500).json({ error: "Failed to register shop" });
  }
});

/** Get shops (optionally by vendorEmail) */
router.get("/", async (req, res) => {
  try {
    const { vendorEmail } = req.query;
    const q = vendorEmail ? { vendorEmail } : {};
    const shops = await Shop.find(q).sort({ createdAt: -1 });
    res.json(shops);
  } catch {
    res.status(500).json({ error: "Failed to fetch shops" });
  }
});

/** Update a shop (owner edits) */
router.put("/:id", async (req, res) => {
  try {
    const update = req.body;
    // Optional: re-geocode if address changed and no lat/lng provided
    if (update.address && (update.lat == null || update.lng == null)) {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(update.address)}`
      );
      const geo = await geoRes.json();
      if (geo?.[0]) {
        update.lat = parseFloat(geo[0].lat);
        update.lng = parseFloat(geo[0].lon);
      }
    }
    const shop = await Shop.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    res.json(shop);
  } catch (e) {
    console.error("Update shop error:", e);
    res.status(500).json({ error: "Failed to update shop" });
  }
});

/** Delete a shop */
router.delete("/:id", async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete shop" });
  }
});

/** Add review and update rating summary */
router.post("/:id/reviews", async (req, res) => {
  try {
    const { userEmail, rating, comment } = req.body;
    if (!userEmail || !rating) return res.status(400).json({ error: "Missing fields" });

    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ error: "Shop not found" });

    shop.reviews.unshift({ userEmail, rating, comment: comment || "" });
    // recompute summary
    const total = shop.averageRating * shop.ratingsCount + Number(rating);
    shop.ratingsCount += 1;
    shop.averageRating = Number((total / shop.ratingsCount).toFixed(2));

    await shop.save();
    res.status(201).json({ averageRating: shop.averageRating, ratingsCount: shop.ratingsCount, reviews: shop.reviews.slice(0, 10) });
  } catch (e) {
    console.error("Add review error:", e);
    res.status(500).json({ error: "Failed to add review" });
  }
});

/** Get reviews (paginated lite) */
router.get("/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findById(id, { reviews: { $slice: 20 }, averageRating: 1, ratingsCount: 1 });
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    res.json(shop);
  } catch {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

export default router;
