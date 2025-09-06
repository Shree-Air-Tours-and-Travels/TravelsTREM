import express from "express";
import { getTours } from "../controllers/tourController.js";

const router = express.Router();

// GET all tours
router.get("/", getTours);

export default router;
