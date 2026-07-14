import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const location = useLocation();

  if (!token || !userStr) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const user = JSON.parse(userStr);

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If the user's role is not allowed, redirect to a default safe page
    // For now we'll just send them back to login or an unauthorized page
    return <Navigate to="/login" replace />;
  }

  return children;
}
