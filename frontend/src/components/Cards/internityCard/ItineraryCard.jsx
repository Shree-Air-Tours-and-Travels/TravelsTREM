import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import isArray from "lodash/isArray";
import "./itineraryCard.scss";
import Title from "../../../stories/Title";
import SubTitle from "../../../stories/SubTitle";

const ItineraryCard = ({ tour }) => {
    // tour.itinerary can be top-level array or per-tour itinerary
    const pageItinerary = get(tour, "itinerary") || get(tour, "_page.itinerary") || [];
    const arr = Array.isArray(pageItinerary) ? pageItinerary : (pageItinerary.sample || []);

    return (
        <aside className="itinerary-card itinerary-card--itinerary" aria-labelledby="itinerary-title">
            <div className="itinerary-card__header">
                <Title id="itinerary-title" primaryClassname="itinerary-card__title" text="Itinerary" size="small" color="white"/>
            </div>

            <div className="itinerary-card__body">
                {isArray(arr) && arr.length > 0 ? (
                    <ol className="ic-list">
                        {arr.map((day, idx) => (
                            <li className="ic-list__item" key={day.day ?? idx}>
                                <Title text={`Day ${day.day ?? idx + 1}`} size="small" className="ic-day" />
                                <div className="ic-main">
                                    <SubTitle primaryClassname="ic-title" text={day.title} />
                                    {day.overview && <div className="ic-overview">{day.overview}</div>}
                                    {Array.isArray(day.mealsIncluded) && day.mealsIncluded.length > 0 && (
                                        <div className="ic-meals">
                                            <strong>Meals:</strong> {day.mealsIncluded.join(", ")}
                                        </div>
                                    )}
                                    {day.overnight && <div className="ic-overnight"><strong>Overnight:</strong> {day.overnight}</div>}
                                </div>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <div className="ic-empty">No itinerary available</div>
                )}
            </div>
        </aside>
    );
};

ItineraryCard.propTypes = {
    tour: PropTypes.object.isRequired,
};

export default ItineraryCard;
