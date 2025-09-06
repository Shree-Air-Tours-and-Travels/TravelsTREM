import React, { useEffect } from "react";
import { map } from "lodash";
// import tourData from "../assets/data/tours";
import TourCard from "../components/Cards/tourCard";
import { calculateAverageRating } from "../utils/calculateRating"; // Import utility function

import "../styles/layout/tourPackages.scss";
import Title from "../stories/Title";
import axios from "axios";
import api from "../utils/api";

const TourPackages = () => {
    // Header content for the tour packages section
    const headerContent = {
        title: "Our Tour Packages",
        description: "Explore the world with our exclusive tour packages",
    };

    // State to hold the list of tours
    const [tours, setTours] = React.useState([]);

    // Fetch tours from backend or use static data
    useEffect(() => {
        api.get("/tours").then(res => {
            setTours(res.data);
        }).catch(err => console.log("Error fetching tours:", err));
    }, []);
    console.log("Tours state:", tours);

    // Render the tour packages section
    return (
        <>
            <div className="ui-tour__header">
                <Title className="ui-tour__title" text={headerContent.title} />
                <p className="ui-tour__description">{headerContent.description}</p>
            </div>
            <div className="ui-tour__packages">
                {map(tours, (tour) => {
                    const { avgRating, ratingKey } = calculateAverageRating(tour.reviews);

                    const updatedTour = {
                        ...tour,
                        avgRating, // Pass calculated average rating
                        ratingKey, // Pass rating category
                    };

                    return (
                        <div key={tour.id} className="ui-tour__card">
                            <TourCard tour={updatedTour} id={tour.id} />
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default TourPackages;
