import React from 'react';

export default function Services() {
  const services = [
    'AI Symptom Checker',
    'Online Doctor Consultations',
    'Lab & Prescription Referrals',
    'Government Hospital Integration',
    'Affordable Local Pricing',
    'Pan-African Coverage',
  ];

  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-10">
          Our Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <p className="text-blue-800 font-semibold text-sm">{service}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
