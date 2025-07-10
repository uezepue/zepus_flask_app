import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function TopNav() {
  const navigate = useNavigate();
  const { role, user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed:', err);
    }

    localStorage.clear();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-[#0a5275] text-white shadow">
      <div>
        Welcome,{' '}
        {role === 'doctor' ? user?.name :
         role === 'patient' ? `${user?.first_name} ${user?.last_name}` :
         user?.name || 'User'}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}
