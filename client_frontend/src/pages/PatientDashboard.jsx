import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';

export default function PatientDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/api/patient/dashboard')
      .then(res => setData(res.data))
      .catch(err => {
        console.error(err);
        alert('❌ Failed to load dashboard data.');
      });
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-500 animate-pulse">Loading Patient Dashboard...</div>
      </div>
    );
  }

  const wallet = data.wallet_balance ?? 0;
  const appointments = data.appointments ?? [];
  const doctors = data.doctors ?? [];
  const uploads = data.uploads ?? [];
  const transactions = data.transactions ?? [];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Top Navigation */}
      <TopNav />

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white p-4 shadow rounded">
          <nav>
            <ul className="space-y-3">
              <li><Link to="/dashboard/patient/triage" className="text-blue-600 hover:underline">🤖 AI Triage</Link></li>
              <li><Link to="/dashboard/patient/chat" className="text-blue-600 hover:underline">💬 Talk to Doctor</Link></li>
              <li><a href="#wallet" className="text-gray-800 hover:text-blue-600">💳 Wallet</a></li>
              <li><a href="#appointments" className="text-gray-800 hover:text-blue-600">📅 Appointments</a></li>
              <li><a href="#documents" className="text-gray-800 hover:text-blue-600">📄 Documents</a></li>
              <li><a href="#messages" className="text-gray-800 hover:text-blue-600">📬 Messages</a></li>
              <li><a href="#transactions" className="text-gray-800 hover:text-blue-600">💰 Transactions</a></li>
              <li><a href="#uploads" className="text-gray-800 hover:text-blue-600">📷 Uploads</a></li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="w-3/4 space-y-10">
          {/* Wallet */}
          <section id="wallet">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">💳 Wallet Balance</h3>
                <p className="text-2xl font-bold text-green-600">${wallet.toFixed(2)}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">🕒 Pending Appointments</h3>
                <p className="text-xl">{appointments.length}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">👨‍⚕️ Available Doctors</h3>
                <p className="text-xl">{doctors.length}</p>
              </div>
            </div>
          </section>

          {/* Appointments */}
          <section id="appointments">
            <h2 className="text-xl font-semibold mb-3">📅 My Appointments</h2>
            {appointments.length > 0 ? (
              <ul className="space-y-2">
                {appointments.map((appt, i) => (
                  <li key={i} className="bg-white p-3 rounded shadow">
                    With Dr. <strong>{appt.doctor}</strong> | Type: {appt.appointment_type} | Mode: {appt.consultation_mode} | Status: {appt.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No appointments yet.</p>
            )}
          </section>

          {/* Uploads */}
          <section id="uploads">
            <h2 className="text-xl font-semibold mb-3">📷 Upload Photos</h2>
            {uploads.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {uploads.map((img, i) => (
                  <div key={i} className="bg-white p-3 shadow rounded">
                    <img
                      src={`/uploads/${img.filename}`}
                      alt="Uploaded"
                      className="w-full max-h-48 object-cover rounded mb-2"
                    />
                    <div className="text-sm text-gray-600">
                      {img.description || 'No description'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No uploads yet.</p>
            )}
          </section>

          {/* Documents */}
          <section id="documents">
            <h2 className="text-xl font-semibold mb-3">📄 Your Documents</h2>
            <ul className="list-disc ml-5 space-y-1 text-blue-600">
              <li><a href="/static/sample/referral-letter.pdf" download>Referral Letter</a></li>
              <li><a href="/static/sample/prescription.pdf" download>Prescription</a></li>
              <li><a href="/static/sample/investigation-form.pdf" download>Investigation Form</a></li>
            </ul>
          </section>

          {/* Messages */}
          <section id="messages">
            <h2 className="text-xl font-semibold mb-3">📬 Messages from Doctors</h2>
            <p className="text-gray-500">No new messages yet.</p>
          </section>

          {/* Transactions */}
          <section id="transactions">
            <h2 className="text-xl font-semibold mb-3">💰 Transaction History</h2>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-4 py-2">{tx.date}</td>
                        <td className="px-4 py-2">{tx.type}</td>
                        <td className="px-4 py-2">${tx.amount}</td>
                        <td className="px-4 py-2">{tx.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No transactions recorded.</p>
            )}
          </section>
        </main>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <Link
          to="/dashboard/patient/triage"
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded shadow-md animate-pulse"
        >
          🤖 Talk to Dr Zepus
        </Link>
        <Link
          to="/dashboard/patient/chat"
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow-md"
        >
          💬 Live Doctor
        </Link>
      </div>
    </div>
  );
}
