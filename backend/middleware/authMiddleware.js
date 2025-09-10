// server/middleware/jwtAuth.js
import jwt from "jsonwebtoken";
import config from "../config/index.js";
// Uncomment if you want to check token revocation/version in DB
// import User from "../models/User.js";

const JWT_SECRET = config.jwt?.accessSecret || process.env.JWT_SECRET || "replace_this_in_production";

/**
 * jwtAuth middleware
 * - Accepts token from:
 *    1) Authorization: Bearer <token>
 *    2) Cookie: accessToken (useful if you store access token in httpOnly cookie)
 * - Verifies token and attaches a minimal req.user object.
 * - Optionally supports server-side revocation/tokenVersion checks (commented).
 */
const jwtAuth = async (req, res, next) => {
    try {
        // 1) Get token from Authorization header
        const authHeader = req.headers?.authorization;
        let token = null;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        // 2) Fallback: look in cookie named 'accessToken' (optional)
        if (!token && req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            res.setHeader("WWW-Authenticate", "Bearer");
            return res.status(401).json({ message: "No token provided" });
        }

        // 3) Verify token
        const payload = jwt.verify(token, JWT_SECRET);

        // 4) Optional: server-side revocation / tokenVersion check
        // If you store a tokenVersion or jti on the user record, validate it here.
        // Example (uncomment and adapt if you use tokenVersion):
        //
        // if (payload?.sub) {
        //   const user = await User.findById(payload.sub).select("tokenVersion role");
        //   if (!user) return res.status(401).json({ message: "Invalid token (user not found)" });
        //   if (payload.tokenVersion !== user.tokenVersion) {
        //     return res.status(401).json({ message: "Token revoked" });
        //   }
        //   // attach minimal info
        //   req.user = { id: user._id.toString(), role: user.role };
        //   return next();
        // }

        // 5) Attach minimal user info to req
        // Prefer minimal fields: id (sub), role, maybe email (only if needed)
        req.user = {
            id: payload.sub ?? payload.id ?? payload.userId,
            role: payload.role,
            email: payload.email,
        };

        return next();
    } catch (err) {
        // Log full error server-side; avoid leaking details to the client
        console.error("JWT verification failed:", err && err.message ? err.message : err);
        res.setHeader("WWW-Authenticate", "Bearer error=\"invalid_token\"");
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default jwtAuth;
