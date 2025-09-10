import dotenv from 'dotenv';

dotenv.config(); // Loads variables from .env

// Example of config structure:
const config = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    jwt: {
        accessSecret: process.env.JWT_SECRET || "default-jwt-secret",
    },
    frontends: process.env.FRONTENDS ? process.env.FRONTENDS.split(",") : [],
};

export default config;
