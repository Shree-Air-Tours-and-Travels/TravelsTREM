import React from "react";
import "../../styles/components/tourCard.scss";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";

const TourCard = ({ tour }) => {
  const { title, location, price, reviews, avgRating,photo } = tour;

  // Calculate average rating
//   const averageRating =
//     reviews.length > 0
//       ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
//       : "No reviews";

  return (
    <div className="ui-tour-card">
      <img src={photo} alt={title} className="ui-tour-card__image" />
      <div className="ui-tour-card__content">
        <h3 className="ui-tour-card__title">{title}</h3>
        <div className="ui-tour-card__info">
          <span className="ui-tour-card__location">
            <FaMapMarkerAlt /> {location}
          </span>
          <span className="ui-tour-card__price">${price}</span>
        </div>
        <div className="ui-tour-card__reviews">
          <span className="ui-tour-card__review-count">{reviews.length} Reviews</span>
          <span className="ui-tour-card__rating">
            <FaStar /> {avgRating} 
          </span>
        </div>
        <button className="ui-tour-card__button">Book Now</button>
      </div>
    </div>
  );
};

export default TourCard;
