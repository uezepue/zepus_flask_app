import React from 'react';

export default function Blog() {
  const articles = [
    {
      title: '10 Common Health Myths Busted',
      summary: 'Learn the truth behind everyday health beliefs.',
    },
    {
      title: 'AI in African Healthcare: Hope or Hype?',
      summary: 'How artificial intelligence is reshaping patient care across Africa.',
    },
    {
      title: 'When to See a Doctor: Symptoms You Shouldn’t Ignore',
      summary: 'Recognize red flags early to seek timely medical help.',
    },
  ];

  return (
    <section id="blog" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-10">
          Health Articles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.map((article, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-600">{article.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
