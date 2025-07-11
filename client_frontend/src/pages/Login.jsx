import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'patient') navigate('/patient/dashboard');
    else if (role === 'doctor') navigate('/doctor/dashboard');
    else if (role === 'admin') navigate('/admin');
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const { role, token, user } = data;
        const roleNormalized = role?.toLowerCase();

        localStorage.setItem('role', roleNormalized);
        if (token) localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user || { role: roleNormalized }));

        setTimeout(() => {
          if (roleNormalized === 'doctor') navigate('/doctor/dashboard');
          else if (roleNormalized === 'patient') navigate('/patient/dashboard');
          else if (roleNormalized === 'admin') navigate('/admin');
          else setError('Unauthorized role. Please login via the correct portal.');
        }, 0);
      } else {
        setError(data?.message || 'Login failed. Check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-base-100 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">
        ZEPUS Clinics Login
      </h2>

      {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="email" className="block font-medium mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input input-bordered w-full"
          />
          <label className="label cursor-pointer justify-end mt-1">
            <span className="label-text mr-2">Show Password</span>
            <input type="checkbox" className="checkbox checkbox-xs" onChange={() => setShowPassword(!showPassword)} />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            'Login'
          )}
        </button>
      </form>

      <div className="mt-5 text-sm text-center text-gray-600">
        Don’t have an account?
        <div className="flex justify-center gap-4 mt-2">
          <a href="/register/patient" className="link link-primary">Register as Patient</a>
          <span>|</span>
          <a href="/register/doctor" className="link link-primary">Register as Doctor</a>
        </div>
      </div>
    </div>
  );
}
