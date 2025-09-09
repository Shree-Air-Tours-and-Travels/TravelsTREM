// server/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "replace_this_in_production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const ADMIN_CREATION_SECRET = (process.env.ADMIN_CREATION_SECRET || "").toString().trim();

/**
 * register
 * body: { name, email, password, role?, adminSecret? }
 * returns: { token, user }
 */
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body || {};

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required." });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(409).json({ message: "Email already in use." });
        }

        const requestedRole = role || "public";

        // Admin secret validation (trim both sides)
        if (requestedRole === "admin") {
            const adminSecretReceived = (req.body.adminSecret ?? "").toString().trim();
            if (!adminSecretReceived || adminSecretReceived !== ADMIN_CREATION_SECRET) {
                // Do NOT log secret values in production
                return res.status(403).json({ message: "Invalid admin creation secret." });
            }
        }

        // Hash password properly with bcrypt
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            role: requestedRole,
        });

        await user.save();

        const token = jwt.sign(
            { sub: user._id.toString(), role: user.role, name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role };
        return res.status(201).json({ token, user: safeUser });
    } catch (err) {
        console.error("Auth register error:", err && err.stack ? err.stack : err);
        return res.status(500).json({ message: "Server error during registration." });
    }
};

/**
 * login
 * body: { email, password }
 * returns: { token, user }
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Make sure we have a hashed password stored
        if (!user.passwordHash || typeof user.passwordHash !== "string") {
            console.error(`[login] user ${normalizedEmail} missing/invalid passwordHash`);
            return res.status(500).json({ message: "User password is not configured correctly." });
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { sub: user._id.toString(), role: user.role, name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role };
        return res.json({ token, user: safeUser });
    } catch (err) {
        console.error("Auth login error:", err && err.stack ? err.stack : err);
        return res.status(500).json({ message: "Server error during login." });
    }
};

/**
 * getCurrentUser
 * protected route (requires Authorization header)
 * returns: { id, name, email, role }
 */
export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findById(req.user.sub).select("name email role");
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
        console.error("getCurrentUser error:", err && err.stack ? err.stack : err);
        return res.status(500).json({ message: "Server error" });
    }
};
