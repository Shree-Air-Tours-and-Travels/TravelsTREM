import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import isArray from "lodash/isArray";
import "./highlightsCard.scss";
import Title from "../../../stories/Title";
import SubTitle from "../../../stories/SubTitle";

const HighlightsCard = ({ tour }) => {
    const highlights = get(tour, "highlights", {});
    const bullets = get(highlights, "highlights", []);
    return (
        <aside className="highlight-card highlight-card--highlights" aria-labelledby="highlights-title">
            <div className="highlight-card__header">
                <Title id="highlights-title" primaryClassname="highlight-card__title" text="Highlights" size="small" color="white" />
            </div>

            <div className="highlight-card__body">
                <ul className="hc-meta">
                    {highlights.tripType && (
                        <li><strong>Trip type:</strong> <span>{highlights.tripType}</span></li>
                    )}
                    {highlights.groupSizeType && (
                        <li><strong>Group:</strong> <span>{highlights.groupSizeType}</span></li>
                    )}
                    {highlights.lodgingLevel && (
                        <li><strong>Lodging:</strong> <span>{highlights.lodgingLevel}</span></li>
                    )}
                    {highlights.physicalLevel && (
                        <li><strong>Physical level:</strong> <span>{highlights.physicalLevel}</span></li>
                    )}
                    {highlights.tripPace && (
                        <li><strong>Pace:</strong> <span>{highlights.tripPace}</span></li>
                    )}
                </ul>

                {isArray(bullets) && bullets.length > 0 && (
                    <>
                        <SubTitle text={"Top highlights"} primaryClassname="hc-subtitle"  />
                        <ul className="hc-list">
                            {bullets.map((b, idx) => (
                                <li key={idx} className="hc-list__item">{b}</li>
                            ))}
                        </ul>
                    </>
                )}

                {!bullets.length && !Object.keys(highlights).length && (
                    <div className="hc-empty">No highlights available</div>
                )}
            </div>

            <div className="highlight-card__footer">
                {/* optional footer actions can be added here */}
            </div>
        </aside>
    );
};

HighlightsCard.propTypes = {
    tour: PropTypes.object.isRequired,
};

export default HighlightsCard;
