import React from 'react';

export default function FAQs() {
  const questions = [
    {
      q: 'What is ZEPUS Clinics?',
      a: 'ZEPUS Clinics is a smart digital health platform that uses AI to triage patients and connects them with real doctors online or at nearby clinics across Africa.',
    },
    {
      q: 'How does the triage bot work?',
      a: 'Our AI-powered triage assistant, Dr Zepus, asks you symptom-based questions and guides you to the right specialist or nearby facility.',
    },
    {
      q: 'Can I consult a doctor online?',
      a: 'Yes. You can book virtual consultations and receive prescriptions or referrals from verified doctors directly on the platform.',
    },
    {
      q: 'Is my information safe?',
      a: 'Absolutely. ZEPUS Clinics uses encrypted storage and complies with global data privacy standards.',
    },
    {
      q: 'How do I pay for consultations?',
      a: 'You can securely pay online through various options including cards, bank transfers, and mobile money.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Frequently Asked Questions</h1>

      <div className="space-y-6">
        {questions.map((item, index) => (
          <div key={index} className="bg-white border rounded-lg shadow p-4">
            <h3 className="font-semibold text-blue-800 mb-2">{item.q}</h3>
            <p className="text-gray-700 text-sm">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
