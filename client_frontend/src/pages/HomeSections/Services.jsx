import React from 'react';

export default function Services() {
  return (
    <section
      id="services"
      className="py-12 bg-white text-center"
      data-aos="fade-up"
    >
      <h2 className="text-2xl font-semibold mb-6 text-primary">Our Services</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-sm">
        {[
          'AI Symptom Checker',
          'Online Doctor Consultations',
          'Lab & Prescription Referrals',
          'Government Hospital Integration',
          'Affordable Local Pricing',
          'Pan-African Coverage',
        ].map((service, i) => (
          <div
            key={i}
            className="p-4 bg-base-100 rounded shadow hover:shadow-md transition duration-300"
            data-aos="zoom-in"
            data-aos-delay={i * 100}
          >
            {service}
          </div>
        ))}
      </div>
    </section>
  );
}
