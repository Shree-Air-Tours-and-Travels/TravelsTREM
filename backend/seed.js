// seed.js
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import Tour from "./models/Tour.js";
import tours from "./utils/dummydata/tours.js";

const seedTours = async () => {
  try {
    await connectDB(); // ✅ use same db.js
    await Tour.deleteMany();
    await Tour.insertMany(tours);
    console.log("✅ Tours seeded!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding tours:", err);
    process.exit(1);
  }
};

seedTours();
