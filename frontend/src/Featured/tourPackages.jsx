import React from "react";
import { map } from "lodash";
import tourData from "../assets/data/tours";
import TourCard from "../components/Cards/tourCard";
import { useNavigate } from "react-router-dom";
import { calculateAverageRating } from "../utils/calculateRating"; // Import utility function

import "../styles/layout/tourPackages.scss";
import Title from "../stories/Title";

const TourPackages = () => {
  const headerContent = {
    title: "Our Tour Packages",
    description: "Explore the world with our exclusive tour packages",
  };

  const navigate = useNavigate();

  const handleNavigate = (id) => {
    navigate(`/tours/${id}`);
  };

  return (
    <>
      <div className="ui-tour__header">
        <Title className="ui-tour__title" text={headerContent.title} />
        <p className="ui-tour__description">{headerContent.description}</p>
      </div>
      <div className="ui-tour__packages">
        {map(tourData, (tour) => {
          const { avgRating, ratingKey } = calculateAverageRating(tour.reviews);

          const updatedTour = {
            ...tour,
            avgRating, // Pass calculated average rating
            ratingKey, // Pass rating category
          };

          return (
            <div key={tour.id} className="ui-tour__card">
              <TourCard tour={updatedTour} handleNavigate={() => handleNavigate(tour?.id)} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TourPackages;
