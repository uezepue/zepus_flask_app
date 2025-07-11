import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[80vh] flex flex-col justify-center items-center px-4 text-center bg-gradient-to-br from-blue-100 to-white dark:from-gray-900 dark:to-black"
      data-aos="fade-up"
    >
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 dark:text-white mb-4 leading-tight">
        Africa&apos;s Smartest <br className="hidden md:block" />
        AI Medical Assistant
      </h1>

      <p className="text-lg md:text-xl max-w-2xl text-gray-700 dark:text-gray-300 mb-8">
        Get triaged by AI, consult real doctors online or at nearby clinics in minutes.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/triage-bot"
          className="btn btn-success btn-lg text-white animate-pulse"
        >
          🤖 Start Chat with Dr Zepus
        </Link>
        <Link
          to="/register/doctor"
          className="btn btn-outline btn-lg"
        >
          🩺 Register as a Doctor
        </Link>
      </div>
    </section>
  );
}
