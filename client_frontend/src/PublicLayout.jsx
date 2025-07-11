import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

export default function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 py-4 shadow-md sticky top-0 bg-white z-50">
        <div className="text-2xl font-bold text-blue-900">
          ZEPUS <span className="text-sm block -mt-1 text-gray-600">CLINICS</span>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-blue-900 text-2xl"
          >
            <FaBars />
          </button>
        </div>
        <div className="hidden md:flex space-x-6 text-sm md:text-base">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/new-doctors" className="hover:text-blue-600">New Doctors</Link>
          <Link to="/services" className="hover:text-blue-600">Services</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/blog" className="hover:text-blue-600">Blog</Link>
          <Link to="/faqs" className="hover:text-blue-600">FAQs</Link>
          <Link to="/login" className="hover:text-blue-600">Login</Link>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-2 bg-white border-b">
          <Link to="/" className="block py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/new-doctors" className="block py-2" onClick={() => setIsMenuOpen(false)}>New Doctors</Link>
          <Link to="/services" className="block py-2" onClick={() => setIsMenuOpen(false)}>Services</Link>
          <Link to="/about" className="block py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link to="/blog" className="block py-2" onClick={() => setIsMenuOpen(false)}>Blog</Link>
          <Link to="/faqs" className="block py-2" onClick={() => setIsMenuOpen(false)}>FAQs</Link>
          <Link to="/login" className="block py-2" onClick={() => setIsMenuOpen(false)}>Login</Link>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-blue-800 text-white text-sm py-6 text-center">
        <div className="mb-3">
          <Link to="/about" className="mx-2 hover:underline">About</Link>
          <Link to="/privacy" className="mx-2 hover:underline">Privacy</Link>
          <Link to="/terms" className="mx-2 hover:underline">Terms</Link>
          <a href="mailto:support@zepusclinics.com" className="mx-2 hover:underline">Contact</a>
        </div>
        <div className="mb-3">Follow us: Facebook | X | Instagram</div>
        <p>&copy; {new Date().getFullYear()} ZEPUS Clinics. All rights reserved.</p>
      </footer>
    </div>
  );
}
