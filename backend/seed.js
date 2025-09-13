// seed.js
import dotenv from "dotenv";
import fs from "fs";
import connectDB from "./config/db.js";
import Tour from "./models/Tour.js";
import tours from "./utils/dummydata/tours.js";

// Load environment file like in server.js
const currentEnv = process.env.NODE_ENV || "development";
const envFile = `.env.${currentEnv}`;

if (currentEnv !== "production" && fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    console.log(`✅ Loaded env from ${envFile}`);
} else {
    dotenv.config(); // fallback to .env
    if (currentEnv !== "production") {
        console.log(`⚠️ Loaded fallback .env (or none) for ${currentEnv}`);
    }
}

const seedTours = async () => {
    try {
        console.log("⏳ Connecting to DB...");
        await connectDB();

        console.log("🧹 Clearing existing tours...");
        await Tour.deleteMany();

        console.log("🌱 Seeding dummy tours...");
        const createdTours = await Tour.insertMany(tours);

        console.log(`✅ Successfully seeded ${createdTours.length} tours.`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding tours:");
        console.error(err.stack || err);
        process.exit(1);
    }
};

seedTours();
