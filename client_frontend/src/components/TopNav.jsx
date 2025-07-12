import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function TopNav() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');

  if (isAuthPage) return null;

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-blue-900 leading-tight">
          ZEPUS <span className="block text-sm font-light text-gray-500 -mt-1">CLINICS</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <Link to="/services" className="hover:text-blue-700">Services</Link>
          <Link to="/about" className="hover:text-blue-700">About</Link>
          <Link to="/blog" className="hover:text-blue-700">Blog</Link>
          <Link to="/faqs" className="hover:text-blue-700">FAQs</Link>
          <Link to="/login" className="hover:text-blue-700">Login</Link>
        </nav>
      </div>
    </header>
  );
}
