// authRoutes.js (ESM version)
import express from "express";
import * as authController from "../controllers/authController.js";
import jwtAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", jwtAuth, authController.getCurrentUser);

export default router;
