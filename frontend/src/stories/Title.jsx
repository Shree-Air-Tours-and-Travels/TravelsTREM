import React from "react";
import "../styles/Stories/title.scss";

const Title = ({ text, variant = "primary", size = "large" }) => {
  return (
    <h1 className={`ui-title ui-title--${variant} ui-title--${size}`}>
      {text}
    </h1>
  );
};

export default Title;
