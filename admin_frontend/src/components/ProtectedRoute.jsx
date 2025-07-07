import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, allowedRole, allowedRoles = [], children }) {
  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch check
  const roleAllowed =
    allowedRole
      ? user.role === allowedRole
      : allowedRoles.length > 0
        ? allowedRoles.includes(user.role)
        : true;

  if (!roleAllowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}
