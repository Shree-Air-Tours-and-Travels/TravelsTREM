import Hero from "../models/Hero.js";

// Get latest hero content
export const getHero = async (req, res) => {
  const DefaultHero = {
    title: "Traveling opens the door to creating",
    highlight: "memories",
    description:
      "Discover the world with TravelsTREM. Curated adventures, stunning destinations, and memories that last a lifetime.",
    buttonText: "Explore Now",
    images: {
      main: "/hero-images/air-hostest1.png",
      gallery: ["/hero-images/air-hostest2.jpg", "/hero-images/air-hostest3.jpg"],
      video: "/hero-images/hero-video.mp4",
    },
  };

  try {
    const hero = await Hero.findOne().sort({ createdAt: -1 });

    // ⏳ delay 3 seconds before sending response
    setTimeout(() => {
      if (!hero) {
        return res.status(200).json({
          success: true,
          message: "Default hero content used",
          data: DefaultHero,
        });
      }

      res.status(200).json({
        success: true,
        message: "Hero content fetched successfully",
        data: hero,
      });
    }, 1000); // 3000ms = 3 seconds

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hero content",
      error: err.message,
    });
  }
};


// Create or update hero content (for admin)
export const createHero = async (req, res) => {
  try {
    const newHero = new Hero(req.body);
    const savedHero = await newHero.save();

    res.status(201).json({
      success: true,
      message: "Hero content created successfully",
      data: savedHero,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to create hero content",
      error: err.message,
    });
  }
};
