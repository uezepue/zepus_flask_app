import React from 'react';

export default function Blog() {
  const articles = [
    {
      title: '10 Common Health Myths Busted',
      summary: 'Separating facts from fiction in everyday health advice.',
    },
    {
      title: 'AI in African Healthcare: Hope or Hype?',
      summary: 'Exploring the promise and challenges of AI in medicine across Africa.',
    },
    {
      title: 'When to See a Doctor: Symptoms You Shouldn’t Ignore',
      summary: 'Recognize red flags early and act fast for your health.',
    },
    {
      title: 'Telemedicine Tips: Getting the Best from Your Online Visit',
      summary: 'How to prepare and what to expect during an e-consultation.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">ZEPUS Health Blog</h1>
      <p className="text-gray-700 mb-6 text-center text-sm md:text-base">
        Read tips and expert insights from Dr Zepus and our medical team.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm md:text-base">
        {articles.map((article, index) => (
          <div key={index} className="bg-white border rounded-lg shadow p-4 hover:shadow-md transition">
            <h3 className="font-semibold text-blue-800 mb-2">{article.title}</h3>
            <p className="text-gray-600">{article.summary}</p>
            <button className="mt-3 text-blue-600 hover:underline text-xs">Read more →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
