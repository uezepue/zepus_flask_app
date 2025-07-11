import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">About ZEPUS Clinics</h1>

      <p className="mb-4 text-gray-700 text-sm md:text-base leading-relaxed">
        ZEPUS Clinics is a modern, AI-powered healthcare platform revolutionizing how people access medical care across Africa and beyond.
        Our mission is to deliver fast, affordable, and intelligent care to patients regardless of their location or status.
      </p>

      <p className="mb-4 text-gray-700 text-sm md:text-base leading-relaxed">
        Our platform allows users to:
        <ul className="list-disc list-inside mt-2">
          <li>Check symptoms using our AI-powered triage assistant</li>
          <li>Get referred to appropriate specialists or nearby clinics</li>
          <li>Consult doctors online or schedule physical appointments</li>
          <li>Download referrals and lab request forms</li>
          <li>Access care across verified public and private facilities</li>
        </ul>
      </p>

      <p className="mb-4 text-gray-700 text-sm md:text-base leading-relaxed">
        With a network of over 500 verified doctors, integrated government clinic access, and expanding international support, ZEPUS Clinics is committed to transforming healthcare accessibility one consultation at a time.
      </p>

      <p className="text-gray-600 text-sm text-center mt-8">
        Thank you for trusting us with your care.
      </p>
    </div>
  );
}
