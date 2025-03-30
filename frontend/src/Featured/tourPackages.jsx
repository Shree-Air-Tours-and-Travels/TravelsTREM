import React from "react";
import { map } from "lodash";
import tourData from "../assets/data/tours";
import TourCard from "../components/Cards/tourCard";
import "../styles/layout/tourPackages.scss";

const TourPackages = () => {
  const headerContent = {
    title: "Our Tour Packages",
    description: "Explore the world with our exclusive tour packages",
  };

  return (
    <>
      <div className="ui-tour__header">
        <h2 className="ui-tour__title">{headerContent.title}</h2>
        <p className="ui-tour__description">{headerContent.description}</p>
      </div>
      <div className="ui-tour__packages">
        {map(tourData, (tour) => (
          <div key={tour.id} className="ui-tour__card">
            <TourCard tour={tour} />
          </div>
        ))}
      </div>
    </>
  );
};

export default TourPackages;
