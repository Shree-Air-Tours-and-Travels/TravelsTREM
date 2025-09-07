// src/components/cards/InfoCard.jsx
import React from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import "./infoCard.style.scss";
import _ from "lodash";
import Title from "../../../stories/Title";
import SubTitle from "../../../stories/SubTitle";
import HighlightSpan from "../../../stories/HighlightSpan";

const InfoCard = ({ tour }) => {
    if (!tour) return null;

    const reviewCount = Array.isArray(tour.reviews) ? tour.reviews.length : tour.reviewsCount || 0;

    const period = `${_.get(tour, "period.days", null)}d ${_.get(tour, "period.nights", null)}n`
    const avgRating = _.get(tour, "avgRating", "");

    return (
        <div className="info-card">
            {/* Title uses your custom Title component */}
            <Title text={tour.title} variant="primary" size="large" />

            <div className="info-card__meta">
                <div className="rating">
                    <span className="rating-badge" aria-label={`Average rating ${avgRating}`}>
                        <FaStar /> <HighlightSpan variant="light">{avgRating}</HighlightSpan>
                    </span>
                    <span className="muted">({reviewCount})</span>
                </div>

                <div className="chips">
                    {period && <span className="chip">{period}</span>}
                    <span className="chip">{tour.maxGroupSize ?? "—"} people</span>
                    {tour.price != null && (
                        <span className="chip chip--price">
                            {typeof tour.price === "number" ? `$${tour.price}` : tour.price}
                        </span>
                    )}
                </div>
            </div>

            {tour.address && (
                <div className="info-card__address">
                    <FaMapMarkerAlt className="address-icon" />
                    <div className="address-text">
                        {/* Use Subtitle for address main and sub */}
                        <SubTitle text={tour.address.line1} variant="tertiary" size="small" />
                        <div className="address-sub">
                            <span>
                                {tour.address.line2 && `${tour.address.line2} • `}
                                {tour.address.city}, {tour.address.state} {tour.address.zip} • {tour.address.country}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoCard;
