import React from 'react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Dr Zepus helped me get referred to the right clinic instantly. Fast and helpful!",
      name: 'Chidi O., Lagos',
    },
    {
      quote: "I consulted from home and got my meds in 30 minutes. Amazing service!",
      name: 'Amina K., Nairobi',
    },
    {
      quote: "The AI was surprisingly smart and kind. Then I got a real doctor in minutes.",
      name: 'Kwame B., Accra',
    },
  ];

  return (
    <section className="py-16 bg-white" id="testimonials">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-10">What Our Patients Say</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-blue-50 border border-blue-100 p-6 rounded-xl shadow-sm hover:shadow-md transition"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <p className="italic text-gray-700 mb-4">“{t.quote}”</p>
              <div className="text-sm font-semibold text-blue-800">{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
