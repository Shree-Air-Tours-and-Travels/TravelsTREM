// server/controllers/filters.controller.js
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { FiltersQuery } from "../models/filters";

import FiltersQuerySchema from "../models/FiltersQuery.model.js"; // mongoose model

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "../data/filters.json");

/**
 * GET /api/filters.json
 * Returns componentData shaped object for front-end Filters component
 */
export async function getFilters(req, res) {

    // inside getFilters
    const doc = new FiltersQuery(req.query);
    const validationError = doc.validateSync();
    if (validationError) {
        console.warn("filters query validation failed:", validationError.errors);
    }
    try {

        // optional: validate incoming query params
        const { error } = FiltersQuerySchema.validate(req.query, {
            allowUnknown: true,
            stripUnknown: true,
        });
        if (error) {
            console.warn("filters query validation failed:", error.details);
        }

        const raw = await fs.readFile(DATA_FILE, "utf-8");
        const payload = JSON.parse(raw);

        return res.status(200).json(payload);
    } catch (err) {
        console.error("getFilters error:", err);
        return res.status(200).json({
            status: "success",
            message: "filters fallback",
            componentData: {
                title: "Filters",
                description: "",
                data: [],
                structure: {},
                config: {
                    defaults: {
                        search: "",
                        city: "",
                        minPrice: "",
                        maxPrice: "",
                        minDays: "",
                        maxDays: "",
                        featured: "",
                        rating: "",
                        adults: 2,
                        children: 0,
                        infants: 0,
                        arrivalDate: "",
                        returnDate: "",
                    },
                    options: { cities: [], featured: [], ratings: [] },
                },
            },
        });
    }
}
