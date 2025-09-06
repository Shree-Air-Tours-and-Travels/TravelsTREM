import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute component
 * Wraps around routes/components that require authentication.
 * Redirects to /auth if user is not logged in.
 *
 * @param {React.ReactNode} children - The component to render if authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);

  // fallback: check localStorage if Redux state is empty (after refresh)
  const localUser = JSON.parse(localStorage.getItem("userInfo"));

  const location = useLocation();

  if (!user && !localUser) {
    // User is not logged in, redirect to /auth
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  // User is logged in, render the protected component
  return children;
};

export default ProtectedRoute;
