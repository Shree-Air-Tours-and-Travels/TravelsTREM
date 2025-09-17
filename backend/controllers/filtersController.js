// server/controllers/filtersController.js
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Tour from "../models/Tour.js";
import FiltersQueryModel from "../models/filters.js";
import FiltersQuery from "../models/FiltersQuery.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "../data/filters.json");

// Local fallback default (keeps parity with your DefaultFilters constant)
const DefaultFilters = {
    title: "Filters",
    description: "Search and filtering packages",
    data: [],
    structure: {
        fields: [
            { name: "search", label: "Search", type: "text", value: "" },
            { name: "city", label: "City", type: "select", value: "", optionsSource: "cities" },
            { name: "minPrice", label: "Min Price", type: "number", value: "" },
            { name: "maxPrice", label: "Max Price", type: "number", value: "" },
            { name: "minDays", label: "Min Days", type: "number", value: "" },
            { name: "maxDays", label: "Max Days", type: "number", value: "" },
            { name: "featured", label: "Featured", type: "select", value: "", optionsSource: "featured" },
            { name: "rating", label: "Rating", type: "select", value: "", optionsSource: "ratings" },
            { name: "adults", label: "Adults", type: "number", value: 2 },
            { name: "children", label: "Children", type: "number", value: 0 },
            { name: "infants", label: "Infants", type: "number", value: 0 },
            { name: "arrivalDate", label: "Arrival Date", type: "date", value: "" },
            { name: "returnDate", label: "Return Date", type: "date", value: "" }
        ],
        actions: [
            {
                name: "apply",
                type: "apply",
                label: "Apply filters",
                className: "button button--primary",
                method: "POST",
                endpoint: "/api/filters.json/apply"
            },
            {
                name: "reset",
                type: "apply",
                label: "Reset filters",
                className: "button button--primary",
                method: "POST",
                endpoint: "/api/tours.json"
            }
        ],
        submitText: "Apply Filters",
        layout: {
            rows: [
                ["search", "city", "minPrice", "maxPrice"],
                ["minDays", "maxDays", "featured", "rating"],
                ["adults", "children", "infants", "arrivalDate"],
                ["returnDate"]
            ]
        }
    },
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
            returnDate: ""
        },
        options: {
            cities: ["Paris", "London", "New York", "Delhi", "Tokyo", "Barcelona", "Rome", "Bangkok"],
            featured: [
                { label: "Any", value: "" },
                { label: "Featured", value: "true" },
                { label: "Not featured", value: "false" }
            ],
            ratings: [
                { label: "Any rating", value: "" },
                { label: "4+ stars", value: "4" },
                { label: "3+ stars", value: "3" },
                { label: "2+ stars", value: "2" }
            ],
            maxGuests: { adults: 10, children: 10, infants: 4 },
            dateRange: { earliest: "2025-01-01", latest: "2026-12-31" },
            priceBuckets: [
                { label: "Under $100", from: 0, to: 100 },
                { label: "$100 - $300", from: 100, to: 300 },
                { label: "$300 - $700", from: 300, to: 700 },
                { label: "Above $700", from: 700, to: 1000000 }
            ]
        }
    }
};

/**
 * Utility: safely parse number-ish values
 */
