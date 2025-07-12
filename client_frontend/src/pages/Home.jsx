import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaRobot, FaMapMarkedAlt } from 'react-icons/fa';
import heroDoctor from '../assets/doctor.png';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-4 py-12 md:py-20 max-w-7xl mx-auto">
        {/* Text Block */}
        <div className="space-y-6 text-center md:text-left">
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

          {/* Features */}
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

        {/* Image */}
        <div className="flex justify-center items-center relative">
          <img
            src={heroDoctor}
            alt="Smiling Doctor"
            className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain rounded-2xl shadow-md max-h-[70vh]"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/80 via-white/50 to-transparent pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
