// client_frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ⬇️ Client Pages
import Home from './pages/Home';
import PatientRegistration from './pages/PatientRegistration';
import DoctorRegistration from './pages/DoctorRegistration';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientChatRoom from './pages/PatientChatRoom';
import DoctorChatRoom from './pages/DoctorChatRoom';

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

export default function App() {
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
        <Route path="/dashboard/doctor/chat" element={<DoctorChatRoom />} />

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
