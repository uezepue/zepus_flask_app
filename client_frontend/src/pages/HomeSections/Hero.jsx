import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section
      id="hero"
      className="text-center py-16 bg-blue-50"
      data-aos="fade-up"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
        Africa's Smartest AI Medical Assistant
      </h1>
      <p className="text-lg md:text-xl mb-6 text-gray-700">
        Get triaged by AI, consult real doctors online or at nearby clinics in minutes.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/triage-bot"
          className="btn btn-success btn-lg animate-pulse"
        >
          🤖 Start Chat with Dr Zepus
        </Link>
        <Link
          to="/register/doctor"
          className="btn btn-neutral btn-lg"
        >
          🩺 Register as a Doctor
        </Link>
      </div>
    </section>
  );
}