const safeParseNumber = (v) => {
    if (v === undefined || v === null || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
};

/**
 * Build Mongo query from filter payload
 * Supported filters:
 * - search => searches title and desc/`desc`
 * - city => exact match
 * - minPrice/maxPrice => price range
 * - minDays/maxDays => period.days range
 * - featured => "true"/"false" or boolean
 * - rating => numeric threshold (avgRating >= rating)
 * - arrivalDate/returnDate => placeholder (requires availability model) -- ignored for now
 * - adults/children/infants => ignored here (UI-only / client)
 */
const buildQueryFromFilters = (filters = {}) => {
    const q = {};

    // Search (case-insensitive substring on title & desc)
    if (filters.search && typeof filters.search === "string" && filters.search.trim() !== "") {
        const re = new RegExp(filters.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        q.$or = [{ title: re }, { desc: re }, { description: re }];
    }

    // City exact match (case-insensitive)
    if (filters.city && typeof filters.city === "string" && filters.city.trim() !== "") {
        q["city"] = new RegExp(`^${filters.city.trim()}$`, "i");
    }

    // Price range
    const minPrice = safeParseNumber(filters.minPrice);
    const maxPrice = safeParseNumber(filters.maxPrice);
    if (minPrice !== undefined || maxPrice !== undefined) {
        q.price = {};
        if (minPrice !== undefined) q.price.$gte = minPrice;
        if (maxPrice !== undefined) q.price.$lte = maxPrice;
        // if empty object, remove it
        if (Object.keys(q.price).length === 0) delete q.price;
    }

    // Days (period.days)
    const minDays = safeParseNumber(filters.minDays);
    const maxDays = safeParseNumber(filters.maxDays);
    if (minDays !== undefined || maxDays !== undefined) {
        q["period.days"] = {};
        if (minDays !== undefined) q["period.days"].$gte = minDays;
        if (maxDays !== undefined) q["period.days"].$lte = maxDays;
        if (Object.keys(q["period.days"]).length === 0) delete q["period.days"];
    }

    // Featured
    if (filters.featured !== undefined && filters.featured !== "") {
        // Accept boolean or strings "true"/"false"
        const val = (filters.featured === true || String(filters.featured).toLowerCase() === "true");
        q.featured = val;
    }

    // Rating (avgRating >= value)
    const rating = safeParseNumber(filters.rating);
    if (rating !== undefined) {
        q.avgRating = { $gte: rating };
    }

    // arrivalDate / returnDate: NOTE: to truly filter by dates you need an availability or bookings collection.
    // We'll ignore them here (or you can add custom logic later).
    // If you store date ranges in tours, add those queries here.

    return q;
};

/**
 * GET /api/filters
 * Read filters.json from disk (if present) else fallback to DefaultFilters.
 * Returns with a short simulated delay for consistent FE loading UX.
 */
export const getFilters = async (req, res) => {
    try {
        // optional validation for query params (won't block)
        try {
            const { error } = FiltersQuery?.validate?.(req.query || {}, { allowUnknown: true, stripUnknown: true }) || {};
            if (error) {
                console.warn("FiltersQuery validation warning:", error.details || error);
            }
        } catch (e) {
            // don't crash if schema missing
        }

        let payload = DefaultFilters;
        try {
            const raw = await fs.readFile(DATA_FILE, "utf-8");
            payload = JSON.parse(raw);
        } catch (e) {
            console.debug("filters.json not found or invalid, using DefaultFilters:", e?.message || e);
        }

        // small delay so frontend loader is visible (keeps parity with your other controllers)
        return setTimeout(() => {
            // Return payload.componentData when file is in the shape { componentData: { ... } }
            // otherwise return payload (DefaultFilters already matches componentData shape)
            const componentData = payload && payload.componentData ? payload.componentData : payload;
            return res.status(200).json({
                status: "success",
                message: "Filters fetched",
                componentData,
            });
        }, 300);
    } catch (err) {
        console.error("getFilters error:", err);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch filters",
            componentData: DefaultFilters,
            error: String(err),
        });
    }
};

/**
 * POST /api/filters/apply  (or you can wire this to POST /api/tours.json from FE)
 * Accepts a JSON body with filter fields (same keys as DefaultFilters.config.defaults).
 * Builds a Mongo query and returns matching tours (sorted by createdAt desc).
 *
 * Note: your frontend currently posts to "/api/tours.json" for apply action; you can:
 * - point that endpoint to this handler (router.post("/tours.json", applyFilters))
 * - OR keep your /tours route and let FE call /api/tours.json with filters in body.
 */
