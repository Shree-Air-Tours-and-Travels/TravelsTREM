import express from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/home", authMiddleware, getProfile);

export default router; // ✅ Use ES Module export
