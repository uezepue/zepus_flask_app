import React from 'react';

export default function Blog() {
  return (
    <section
      id="blog"
      className="py-12 bg-gray-50 text-center"
      data-aos="fade-up"
    >
      <h2 className="text-2xl font-semibold mb-4">Health Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto text-sm">
        <div className="p-4 bg-white border rounded shadow hover:shadow-md">10 Common Health Myths Busted</div>
        <div className="p-4 bg-white border rounded shadow hover:shadow-md">AI in African Healthcare: Hope or Hype?</div>
        <div className="p-4 bg-white border rounded shadow hover:shadow-md">When to See a Doctor: Symptoms You Shouldn’t Ignore</div>
      </div>
    </section>
  );
}
