import React from 'react';
import { FaComments, FaStethoscope, FaCalendarCheck, FaMoneyBillWave, FaHeartbeat } from 'react-icons/fa';

export default function HowItWorks() {
  const steps = [
    {
      icon: <FaComments className="text-blue-600 text-2xl" />,
      title: 'Tell Dr Zepus',
      desc: 'Describe your symptoms and concerns.',
    },
    {
      icon: <FaStethoscope className="text-blue-600 text-2xl" />,
      title: 'AI Triage',
      desc: 'Get triaged and referred instantly.',
    },
    {
      icon: <FaCalendarCheck className="text-blue-600 text-2xl" />,
      title: 'Book Consultation',
      desc: 'Choose telemedicine or in-person visit.',
    },
    {
      icon: <FaMoneyBillWave className="text-blue-600 text-2xl" />,
      title: 'Pay Securely',
      desc: 'Fast, safe online payments.',
    },
    {
      icon: <FaHeartbeat className="text-blue-600 text-2xl" />,
      title: 'Recover & Follow Up',
      desc: 'Track recovery and stay supported.',
    },
  ];

  return (
    <section id="consult" className="py-16 bg-blue-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-10">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-center space-y-3">
              <div className="flex justify-center">{step.icon}</div>
              <h3 className="font-semibold text-sm text-blue-800">{step.title}</h3>
              <p className="text-xs text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
