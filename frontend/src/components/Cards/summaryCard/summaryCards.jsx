import get from "lodash/get";
import Button from "../../../stories/Button";
import { FaStar } from "react-icons/fa";
import "./summaryCard.style.scss";
import Title from "../../../stories/Title";
import SubTitle from "../../../stories/SubTitle";

const SummaryCard = ({ tour, onBook, onContact }) => {
    if (!tour) return null;

    // Centralized defaults
    const DEFAULTS = {
        labels: {
            price: "Price",
            duration: "Duration",
            groupSize: "Group size",
            rating: "Rating",
        },
        units: {
            people: "people",
            days: "days",
            nights: "nights",
        },
        actions: {
            book: "Book Now",
            contact: "Contact Us",
            chat: "Chat",
        },
        misc: {
            noRating: "0.0",
        },
    };

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
    const footerText = get(tour, "_page.config.footer.text");

    return (
        <aside className="summary-card">
            <div className="summary-card__header">
                <Title text={pageTitle} variant="primary" />
                {city && <SubTitle className="summary-card__city" text={city} variant="primary" />}
            </div>

            <div className="summary-card__meta">
                {typeof price !== "undefined" && (
                    <div className="summary-card__price">
                        <span className="label">{DEFAULTS.labels.price}</span>
                        <span className="value">${price}</span>
                    </div>
                )}

                {(periodDays || periodNights) && (
                    <div className="summary-card__period">
                        <span className="label">{DEFAULTS.labels.duration}</span>
                        <span className="value">
                            {periodDays ? `${periodDays} ${DEFAULTS.units.days}` : ""}{" "}
                            {periodNights ? `/ ${periodNights} ${DEFAULTS.units.nights}` : ""}
                        </span>
                    </div>
                )}

                {maxGroupSize && (
                    <div className="summary-card__group">
                        <span className="label">{DEFAULTS.labels.groupSize}</span>
                        <span className="value">
                            {maxGroupSize} {DEFAULTS.units.people}
                        </span>
                    </div>
                )}

                <div className="summary-card__rating">
                    <FaStar />
                    <span>{avgRating !== null ? avgRating.toFixed(1) : DEFAULTS.misc.noRating}</span>
                    <small>({reviewsCount})</small>
                </div>
            </div>

            <div className="summary-card__actions">
                {actions?.book ? (
                    <Button
                        text={actions.book.label || DEFAULTS.actions.book}
                        variant="solid"
                        onClick={() => onBook && onBook(tour)}
                    />
                ) : (
                    <Button
                        text={DEFAULTS.actions.book}
                        variant="ghost"
                        onClick={() => onBook && onBook(tour)}
                    />
                )}

                {actions?.contact ? (
                    <Button
                        text={actions.contact.label || DEFAULTS.actions.contact}
                        variant="outline"
                        onClick={() => onContact && onContact(tour)}
                    />
                ) : (
                    <Button
                        text={DEFAULTS.actions.contact}
                        variant="outline"
                        onClick={() => onContact && onContact(tour)}
                    />
                )}

                {actions?.chat && (
                    <Button
                        text={actions.chat.label || DEFAULTS.actions.chat}
                        variant="ghost"
                        onClick={() => {
                            /* implement chat */
                        }}
                    />
                )}

                {footerText && (
                    <Button
                        text={footerText}
                        variant="ghost"
                        onClick={() => {
                            /* implement footer action */
                        }}
                    />
                )}
            </div>
        </aside>
    );
};

export default SummaryCard;
