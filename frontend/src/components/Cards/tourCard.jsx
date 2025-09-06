import React from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import Button from "../../stories/Button";
import "../../styles/components/tourCard.scss";
import { useNavigate } from "react-router-dom";

const TourCard = ({ tour }) => {
    const { _id, title, city, price, reviews = [], avgRating, photo } = tour;
    const navigate = useNavigate();

    const handleClick = () => navigate(`/tours/${_id}`)

    return (
        <div className="ui-tour-card">
            <img src={photo} alt={title} className="ui-tour-card__image" />

            <div className="ui-tour-card__content">
                <h3 className="ui-tour-card__title" style={{ cursor: "pointer" }}>
                    {title}
                </h3>

                <div className="ui-tour-card__info">
                    <span className="ui-tour-card__location">
                        <FaMapMarkerAlt /> {city}
                    </span>
                    <span className="ui-tour-card__price">${price}</span>
                </div>

                <div className="ui-tour-card__reviews">
                    <span className="ui-tour-card__review-count">{reviews.length} Reviews</span>
                    <span className="ui-tour-card__rating">
                        <FaStar /> {avgRating || 0}
                    </span>
                </div>

                <Button
                    className="ui-tour-card__button"
                    text="Book Now"
                    variant="outline"
                    onClick={handleClick}
                />
            </div>
        </div>
    );
};

export default TourCard;
