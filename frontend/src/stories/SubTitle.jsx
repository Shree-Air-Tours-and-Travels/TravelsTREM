import React from "react";
import "../styles/Stories/subTitle.scss";

const SubTitle = ({ text, variant = "tertiary", size = "", color }) => {
    return <h2 className={`ui-subtitle ui-subtitle--${variant} ui-subtitle--${size}`} style={color ? { color } : {}}>{text}</h2>;
};

export default SubTitle;
