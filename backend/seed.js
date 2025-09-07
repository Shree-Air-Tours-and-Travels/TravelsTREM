import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Tour from "./models/Tour.js";
import tours from "./utils/dummydata/tours.js";

dotenv.config();

const seedTours = async () => {
  try {
    await connectDB();

    // Clear existing tours
    await Tour.deleteMany();

    // Insert dummy tours
    const createdTours = await Tour.insertMany(tours);

    console.log(`✅ Seeded ${createdTours.length} tours`);
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding tours:", error.message);
    process.exit(1);
  }
};

seedTours();
