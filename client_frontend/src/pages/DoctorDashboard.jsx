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

  if (error) {
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  }

  if (!doctor) {
    return <div className="text-center mt-10 text-blue-800">Loading Doctor Dashboard...</div>;
  }

  const statusText = doctor.status?.charAt(0).toUpperCase() + doctor.status?.slice(1);
  const waitingCount = appointments.filter(a => ['waiting', 'pending'].includes(a.status)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center bg-blue-800 text-white px-6 py-4 shadow-md">
        <h1 className="text-xl font-bold">ZEPUS Clinics – Doctor Dashboard</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <span>My Profile</span>
          <button onClick={handleLogout} className="hover:underline text-red-200">Logout</button>
        </div>
      </header>

      {/* Alert */}
      {waitingCount > 0 && (
        <div className="bg-yellow-100 text-yellow-800 px-6 py-3 text-center font-semibold">
          🛎️ {waitingCount} patient{waitingCount > 1 ? 's' : ''} waiting for consultation.
        </div>
      )}

      {/* Status Warning */}
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

      {/* Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-4 min-h-screen space-y-2">
          <ul className="space-y-2">
            <li><Link to="/doctor/dashboard" className="block hover:text-blue-600">🏠 Dashboard</Link></li>
            <li><Link to="/doctor/verify-documents" className="block hover:text-blue-600">📑 Upload Documents</Link></li>
            <li className="flex justify-between items-center">
              <a href="#" className="block hover:text-blue-600">🗓️ Appointments</a>
              {waitingCount > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {waitingCount}
                </span>
              )}
            </li>
            <li><a href="#" className="block hover:text-blue-600">🧑‍⚕️ Patients</a></li>
            <li><a href="#" className="block hover:text-blue-600">📋 Notes</a></li>
            <li><a href="#" className="block hover:text-blue-600">💊 Prescriptions</a></li>
            <li><a href="#" className="block hover:text-blue-600">📂 Results</a></li>
            <li><a href="#" className="block hover:text-blue-600">📨 Follow-Ups</a></li>
            <li><a href="#" className="block hover:text-blue-600">💼 Earnings</a></li>
            <li><a href="#" className="block hover:text-blue-600">📣 Broadcasts</a></li>
            <li><a href="#" className="block hover:text-blue-600">⚙️ Settings</a></li>
            <li><Link to="/doctor/chatroom" className="block hover:text-blue-600">💬 Chatroom</Link></li>
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
                <p>You have <strong>{appointments.length}</strong> appointment{appointments.length !== 1 ? 's' : ''} today.</p>
              </div>

              <div className="bg-white p-6 rounded shadow-md">
                <h3 className="text-lg font-semibold mb-2">📣 Latest Broadcast</h3>
                {broadcast ? (
                  <>
                    <h4 className="text-md font-bold">{broadcast.title}</h4>
                    <p className="mt-1">{broadcast.body}</p>
                    <small className="text-gray-500">Posted on {new Date(broadcast.created_at).toLocaleDateString()}</small>
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
