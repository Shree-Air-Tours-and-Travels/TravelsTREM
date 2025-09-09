// server/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import crypto from "crypto";
import mailer from "../utils/mailer.js"; // <- new helper (optional)
import fs from "fs";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET || "replace_this_in_production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const ADMIN_CREATION_SECRET = (process.env.ADMIN_CREATION_SECRET || "").toString().trim();

// OTP TTL (ms)
const OTP_TTL = 1000 * 60 * 15; // 15 minutes

const signTokenForUser = (user) =>
    jwt.sign(
        { sub: user._id.toString(), role: user.role, name: user.name, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

/**
 * register
 */

export const getAuthConfig = async (req, res) => {
  try {
    const configPath = path.resolve(process.cwd(), "config", "auth.json");
    if (!fs.existsSync(configPath)) {
      return res.status(500).json({ status: "error", message: "auth.json not found on server" });
    }
    const raw = fs.readFileSync(configPath, "utf8");
    const json = JSON.parse(raw);
    return res.json(json);
  } catch (err) {
    console.error("getAuthConfig error:", err && err.stack ? err.stack : err);
    return res.status(500).json({ status: "error", message: "Failed to load auth config" });
  }
};

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

        const requestedRole = role || "member";

        if (requestedRole === "admin") {
            const adminSecretReceived = (req.body.adminSecret ?? "").toString().trim();
            if (!adminSecretReceived || adminSecretReceived !== ADMIN_CREATION_SECRET) {
                return res.status(403).json({ message: "Invalid admin creation secret." });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            role: requestedRole,
        });

        await user.save();

        const token = signTokenForUser(user);
        const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role };
        return res.status(201).json({ token, user: safeUser });
    } catch (err) {
        console.error("Auth register error:", err && err.stack ? err.stack : err);
        return res.status(500).json({ message: "Server error during registration." });
    }
};

/**
 * login
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

        if (!user.passwordHash || typeof user.passwordHash !== "string") {
            console.error(`[login] user ${normalizedEmail} missing/invalid passwordHash`);
            return res.status(500).json({ message: "User password is not configured correctly." });
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = signTokenForUser(user);
        const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role };
        return res.json({ token, user: safeUser });
    } catch (err) {
        console.error("Auth login error:", err && err.stack ? err.stack : err);
        return res.status(500).json({ message: "Server error during login." });
    }
};

/**
 * forgotPassword (OTP)
 * body: { email }
 */

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body || {};
        if (!email) return res.status(400).json({ message: "Email is required." });

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        // If user not found, return validation error
        if (!user) {
            return res.status(404).json({ message: "No account found with that email address." });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + OTP_TTL; // OTP_TTL already defined (e.g. 15min)
        await user.save();

        // Build OTP email content
        const subject = "Your password reset code";
        const text = `Your password reset code is: ${otp}. It is valid for 15 minutes.`;
        const html = `<p>Your password reset code is: <strong>${otp}</strong></p><p>This code is valid for 15 minutes.</p>`;

        try {
            if (mailer && process.env.SMTP_HOST) {
                await mailer.sendMail({ to: user.email, subject, text, html });
            } else {
                console.info(`[forgotPassword] OTP for ${user.email}: ${otp}`);
            }
        } catch (emailErr) {
            console.error("Error sending OTP email:", emailErr);
            // optionally still return 500 here; for now, proceed but inform caller
            return res.status(500).json({ message: "Failed to send OTP email. Try again later." });
        }

        return res.json({ message: "OTP sent to registered email address." });
    } catch (err) {
        console.error("Auth forgotPassword error:", err && err.stack ? err.stack : err);
        return res.status(500).json({ message: "Server error" });
    }
};


/**
 * resetPassword (OTP verification)
 * body: { email, otp, password }
 */
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body || {};
        if (!email || !otp || !password) {
            return res.status(400).json({ message: "Email, OTP and new password are required." });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail,
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(password, salt);
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Issue new JWT so user is logged in immediately
        const token = signTokenForUser(user);
        const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role };

        return res.json({ message: "Password reset successful.", token, user: safeUser });
    } catch (err) {
        console.error("Auth resetPassword error:", err && err.stack ? err.stack : err);
        return res.status(500).json({ message: "Server error resetting password." });
    }
};

/**
 * getCurrentUser
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
