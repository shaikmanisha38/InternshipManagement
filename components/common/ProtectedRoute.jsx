"use client";
import React from 'react';
import { usePathname } from 'next/navigation';


export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const pathname = usePathname();

  if (!token || !userStr) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected.
    return <Navigate href="/login" state={{ from: location }} replace />;
  }

  const user = JSON.parse(userStr);

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If the user's role is not allowed, redirect to a default safe page
    // For now we'll just send them back to login or an unauthorized page
    return <Navigate href="/login" replace />;
  }

  return children;
}
