import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
          <span>Welcome, Dr. {doctor.name}</span>
          <button onClick={handleLogout} className="hover:underline text-red-200">Logout</button>
        </div>
      </header>

      {/* Warning Alerts */}
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

      {/* Tabs Section */}
      <div className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex flex-wrap gap-2 mb-4">
            <TabsTrigger value="overview">🏠 Overview</TabsTrigger>
            <TabsTrigger value="appointments">📅 Appointments</TabsTrigger>
            <TabsTrigger value="broadcasts">📣 Broadcasts</TabsTrigger>
            <TabsTrigger value="patients">🧑‍🤝‍🧑 Patients</TabsTrigger>
            <TabsTrigger value="notes">📝 Notes</TabsTrigger>
            <TabsTrigger value="prescriptions">💊 Prescriptions</TabsTrigger>
            <TabsTrigger value="earnings">💼 Earnings</TabsTrigger>
            <TabsTrigger value="settings">⚙️ Settings</TabsTrigger>
          </TabsList>

          {/* Tab: Overview */}
          <TabsContent value="overview">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">👨‍⚕️ Doctor Profile</h2>
              <p><strong>Specialty:</strong> {doctor.specialty || 'Not provided'}</p>
              <p><strong>Status:</strong> {statusText}</p>
              <p><strong>Verification:</strong> {doctor.is_verified ? '✅ Verified' : '❌ Not Verified'}</p>
              <p><strong>Consultation Fee:</strong> ₦{doctor.consultation_fee?.toLocaleString() || '0.00'}</p>
            </div>
          </TabsContent>

          {/* Tab: Appointments */}
          <TabsContent value="appointments">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-3">📅 Today’s Appointments</h2>
              {appointments.length > 0 ? (
                <ul className="space-y-2">
                  {appointments.map((appt, idx) => (
                    <li key={idx} className="border-b py-2">
                      {appt.patient} – {appt.status} – {appt.appointment_type} ({appt.consultation_mode})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No appointments today.</p>
              )}
            </div>
          </TabsContent>

          {/* Tab: Broadcasts */}
          <TabsContent value="broadcasts">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">📣 Latest Broadcast</h2>
              {broadcast ? (
                <>
                  <h4 className="text-lg font-bold">{broadcast.title}</h4>
                  <p className="mt-1">{broadcast.body}</p>
                  <small className="text-gray-500">Posted on {new Date(broadcast.created_at).toLocaleDateString()}</small>
                </>
              ) : (
                <p>No new broadcasts.</p>
              )}
            </div>
          </TabsContent>

          {/* Tab: Patients */}
          <TabsContent value="patients">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">🧑‍🤝‍🧑 Patients</h2>
              <p>Coming soon: Your patient list, recent interactions, and referrals.</p>
            </div>
          </TabsContent>

          {/* Tab: Notes */}
          <TabsContent value="notes">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">📝 Notes</h2>
              <p>Coming soon: Case notes, clinical summaries, and SOAP templates.</p>
            </div>
          </TabsContent>

          {/* Tab: Prescriptions */}
          <TabsContent value="prescriptions">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">💊 Prescriptions</h2>
              <p>Coming soon: Drug templates, repeat prescriptions, and pharmacy linkage.</p>
            </div>
          </TabsContent>

          {/* Tab: Earnings */}
          <TabsContent value="earnings">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">💼 Earnings</h2>
              <p>Coming soon: Consultation earnings, withdrawal requests, and ledger breakdown.</p>
            </div>
          </TabsContent>

          {/* Tab: Settings */}
          <TabsContent value="settings">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">⚙️ Settings</h2>
              <p>Coming soon: Account preferences, password reset, availability settings.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
