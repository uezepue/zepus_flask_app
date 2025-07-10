import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  let user = null;
  let storedRole = null;

  try {
    const rawUser = localStorage.getItem('user');
    const rawRole = localStorage.getItem('role');
    if (rawUser) user = JSON.parse(rawUser);
    if (rawRole) storedRole = rawRole.toLowerCase();
  } catch (err) {
    console.error('❌ Failed to parse user or role from localStorage:', err);
  }

  // ❌ Not logged in
  if (!user || !storedRole) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role mismatch
  if (role && storedRole !== role) {
    return <Navigate to="/login" replace />;
  }

  // ✅ All good
  return children;
}
