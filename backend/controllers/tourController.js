import Tour from "../models/Tour.js";

export const getTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTourById = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
