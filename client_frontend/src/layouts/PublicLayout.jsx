import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-800">
            ZEPUS <span className="text-sm block -mt-1 text-gray-600">CLINICS</span>
          </div>
          <nav className="space-x-4 text-sm">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/services" className="hover:text-blue-600">Services</Link>
            <Link to="/about" className="hover:text-blue-600">About</Link>
            <Link to="/blog" className="hover:text-blue-600">Blog</Link>
            <Link to="/faqs" className="hover:text-blue-600">FAQs</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 p-4">
        <Outlet />
      </main>

      <footer className="bg-blue-800 text-white text-sm py-6 text-center">
        <div className="mb-2">
          <Link to="/about" className="mx-2 hover:underline">About Us</Link>
          <Link to="/privacy" className="mx-2 hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="mx-2 hover:underline">Terms of Service</Link>
          <a href="mailto:support@zepusclinics.com" className="mx-2 hover:underline">Contact</a>
        </div>
        <div className="mb-1">Follow us: Facebook | X | Instagram</div>
        <p>&copy; {new Date().getFullYear()} ZEPUS Clinics. All rights reserved.</p>
      </footer>
    </div>
  );
}
