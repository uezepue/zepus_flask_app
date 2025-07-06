import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [broadcast, setBroadcast] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/doctor/dashboard')
      .then(res => {
        if (res.data && res.data.doctor) {
          setDoctor(res.data.doctor);
          setAppointments(res.data.appointments || []);
          setBroadcast(res.data.latest_broadcast || null);
        } else {
          throw new Error('Invalid response structure');
        }
      })
      .catch(err => {
        console.error(err);
        setError('❌ Failed to load dashboard. Ensure /api/doctor/dashboard is working.');
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!doctor) return <div>Loading...</div>;

  const statusText = doctor.status?.charAt(0).toUpperCase() + doctor.status?.slice(1);
  const waitingCount = appointments.filter(appt => appt.status === 'waiting' || appt.status === 'pending').length;

  return (
    <div>
      <header className="top-bar">
        <div>ZEPUS Clinics – Doctor Dashboard</div>
        <div>
          <a href="/">Home</a> | <span>My Profile</span> | 
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#0077b6', cursor: 'pointer', marginLeft: '10px' }}>
            Logout
          </button>
        </div>
      </header>

      {waitingCount > 0 && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-center font-semibold">
          🛎️ You have {waitingCount} patient{waitingCount > 1 ? 's' : ''} waiting for your consultation.
        </div>
      )}

      {(doctor.status === 'pending' || doctor.status === 'flagged' || doctor.status === 'expired') && (
        <div className="banner">
          ⚠️ Your account is <strong>{statusText}</strong>.&nbsp;
          {{
            'flagged': 'Please re-submit valid documents.',
            'expired': 'Some documents have expired. Please upload updated versions.',
            'pending': 'Awaiting admin approval.'
          }[doctor.status]}
        </div>
      )}

      <div className="container">
        <aside>
          <ul>
            <li><Link to="/doctor/dashboard">🏠 Dashboard</Link></li>
            <li><Link to="/doctor/verify-documents">📑 Upload Documents</Link></li>
            <li>
              <a href="#">
                🗓️ Appointments
                {waitingCount > 0 && (
                  <span className="ml-2 inline-block bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {waitingCount}
                  </span>
                )}
              </a>
            </li>
            <li><a href="#">🧑‍⚕️ Patients</a></li>
            <li><a href="#">📋 Notes</a></li>
            <li><a href="#">💊 Prescriptions</a></li>
            <li><a href="#">📂 Results</a></li>
            <li><a href="#">📨 Follow-Ups</a></li>
            <li><a href="#">💼 Earnings</a></li>
            <li><a href="#">📣 Broadcasts</a></li>
            <li><a href="#">⚙️ Settings</a></li>
            <li><Link to="/doctor/chatroom">💬 Chatroom</Link></li>
          </ul>
        </aside>

        <main>
          <div className="card">
            <h2>Welcome, Dr. {doctor.name}</h2>
            <p><strong>Specialty:</strong> {doctor.specialty || 'Not provided'}</p>
            <p><strong>Status:</strong> {statusText}</p>
            <p><strong>Verification:</strong> {doctor.is_verified ? '✅ Verified' : '❌ Not Verified'}</p>
            <p><strong>Consultation Fee:</strong> ${doctor.consultation_fee?.toFixed(2) || '0.00'}</p>
          </div>

          {doctor.is_verified && (
            <>
              <div className="card">
                <h3>📅 Today’s Appointments</h3>
                <p>You have <strong>{appointments.length}</strong> appointments.</p>
              </div>

              <div className="card">
                <h3>📣 Latest Broadcast</h3>
                {broadcast ? (
                  <>
                    <h4>{broadcast.title}</h4>
                    <p>{broadcast.body}</p>
                    <small>Posted on {broadcast.created_at}</small>
                  </>
                ) : <p>No new broadcasts.</p>}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
