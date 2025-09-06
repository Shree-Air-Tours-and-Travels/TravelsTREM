// src/components/common/Loader.js
import React from "react";
import { Spinner } from "react-bootstrap"; // or mdb spinner
import  "./loader.style.scss";

const Loader = () => {
  return (
    <div className="loader-overlay">
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default Loader;
