import React from 'react';

export default function HowItWorks() {
  return (
    <section
      id="consult"
      className="py-12 bg-blue-50 text-center"
      data-aos="fade-up"
    >
      <h2 className="text-2xl font-semibold mb-4 text-primary">How It Works</h2>
      <ol className="list-decimal list-inside space-y-3 text-gray-700 max-w-lg mx-auto text-left text-base">
        <li>Tell Dr Zepus your symptoms</li>
        <li>Get triaged and referred</li>
        <li>Book a consultation (telemedicine or physical)</li>
        <li>Pay securely</li>
        <li>Follow up and recover</li>
      </ol>
    </section>
  );
}
