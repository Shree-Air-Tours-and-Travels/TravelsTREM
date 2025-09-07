import React from "react";
import { map } from "lodash";
import { calculateAverageRating } from "../../utils/calculateRating";
import "./tourPackages.scss";
import Title from "../../stories/Title";
import TourCard from "../../components/cards/tourCard";
import useComponentData from "../../hooks/useComponentData";

const TourPackages = () => {
    const { loading, error, componentData } = useComponentData("/tours");

    if (loading) return <p>Loading tours...</p>;
    if (error) return <p>{error}</p>;
    if (!componentData?.data?.length) return <p>No tours available</p>;

    return (
        <>
            {/* Header */}
            <div className="ui-tour__header">
                <Title className="ui-tour__title" text={componentData?.title} />
                <p className="ui-tour__description">{componentData?.description}</p>
            </div>

            {/* Tour Cards */}
            <div className="ui-tour__packages">
                {map(componentData.data, (tour) => {
                    const { avgRating, ratingKey } = calculateAverageRating(tour?.reviews);

                    const updatedTour = {
                        ...tour,
                        avgRating,
                        ratingKey,
                    };

                    return (
                        <div key={tour._id || tour.id} className="ui-tour__card">
                            <TourCard tour={updatedTour} id={tour?._id || tour?.id} />
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default TourPackages;
