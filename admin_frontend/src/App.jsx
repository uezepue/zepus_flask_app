import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Admin Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Admin Modules (rename and import as needed)
import AdminDoctors from './pages/AdminDoctors';
import AdminPatients from './pages/AdminPatients';
import AdminBroadcasts from './pages/AdminBroadcasts';
import AdminSettings from './pages/AdminSettings';
import AdminAnalytics from './pages/AdminAnalytics';
import AuditLogs from './pages/AuditLogs';
import FinanceLedger from './pages/FinanceLedger';
import Security from './pages/Security';
import Support from './pages/Support';
import SystemStatus from './pages/SystemStatus';
import TriageLogs from './pages/TriageLogs';
import VerifyDoctors from './pages/VerifyDoctors';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 🔐 Admin Entry Point */}
        <Route path="/" element={<Login />} />

        {/* ✅ Admin Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctors" element={<AdminDoctors />} />
        <Route path="/patients" element={<AdminPatients />} />
        <Route path="/broadcasts" element={<AdminBroadcasts />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/audit" element={<AuditLogs />} />
        <Route path="/finance" element={<FinanceLedger />} />
        <Route path="/security" element={<Security />} />
        <Route path="/support" element={<Support />} />
        <Route path="/system-status" element={<SystemStatus />} />
        <Route path="/triage" element={<TriageLogs />} />
        <Route path="/verify-doctors" element={<VerifyDoctors />} />

        {/* ❌ Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
