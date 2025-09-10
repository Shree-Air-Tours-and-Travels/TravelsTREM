// server.js
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
import formsRouter from "./routes/form.js";

const app = express();

// Build allowed origins from env or fallback to sensible defaults
// Set FRONTEND_URL in Render/Netlify to your frontend URL (e.g. https://your-site.netlify.app)
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.REACT_APP_API_URL || null;
const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:3002",
]);

if (FRONTEND_URL) allowedOrigins.add(FRONTEND_URL);
if (process.env.ADDITIONAL_ALLOWED_ORIGINS) {
  // comma separated list passthrough
  process.env.ADDITIONAL_ALLOWED_ORIGINS.split(",").forEach((o) => allowedOrigins.add(o.trim()));
}

app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser requests (e.g. server-to-server) when origin is undefined
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Simple health endpoint
app.get("/health", (req, res) => {
  // Optionally add DB check: ensure mongoose connection readyState === 1
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Debug route to list registered routes (safe for short-term debugging)
app.get("/__routes", (req, res) => {
  try {
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        routes.push({
          path: middleware.route.path,
          methods: Object.keys(middleware.route.methods),
        });
      } else if (middleware.name === "router" && middleware.handle.stack) {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            routes.push({
              path: handler.route.path,
              methods: Object.keys(handler.route.methods),
            });
          }
        });
      }
    });
    res.json({ routes });
  } catch (err) {
    res.status(500).json({ error: "Failed to list routes" });
  }
});

// Mount API routes (use clean paths; avoid .json suffix unless intentionally required)
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api", formsRouter);

// global error handler (prevents uncaught exceptions from returning raw stack)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && (err.stack || err.message || err));
  res.status(err.status || 500).json({ status: "error", message: err.message || "Internal Server Error" });
});

// Start server after DB connection — use Render's port if available
const PORT = Number(process.env.PORT) || Number(process.env.SERVER_PORT) || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (env PORT=${process.env.PORT || "unset"})`));
  })
  .catch((err) => {
    console.error("Failed to connect to DB; exiting.", err && (err.stack || err.message || err));
    // exit so Render marks deploy unhealthy — you may want to retry depending on your setup
    process.exit(1);
  });

export default app;
