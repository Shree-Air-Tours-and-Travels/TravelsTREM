// server/routes/filters.routes.js
import express from "express";
import { getFilters } from "../controllers/filtersController.js"

const router = express.Router();

router.get("/filters.json", getFilters);

export default filtersRoutes;


