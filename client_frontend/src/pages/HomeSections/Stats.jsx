import React from 'react';

export default function Stats() {
  const stats = [
    { value: '500+', label: 'Verified Doctors' },
    { value: '50,000+', label: 'Patients Served' },
    { value: '30+', label: 'Countries Supported' },
  ];

  return (
    <section className="py-16 bg-white" id="stats">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">
          Trusted by Thousands
        </h2>
        <p className="text-gray-600 mb-10">
          Serving patients across Africa. Verified doctors. Integrated with government clinics.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-green-50 border border-green-100 p-6 rounded-xl shadow-sm hover:shadow-md transition text-center"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="text-3xl font-bold text-green-700 mb-1">{item.value}</div>
              <div className="text-sm text-gray-700">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
