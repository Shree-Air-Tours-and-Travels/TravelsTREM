import express from "express";
import { getTours, getTourById, createTour, updateTour, deleteTour} from "../controllers/tourController.js";

const router = express.Router();

// GET all tours
router.get("/", getTours);        // Get all tours
router.get("/:id", getTourById);  // Get single tour
router.post("/", createTour);     // Create new tour
router.put("/:id", updateTour);   // Update tour
router.delete("/:id", deleteTour);// Delete tour


export default router;
