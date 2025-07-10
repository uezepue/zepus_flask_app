import { useMemo } from 'react';

export default function useAuth() {
  const role = localStorage.getItem('role');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isAuthenticated = !!role;

  return useMemo(() => ({
    isAuthenticated,
    role,
    user,
  }), [role, user, isAuthenticated]);
}
