import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ Enables Flask session cookies
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();
      console.log('LOGIN RESPONSE:', data); // ✅ Debug

      if (res.ok) {
        const { role, token, user } = data;
        const roleNormalized = role?.toLowerCase();

        // ✅ Save to localStorage
        localStorage.setItem('role', roleNormalized);
        if (token) localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user || { role: roleNormalized }));

        // ✅ Role-based redirection
        if (roleNormalized === 'doctor') {
          navigate('/doctor/dashboard');
        } else if (roleNormalized === 'patient') {
          navigate('/patient/dashboard');
        } else if (roleNormalized === 'admin') {
          navigate('/admin'); // optional: adjust if needed
        } else {
          setError('Unauthorized role. Please login via the correct portal.');
        }
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
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-center text-2xl mb-4 font-semibold text-[#0a5275]">
        ZEPUS Clinics Login
      </h2>

      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#0a5275] text-white py-2 rounded font-semibold hover:bg-[#083a56] ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-4 text-sm text-center text-gray-600">
        Don't have an account?{' '}
        <a href="/register/patient" className="text-blue-600 hover:underline">Register as Patient</a>{' '}|
        {' '}<a href="/register/doctor" className="text-blue-600 hover:underline">Register as Doctor</a>
      </div>
    </div>
  );
}
