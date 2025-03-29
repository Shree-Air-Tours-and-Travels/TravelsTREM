import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// ✅ Only use ES modules, remove module.exports
const User = mongoose.model("User", UserSchema);
export default User;


// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },

//     photo: {
//       type: String,
//     },

//     role: {
//       type: String,
//       default: "user",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);