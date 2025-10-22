// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AppContext';

function ProtectedRoute() {
  const { user } = useAuth();

  // If there's no user, redirect to the /login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If there is a user, render the child component (e.g., HomePage)
  return <Outlet />;
}

export default ProtectedRoute;
