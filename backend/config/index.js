const get = (key, fallback) => process.env[key] ?? fallback;

export default {
    nodeEnv: get("NODE_ENV", "development"),
    port: Number(get("PORT", 5000)),
    mongoUri: get("MONGO_URI", "mongodb://localhost:27017/travelstrem_dev"),
    frontends: (get("FRONTENDS", "http://localhost:3000")).split(",").map(s => s.trim()),
    jwt: {
        accessSecret: get("JWT_ACCESS_SECRET", "dev_access_secret"),
        refreshSecret: get("JWT_REFRESH_SECRET", "dev_refresh_secret"),
        accessExpires: get("ACCESS_TOKEN_EXPIRES_IN", "15m"),
        refreshExpires: get("REFRESH_TOKEN_EXPIRES_IN", "30d"),
    },
    rateLimit: {
        windowMs: Number(get("RATE_WINDOW_MS", 60 * 1000)),
        max: Number(get("RATE_MAX", 6)),
    },
    debug: get("NODE_ENV", "development") !== "production",
};


//import config from "./config/index.js";
// const allowedOrigins = config.frontends;
// const PORT = config.port;
