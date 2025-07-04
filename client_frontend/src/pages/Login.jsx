import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FormStyles.css'; // Optional: extract inline styles into this file

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        if (data.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed. Check your credentials.');
      }
    } catch (err) {
      setError('Network error. Try again later.');
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome to ZEPUS Clinics</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      <div className="footer-text">
        Don't have an account?{' '}
        <a href="/register/patient">Register as Patient</a> |{' '}
        <a href="/register/doctor">Register as Doctor</a>
      </div>
    </div>
  );
}
