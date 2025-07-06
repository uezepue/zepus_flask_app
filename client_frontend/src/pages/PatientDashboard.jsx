import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function PatientDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/patient/dashboard')
      .then(res => setData(res.data))
      .catch(err => {
        console.error(err);
        alert('Failed to load dashboard data.');
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'GET' });
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (!data) return <div className="text-center mt-10">Loading...</div>;

  const wallet = data.wallet_balance !== undefined ? data.wallet_balance : 0;
  const appointments = data?.appointments || [];
  const doctors = data?.doctors || [];
  const uploads = data?.uploads || [];
  const transactions = data?.transactions || [];

  return (
    <div className="container mx-auto px-4">
      <div className="dashboard">
        <div className="top-bar">
          <div className="logo">ZEPUS Clinics</div>
          <div className="top-icons">
            <div className="icon">Welcome, {data.first_name}</div>
            <div className="icon">
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#0077b6', cursor: 'pointer' }}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <aside className="sidebar">
          <nav>
            <ul>
              <li><Link to="/dashboard/patient/triage">🤖 Chat with Dr Zepus (AI)</Link></li>
              <li><Link to="/dashboard/patient/chat">💬 Talk to Doctor (Live)</Link></li>
              <li><a href="#wallet">Wallet</a></li>
              <li><a href="#appointments">My Appointments</a></li>
              <li><a href="#documents">Documents</a></li>
              <li><a href="#messages">Messages</a></li>
              <li><a href="#transactions">Transaction History</a></li>
              <li><a href="#uploads">Upload Photos</a></li>
            </ul>
          </nav>
        </aside>

        <main className="main-dashboard">
          <section id="wallet">
            <div className="summary-tiles">
              <div className="tile">
                <h3>Wallet Balance</h3>
                <p><strong>${wallet.toFixed(2)}</strong></p>
              </div>
              <div className="tile">
                <h3>Pending Appointments</h3>
                <p>{appointments.length}</p>
              </div>
              <div className="tile">
                <h3>Available Doctors</h3>
                <p>{doctors.length}</p>
              </div>
            </div>
          </section>

          <section id="appointments">
            <h2>My Appointments</h2>
            {appointments.length > 0 ? (
              <ul>
                {appointments.map((appt, i) => (
                  <li key={i}>
                    With Dr. <strong>{appt.doctor}</strong> | Type: {appt.appointment_type} | Mode: {appt.consultation_mode} | Status: {appt.status}
                  </li>
                ))}
              </ul>
            ) : <p>You have no appointments yet.</p>}
          </section>

          <section id="uploads">
            <h2>Upload Photos for Doctor</h2>
            {uploads.length > 0 && (
              <ul>
                {uploads.map((img, i) => (
                  <li key={i}>
                    <img src={`/uploads/${img.filename}`} alt="Uploaded" style={{ maxWidth: '200px' }} />
                    <div>{img.description || 'No description'}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section id="documents">
            <h2>Your Documents</h2>
            <ul>
              <li><a href="/static/sample/referral-letter.pdf" download>Referral Letter</a></li>
              <li><a href="/static/sample/prescription.pdf" download>Prescription</a></li>
              <li><a href="/static/sample/investigation-form.pdf" download>Investigation Form</a></li>
            </ul>
          </section>

          <section id="messages">
            <h2>Messages from Doctors</h2>
            <p>No new messages.</p>
          </section>

          <section id="transactions">
            <h2>Transaction History</h2>
            {transactions.length > 0 ? (
              <table className="transaction-table">
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
            ) : <p>No transactions yet.</p>}
          </section>
        </main>

        <div className="floating-buttons">
          <Link to="/dashboard/patient/triage" className="btn-primary pulse-button">Talk to Dr Zepus</Link>
          <Link to="/dashboard/patient/chat" className="btn-secondary">Live Doctor</Link>
        </div>
      </div>
    </div>
  );
}
