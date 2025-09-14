// server/routes/filters.routes.js
import express from "express";
import { getFilters } from "../controllers/filtersController.js";

const router = express.Router();

// GET /api/filters
router.get("/", getFilters);

export default router;
