// backend/server.js
import express from "express";
import dotenv from "dotenv";
import fs from "fs";

const currentEnv = process.env.NODE_ENV || "development";
const envFile = `.env.${currentEnv}`;

if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    console.log(`✅ Loaded env from ${envFile}`);
} else {
    dotenv.config(); // fallback to default .env
    console.log(`⚠️  Loaded fallback .env (didn't find ${envFile})`);
}

import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import config from "./config/index.js";

import authRoutes from "./routes/authRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import formsRouter from "./routes/form.js";

const app = express();

// Optional (recommended) middlewares you can enable later:
// import helmet from "helmet"; app.use(helmet());
// import morgan from "morgan"; app.use(morgan(config.debug ? "dev" : "combined"));

const allowedOrigins = Array.isArray(config.frontends) ? config.frontends : [];

app.use((req, res, next) => {
    console.log("Incoming CORS origin:", req.headers.origin);
    next();
});

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // allow Netlify preview domains
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

app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tours.json", tourRoutes);
app.use("/api/hero.json", heroRoutes);
app.use("/api/services.json", serviceRoutes);
app.use("/api", formsRouter);

// Central error handler
app.use((err, req, res, next) => {
    if (err && err.message && err.message.startsWith("CORS blocked:")) {
        return res.status(403).json({ status: "error", message: err.message });
    }

    console.error(err.stack || err);
    res.status(500).json({
        status: "error",
        message: err.message || "Internal Server Error",
    });
});

const PORT = config.port;

(async () => {
    try {
        await connectDB();
        app.listen(PORT, () =>
            console.log(`🚀 Server running in ${config.nodeEnv} on port ${PORT}`)
        );
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
})();
