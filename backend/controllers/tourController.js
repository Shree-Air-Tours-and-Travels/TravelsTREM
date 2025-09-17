// controllers/tourController.js
import Tour from "../models/Tour.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "../data/tourDetails.json");

const DEFAULT_DELAY_MS = 3000;

/**
 * Read static JSON (structure, config, actions, etc.)
 * If reading/parsing fails, returns a safe fallback object.
 */
const readStaticPayload = async () => {
    try {
        const raw = await fs.readFile(DATA_FILE, "utf-8");
        const payload = JSON.parse(raw);
        return payload || {};
    } catch (err) {
        console.warn("readStaticPayload warning:", err?.message || err);
        // fallback minimal structure
        return {
            state: { data: {} },
            structure: null,
            config: null,
            actions: null,
        };
    }
};

/**
 * helper for consistent delayed responses (keeps your 3s loader)
 */
const respondDelayed = (res, statusCode, body, delay = DEFAULT_DELAY_MS) => {
    return setTimeout(() => res.status(statusCode).json(body), delay);
};

/**
 * determine handler from req.user
 * expects req.user.role to be one of: 'admin', 'agent', 'user'
 */
const getHandlerFromReq = (req) => {
    const role = req?.user?.role;
    if (role === "admin") return "admin";
    if (role === "agent") return "agent";
    if (role === "user") return "user";
    // default to "user"
    return "user";
};

/**
 * Shared structure for admin forms and fields (kept as-is)
 */
const getBaseStructure = (pageTitle = "") => ({
    fields: [
        {
            name: "title",
            type: "text",
            label: "Tour Title",
            required: true,
        },
        {
            name: "description",
            type: "textarea",
            label: "Tour Description",
            required: true,
        },
        {
            name: "tours",
            type: "form",
            label: "Tour's Data",
            itemStructure: {
                fields: [
                    { name: "title", type: "text", label: "Tour Title", required: true },
                    { name: "city", type: "text", label: "City", required: true },
                    { name: "address.line1", type: "text", label: "Address Line 1", required: true },
                    { name: "address.line2", type: "text", label: "Address Line 2" },
                    { name: "address.city", type: "text", label: "City", required: true },
                    { name: "address.state", type: "text", label: "State/Province", required: true },
                    { name: "address.zip", type: "text", label: "ZIP/Postal Code", required: true },
                    { name: "address.country", type: "text", label: "Country", required: true },
                    { name: "distance", type: "number", label: "Distance (in km)", required: true, min: 0 },
                    { name: "period.days", type: "number", label: "Number of Days", required: true, min: 1 },
                    { name: "period.nights", type: "number", label: "Number of Nights", required: true, min: 0 },
                    { name: "photos", type: "array", label: "Photo URLs", itemType: "text", required: true },
                    { name: "desc", type: "textarea", label: "Description", required: true },
                    { name: "price", type: "number", label: "Price (in USD)", required: true, min: 0 },
                    { name: "maxGroupSize", type: "number", label: "Maximum Group Size", required: true, min: 1 },
                    { name: "featured", type: "checkbox", label: "Featured Tour" },
                    { name: "createdAt", type: "datetime", label: "Created At", readonly: true },
                    { name: "updatedAt", type: "datetime", label: "Updated At", readonly: true },
                    { name: "avgRating", type: "number", label: "Average Rating", readonly: true, min: 0, max: 5 },
                ],
            },
            config: {},
            actions: {},
        },
    ],
    card: {},
    config: {},
    actions: {
        share: { label: "Share this tour" },
        save: { label: "Save to Wishlist" },
    },
    layout: {},
});

/**
 * Filter roleActions so only actions allowed for the current handler are exposed.
 * Returns a shallow copy of actions with roleActions pruned.
 */
const filterRoleActionsForHandler = (actions = {}, handler = "user") => {
    if (!actions || !actions.roleActions) return actions;
    const filtered = { ...actions };
    const available = {};
    Object.entries(actions.roleActions).forEach(([key, action]) => {
        const allowed = action.allowedRoles || [];
        if (allowed.includes(handler)) {
            available[key] = action;
        }
    });
    filtered.roleActions = available;
    return filtered;
};

/**
 * Provide dummy highlights + itinerary so FE can render even if DB doesn't have them yet.
 * If payload (static JSON) contains templates, prefer those.
 * Later you can populate real data in DB and this function will pick from DB values.
 */
