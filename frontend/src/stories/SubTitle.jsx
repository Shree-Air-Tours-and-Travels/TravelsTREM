import React from "react";
import "../styles/Stories/subTitle.scss";

const SubTitle = ({ text, variant = "primary", size = "large" }) => {
  return <h2 className={`ui-subtitle ui-subtitle--${variant} ui-subtitle--${size}`}>{text}</h2>;
};

export default SubTitle;
