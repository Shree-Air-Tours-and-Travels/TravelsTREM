import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "../AuthPage/Auth";
import ProfilePage from "../ProfilePage/ProfilePage";
import Tours from "../Tour/Tours";
import ToursDetails from "../Tour/ToursDetails";
import Home from "../homePage/home";
import SearchResultList from "../../components/SEO/SearchResultList";

/**
 * Routers component
 * @param {Object} user - The user object
 * @returns {JSX.Element} - The rendered component
 */
const Routers = ({ user }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<ToursDetails />} />
      <Route path="/search" element={<SearchResultList />} />
      <Route path="/auth" element={<AuthPage />} />
   { user &&  <Route path="/profile" element={ <ProfilePage /> } />}
    </Routes>
  );
};

export default Routers;
