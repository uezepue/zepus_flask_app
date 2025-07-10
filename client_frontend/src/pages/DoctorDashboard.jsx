import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [broadcast, setBroadcast] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/doctor/dashboard')
      .then(res => {
        if (res.data?.doctor) {
          setDoctor(res.data.doctor);
          setAppointments(res.data.appointments || []);
          setBroadcast(res.data.latest_broadcast || null);
        } else {
          throw new Error('Invalid response structure');
        }
      })
      .catch(err => {
        console.error(err);
        setError('❌ Failed to load dashboard. Please check your network or try again.');
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout');
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (error) {
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  }

  if (!doctor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-blue-800 text-lg animate-pulse">Loading Doctor Dashboard...</div>
      </div>
    );
  }

  const statusText = doctor.status?.charAt(0).toUpperCase() + doctor.status?.slice(1);
  const waitingCount = appointments.filter(a => ['waiting', 'pending'].includes(a.status)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />

      {/* Alerts */}
      {waitingCount > 0 && (
        <div className="bg-yellow-100 text-yellow-800 px-6 py-3 text-center font-semibold">
          🛎️ {waitingCount} patient{waitingCount > 1 ? 's' : ''} waiting for consultation.
        </div>
      )}
      {['pending', 'flagged', 'expired'].includes(doctor.status) && (
        <div className="bg-red-100 text-red-800 px-6 py-3 text-center">
          ⚠️ Your account is <strong>{statusText}</strong>.{' '}
          {{
            flagged: 'Please re-submit valid documents.',
            expired: 'Some documents have expired. Please upload updated versions.',
            pending: 'Awaiting admin approval.',
          }[doctor.status]}
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-4 min-h-screen">
          <ul className="space-y-3 text-gray-800">
            <li><Link to="/doctor/dashboard" className="hover:text-blue-600">🏠 Dashboard</Link></li>
            <li><Link to="/doctor/verify-documents" className="hover:text-blue-600">📑 Upload Documents</Link></li>
            <li className="flex justify-between items-center">
              <span className="hover:text-blue-600 cursor-pointer">🗓️ Appointments</span>
              {waitingCount > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 rounded-full">{waitingCount}</span>
              )}
            </li>
            <li><span className="hover:text-blue-600 cursor-pointer">🧑‍⚕️ Patients</span></li>
            <li><span className="hover:text-blue-600 cursor-pointer">📋 Notes</span></li>
            <li><span className="hover:text-blue-600 cursor-pointer">💊 Prescriptions</span></li>
            <li><span className="hover:text-blue-600 cursor-pointer">📂 Results</span></li>
            <li><span className="hover:text-blue-600 cursor-pointer">📨 Follow-Ups</span></li>
            <li><span className="hover:text-blue-600 cursor-pointer">💼 Earnings</span></li>
            <li><span className="hover:text-blue-600 cursor-pointer">📣 Broadcasts</span></li>
            <li><span className="hover:text-blue-600 cursor-pointer">⚙️ Settings</span></li>
            <li><Link to="/doctor/chatroom" className="hover:text-blue-600">💬 Chatroom</Link></li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline mt-4 w-full text-left"
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Welcome, Dr. {doctor.name}</h2>
            <p><strong>Specialty:</strong> {doctor.specialty || 'Not provided'}</p>
            <p><strong>Status:</strong> {statusText}</p>
            <p><strong>Verification:</strong> {doctor.is_verified ? '✅ Verified' : '❌ Not Verified'}</p>
            <p><strong>Consultation Fee:</strong> ₦{doctor.consultation_fee?.toLocaleString() || '0.00'}</p>
          </div>

          {doctor.is_verified && (
            <>
              <div className="bg-white p-6 rounded shadow-md">
                <h3 className="text-lg font-semibold mb-2">📅 Today’s Appointments</h3>
                {appointments.length > 0 ? (
                  <ul className="space-y-2">
                    {appointments.map((appt, i) => (
                      <li key={i} className="border-b py-2">
                        {appt.time} with <strong>{appt.patient}</strong> ({appt.status})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No appointments for today.</p>
                )}
              </div>

              <div className="bg-white p-6 rounded shadow-md">
                <h3 className="text-lg font-semibold mb-2">📣 Latest Broadcast</h3>
                {broadcast ? (
                  <>
                    <h4 className="text-md font-bold">{broadcast.title}</h4>
                    <p className="mt-1">{broadcast.body}</p>
                    <small className="text-gray-500">Posted {new Date(broadcast.created_at).toLocaleDateString()}</small>
                  </>
                ) : (
                  <p>No new broadcasts.</p>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
