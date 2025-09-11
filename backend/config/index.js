// config/index.js
// Central configuration. Reads from environment variables.
// Supports: comma-separated FRONTENDS or a JSON array string.

const get = (key, fallback) => (typeof process.env[key] !== "undefined" ? process.env[key] : fallback);

const parseFrontends = (raw) => {
    if (!raw) return [];
    // allow either JSON array or comma-separated list
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map((s) => String(s).trim()).filter(Boolean);
    } catch (err) {
        // not JSON, fallback to comma-split
    }
    return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
};

const nodeEnv = get("NODE_ENV", "development");
const port = Number(get("PORT", 5000));
const mongoUri = get("MONGO_URI", "mongodb://localhost:27017/travelstrem_dev");

const frontendsRaw = get("FRONTENDS", "http://localhost:3000");
const frontends = parseFrontends(frontendsRaw);

const jwt = {
    accessSecret: get("JWT_ACCESS_SECRET", "dev_access_secret"),
    refreshSecret: get("JWT_REFRESH_SECRET", "dev_refresh_secret"),
    accessExpires: get("ACCESS_TOKEN_EXPIRES_IN", "15m"),
    refreshExpires: get("REFRESH_TOKEN_EXPIRES_IN", "30d"),
};

const rateLimitConfig = {
    windowMs: Number(get("RATE_WINDOW_MS", 60 * 1000)), // ms
    max: Number(get("RATE_MAX", 60)), // requests per windowMs
};

export default {
    nodeEnv,
    port,
    mongoUri,
    frontends,
    jwt,
    rateLimit: rateLimitConfig,
    debug: nodeEnv !== "production",
};