export const applyFilters = async (req, res) => {
    const handler = req?.user?.role === "agent" ? "agent" : req?.user?.role === "admin" ? "admin" : "admin";
    try {
        // Normalize incoming filters
        const filters = req.body && typeof req.body === "object" ? { ...req.body } : {};

        // Quick normalization: convert "true"/"false" strings to booleans,
        // convert number strings to numbers where appropriate.
        const normalize = (obj) => {
            const out = {};
            for (const k of Object.keys(obj)) {
                const v = obj[k];
                if (typeof v === "string") {
                    const trimmed = v.trim();
                    if (trimmed === "") {
                        out[k] = "";
                        continue;
                    }
                    // booleans
                    if (trimmed.toLowerCase() === "true") { out[k] = true; continue; }
                    if (trimmed.toLowerCase() === "false") { out[k] = false; continue; }
                    // numbers
                    const num = Number(trimmed);
                    if (!Number.isNaN(num) && String(num) === trimmed) {
                        out[k] = num;
                        continue;
                    }
                    out[k] = trimmed;
                } else {
                    out[k] = v;
                }
            }
            return out;
        };

        const sanitizedFilters = normalize(filters);


        // Validate incoming filters with Joi / FiltersQuery (if available)
        try {
            const { error, value } =
                FiltersQuery?.validate?.(sanitizedFilters || {}, { allowUnknown: true, stripUnknown: true }) || {};
            if (error) {
                console.warn("applyFilters validation warning:", error.details || error);
            }
            if (value) Object.assign(sanitizedFilters, value);
        } catch (e) {
            console.debug("FiltersQuery validation skipped or failed:", e?.message || e);
        }

        // Build the MongoDB query
        const mongoQuery = buildQueryFromFilters(sanitizedFilters);


        // LOG: the query we will send to Mongo — helps confirm expected criteria

        // LOG: what we actually received (helps debugging unfiltered results)
        // Log with regex-friendly stringify
        console.log("applyFilters: received filters:", filters);
        console.log("applyFilters: mongoQuery:", stringifyRegexes(mongoQuery));

        // Execute the query
        const tours = await Tour.find(mongoQuery).sort({ createdAt: -1 }).lean();

        // Compose response componentData (similar shape to toursController.getTours)
        const componentData = {
            state: {
                data: {
                    id: null,
                    title: "Filtered Tours",
                    description: "Tours matching your filters",
                    tours: tours || [],
                },
            },
            // Keep a minimal structure for FE to render filters + list (FE can also call GET /api/filters to obtain full structure)
            structure: {
                // If you want the UI to still render the filters panel, provide the DefaultFilters.structure
                ...DefaultFilters.structure,
            },
            config: {
                header: { title: "Filtered Tour Packages" },
                footer: { text: "Explore curated tours across stunning destinations" },
            },
            actions: {
                share: { label: "Share this tour" },
                save: { label: "Save to Wishlist" },
            },
        };

        // Reply with a short simulated delay to match other controllers (use 1s so user feels responsive but realistic)
        return setTimeout(() => {
            return res.status(200).json({
                status: "success",
                message: "Filtered tours fetched",
                handler,
                componentData,
            });
        }, 1000);
    } catch (error) {
        console.error("applyFilters error:", error);
        // On error, return an empty list and helpful error payload (but keep a 200 success fallback if you prefer)
        return setTimeout(() => {
            return res.status(500).json({
                status: "error",
                message: "Failed to apply filters",
                handler: req?.user?.role || "admin",
                componentData: {
                    state: { data: { tours: [] } },
                    structure: DefaultFilters.structure,
                    config: {},
                    actions: {},
                },
                error: String(error),
            });
        }, 1000);
    }
};

/**
 * Utility loader (optional) to reuse in other modules
 */
export const loadFiltersFromDisk = async () => {
    try {
        const raw = await fs.readFile(DATA_FILE, "utf-8");
        return JSON.parse(raw);
    } catch {
        return DefaultFilters;
    }
};


/**
 * Utility: stringify regexes for logging
 */
const stringifyRegexes = (obj) => {
    try {
        return JSON.stringify(
            obj,
            (k, v) => (v instanceof RegExp ? v.toString() : v),
            2
        );
    } catch (e) {
        return String(obj);
    }
};

// export default for convenience if using default import style
export default {
    getFilters,
    applyFilters,
    loadFiltersFromDisk,
};
