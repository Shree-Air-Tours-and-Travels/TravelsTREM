// src/pages/tours/TourPackages.jsx
import React from "react";
import map from "lodash/map";
import { Link, useNavigate } from "react-router-dom";
import { calculateAverageRating } from "../../utils/calculateRating";
import "./tourPackages.scss";
import Title from "../../stories/Title";
import useComponentData from "../../hooks/useComponentData";
import Button from "../../stories/Button";
import SubTitle from "../../stories/SubTitle";
import isArray from "lodash/isArray";
import get from "lodash/get";
import TourCard from "../../components/Cards/tourCard";

const TourPackages = ({ user }) => {
  const navigate = useNavigate();
  const { loading, error, componentData } = useComponentData("/tours.json", {
    headers: {},
    // no special params needed — backend returns new shape
  });

  if (loading) return <p>Loading tours...</p>;
  if (error) return <p>{typeof error === "string" ? error : "Failed to load tours"}</p>;

  // Title & description: try multiple places depending on response shape
  const title =
    get(componentData, "config.header.title") ||
    get(componentData, "state.data.title") ||
    get(componentData, "componentData.state.data.title") ||
    get(componentData, "title") ||
    "Tours";

  const description =
    get(componentData, "state.data.description") ||
    get(componentData, "componentData.state.data.description") ||
    componentData?.description ||
    "";

  // the tours array lives under componentData.state.data.tours per new schema
  const tours =
    isArray(get(componentData, "state.data.tours")) ? get(componentData, "state.data.tours") :
    isArray(get(componentData, "componentData.state.data.tours")) ? get(componentData, "componentData.state.data.tours") :
    // fallback: maybe componentData.data was used previously
    isArray(componentData?.data) ? componentData.data :
    [];

  if (!tours.length) return <p>No tours available</p>;

  // helper: try common date fields and parse to Date
  const getCreatedDate = (t) => {
    if (!t) return null;
    const candidates = [
      t.createdAt,
      t.created_at,
      t.dateAdded,
      t.addedAt,
      t.publishedAt,
      t.published_at,
      t.updatedAt,
      t.updated_at,
      t.date,
    ];
    for (const c of candidates) {
      if (!c) continue;
      const parsed = typeof c === "number" ? new Date(c) : new Date(c);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    return null;
  };

  // sort by date desc if possible; otherwise fallback to reversed array
  const sortedByDate = [...tours].sort((a, b) => {
    const da = getCreatedDate(a);
    const db = getCreatedDate(b);
    if (da && db) return db - da; // newest first
    if (da) return -1;
    if (db) return 1;
    return 0;
  });

  const hasAnyDate = sortedByDate.some((t) => getCreatedDate(t) !== null);
  const recentList = hasAnyDate ? sortedByDate : [...tours].reverse();

  // only show top 4
  const visible = recentList.slice(0, 4);

  const handleViewAll = () => {
    if (user) {
      navigate("/tours"); // logged in → tours page
    } else {
      navigate("/login"); // not logged in → login page
    }
  };

  return (
    <section className="ui-tour">
      {/* Header */}
      <div className="ui-tour__header">
        <Title className="ui-tour__title" text={title} variant="primary" color={"white"} />
        {description && (
          <SubTitle
            className="ui-home__main__hero__description"
            text={description}
            variant="tertiary"
            size="small"
            color="white"
          />
        )}
      </div>

      {/* Tour Cards */}
      <div className="ui-tour__packages">
        {map(visible, (tour) => {
          const { avgRating, ratingKey } = calculateAverageRating(tour?.reviews);
          const updatedTour = { ...tour, avgRating, ratingKey };
          const tourId = tour?._id || tour?.id;

          return (
            <div key={tourId || JSON.stringify(tour)} className="ui-tour__card">
              <Link to={`/tours/${tourId}`} className="ui-tour__card-link" aria-label={`Open ${tour.title}`}>
                <TourCard tour={updatedTour} id={tourId} />
              </Link>
            </div>
          );
        })}
      </div>

      {/* View all button using your custom Button */}
      {tours.length > visible.length && (
        <div className="ui-tour__more">
          <Button
            text="View all tours"
            variant="outline"
            size="medium"
            color="white"
            onClick={handleViewAll}
          />
        </div>
      )}
    </section>
  );
};

export default TourPackages;
