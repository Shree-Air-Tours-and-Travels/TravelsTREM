// server/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["public", "member", "admin"], default: "public" },
  createdAt: { type: Date, default: Date.now },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// If model already exists (hot-reload in dev), reuse it
const User = mongoose.models?.User || mongoose.model("User", userSchema);
export default User;
