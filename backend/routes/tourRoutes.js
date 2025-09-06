import express from "express";
import { getTours, getTourById} from "../controllers/tourController.js";

const router = express.Router();

// GET all tours
router.get("/", getTours);
router.get("/:id", getTourById);


export default router;
