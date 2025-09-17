import React from "react";
import "../styles/Stories/title.scss";

const Title = ({ text, variant = "primary", size = "large", color, primaryClassname }) => {
  return (
    <h1
      className={`ui-title ui-title--${variant} ui-title--${size} ${primaryClassname}`}
      style={color ? { color } : {}}
    >
      {text}
    </h1>
  );
};

export default Title;
