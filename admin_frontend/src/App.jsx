// admin_frontend/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Admin Modules
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
        <Route path="/" element={<AdminPortal />} />
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

        {/* Fallback */}
        <Route path="*" element={<h2>404 - Admin Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}