const getDummyHighlights = () => ({
    tripType: "Cultural & Active",
    groupSizeType: "Small Group Tour",
    lodgingLevel: "Standard - 3 star",
    physicalLevel: "Easy",
    tripPace: "Balanced schedule",
    highlights: [
        "Stay in a local’s home and learn about regional life.",
        "Explore colourful heritage streets and bustling markets.",
        "Spend a night aboard a traditional boat for a unique experience.",
        "Cyclo tour through old city and ancient temples.",
        "Dine at a local social enterprise to support the community."
    ],
});

const getDummyItinerary = (days = 3) => {
    const sample = [];
    for (let i = 1; i <= days; i += 1) {
        sample.push({
            day: i,
            title: i === 1 ? "Arrival & Orientation" : i === days ? "Wrap-up & Departure" : `Main Activity Day ${i}`,
            overview: i === 1 ? "Arrival, meet & greet, short orientation walk and welcome dinner." :
                i === days ? "Free morning and depart; optional extensions available." :
                    "Full day outing with local guide, included meals and activities.",
            mealsIncluded: i === 1 ? ["Dinner"] : i === days ? ["Breakfast"] : ["Breakfast", "Lunch"],
            overnight: i === days ? null : `Hotel - Night ${i}`,
        });
    }
    return sample;
};

/**
 * Merge/enrich a tour object with highlights and itinerary.
 * Priority:
 *  1. tour.highlights / tour.itinerary if set in DB
 *  2. payload-level templates (payload.state.data.tours[0].highlights or payload.state.data.itinerary)
 *  3. dummy defaults
 */
const enrichTourWithStatic = (tour = {}, payload = {}) => {
    const enriched = { ...tour };

    // Try DB values first
    if (!enriched.highlights) {
        // check payload-level tour template or top-level itinerary/highlights
        const payloadTourTemplate = payload?.state?.data?.tours && Array.isArray(payload.state.data.tours) && payload.state.data.tours[0]
            ? payload.state.data.tours[0].highlights
            : null;

        enriched.highlights = tour.highlights
            || payloadTourTemplate
            || payload?.highlights
            || payload?.state?.data?.highlights
            || getDummyHighlights();
    }

    if (!enriched.itinerary) {
        // payload may have top-level sample itinerary at payload.state.data.itinerary
        const payloadItinerary = payload?.state?.data?.itinerary || payload?.itinerary || payload?.data?.itinerary;
        enriched.itinerary = tour.itinerary
            || payloadItinerary
            || getDummyItinerary((tour?.period?.days) || 3);
    }

    return enriched;
};

/**
 * GET /tours
 * returns list and structure; keeps the 3s delay for loader testing
 * static UI data (structure/config/actions) comes from data/tourDetails.json
 * dynamic data (tours array) comes from DB
 */
export const getTours = async (req, res) => {
    const handler = getHandlerFromReq(req);
    try {
        const [payload, toursRaw] = await Promise.all([
            readStaticPayload(),
            Tour.find().sort({ createdAt: -1 }),
        ]);

        // enrich tours with highlights/itinerary so FE can render
        const tours = (Array.isArray(toursRaw) ? toursRaw : []).map((t) => enrichTourWithStatic(t.toObject ? t.toObject() : t, payload));

        // structure/config/actions come from payload; filter roleActions by handler
        const actions = payload?.actions || getBaseStructure().actions;
        const filteredActions = filterRoleActionsForHandler(actions, handler);

        const componentData = {
            state: {
                data: {
                    id: null,
                    title: payload?.state?.title || "All Tours",
                    description: payload?.state?.description || "List of all tours",
                    tours: tours,
                },
            },
            // prefer the payload structure if present; otherwise fall back to base structure
            structure: payload?.structure || getBaseStructure("Our Popular Tour Packages"),
            config: payload?.config || {
                header: { title: "Our Popular Tour Packages" },
                footer: { text: "Explore curated tours across stunning destinations" },
            },
            // actions filtered for handler
            actions: filteredActions,
        };

        return respondDelayed(res, 200, {
            status: "success",
            message: "Tours fetched successfully",
            handler,
            componentData,
        });
    } catch (error) {
        console.error("getTours error:", error);
        const payload = await readStaticPayload(); // still attempt to get static structure
        const actions = payload?.actions || {};
        const filteredActions = filterRoleActionsForHandler(actions, handler);

        return respondDelayed(res, 500, {
            status: "error",
            message: "Failed to fetch tours",
            handler,
            componentData: {
                state: { data: { tours: [] } },
                structure: payload?.structure || getBaseStructure("Our Tour Packages"),
                config: payload?.config || { header: { title: "Our Tour Packages" } },
                actions: filteredActions,
            },
            error: error.message,
        });
    }
};

