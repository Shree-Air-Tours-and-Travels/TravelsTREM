// server/controllers/filtersController.js
import FiltersQueryModel from "../models/filters.js";
import  FiltersQuery from "../models/FiltersQuery.model.js"; 
// Default Filters structure (fallback)
const DefaultFilters = {
  title: "Filters",
  description: "Search and filtering options",
  data: [],
  structure: {
    fields: [
      { name: "search", label: "Search", type: "text", value: "" },
      { name: "city", label: "City", type: "select", value: "" },
      { name: "minPrice", label: "Min Price", type: "number", value: "" },
      { name: "maxPrice", label: "Max Price", type: "number", value: "" },
      { name: "minDays", label: "Min Days", type: "number", value: "" },
      { name: "maxDays", label: "Max Days", type: "number", value: "" },
      { name: "featured", label: "Featured", type: "select", value: "" },
      { name: "rating", label: "Rating", type: "select", value: "" },
      { name: "adults", label: "Adults", type: "number", value: 2 },
      { name: "children", label: "Children", type: "number", value: 0 },
      { name: "infants", label: "Infants", type: "number", value: 0 },
      { name: "arrivalDate", label: "Arrival Date", type: "date", value: "" },
      { name: "returnDate", label: "Return Date", type: "date", value: "" },
    ],
    submitText: "Apply Filters",
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
      returnDate: "",
    },
    options: { cities: [], featured: [], ratings: [] },
  },
};

/**
 * GET /api/filters
 * Validate query, return payload from data/filters.json or fallback.
 */
export const getFilters = async (req, res) => {
  try {
    // Validate query using Joi schema so frontend mistakes won't break anything
    try {
      const { error, value } = FiltersQuery.validate(req.query, {
        allowUnknown: true,
        stripUnknown: true,
      });
      if (error) {
        console.warn("filters query validation failed:", error.details);
      }
      // you can use `value` if you need sanitized query params
    } catch (schemaErr) {
      console.debug("FiltersQuery validation skipped or failed:", schemaErr?.message || schemaErr);
    }

    // Optional: run mongoose model validation (construct instance but don't save)
    try {
      const doc = new FiltersQueryModel(req.query);
      if (typeof doc.validateSync === "function") {
        const validationError = doc.validateSync();
        if (validationError) {
          console.warn("Mongoose filters query validation failed:", validationError.errors);
        }
      }
    } catch (e) {
      console.debug("FiltersQueryModel instantiation skipped or failed:", e?.message || e);
    }

    // Read JSON file
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const payload = JSON.parse(raw);

    // emulate slight delay (consistent UX with other controllers)
    setTimeout(() => {
      return res.status(200).json({
        status: "success",
        message: "Filters fetched",
        componentData: payload,
      });
    }, 300);
  } catch (err) {
    console.error("getFilters error:", err);

    // fallback to default structure
    return res.status(200).json({
      status: "success",
      message: "filters fallback",
      componentData: DefaultFilters,
    });
  }
};

// export function to programmatically load the JSON (optional)
export const loadFiltersFromDisk = async () => {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return DefaultFilters;
  }
};
