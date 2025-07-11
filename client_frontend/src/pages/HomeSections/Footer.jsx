import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 text-sm py-8 border-t mt-12">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/about" className="hover:text-blue-600">About Us</Link>
          <Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-blue-600">Terms of Service</Link>
          <a href="mailto:support@zepusclinics.com" className="hover:text-blue-600">Contact</a>
        </div>

        {/* Social Links */}
        <div className="text-xs text-gray-500">
          Follow us: <span className="hover:text-blue-600 cursor-pointer">Facebook</span> | <span className="hover:text-blue-600 cursor-pointer">X</span> | <span className="hover:text-blue-600 cursor-pointer">Instagram</span>
        </div>

        {/* Translate Widget */}
        <div id="google_translate_element" className="text-xs" />

        {/* Copyright */}
        <p className="text-xs text-gray-400">&copy; 2025 ZEPUS Clinics. All rights reserved.</p>
      </div>
    </footer>
  );
}
