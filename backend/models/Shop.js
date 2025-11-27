// backend/models/Shop.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

const shopSchema = new mongoose.Schema(
  {
    vendorEmail: { type: String, required: true },
    name: { type: String, required: true },
    products: { type: String, required: true },
    description: { type: String },
    timings: { type: String },
    address: { type: String, required: true },
    number: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
    // rating summary
    averageRating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    // store last N reviews inline (simple)
    reviews: [reviewSchema],
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Shop", shopSchema);
