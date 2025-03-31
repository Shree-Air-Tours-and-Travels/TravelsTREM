import React from "react";
import PropTypes from "prop-types";
import "../../styles/components/serviceCard.scss";

const ServiceCard = ({ service }) => {
  return (
    <div className="ui-service-card">
      <div className="ui-service-card__image-container">
        <img src={service.image} alt={service.label} className="ui-service-card__image" />
      </div>
      <h3 className="ui-service-card__title">{service.label}</h3>
      <p className="ui-service-card__description">{service.description}</p>
    </div>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    image: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default ServiceCard;
