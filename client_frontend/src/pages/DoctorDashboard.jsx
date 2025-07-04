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
        setError('Failed to load doctor dashboard. Please check that the /api/doctor/dashboard endpoint exists and returns correct data.');
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

  if (error) return <div className="error">{error}</div>;
  if (!doctor) return <div>Loading...</div>;

  return (
    <div>
      <header className="top-bar">
        <div>ZEPUS Clinics – Doctor Dashboard</div>
        <div>
          <a href="/">Home</a> | <a href="#">My Profile</a> | 
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#0077b6', cursor: 'pointer', paddingLeft: '8px' }}>
            Logout
          </button>
        </div>
      </header>

      {(doctor.status === 'pending' || doctor.status === 'flagged' || doctor.status === 'expired') && (
        <div className="banner">
          ⚠️ Your account is <strong>{doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}</strong>.&nbsp;
          {doctor.status === 'flagged' && 'Please correct issues with your documents and re-submit for verification.'}
          {doctor.status === 'expired' && 'Some documents have expired. Please re-upload updated versions.'}
          {doctor.status === 'pending' && 'Your account is pending admin approval.'}
        </div>
      )}

      <div className="container">
        <aside>
          <ul>
            <li><Link to="/doctor/dashboard">🏠 Dashboard Home</Link></li>
            <li><a href="#">🗓️ Appointments</a></li>
            <li><a href="#">🧑‍⚕️ My Patients</a></li>
            <li><a href="#">📋 Notes</a></li>
            <li><a href="#">💊 Prescriptions</a></li>
            <li><a href="#">📂 Uploaded Results</a></li>
            <li><a href="#">📨 Follow-Up Messages</a></li>
            <li><a href="#">💼 Earnings</a></li>
            <li><a href="#">📣 Broadcasts</a></li>
            <li><a href="#">⚙️ Settings</a></li>
            <li><Link to="/doctor/chatroom">💬 Chatroom</Link></li>
          </ul>
        </aside>

        <main>
          <div className="card">
            <h2>Welcome, Dr. {doctor.name}</h2>
            <p>Specialty: {doctor.specialty}</p>
            <p>Status: <strong>{doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}</strong></p>
            <p>Verification: {doctor.is_verified ? '✅ Verified' : '❌ Not Verified'}</p>
            <p>Consultation Fee: ${doctor.consultation_fee?.toFixed(2) || '0.00'}</p>
          </div>

          {(doctor.status === 'flagged' || doctor.status === 'expired' || doctor.status === 'pending') && (
            <div className="card">
              <h3>📑 Upload or Re-Upload Documents</h3>
              <form action="/doctor/verify-documents" method="POST" encType="multipart/form-data">
                <label>Medical License:</label><input type="file" name="license" /><br /><br />
                <label>Government ID:</label><input type="file" name="gov_id" /><br /><br />
                <label>Specialty Certificate:</label><input type="file" name="specialty_cert" /><br /><br />
                <label>Passport Photo:</label><input type="file" name="photo" /><br /><br />
                <label>CV:</label><input type="file" name="cv" /><br /><br />
                <label><input type="checkbox" name="confirm" /> I confirm that my documents are valid</label><br /><br />
                <button type="submit">Submit Documents</button>
              </form>
            </div>
          )}

          {doctor.is_verified && (
            <>
              <div className="card">
                <h3>📅 Today’s Appointments</h3>
                <p>You have {appointments.length} appointments today.</p>
              </div>

              <div className="card">
                <h3>📣 Latest Admin Broadcast</h3>
                {broadcast ? (
                  <>
                    <strong>{broadcast.title}</strong>
                    <p>{broadcast.body}</p>
                    <small>Posted on {broadcast.created_at}</small>
                  </>
                ) : <p>No recent broadcasts.</p>}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
