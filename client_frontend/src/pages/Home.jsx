import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import heroDoctor from '../assets/doctor.png';
import { FaHeartbeat, FaRobot, FaMapMarkedAlt, FaBars } from 'react-icons/fa';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
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
          <Link to="/login">
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700">
              Log in
            </button>
          </Link>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-2 bg-white border-b">
          <Link to="/" className="block py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/new-doctors" className="block py-2" onClick={() => setIsMenuOpen(false)}>New Doctors</Link>
          <Link to="/services" className="block py-2" onClick={() => setIsMenuOpen(false)}>Services</Link>
          <Link to="/about" className="block py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link to="/login" className="block py-2" onClick={() => setIsMenuOpen(false)}>Log in</Link>
        </div>
      )}

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-12 md:py-20 max-w-7xl mx-auto">
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight">
            Your Health, <br /> Our Priority
          </h1>
          <p className="text-gray-600 text-lg">
            Quality care for individuals and families.
          </p>
          <Link to="/get-started">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium text-base hover:bg-blue-700">
              Get Started
            </button>
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <div className="flex items-start gap-3 bg-white shadow-md p-4 rounded-xl">
              <FaHeartbeat className="text-blue-600 text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-sm">Our Services</h3>
                <p className="text-xs text-gray-600">Comprehensive medical care</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white shadow-md p-4 rounded-xl">
              <FaRobot className="text-blue-600 text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-sm">AI Triage Bot</h3>
                <p className="text-xs text-gray-600">Fast online symptom checker</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white shadow-md p-4 rounded-xl">
              <FaMapMarkedAlt className="text-blue-600 text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-sm">Care Zone Map</h3>
                <p className="text-xs text-gray-600">Find clinics near you</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center">
          <img
            src={heroDoctor}
            alt="Smiling Doctor"
            className="w-80 h-auto object-cover rounded-2xl shadow-md"
          />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-900 text-white text-sm py-8 text-center mt-16 px-4">
        <div className="mb-4 space-x-4">
          <Link to="/about" className="hover:underline">About Us</Link>
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:underline">Terms</Link>
          <a href="mailto:support@zepusclinics.com" className="hover:underline">Contact</a>
        </div>
        <p className="text-xs text-gray-300 mt-2">
          © 2025 ZEPUS Clinics. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
