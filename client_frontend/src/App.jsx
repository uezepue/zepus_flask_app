import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ⬇️ Client Pages
import Home from './pages/Home';
import PatientRegistration from './pages/PatientRegistration';
import DoctorRegistration from './pages/DoctorRegistration';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientChatRoom from './pages/PatientChatRoom';       // 🔄 Renamed: Live Chat with Doctor
import TriageBotRoom from './pages/TriageBotRoom';           // ✅ New: AI Triage Bot
import DoctorChatRoom from './pages/DoctorChatRoom';
import VerifyDocuments from './pages/VerifyDocuments';

// ⬇️ Admin Modules
import AdminPortal from './modules/AdminPortal';
import AdminDoctors from './modules/AdminDoctors';
import AdminPatients from './modules/AdminPatients';
import AdminBroadcasts from './modules/AdminBroadcasts';
import AdminSettings from './modules/AdminSettings';
import AdminAnalytics from './modules/AdminAnalytics';
import AuditLogs from './modules/AuditLogs';
import FinanceLedger from './modules/FinanceLedger';
import Security from './modules/Security';
import Support from './modules/Support';
import SystemStatus from './modules/SystemStatus';
import TriageLogs from './modules/TriageLogs';
import VerifyDoctors from './modules/VerifyDoctors';

// ⬇️ Auth Guard
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/check-auth')
      .then(res => res.json())
      .then(data => setUser(data.user || null))
      .catch(() => setUser(null));
  }, []);

  return (
    <Router>
      <Routes>
        {/* 🌍 Client Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register/patient" element={<PatientRegistration />} />
        <Route path="/register/doctor" element={<DoctorRegistration />} />
        <Route path="/dashboard/patient" element={<PatientDashboard />} />
        <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
        <Route path="/dashboard/patient/chat" element={<PatientChatRoom />} />
        <Route path="/dashboard/patient/triage-bot" element={<TriageBotRoom />} />
        <Route path="/dashboard/doctor/chat" element={<DoctorChatRoom />} />
        <Route
          path="/doctor/verify-documents"
          element={
            <ProtectedRoute user={user} allowedRole="doctor">
              <VerifyDocuments />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Admin Routes */}
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/admin/doctors" element={<AdminDoctors />} />
        <Route path="/admin/patients" element={<AdminPatients />} />
        <Route path="/admin/broadcasts" element={<AdminBroadcasts />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/audit" element={<AuditLogs />} />
        <Route path="/admin/finance" element={<FinanceLedger />} />
        <Route path="/admin/security" element={<Security />} />
        <Route path="/admin/support" element={<Support />} />
        <Route path="/admin/system-status" element={<SystemStatus />} />
        <Route path="/admin/triage" element={<TriageLogs />} />
        <Route path="/admin/verify-doctors" element={<VerifyDoctors />} />

        {/* ❌ 404 Fallback */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}
