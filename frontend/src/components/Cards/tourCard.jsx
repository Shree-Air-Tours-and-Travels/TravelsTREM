import React from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import Button from "../../stories/Button";
import "../../styles/components/tourCard.scss";

const TourCard = ({ tour, handleNavigate }) => {
  const { id, title, location, price, reviews, avgRating, ratingKey, photo } = tour;

  return (
    <div className="ui-tour-card">
      <img src={photo} alt={title} className="ui-tour-card__image" />
      <div className="ui-tour-card__content">
        <a href={`/tours/${id}`} className="ui-tour-card__title">
          {title}
        </a>
        <div className="ui-tour-card__info">
          <span className="ui-tour-card__location">
            <FaMapMarkerAlt /> {location}
          </span>
          <span className="ui-tour-card__price">${price}</span>
        </div>
        <div className="ui-tour-card__reviews">
          <span className="ui-tour-card__review-count">{reviews.length} Reviews</span>
          <span className={`ui-tour-card__rating ui-tour-card__rating--${ratingKey}`}>
            <FaStar /> {avgRating}
          </span>
        </div>
        <Button className="ui-tour-card__button" text="Book Now" variant="outline" onClick={() => handleNavigate(id)} />
      </div>
    </div>
  );
};

export default TourCard;
