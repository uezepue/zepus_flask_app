import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaRobot, FaMapMarkerAlt } from 'react-icons/fa';
import doctorImage from '../../assets/doctor.png'; // make sure image exists

export default function Hero() {
  return (
    <section className="w-full bg-white text-gray-900 py-16">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center px-6 gap-10">
        {/* Text Content */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 leading-tight">
            Your Health,<br /> Our Priority
          </h1>
          <p className="text-lg text-gray-700">
            Quality care for individuals and families.
          </p>

          <Link
            to="/get-started"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </Link>

          {/* Cards */}
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

        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={doctorImage}
            alt="Smiling doctor with tablet"
            className="w-80 h-auto object-cover rounded-2xl shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
