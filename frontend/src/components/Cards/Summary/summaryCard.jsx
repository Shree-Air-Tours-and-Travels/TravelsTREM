// src/components/cards/SummaryCard.jsx
import React from "react";
import "./summaryCard.style.scss";
import SubTitle from "../../../stories/SubTitle";
import Title from "../../../stories/Title";
import Button from "../../../stories/Button";
import _ from "lodash";

const SummaryCard = ({ tour, onBook, onContact }) => {
    if (!tour) return null;
    console.log(tour, "summary")
    const period = `${_.get(tour, "period.days", null)}d ${_.get(tour, "period.nights", null)}n`
    const price = _.get(tour, "price", null)
    return (
        <div className="summary-card">
            <div className="summary-row">
                <SubTitle text="Duration" variant="tertiary" size="small" />
                <Title text={period} variant="primary" size="medium" />
            </div>

            <div className="summary-row">
                <SubTitle text="People" variant="tertiary" size="small" />
                <Title
                    text={typeof tour.maxGroupSize !== "undefined" ? tour.maxGroupSize : "—"}
                    variant="primary"
                    size="medium"
                />
            </div>

            <div className="summary-row">
                <SubTitle text="Price" variant="tertiary" size="small" />
                 <Title
                    text={`$${tour.price}`}
                    variant="primary"
                    size="medium"
                />
            </div>

            <div className="summary-actions">
                <Button
                    text="Book Now"
                    size="medium"
                    variant="solid"
                    color="primary"
                    onClick={onBook ?? (() => { })}
                />
                <Button
                    text="Contact"
                    size="medium"
                    variant="outline"
                    color="primary"
                    onClick={onContact ?? (() => { })}
                />
            </div>
        </div>
    );
};

export default SummaryCard;
