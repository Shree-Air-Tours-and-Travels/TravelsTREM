// components/TourCard/TourCard.jsx
import React from "react";

import "./tourCardSecondary.scss";
import Title from "../../../stories/Title";
import SubTitle from "../../../stories/SubTitle";
import Button from "../../../stories/Button";

const TourCard = ({ tour, onView }) => {
    const {
        _id,
        title,
        city,
        address,
        photos = [],
        period = {},
        price,
        desc,
        avgRating,
        maxGroupSize,
    } = tour || {};

    const imageSrc = photos?.length ? photos[0] : null;
    const displayRating = Number.isFinite(avgRating) ? avgRating.toFixed(1) : "0.0";

    return (
        <article className="tour-card" aria-labelledby={`tour-${_id}-title`}>
            <div className="tour-card__media">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={title || "Tour image"}
                        loading="lazy"
                        className="tour-card__img"
                    />
                ) : (
                    <div className="tour-card__placeholder">
                        <img src={"/public/logo.png"} />
                    </div>
                )}
            </div>

            <div className="tour-card__body">
                <Title
                    text={title || "Untitled Tour"}
                    variant="primary"
                    size="small"
                />

                <SubTitle
                    text={`${city || address?.city || "Unknown"} • ${period?.days ?? "-"
                        } days • ${maxGroupSize ?? "-"} pax`}
                    variant="secondary"
                    size="small"
                />

                <SubTitle
                    text={
                        desc
                            ? `${desc.slice(0, 120)}${desc.length > 120 ? "…" : ""}`
                            : "No description"
                    }
                    variant="tertiary"
                    size="small"
                    primaryClassname="ui-subtitle-parent"

                />

                <div className="tour-card__footer">
                    <div className="tour-card__price">
                        <SubTitle
                            text={price ? `$${price}` : "TBD"}
                            variant="primary"
                            size="medium"
                        />

                        {avgRating !== undefined && (
                            <SubTitle
                                text={`${displayRating} ★`}
                                variant="secondary"
                                size="small"
                            />
                        )}
                    </div>

                    <Button
                        text="View tour"
                        variant="solid"
                        color="primary"
                        size="small"
                        onClick={() => onView(_id)}
                    />
                </div>
            </div>
        </article>
    );
};

export default TourCard;
