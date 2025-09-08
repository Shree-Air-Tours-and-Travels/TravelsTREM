// src/components/cards/Summary/summaryCard.jsx
import get from "lodash/get";
import Button from "../../../stories/Button";
import { FaStar } from "react-icons/fa";
import "./summaryCard.style.scss";

const SummaryCard = ({ tour, onBook, onContact }) => {
  if (!tour) return null;

  // page-level data merged under _page by TourDetails
  const pageTitle = get(tour, "_page.title", tour.title);
  const actions = get(tour, "_page.actions", {});
  const price = get(tour, "price");
  const periodDays = get(tour, "period.days");
  const periodNights = get(tour, "period.nights");
  const maxGroupSize = get(tour, "maxGroupSize");
  const city = get(tour, "city");
  const avgRating = Number.isFinite(Number(get(tour, "avgRating"))) ? Number(get(tour, "avgRating")) : null;
  const reviewsCount = Array.isArray(get(tour, "reviews")) ? get(tour, "reviews").length : 0;

  return (
    <aside className="summary-card">
      <div className="summary-card__header">
        <h2 className="summary-card__title">{pageTitle}</h2>
        {city && <div className="summary-card__city">{city}</div>}
      </div>

      <div className="summary-card__meta">
        {typeof price !== "undefined" && (
          <div className="summary-card__price">
            <span className="label">Price</span>
            <span className="value">${price}</span>
          </div>
        )}

        {(periodDays || periodNights) && (
          <div className="summary-card__period">
            <span className="label">Duration</span>
            <span className="value">
              {periodDays ? `${periodDays} days` : ""} {periodNights ? ` / ${periodNights} nights` : ""}
            </span>
          </div>
        )}

        {maxGroupSize && (
          <div className="summary-card__group">
            <span className="label">Group size</span>
            <span className="value">{maxGroupSize} people</span>
          </div>
        )}

        <div className="summary-card__rating">
          <FaStar />
          <span>{avgRating !== null ? avgRating.toFixed(1) : "0.0"}</span>
          <small>({reviewsCount})</small>
        </div>
      </div>

      <div className="summary-card__actions">
        {/* prefer action labels from page actions when present */}
        {actions?.book ? (
          <Button text={actions.book.label || "Book Now"} variant="solid" onClick={() => onBook && onBook(tour)} />
        ) : (
          <Button text="Book Now" variant="solid" onClick={() => onBook && onBook(tour)} />
        )}

        {actions?.contact ? (
          <Button
            text={actions.contact.label || "Contact"}
            variant="outline"
            onClick={() => onContact && onContact(tour)}
          />
        ) : (
          <Button text="Contact Us" variant="outline" onClick={() => onContact && onContact(tour)} />
        )}

        {actions?.chat && (
          <Button text={actions.chat.label || "Chat"} variant="ghost" onClick={() => {/* implement chat */}} />
        )}
      </div>

      {/* optional footer message from config */}
      {get(tour, "_page.config.footer.text") && (
        <div className="summary-card__footer">{get(tour, "_page.config.footer.text")}</div>
      )}
    </aside>
  );
};

export default SummaryCard;
