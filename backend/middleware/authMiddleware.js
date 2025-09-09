// server/middleware/jwtAuth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "replace_this_in_production";

/**
 * jwtAuth middleware
 * - If Authorization header missing or invalid -> responds 401
 * - If valid -> attaches decoded payload to req.user and calls next()
 */
const jwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // payload.sub, payload.role, payload.email, payload.name, iat, exp
    return next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default jwtAuth;
