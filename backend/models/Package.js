import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
  title: String,
  description: String,
  destination: String,
  price: Number,
  duration: String,
  imageUrl: String,
  type: String, // "domestic", "international", "honeymoon", etc.
}, { timestamps: true });

const Package = mongoose.model("Package", PackageSchema);
export default Package;
