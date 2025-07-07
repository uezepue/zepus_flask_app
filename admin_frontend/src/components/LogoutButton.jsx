import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton({ redirectTo = '/login', onLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        // Optional client-side cleanup
        if (typeof onLogout === 'function') onLogout();

        navigate(redirectTo);
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`logout-button ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
