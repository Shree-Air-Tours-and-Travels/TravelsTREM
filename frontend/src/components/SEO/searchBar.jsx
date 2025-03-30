import React, { useState } from "react";
import "../../styles/components/searchBar.scss";

const searchData = {
  fields: [
    { id: "location", label: "Location", type: "text", placeholder: "Where to?" },
    { id: "distance", label: "Distance", type: "number", placeholder: "Distance (km)" },
    { id: "maxPeople", label: "Max People", type: "number", placeholder: "No. of People" },
  ],
  searchIcon: <div>search</div>,
};

const SearchBar = () => {
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [maxGroupSize, setMaxGroupSize] = useState("");

  const handleSearch = () => {
    if (!location || !distance || !maxGroupSize) {
      alert("Please enter at least one search field!");
      return;
    }

    const tour = {
      location,
      distance,
      maxGroupSize,
    };
    
    console.log("Searching for:", tour);

    setLocation("")
     setDistance("")
     setMaxGroupSize("")
  };

  return (
    <div className="ui-search-bar">
      {searchData.fields.map((field) => (
        <div key={field.id} className="ui-search-bar__field">
          <label htmlFor={field.id} className="ui-search-bar__label">
            {field.label}
          </label>
          <input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            className="ui-search-bar__input"
            value={
              field.id === "location"
                ? location
                : field.id === "distance"
                ? distance
                : maxGroupSize
            }
            onChange={(e) =>
              field.id === "location"
                ? setLocation(e.target.value)
                : field.id === "distance"
                ? setDistance(e.target.value)
                : setMaxGroupSize(e.target.value)
            }
          />
        </div>
      ))}
      <button className="ui-search-bar__button" onClick={handleSearch}>
        {searchData.searchIcon}
      </button>
    </div>
  );
};

export default SearchBar;
