import React from 'react';

export default function Stats() {
  return (
    <section
      className="py-12 bg-white text-center"
      data-aos="fade-up"
    >
      <h2 className="text-2xl font-semibold mb-4">Trusted by Thousands</h2>
      <p className="mb-6 text-gray-600">
        Serving patients across Africa. Verified doctors. Integrated with government clinics.
      </p>
      <div className="flex flex-wrap justify-center gap-6 text-sm">
        <div className="p-4 bg-green-100 rounded shadow">500+ Verified Doctors</div>
        <div className="p-4 bg-green-100 rounded shadow">50,000+ Patients Served</div>
        <div className="p-4 bg-green-100 rounded shadow">30+ Countries Supported</div>
      </div>
    </section>
  );
}
