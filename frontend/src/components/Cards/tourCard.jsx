import React from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import Button from "../../stories/Button";
import "../../styles/components/tourCard.scss";
import { useNavigate } from "react-router-dom";

const TourCard = ({ tour }) => {
    const { _id, title, city, price, reviews = [], avgRating, photos = [] } = tour;
    const navigate = useNavigate();

    const handleClick = () => navigate(`/tours/${_id}`);

    // Photo fallback (first photo)
    const coverPhoto = photos.length > 0 ? photos[0] : "/tour-images/placeholder.jpg";

    // show one decimal place (or 0)
    const displayRating = Number.isFinite(avgRating) ? avgRating.toFixed(1) : "0.0";

    return (
        <div className="ui-tour-card">
            <img src={coverPhoto} alt={title} className="ui-tour-card__image" />

            <div className="ui-tour-card__content">
                <h3
                    className="ui-tour-card__title"
                    onClick={handleClick}
                >
                    {title}
                </h3>

                <div className="ui-tour-card__info">
                    <span className="ui-tour-card__location">
                        <FaMapMarkerAlt /> {city}
                    </span>
                    <span className="ui-tour-card__price">${price}</span>
                </div>

                <div className="ui-tour-card__reviews">
                    <span className="ui-tour-card__review-count">
                        {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
                    </span>
                    <span className="ui-tour-card__rating" >
                        <FaStar /> {displayRating}
                    </span>
                </div>

                <Button
                    className="ui-tour-card__button"
                    text="Book Now"
                    variant="solid"
                    onClick={handleClick}
                />
            </div>
        </div>
    );
};

export default TourCard;
