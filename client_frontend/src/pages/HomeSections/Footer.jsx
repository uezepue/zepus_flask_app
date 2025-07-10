import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-blue-800 text-white text-sm py-6 text-center">
      <div className="mb-3">
        <Link to="/about" className="mx-2 hover:underline">About Us</Link>
        <Link to="/privacy" className="mx-2 hover:underline">Privacy Policy</Link>
        <Link to="/terms" className="mx-2 hover:underline">Terms of Service</Link>
        <a href="mailto:support@zepusclinics.com" className="mx-2 hover:underline">Contact</a>
      </div>
      <div className="mb-3">Follow us: Facebook | X | Instagram</div>
      <div id="google_translate_element" className="mb-2" />
      <p>&copy; 2025 ZEPUS Clinics. All rights reserved.</p>
    </footer>
  );
}
