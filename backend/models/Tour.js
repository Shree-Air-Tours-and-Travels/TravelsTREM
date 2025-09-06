import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  city: String,
  state: String,
  zip: String,
  country: String,
});

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String,
});

const tourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    address: { type: addressSchema, required: true },
    distance: { type: Number, required: true },
    photo: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    maxGroupSize: { type: Number, required: true },
    reviews: [reviewSchema], // ✅ embedded reviews
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);


const Tour = mongoose.model("Tour", tourSchema);
export default Tour;
