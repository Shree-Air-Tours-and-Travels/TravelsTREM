import React from "react";
import "../styles/Stories/button.scss";

const Button = ({
  text,
  size = "medium",
  variant = "solid",
  color = "primary",
  isCircular = false,
  onClick,
}) => {
  return (
    <button
      className={`
        ui-button 
        ui-button--${size} 
        ui-button--${variant} 
        ui-button--${color} 
        ${isCircular ? "ui-button--circular" : ""}
      `}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
