import React from 'react';
import { FaStethoscope, FaRobot, FaFlask, FaHospital, FaGlobeAfrica, FaMoneyBillWave } from 'react-icons/fa';

export default function Services() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Our Services</h1>

      <p className="text-gray-700 mb-8 text-sm md:text-base text-center">
        ZEPUS Clinics offers intelligent and inclusive healthcare services powered by AI and verified medical professionals.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm md:text-base">
        <div className="p-4 bg-white border rounded shadow flex items-start gap-3">
          <FaRobot className="text-blue-600 text-xl mt-1" />
          <div>
            <h3 className="font-semibold">AI Symptom Checker</h3>
            <p className="text-gray-600">Get fast, intelligent triage and care guidance using our AI-powered health bot.</p>
          </div>
        </div>

        <div className="p-4 bg-white border rounded shadow flex items-start gap-3">
          <FaStethoscope className="text-blue-600 text-xl mt-1" />
          <div>
            <h3 className="font-semibold">Doctor Consultations</h3>
            <p className="text-gray-600">Chat with real, verified doctors online or book in-person visits seamlessly.</p>
          </div>
        </div>

        <div className="p-4 bg-white border rounded shadow flex items-start gap-3">
          <FaFlask className="text-blue-600 text-xl mt-1" />
          <div>
            <h3 className="font-semibold">Lab & Prescription Referrals</h3>
            <p className="text-gray-600">Instant referrals to labs and pharmacies with downloadable request forms.</p>
          </div>
        </div>

        <div className="p-4 bg-white border rounded shadow flex items-start gap-3">
          <FaHospital className="text-blue-600 text-xl mt-1" />
          <div>
            <h3 className="font-semibold">Government Hospital Integration</h3>
            <p className="text-gray-600">Easily connect with supported public clinics and referral centers near you.</p>
          </div>
        </div>

        <div className="p-4 bg-white border rounded shadow flex items-start gap-3">
          <FaMoneyBillWave className="text-blue-600 text-xl mt-1" />
          <div>
            <h3 className="font-semibold">Affordable Local Pricing</h3>
            <p className="text-gray-600">We provide wallet-friendly care plans suited to African economies.</p>
          </div>
        </div>

        <div className="p-4 bg-white border rounded shadow flex items-start gap-3">
          <FaGlobeAfrica className="text-blue-600 text-xl mt-1" />
          <div>
            <h3 className="font-semibold">Pan-African Coverage</h3>
            <p className="text-gray-600">We support patients across 30+ African countries and expanding.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
