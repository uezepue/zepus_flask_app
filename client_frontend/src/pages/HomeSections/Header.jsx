import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [theme, setTheme] = useState('luxury');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'luxury' ? 'light' : 'luxury'));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <header className="bg-base-100 shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold text-primary">ZEPUS Clinics</div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex">
          <ul className="flex items-center gap-5 text-sm text-gray-700">
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

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="btn btn-sm btn-ghost">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu Items */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4">
          <ul className="flex flex-col gap-3 text-sm text-gray-700">
            <li><Link to="/" onClick={toggleMobileMenu}>Home</Link></li>
            <li><a href="#about" onClick={toggleMobileMenu}>About</a></li>
            <li><a href="#services" onClick={toggleMobileMenu}>Services</a></li>
            <li><a href="#consult" onClick={toggleMobileMenu}>Consult</a></li>
            <li><a href="#faqs" onClick={toggleMobileMenu}>FAQs</a></li>
            <li><a href="#blog" onClick={toggleMobileMenu}>Blog</a></li>
            <li><Link to="/login" onClick={toggleMobileMenu}>Login</Link></li>
            <li>
              <Link to="/register/patient" className="btn btn-sm btn-primary" onClick={toggleMobileMenu}>
                Sign Up
              </Link>
            </li>
            <li>
              <button onClick={toggleTheme} className="btn btn-sm btn-ghost">
                {theme === 'luxury' ? '☀️' : '🌙'}
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
