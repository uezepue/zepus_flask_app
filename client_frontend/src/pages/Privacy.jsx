// src/pages/Privacy.jsx
import React from 'react';

export default function Privacy() {
  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        At ZEPUS Clinics, we value your privacy and are committed to protecting your personal data.
        This policy explains how we collect, use, store, and disclose your information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Personal details (name, age, gender, phone, email, etc.)</li>
        <li>Medical history and symptoms shared with our AI or doctors</li>
        <li>Location data (for clinic matching and referrals)</li>
        <li>Payment and transaction data</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Data</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To provide accurate triage and consultations</li>
        <li>To recommend nearby clinics or hospitals</li>
        <li>To improve our AI and health services</li>
        <li>To process payments and maintain records</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Who We Share It With</h2>
      <p className="mb-4">
        We only share your data with verified doctors and clinics involved in your care, and never sell your data to third parties.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Security</h2>
      <p className="mb-4">
        We use modern encryption and secure servers to keep your data safe. Access is restricted to authorized personnel only.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Request access to your data</li>
        <li>Request corrections or deletion</li>
        <li>Withdraw consent at any time</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact</h2>
      <p className="mb-4">
        For any privacy-related concerns, contact us at <a href="mailto:support@zepusclinics.com" className="text-blue-600">support@zepusclinics.com</a>.
      </p>

      <p className="text-sm text-gray-500">
        Last updated: July 2025
      </p>
    </div>
  );
}
