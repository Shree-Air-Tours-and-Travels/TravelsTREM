import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import tourData from "../../../../backend/utils/dummy data's/tours.js";
import "../../styles/pages/tourDetails.scss";
import { find } from "lodash";
const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: "", rating: "", comment: "" });
  const [guestCount, setGuestCount] = useState(1);
  const serviceCharge = 10;

  useEffect(() => {
    const foundTour =find( [],tour => tour.id === id);
    if (foundTour) {
      setTour(foundTour);
      setReviews(foundTour.reviews || []);
    }
  }, [id]);

  // Normalize address display
  const displayAddress = (address) => {
    if (typeof address === 'string') return address;
    return `${address.line1}, ${address.city}, ${address.country}`;
  };

  const totalPrice = tour ? tour.price * guestCount + serviceCharge : 0;

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReview.name && newReview.rating && newReview.comment) {
      setReviews([...reviews, newReview]);
      setNewReview({ name: "", rating: "", comment: "" });
    }
  };

  if (!tour) return <div>Loading tour details...</div>;
  return (
    <div className="tour-details">
      {/* Image & Info Container */}
      <div className="tour-details__container">
        {/* Tour Image */}
        <div className="tour-details__image">
          <img src={tour.photo} alt="Tour" />
        </div>

        {/* Tour Info */}
        <div className="tour-details__info">
          <h2>{tour.title}</h2>
          <p><span>📍</span> {tour.city}</p>
          <p><span>📌</span> {displayAddress(tour.address)}</p>
          <p><span>⏳</span> {tour.distance} km away</p>
          <p><span>👥</span> Max {tour.maxGroupSize} People</p>
          <p><span>💲</span> ${tour.price} per person</p>
          <p>{tour.desc}</p>
        </div>
      </div>

      {/* Reviews & Booking Container */}
      <div className="tour-details__container">
        {/* Reviews */}
        <div className="tour-details__reviews">
          <h3>Reviews ({reviews.length})</h3>
          <ul>
            {reviews.map((review, index) => (
              <li key={index}>
                <strong>{review.name}</strong> - ⭐ {review.rating}
              </li>
            ))}
          </ul>

          {/* Add Review Form */}
          <form onSubmit={handleReviewSubmit} className="review-form">
            <input
              type="text"
              placeholder="Your Name"
              value={newReview.name}
              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
              required
            />
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
              required
            >
              <option value="">Rate the tour</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num} Star</option>
              ))}
            </select>
            <textarea
              placeholder="Your Review"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
            />
            <button type="submit">Submit Review</button>
          </form>
        </div>

        {/* Booking Form */}
        <div className="tour-details__booking">
          <h3>Book This Tour</h3>
          <form>
            <input type="text" placeholder="Full Name" required />
            <input type="tel" placeholder="Phone Number" required />
            <input type="date" placeholder="Start Date" required />
            <input type="date" placeholder="End Date" required />
            <input
              type="number"
              min="1"
              max="10"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
            />
            <p>Total Price: ${totalPrice}</p>
            <button type="submit">Book Now</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;