// src/components/cards/SummaryCard.jsx
import React from "react";
import "./summaryCard.style.scss";

const SummaryCard = ({ tour }) => {
  if (!tour) return null;

  const period =
    tour.period ||
    (tour.durationDays && tour.durationNights ? `${tour.durationDays}d ${tour.durationNights}n` : null) ||
    (tour.durationDays ? `${tour.durationDays}d` : null) ||
    (tour.duration ? `${tour.duration}` : null);

  const avgRating = Array.isArray(tour.reviews) && tour.reviews.length
    ? (tour.reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / tour.reviews.length).toFixed(1)
    : tour.rating
    ? Number(tour.rating).toFixed(1)
    : "—";

  return (
    <div className="summary-card">
      <div className="summary-row">
        <span className="summary-label">Duration</span>
        <span className="summary-value">{period || "—"}</span>
      </div>
      <div className="summary-row">
        <span className="summary-label">People</span>
        <span className="summary-value">{tour.maxGroupSize ?? "—"}</span>
      </div>
      <div className="summary-row">
        <span className="summary-label">Rating</span>
        <span className="summary-value">{avgRating}</span>
      </div>
      <div className="summary-actions">
        <button className="btn btn-primary">Book Now</button>
        <button className="btn btn-outline">Contact</button>
      </div>
    </div>
  );
};

export default SummaryCard;
