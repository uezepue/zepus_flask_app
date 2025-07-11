import React, { useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import heroDoctor from '../assets/doctor.png';
import { FaHeartbeat, FaRobot, FaMapMarkerAlt } from 'react-icons/fa';

// Lazy-loaded sections
const Services = lazy(() => import('./HomeSections/Services'));
const HowItWorks = lazy(() => import('./HomeSections/HowItWorks'));
const Stats = lazy(() => import('./HomeSections/Stats'));
const Blog = lazy(() => import('./HomeSections/Blog'));
const Testimonials = lazy(() => import('./HomeSections/Testimonials'));
const NewsletterForm = lazy(() => import('./HomeSections/NewsletterForm'));
const Footer = lazy(() => import('./HomeSections/Footer'));

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-blue-900">
            ZEPUS <span className="text-gray-700">CLINICS</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 text-sm md:text-base">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/services" className="hover:text-blue-600">Services</Link>
            <Link to="/about" className="hover:text-blue-600">About</Link>
            <Link to="/login">
              <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700">
                Log in
              </button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-2xl focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden px-6 pb-4 space-y-2 text-sm">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block">Home</Link>
            <Link to="/services" onClick={() => setMobileOpen(false)} className="block">Services</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="block">About</Link>
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <button className="bg-blue-600 text-white px-4 py-1.5 mt-2 rounded-full w-full">
                Log in
              </button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-12 md:py-20 max-w-7xl mx-auto">
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
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

          {/* Features Cards */}
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
              <FaMapMarkerAlt className="text-blue-600 text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-sm">Care Zone Map</h3>
                <p className="text-xs text-gray-600">Find clinics near you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Image */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center">
          <img
            src={heroDoctor}
            alt="Smiling Doctor"
            className="w-80 h-auto object-cover rounded-2xl shadow-md"
          />
        </div>
      </section>

      {/* Lazy-loaded Sections */}
      <Suspense fallback={<div className="text-center py-6">Loading...</div>}>
        <Services />
        <HowItWorks />
        <Stats />
        <Blog />
        <Testimonials />
        <NewsletterForm />
        <Footer />
      </Suspense>

      {/* Floating Chat Button */}
      <Link
        to="/triage-bot"
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 text-sm md:text-base animate-pulse"
      >
        💬 Chat with Dr Zepus
      </Link>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 left-6 z-50 bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full shadow hover:bg-gray-300 text-xs"
      >
        ↑ Top
      </button>
    </div>
  );
}
