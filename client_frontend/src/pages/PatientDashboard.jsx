import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('wallet');

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
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const wallet = data.wallet_balance ?? 0;
  const appointments = data.appointments ?? [];
  const doctors = data.doctors ?? [];
  const uploads = data.uploads ?? [];
  const transactions = data.transactions ?? [];

  return (
    <div className="min-h-screen bg-base-200">
      {/* Top Navbar */}
      <div className="navbar bg-base-100 shadow-md px-6">
        <div className="flex-1 text-xl font-bold">👩‍⚕️ ZEPUS Clinics</div>
        <div className="flex gap-3">
          <Link to="/triage-bot" className="btn btn-outline btn-sm">🤖 AI Triage</Link>
          <Link to="/patient-chat" className="btn btn-primary btn-sm">💬 Live Doctor</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-base-100 p-4 shadow-lg hidden md:block">
          <ul className="menu space-y-2">
            <li><Link to="/triage-bot">🤖 Talk to Dr Zepus</Link></li>
            <li><Link to="/patient-chat">💬 Talk to Doctor</Link></li>
            <li><button onClick={() => setActiveTab('wallet')}>💳 Wallet</button></li>
            <li><button onClick={() => setActiveTab('appointments')}>📅 Appointments</button></li>
            <li><button onClick={() => setActiveTab('documents')}>📄 Documents</button></li>
            <li><button onClick={() => setActiveTab('messages')}>📬 Messages</button></li>
            <li><button onClick={() => setActiveTab('transactions')}>💰 Transactions</button></li>
            <li><button onClick={() => setActiveTab('uploads')}>📷 Uploads</button></li>
          </ul>
        </aside>

        {/* Main Tabs */}
        <main className="flex-1 p-6">
          <div role="tablist" className="tabs tabs-boxed mb-6">
            <button role="tab" className={`tab ${activeTab === 'wallet' ? 'tab-active' : ''}`} onClick={() => setActiveTab('wallet')}>💳 Wallet</button>
            <button role="tab" className={`tab ${activeTab === 'appointments' ? 'tab-active' : ''}`} onClick={() => setActiveTab('appointments')}>📅 Appointments</button>
            <button role="tab" className={`tab ${activeTab === 'documents' ? 'tab-active' : ''}`} onClick={() => setActiveTab('documents')}>📄 Documents</button>
            <button role="tab" className={`tab ${activeTab === 'messages' ? 'tab-active' : ''}`} onClick={() => setActiveTab('messages')}>📬 Messages</button>
            <button role="tab" className={`tab ${activeTab === 'transactions' ? 'tab-active' : ''}`} onClick={() => setActiveTab('transactions')}>💰 Transactions</button>
            <button role="tab" className={`tab ${activeTab === 'uploads' ? 'tab-active' : ''}`} onClick={() => setActiveTab('uploads')}>📷 Uploads</button>
          </div>

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title">💳 Wallet Balance</h3>
                  <p className="text-2xl font-bold text-primary">${wallet.toFixed(2)}</p>
                </div>
              </div>
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title">🕒 Pending Appointments</h3>
                  <p className="text-lg">{appointments.length}</p>
                </div>
              </div>
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title">👨‍⚕️ Available Doctors</h3>
                  <p className="text-lg">{doctors.length}</p>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div>
              <h2 className="text-xl font-bold mb-4">📅 My Appointments</h2>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appt, i) => (
                    <div key={i} className="card bg-base-100 shadow">
                      <div className="card-body">
                        <p>With Dr. <strong>{appt.doctor}</strong></p>
                        <p>Type: <span className="badge badge-info">{appt.appointment_type}</span></p>
                        <p>Mode: <span className="badge badge-accent">{appt.consultation_mode}</span></p>
                        <p>Status: <span className="badge badge-secondary">{appt.status}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No appointments yet.</p>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <h2 className="text-xl font-bold mb-4">📄 Your Documents</h2>
              <ul className="list-disc pl-6 space-y-2 text-blue-600">
                <li><a href="/static/sample/referral-letter.pdf" download>Referral Letter</a></li>
                <li><a href="/static/sample/prescription.pdf" download>Prescription</a></li>
                <li><a href="/static/sample/investigation-form.pdf" download>Investigation Form</a></li>
              </ul>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div>
              <h2 className="text-xl font-bold mb-4">📬 Messages from Doctors</h2>
              <p className="text-gray-500">No new messages yet.</p>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div>
              <h2 className="text-xl font-bold mb-4">💰 Transaction History</h2>
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx, i) => (
                        <tr key={i}>
                          <td>{tx.date}</td>
                          <td>{tx.type}</td>
                          <td>${tx.amount}</td>
                          <td>{tx.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No transactions recorded.</p>
              )}
            </div>
          )}

          {/* Uploads Tab */}
          {activeTab === 'uploads' && (
            <div>
              <h2 className="text-xl font-bold mb-4">📷 Upload Photos</h2>
              {uploads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uploads.map((img, i) => (
                    <div key={i} className="card bg-base-100 shadow">
                      <figure><img src={`/uploads/${img.filename}`} alt="Upload" className="w-full h-48 object-cover" /></figure>
                      <div className="card-body">
                        <p>{img.description || 'No description'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No uploads yet.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
