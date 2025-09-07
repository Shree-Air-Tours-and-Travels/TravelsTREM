// src/components/cards/InfoCard.jsx
import React from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import "./infoCard.style.scss";

const InfoCard = ({ tour }) => {
  if (!tour) return null;

  const avgRating = Array.isArray(tour.reviews) && tour.reviews.length
    ? (tour.reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / tour.reviews.length).toFixed(1)
    : tour.rating
    ? Number(tour.rating).toFixed(1)
    : "0.0";

  const reviewCount = Array.isArray(tour.reviews) ? tour.reviews.length : tour.reviewsCount || 0;

  const period =
    tour.period ||
    (tour.durationDays && tour.durationNights ? `${tour.durationDays}d ${tour.durationNights}n` : null) ||
    (tour.durationDays ? `${tour.durationDays}d` : null) ||
    (tour.duration ? `${tour.duration}` : null);

  return (
    <div className="info-card">
      <h1 className="info-card__title">{tour.title}</h1>

      <div className="info-card__meta">
        <div className="rating">
          <span className="rating-badge">
            <FaStar /> {avgRating}
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
            <div className="address-main">{tour.address.line1}</div>
            <div className="address-sub">
              {tour.address.line2 && `${tour.address.line2} • `}
              {tour.address.city}, {tour.address.state} {tour.address.zip} • {tour.address.country}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoCard;
