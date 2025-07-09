import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      // Always clear client-side session
      localStorage.removeItem('user'); // or 'patient' / 'doctor' / 'admin'

      if (res.ok) {
        navigate('/login');
      } else {
        alert('Logout failed. You have been logged out locally.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('⚠️ Network error. Logging out locally.');
      localStorage.removeItem('user'); // fallback cleanup
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}
