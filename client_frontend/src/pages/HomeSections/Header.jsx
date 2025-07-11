import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-900">
          ZEPUS <span className="text-gray-700">CLINICS</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-gray-700 text-sm">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/services" className="hover:text-blue-600">Services</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/login">
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 text-sm">
              Log in
            </button>
          </Link>
        </nav>

        {/* Mobile Placeholder */}
        <div className="md:hidden">
          {/* You can add a hamburger menu here if needed */}
        </div>
      </div>
    </header>
  );
}
