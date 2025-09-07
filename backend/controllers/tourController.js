import Tour from "../models/Tour.js";

// ✅ Get all tours
export const getTours = async (req, res) => {
  try {
    const tours = await Tour.find().sort({createdAt: -1});

    res.status(200).json({
      status: "success",
      message: "Tours fetched successfully",
      componentData: {
        title: "Our Popular Tour Packages",
        description:
          "Explore curated tours across stunning destinations with flexible packages and memorable experiences.",
        data: tours,
        structure: {},
        config: {},
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch tours",
      componentData: {
        title: "Our Tour Packages",
        description: "",
        data: [],
        structure: {},
        config: {},
      },
      error: error.message,
    });
  }
};

// ✅ Get single tour by ID
export const getTourById = async (req, res) => {
  try {
    const {id} = req.params;
    const tour = await Tour.findById(id);

    if (!tour) {
      return res.status(404).json({
        status: "error",
        message: "Tour not found",
        componentData: {
          title: "Tour Details",
          description: "",
          data: [],
          structure: {},
          config: {},
        },
      });
    }

    res.status(200).json({
      status: "success",
      message: "Tour fetched successfully",
      componentData: {
        title: tour.title,
        description: tour.desc,
        data: [tour],
        structure: {},
        config: {},
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch tour",
      componentData: {
        title: "Tour Details",
        description: "",
        data: [],
        structure: {},
        config: {},
      },
      error: error.message,
    });
  }
};

// ✅ Create a new tour
export const createTour = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    const savedTour = await newTour.save();

    res.status(201).json({
      status: "success",
      message: "Tour created successfully",
      componentData: {
        title: "Our Tour Packages",
        description: "",
        data: [savedTour],
        structure: {},
        config: {},
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to create tour",
      componentData: {
        title: "Our Tour Packages",
        description: "",
        data: [],
        structure: {},
        config: {},
      },
      error: error.message,
    });
  }
};

// ✅ Update a tour by ID
export const updateTour = async (req, res) => {
  try {
    const {id} = req.params;
    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTour) {
      return res.status(404).json({
        status: "error",
        message: "Tour not found",
        componentData: {
          title: "Tour Details",
          description: "",
          data: [],
          structure: {},
          config: {},
        },
      });
    }

    res.status(200).json({
      status: "success",
      message: "Tour updated successfully",
      componentData: {
        title: updatedTour.title,
        description: updatedTour.desc,
        data: [updatedTour],
        structure: {},
        config: {},
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to update tour",
      componentData: {
        title: "Tour Details",
        description: "",
        data: [],
        structure: {},
        config: {},
      },
      error: error.message,
    });
  }
};

// ✅ Delete a tour by ID
export const deleteTour = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedTour = await Tour.findByIdAndDelete(id);

    if (!deletedTour) {
      return res.status(404).json({
        status: "error",
        message: "Tour not found",
        componentData: {
          title: "Tour Details",
          description: "",
          data: [],
          structure: {},
          config: {},
        },
      });
    }

    res.status(200).json({
      status: "success",
      message: "Tour deleted successfully",
      componentData: {
        title: "Our Tour Packages",
        description: "",
        data: [],
        structure: {},
        config: {},
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete tour",
      componentData: {
        title: "Tour Details",
        description: "",
        data: [],
        structure: {},
        config: {},
      },
      error: error.message,
    });
  }
};
