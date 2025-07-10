import React from 'react';

export default function Testimonials() {
  return (
    <section
      className="py-12 text-center bg-white"
      data-aos="fade-up"
    >
      <h2 className="text-2xl font-semibold mb-4">What Our Patients Say</h2>
      <blockquote className="italic text-gray-700 max-w-xl mx-auto mb-4">
        "Dr Zepus helped me get referred to the right clinic instantly. Fast and helpful!"
      </blockquote>
      <blockquote className="italic text-gray-700 max-w-xl mx-auto">
        "I consulted from home and got my meds in 30 minutes. Amazing service!"
      </blockquote>
    </section>
  );
}