/**
 * GET /tours/:id
 * returns single tour wrapped inside state.data.{ id, title, tours: [tour] }
 * also includes static payload (structure/config/actions) read from JSON
 */
export const getTourById = async (req, res) => {
    const handler = getHandlerFromReq(req);
    const { id } = req.params;

    try {
        const [payload, tourRaw] = await Promise.all([
            readStaticPayload(),
            Tour.findById(id),
        ]);

        if (!tourRaw) {
            const actions = payload?.actions || {};
            const filteredActions = filterRoleActionsForHandler(actions, handler);

            return respondDelayed(res, 404, {
                status: "error",
                message: "Tour not found",
                handler,
                componentData: {
                    state: {
                        data: {
                            id,
                            title: "Tour Not Found",
                            description: "",
                            tours: [],
                        },
                    },
                    structure: payload?.structure || getBaseStructure("Tour Not Found"),
                    config: payload?.config || { header: { title: "Tour Not Found" } },
                    actions: filteredActions,
                },
            });
        }

        // convert mongoose document to plain object if needed
        const tourObj = tourRaw.toObject ? tourRaw.toObject() : tourRaw;
        const enrichedTour = enrichTourWithStatic(tourObj, payload);

        const actions = payload?.actions || {};
        const filteredActions = filterRoleActionsForHandler(actions, handler);

        const componentData = {
            state: {
                data: {
                    id: enrichedTour._id,
                    title: enrichedTour.title || enrichedTour.name || "",
                    description: enrichedTour.desc || enrichedTour.description || "",
                    tours: [enrichedTour],
                },
            },
            structure: payload?.structure || getBaseStructure("Tour Details"),
            config: payload?.config || {},
            actions: {
                ...filteredActions,
                back: { label: "Back to Tours", url: "/tours" },
                footer: { label: "Back to Tours", url: "/tours" },
                contact: { label: "Contact Us", url: "/form.json" },
                chat: { label: "Chat on whatsapp", url: "" },
                reserve: { label: "Reserve", url: "" },
            },
        };

        return respondDelayed(res, 200, {
            status: "success",
            message: "Tour fetched successfully",
            handler,
            componentData,
        });
    } catch (error) {
        console.error("getTourById error:", error);
        const payload = await readStaticPayload();
        const actions = payload?.actions || {};
        const filteredActions = filterRoleActionsForHandler(actions, handler);

        return respondDelayed(res, 500, {
            status: "error",
            message: "Failed to fetch tour",
            handler,
            componentData: {
                state: { data: { tours: [] } },
                structure: payload?.structure || getBaseStructure("Tour Details"),
                config: payload?.config || {},
                actions: filteredActions,
            },
            error: error.message,
        });
    }
};

/**
 * POST /tours
 * create a new tour
 * returns created tour inside componentData.state.data.tours array
 */
export const createTour = async (req, res) => {
    const handler = getHandlerFromReq(req);
    try {
        // Optionally: sanitize/whitelist fields from req.body here
        const newTour = new Tour(req.body);
        const savedTour = await newTour.save();

        const payload = await readStaticPayload();
        const enrichedTour = enrichTourWithStatic(savedTour.toObject ? savedTour.toObject() : savedTour, payload);

        const actions = payload?.actions || {};
        const filteredActions = filterRoleActionsForHandler(actions, handler);

        return res.status(201).json({
            status: "success",
            message: "Tour created successfully",
            handler,
            componentData: {
                state: {
                    data: {
                        id: enrichedTour._id,
                        title: enrichedTour.title || "",
                        description: enrichedTour.desc || "",
                        tours: [enrichedTour],
                    },
                },
                structure: payload?.structure || getBaseStructure(enrichedTour.title || "New Tour"),
                config: payload?.config || { header: { title: enrichedTour.title || "New Tour" } },
                actions: filteredActions,
            },
        });
    } catch (error) {
        console.error("createTour error:", error);
        const payload = await readStaticPayload();
        const actions = payload?.actions || {};
        const filteredActions = filterRoleActionsForHandler(actions, handler);

        return res.status(400).json({
            status: "error",
            message: "Failed to create tour",
            handler,
            componentData: {
                state: { data: { tours: [] } },
                structure: payload?.structure || getBaseStructure("Create Tour"),
                config: payload?.config || {},
                actions: filteredActions,
            },
            error: error.message,
        });
    }
};

