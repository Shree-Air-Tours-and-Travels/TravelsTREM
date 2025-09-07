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
  name: {type: String, required: true},
  rating: {type: Number, required: true, min: 0, max: 5},
  comment: {type: String, default: ""},
});

const periodSchema = new mongoose.Schema(
  {
    days: {
      type: Number,
      required: true,
      min: 1, // at least 1 day
    },
    nights: {
      type: Number,
      required: true,
      min: 0, // nights can be 0 (like a day trip)
    },
  },
  {_id: false} // don’t create separate _id for period
);

const tourSchema = new mongoose.Schema(
  {
    title: {type: String, required: true, unique: true},
    city: {type: String, required: true},
    address: {type: addressSchema, required: true},
    distance: {type: Number, required: true},
    period: { type: periodSchema, required: true },
    // Backwards-compatible single photo (optional)
    photo: {type: String},
    // Preferred field: array of photo URLs
    photos: [{type: String}],
    desc: {type: String, required: true},
    price: {type: Number, required: true},
    maxGroupSize: {type: Number, required: true},
    reviews: [reviewSchema], // embedded reviews
    featured: {type: Boolean, default: false},
  },
  {timestamps: true}
);

// Optional virtual: compute avgRating on the fly (not persisted)
tourSchema.virtual("avgRating").get(function () {
  if (!this.reviews || this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  return +(sum / this.reviews.length).toFixed(1);
});

tourSchema.set("toJSON", {virtuals: true});
tourSchema.set("toObject", {virtuals: true});

const Tour = mongoose.model("Tour", tourSchema);
export default Tour;
