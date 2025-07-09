import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  let user = null;

  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      user = JSON.parse(raw);
    }
  } catch (err) {
    console.error('❌ Failed to parse user from localStorage:', err);
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
