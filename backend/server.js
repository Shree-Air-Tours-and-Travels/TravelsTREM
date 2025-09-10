import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
// import rateLimit from "express-rate-limit";
// import contactAgentRouter from "./routes/contactAgent.js";
import formsRouter from "./routes/form.js";

const app = express();

// ✅ Fix: Allow multiple frontend origins

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:3002",
  "https://travelstrem-test.onrender.com", // allow direct onrender host
].filter(Boolean);

// Allow additional origins via env var (comma-separated)
if (process.env.FRONTENDS) {
  const extras = process.env.FRONTENDS.split(",").map(s => s.trim()).filter(Boolean);
  allowedOrigins.push(...extras);
}

app.use((req, res, next) => {
  console.log("Incoming CORS origin:", req.headers.origin);
  next();
});

app.use(
   cors({
    origin: function (origin, callback) {
      // allow requests with no origin (curl, server-to-server, mobile apps)
      if (!origin) return callback(null, true);

      // exact whitelist match
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // allow Netlify preview domains like:
      // https://deploy-preview-48--your-site.netlify.app
      if (/^https?:\/\/.*--.*\.netlify\.app$/.test(origin) || /\.netlify\.app$/.test(origin)) {
        return callback(null, true);
      }

      // allow Render/app onrender subdomains (any *.onrender.com)
      if (/\.onrender\.com$/.test(origin)) {
        return callback(null, true);
      }

      // otherwise block
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.options("*", cors()); // preflight

app.use(express.json());
app.use(cookieParser());

// // rate limiter (recommended)
// const rateLimit = require("express-rate-limit");
// const contactLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: 6,
//   message: {status: "error", message: "Too many requests, try again later"},
// });
// app.use("/api/contact-agent", contactLimiter);

// // mount router (adjust path as needed)
// const contactAgentRouter = require("./routes/contactAgent");
// app.use("/api/contact-agent", contactAgentRouter);

app.use("/api/auth", authRoutes);
app.use("/api/tours.json", tourRoutes);
app.use("/api/hero.json", heroRoutes);
app.use("/api/services.json", serviceRoutes);
app.use("/api", formsRouter);

const PORT = process.env.PORT || 5000;
// start server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});


