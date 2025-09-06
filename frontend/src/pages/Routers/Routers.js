import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../AuthPage/Auth";
import Tours from "../Tour/Tours";
import ToursDetails from "../Tour/ToursDetails";
import Home from "../homePage/home";
import SearchResultList from "../../components/SEO/SearchResultList";

/**
 * Routers component
 * @param {Object} user - The user object
 * @returns {JSX.Element} - The rendered component
 */
const Routers = ({user}) => {

  return (
    <Routes>
      {/* Home is accessible to everyone */}
      <Route path="/" element={<Home user={user} />} />
      
      {/* Auth routes */}
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/" replace /> : <AuthPage />} 
      />
      
      {/* Protected routes - only accessible when logged in */}
      {user ? (
        <>
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<ToursDetails />} />
          <Route path="/search" element={<SearchResultList />} />
        </>
      ) : (
        <Route 
          path="*" 
          element={<Navigate to="/auth" replace state={{ from: window.location.pathname }} />} 
        />
      )}
    </Routes>
  );
};

export default Routers;