/**
 * PUT /tours/:id
 * update a tour
 */
export const updateTour = async (req, res) => {
    const handler = getHandlerFromReq(req);
    const { id } = req.params;

    try {
        const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedTour) {
            const payload = await readStaticPayload();
            const actions = payload?.actions || {};
            const filteredActions = filterRoleActionsForHandler(actions, handler);

            return res.status(404).json({
                status: "error",
                message: "Tour not found",
                handler,
                componentData: {
                    state: { data: { tours: [] } },
                    structure: payload?.structure || getBaseStructure("Tour Details"),
                    config: payload?.config || {},
                    actions: filteredActions,
                },
            });
        }

        const payload = await readStaticPayload();
        const enrichedTour = enrichTourWithStatic(updatedTour.toObject ? updatedTour.toObject() : updatedTour, payload);
        const actions = payload?.actions || {};
        const filteredActions = filterRoleActionsForHandler(actions, handler);

        return res.status(200).json({
            status: "success",
            message: "Tour updated successfully",
            handler,
            componentData: {
                state: {
                    data: {
                        id: enrichedTour._id,
                        title: enrichedTour.title || "",
                        description: enrichedTour.desc || "",
                        tours: [enrichedTour],
                    },
                },
                structure: payload?.structure || getBaseStructure(enrichedTour.title || "Updated Tour"),
                config: payload?.config || { header: { title: enrichedTour.title || "Updated Tour" } },
                actions: filteredActions,
            },
        });
    } catch (error) {
        console.error("updateTour error:", error);
        const payload = await readStaticPayload();
        const actions = payload?.actions || {};
        const filteredActions = filterRoleActionsForHandler(actions, handler);

        return res.status(400).json({
            status: "error",
            message: "Failed to update tour",
            handler,
            componentData: {
                state: { data: { tours: [] } },
                structure: payload?.structure || getBaseStructure("Tour Details"),
                config: payload?.config || {},
                actions: filteredActions,
            },
            error: error.message,
        });
    }
};

/**
 * DELETE /tours/:id
 * delete a tour
 */
export const deleteTour = async (req, res) => {
    const handler = getHandlerFromReq(req);
    const { id } = req.params;

    try {
        const deletedTour = await Tour.findByIdAndDelete(id);

        const payload = await readStaticPayload();
        const actions = payload?.actions || {};
        const filteredActions = filterRoleActionsForHandler(actions, handler);

        if (!deletedTour) {
            return res.status(404).json({
                status: "error",
                message: "Tour not found",
                handler,
                componentData: {
                    state: { data: { tours: [] } },
                    structure: payload?.structure || getBaseStructure("Tour Details"),
                    config: payload?.config || {},
                    actions: filteredActions,
                },
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Tour deleted successfully",
            handler,
            componentData: {
                state: {
                    data: {
                        id: null,
                        title: "Tour Deleted",
                        description: "",
                        tours: [],
                    },
                },
                structure: payload?.structure || getBaseStructure("Tour Deleted"),
                config: payload?.config || { header: { title: "Tour Deleted" } },
                actions: filteredActions,
            },
        });
    } catch (error) {
        console.error("deleteTour error:", error);
        const payload = await readStaticPayload();
        const actions = payload?.actions || {};
        const filteredActions = filterRoleActionsForHandler(actions, handler);

        return res.status(500).json({
            status: "error",
            message: "Failed to delete tour",
            handler,
            componentData: {
                state: { data: { tours: [] } },
                structure: payload?.structure || getBaseStructure("Tour Details"),
                config: payload?.config || {},
                actions: filteredActions,
            },
            error: error.message,
        });
    }
};
