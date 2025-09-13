// server.js
import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import config from "./config/index.js";
import authRoutes from "./routes/authRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import formsRouter from "./routes/form.js";
import chatRoutes from "./routes/chatRoutes.js";


// Load environment variables: allow explicit .env.<env> but don't rely on .env for production
const currentEnv = process.env.NODE_ENV || "development";
const envFile = `.env.${currentEnv}`;

if (currentEnv !== "production" && fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    console.log(`✅ Loaded env from ${envFile}`);
} else {
    // attempt to load plain .env if present (useful for local dev)
    dotenv.config(); // safe no-op when no .env present
    if (currentEnv !== "production") {
        console.log(`⚠️ Loaded fallback .env (or none) for ${currentEnv}`);
    }
}

const app = express();
app.set("trust proxy", true); // needed if behind proxies (Render, Netlify functions, etc.)

// Basic middleware
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging: less verbose in production
if (config.debug) {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

// Rate limiter (configurable via envs)
const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
});
app.use(limiter);

// CORS Configuration
const allowedOrigins = Array.isArray(config.frontends) ? config.frontends : [];

app.use((req, res, next) => {
    // Helpful for debugging which origin a request had
    // (remove or lower logging level in production)
    if (config.debug) console.log("Incoming CORS origin:", req.headers.origin);
    next();
});

app.use(
    cors({
        origin: function (origin, callback) {
            // No origin (like server-to-server or curl) — allow
            if (!origin) return callback(null, true);

            // Exact match
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // allow Netlify preview domains (like preview--site.netlify.app)
            if (/^https?:\/\/.*--.*\.netlify\.app$/.test(origin) || /\.netlify\.app$/.test(origin)) {
                return callback(null, true);
            }

            // allow Render subdomains (*.onrender.com)
            if (/\.onrender\.com$/.test(origin)) {
                return callback(null, true);
            }

            return callback(new Error(`CORS blocked: ${origin}`));
        },
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

// Preflight handler
app.options("*", cors());

// Health-check / readiness endpoints
app.get("/health", (req, res) => res.status(200).json({ status: "ok", env: currentEnv }));
app.get("/", (req, res) => res.send("Travelstrem API is running"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tours.json", tourRoutes);
app.use("/api/hero.json", heroRoutes);
app.use("/api/services.json", serviceRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", formsRouter);

// Central error handler
app.use((err, req, res, next) => {
    if (err && err.message && err.message.startsWith("CORS blocked:")) {
        return res.status(403).json({ status: "error", message: err.message });
    }

    // Log error stack for debugging
    console.error(err && err.stack ? err.stack : err);

    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal Server Error",
    });
});

// Prefer platform PORT (e.g. Render provides process.env.PORT)
const PORT = Number(process.env.PORT) || Number(config.port) || 5000;

(async () => {
    try {
        await connectDB(); // connect to DB before accepting requests
        const server = app.listen(PORT, () =>
            console.log(`🚀 Server running on port ${PORT} (env: ${currentEnv})`)
        );

        // Graceful shutdown
        const shutdown = async () => {
            console.log("Shutting down gracefully...");
            server.close(() => {
                console.log("HTTP server closed");
                // optionally close DB connection if your connectDB exposes close
                process.exit(0);
            });
            // force exit in 10s
            setTimeout(() => process.exit(1), 10_000).unref();
        };

        process.on("SIGTERM", shutdown);
        process.on("SIGINT", shutdown);
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
})();
