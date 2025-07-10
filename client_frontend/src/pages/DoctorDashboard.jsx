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
    return (
      <div className="alert alert-error mt-10 w-11/12 mx-auto justify-center">{error}</div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const statusText = doctor.status?.charAt(0).toUpperCase() + doctor.status?.slice(1);
  const waitingCount = appointments.filter(a => ['waiting', 'pending'].includes(a.status)).length;

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-md px-6">
        <div className="flex-1 text-xl font-bold text-primary">
          ZEPUS Clinics – Doctor Dashboard
        </div>
        <div className="flex gap-4">
          <span className="text-sm">Welcome, Dr. {doctor.name}</span>
          <Link to="/" className="btn btn-sm btn-outline">Home</Link>
          <button onClick={handleLogout} className="btn btn-sm btn-error">Logout</button>
        </div>
      </div>

      {/* Alerts */}
      {waitingCount > 0 && (
        <div className="alert alert-warning mt-4 mx-6">
          🛎️ {waitingCount} patient{waitingCount > 1 ? 's' : ''} waiting for consultation.
        </div>
      )}

      {['pending', 'flagged', 'expired'].includes(doctor.status) && (
        <div className="alert alert-error mx-6 mt-4">
          ⚠️ Your account is <strong>{statusText}</strong>.{' '}
          {doctor.status === 'flagged' && 'Please re-submit valid documents.'}
          {doctor.status === 'expired' && 'Some documents have expired. Please upload updated versions.'}
          {doctor.status === 'pending' && 'Awaiting admin approval.'}
        </div>
      )}

      {/* Tabs */}
      <div className="p-6">
        <div role="tablist" className="tabs tabs-boxed mb-4 flex-wrap">
          {[
            ['overview', '🏠 Overview'],
            ['appointments', '📅 Appointments'],
            ['broadcasts', '📣 Broadcasts'],
            ['patients', '🧑‍🤝‍🧑 Patients'],
            ['notes', '📝 Notes'],
            ['prescriptions', '💊 Prescriptions'],
            ['earnings', '💼 Earnings'],
            ['settings', '⚙️ Settings'],
          ].map(([value, label]) => (
            <input key={value}
              type="radio"
              name="dashboard-tabs"
              role="tab"
              className="tab"
              aria-label={label}
              checked={value === 'overview'}
              onChange={() => {}}
            />
          ))}
        </div>

        {/* Overview */}
        <div className="card bg-base-100 shadow mb-6">
          <div className="card-body">
            <h2 className="card-title">👨‍⚕️ Doctor Profile</h2>
            <p><strong>Specialty:</strong> {doctor.specialty || 'Not provided'}</p>
            <p><strong>Status:</strong> {statusText}</p>
            <p><strong>Verification:</strong> {doctor.is_verified ? '✅ Verified' : '❌ Not Verified'}</p>
            <p><strong>Consultation Fee:</strong> ₦{doctor.consultation_fee?.toLocaleString() || '0.00'}</p>
          </div>
        </div>

        {/* Appointments */}
        <div className="card bg-base-100 shadow mb-6">
          <div className="card-body">
            <h2 className="card-title">📅 Today’s Appointments</h2>
            {appointments.length > 0 ? (
              <ul className="divide-y">
                {appointments.map((appt, i) => (
                  <li key={i} className="py-2">
                    <div className="flex justify-between">
                      <span>{appt.patient}</span>
                      <span className="badge badge-outline">{appt.status}</span>
                    </div>
                    <div className="text-sm text-gray-500">{appt.appointment_type} • {appt.consultation_mode}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No appointments today.</p>
            )}
          </div>
        </div>

        {/* Broadcast */}
        <div className="card bg-base-100 shadow mb-6">
          <div className="card-body">
            <h2 className="card-title">📣 Latest Broadcast</h2>
            {broadcast ? (
              <>
                <h3 className="text-lg font-semibold">{broadcast.title}</h3>
                <p>{broadcast.body}</p>
                <small className="text-gray-500">Posted on {new Date(broadcast.created_at).toLocaleDateString()}</small>
              </>
            ) : (
              <p>No new broadcasts.</p>
            )}
          </div>
        </div>

        {/* Coming Soon Sections */}
        {[
          ['🧑‍🤝‍🧑 Patients', 'Your patient list, recent interactions, and referrals.'],
          ['📝 Notes', 'Case notes, clinical summaries, and SOAP templates.'],
          ['💊 Prescriptions', 'Drug templates, repeat prescriptions, and pharmacy linkage.'],
          ['💼 Earnings', 'Consultation earnings, withdrawal requests, and ledger breakdown.'],
          ['⚙️ Settings', 'Account preferences, password reset, availability settings.'],
        ].map(([title, text], idx) => (
          <div key={idx} className="card bg-base-100 shadow mb-4">
            <div className="card-body">
              <h2 className="card-title">{title}</h2>
              <p className="text-gray-600">Coming soon: {text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
