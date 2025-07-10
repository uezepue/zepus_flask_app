import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [theme, setTheme] = useState('luxury');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'luxury' ? 'light' : 'luxury'));
  };

  return (
    <header className="bg-base-100 shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-xl font-bold text-primary">ZEPUS Clinics</div>
        <nav>
          <ul className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
            <li><Link to="/">Home</Link></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#consult">Consult</a></li>
            <li><a href="#faqs">FAQs</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><Link to="/login">Login</Link></li>
            <li>
              <Link to="/register/patient" className="btn btn-sm btn-primary">Sign Up</Link>
            </li>
            <li>
              <button onClick={toggleTheme} className="btn btn-sm btn-ghost">
                {theme === 'luxury' ? '☀️' : '🌙'}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
