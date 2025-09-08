// controllers/tourController.js
import Tour from "../models/Tour.js";

/**
 * Helper: determine handler from req.user
 * expects req.user.role to be one of: 'admin', 'employee', 'user'
 */
const getHandlerFromReq = (req) => {
    const role = req?.user?.role;
    if (role === "admin") return "admin";
    if (role === "employee") return "employee";
    return "admin";
};

/**
 * Shared structure for admin forms and fields (feel free to extend)
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
            config: {
                header: { title: pageTitle },
                footer: { text: "Explore more tours" },
            },
            actions: {
                back: { label: "Back to Tours", url: "/tours" },
                contact: { label: "Contact Us" },
                chat: { label: "Chat on whatsapp" },
            },
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
 * GET /tours
 * returns list and structure; delayed by 3 seconds (kept as requested)
 */
export const getTours = async (req, res) => {
    const handler = getHandlerFromReq(req);

    try {
        const tours = await Tour.find().sort({ createdAt: -1 });

        // shape the componentData according to the new schema
        const componentData = {
            state: {
                data: {
                    // page-level id/title if needed - for list, id can be omitted or set to empty
                    id: null,
                    title: "All Tours",
                    description: "List of all tours",
                    tours: tours,
                },
            },
            structure: getBaseStructure("Our Popular Tour Packages"),
            config: {
                header: { title: "Our Popular Tour Packages" },
                footer: { text: "Explore curated tours across stunning destinations" },
            },
            actions: {
                share: { label: "Share this tour" },
                save: { label: "Save to Wishlist" },
            },
        };

        // simulate slow response for loader testing
        return setTimeout(() => {
            return res.status(200).json({
                status: "success",
                message: "Tours fetched successfully",
                handler,
                componentData,
            });
        }, 3000);
    } catch (error) {
        console.error("getTours error:", error);
        return setTimeout(() => {
            return res.status(500).json({
                status: "error",
                message: "Failed to fetch tours",
                handler: getHandlerFromReq(req),
                componentData: {
                    state: { data: { tours: [] } },
                    structure: getBaseStructure("Our Tour Packages"),
                    config: { header: { title: "Our Tour Packages" } },
                    actions: {},
                },
                error: error.message,
            });
        }, 3000);
    }
};

/**
 * GET /tours/:id
 * returns single tour wrapped inside state.data.{ id, title, tours: [tour] }
 * delayed by 3 seconds (kept as requested)
 */
export const getTourById = async (req, res) => {
    const handler = getHandlerFromReq(req);
    try {
        const { id } = req.params;
        const tour = await Tour.findById(id);

        if (!tour) {
            return setTimeout(() => {
                return res.status(404).json({
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
                        structure: getBaseStructure("Tour Not Found"),
                        config: { header: { title: "Tour Not Found" } },
                        actions: {},
                    },
                });
            }, 3000);
        }

        const componentData = {
            state: {
                data: {
                    id: tour._id,
                    title: tour.title || tour.name || "",
                    description: tour.desc || tour.description || "",
                    tours: [tour],
                },
            },
            structure: getBaseStructure(tour.title || "Tour Details"),
            config: {
                header: { title: tour.title || "Tour Details" },
                footer: { text: "Explore more tours" },
            },
            actions: {
                back: { label: "Back to Tours", url: "/tours" },
                contact: { label: "Contact Us" },
                chat: { label: "Chat on whatsapp" },
            },
        };

        return setTimeout(() => {
            return res.status(200).json({
                status: "success",
                message: "Tour fetched successfully",
                handler,
                componentData,
            });
        }, 3000);
    } catch (error) {
        console.error("getTourById error:", error);
        return setTimeout(() => {
            return res.status(500).json({
                status: "error",
                message: "Failed to fetch tour",
                handler: getHandlerFromReq(req),
                componentData: {
                    state: { data: { tours: [] } },
                    structure: getBaseStructure("Tour Details"),
                    config: {},
                    actions: {},
                },
                error: error.message,
            });
        }, 3000);
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
        const newTour = new Tour(req.body);
        const savedTour = await newTour.save();

        return res.status(201).json({
            status: "success",
            message: "Tour created successfully",
            handler,
            componentData: {
                state: {
                    data: {
                        id: savedTour._id,
                        title: savedTour.title || "",
                        description: savedTour.desc || "",
                        tours: [savedTour],
                    },
                },
                structure: getBaseStructure(savedTour.title || "New Tour"),
                config: { header: { title: savedTour.title || "New Tour" } },
                actions: {
                    back: { label: "Back to Tours", url: "/tours" },
                },
            },
        });
    } catch (error) {
        console.error("createTour error:", error);
        return res.status(400).json({
            status: "error",
            message: "Failed to create tour",
            handler,
            componentData: {
                state: { data: { tours: [] } },
                structure: getBaseStructure("Create Tour"),
                config: {},
                actions: {},
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
    try {
        const { id } = req.params;
        const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedTour) {
            return res.status(404).json({
                status: "error",
                message: "Tour not found",
                handler,
                componentData: {
                    state: { data: { tours: [] } },
                    structure: getBaseStructure("Tour Details"),
                    config: {},
                    actions: {},
                },
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Tour updated successfully",
            handler,
            componentData: {
                state: {
                    data: {
                        id: updatedTour._id,
                        title: updatedTour.title || "",
                        description: updatedTour.desc || "",
                        tours: [updatedTour],
                    },
                },
                structure: getBaseStructure(updatedTour.title || "Updated Tour"),
                config: { header: { title: updatedTour.title || "Updated Tour" } },
                actions: {
                    back: { label: "Back to Tours", url: "/tours" },
                },
            },
        });
    } catch (error) {
        console.error("updateTour error:", error);
        return res.status(400).json({
            status: "error",
            message: "Failed to update tour",
            handler,
            componentData: {
                state: { data: { tours: [] } },
                structure: getBaseStructure("Tour Details"),
                config: {},
                actions: {},
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
    try {
        const { id } = req.params;
        const deletedTour = await Tour.findByIdAndDelete(id);

        if (!deletedTour) {
            return res.status(404).json({
                status: "error",
                message: "Tour not found",
                handler,
                componentData: {
                    state: { data: { tours: [] } },
                    structure: getBaseStructure("Tour Details"),
                    config: {},
                    actions: {},
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
                structure: getBaseStructure("Tour Deleted"),
                config: { header: { title: "Tour Deleted" } },
                actions: {
                    back: { label: "Back to Tours", url: "/tours" },
                },
            },
        });
    } catch (error) {
        console.error("deleteTour error:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to delete tour",
            handler,
            componentData: {
                state: { data: { tours: [] } },
                structure: getBaseStructure("Tour Details"),
                config: {},
                actions: {},
            },
            error: error.message,
        });
    }
};
