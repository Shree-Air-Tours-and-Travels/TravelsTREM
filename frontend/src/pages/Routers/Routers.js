import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import AuthPage from "../AuthPage/Auth";
import Tours from "../Tour/Tours";
import ToursDetails from "../Tour/ToursDetails";
import Home from "../homePage/home";
import SearchResultList from "../../components/SEO/SearchResultList";
import ProtectedRoute from "../AuthPage/ProtectedRoute"; // import it

const Routers = () => {
  const {user} = useSelector((state) => state.user); // get user from Redux

  return (
    <Routes>
      {/* Home is accessible to everyone */}
      <Route path="/" element={<Home user={user} />} />

      {/* Auth route */}
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <AuthPage />}
      />

      {/* Protected routes */}
      <Route
        path="/tours"
        element={
          <ProtectedRoute>
            <Tours />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tours/:id"
        element={
          <ProtectedRoute>
            <ToursDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchResultList />
          </ProtectedRoute>
        }
      />

      {/* Fallback: redirect unknown routes */}
      <Route
        path="*"
        element={<Navigate to={user ? "/" : "/auth"} replace />}
      />
    </Routes>
  );
};

export default Routers;
