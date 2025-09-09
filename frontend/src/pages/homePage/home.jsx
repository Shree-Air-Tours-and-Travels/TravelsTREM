// src/pages/homePage/home.jsx
import React from "react";
import { useSelector } from "react-redux";
// import Experience from "../../featured/experience";
// import Gallery from "../../components/galary/galary";
// import Reviews from "../../featured/review";
import "../../styles/pages/home.scss";
import HeroSection from "../../featured/Hero/heroSection";
import ServiceList from "../../featured/Service/serviceLst";
import TourPackages from "../../featured/TourPackages/tourPackages";    
/**
 * Home
 *
 * Props:
 *  - user (optional): if provided, used as current user
 *  - readonly (optional boolean): when true (unauthenticated flow),
 *      the home page should be view-only and not allow routing/actions.
 *
 * Behavior:
 *  - If user prop is not provided, read from Redux (supports both
 *    state.auth.user and legacy state.user.user shapes).
 *  - When readonly is true, pass readonly down and do not pass a user
 *    to children (so they can hide CTA / navigation).
 */
const Home = ({ user: userProp, readonly = false }) => {
  // fallback to Redux user if user prop not provided
  const reduxAuthUser = useSelector((state) => {
    // prefer new auth slice, fallback to legacy user slice
    return state?.auth?.user || state?.user?.user || null;
  });

  const currentUser = userProp ?? reduxAuthUser ?? null;
  // If readonly, we intentionally do NOT expose currentUser to children
  const childUser = readonly ? null : currentUser;

  return (
    <div className="ui-home">
      {/* Hero Section */}
      <HeroSection user={childUser} readonly={readonly} />

      {/* Explore Section */}
      <section className="ui-home__explore">
        <ServiceList readonly={readonly} />
        <TourPackages user={childUser} readonly={readonly} />
        {/* <Experience /> */}
        {/* <Gallery /> */}
        {/* <Reviews /> */}
      </section>
    </div>
  );
};

export default Home;
