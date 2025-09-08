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
                    text={`$${price}`}
                    variant="primary"
                    size="medium"
                />
            </div>

            <div className="summary-actions">
                <Button
                    text="Chat on WhatsApp"
                    size="medium"
                    variant="solid"
                    color="primary"
                    onClick={onBook ? () => onBook(tour) : () => { }}
                />
                <Button
                    text="Contact Agent"
                    size="medium"
                    variant="outline"
                    color="primary"
                    onClick={onContact ? () => onContact(tour) : () => { }}
                />
            </div>

        </div>
    );
};

export { SummaryCard };
