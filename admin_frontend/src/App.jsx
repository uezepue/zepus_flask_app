import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

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

import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* 🔐 Admin Login */}
      <Route path="/" element={<Login />} />

      {/* ✅ Protected Admin Pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctors"
        element={
          <ProtectedRoute>
            <AdminDoctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <AdminPatients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/broadcasts"
        element={
          <ProtectedRoute>
            <AdminBroadcasts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AdminAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/audit"
        element={
          <ProtectedRoute>
            <AuditLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance"
        element={
          <ProtectedRoute>
            <FinanceLedger />
          </ProtectedRoute>
        }
      />
      <Route
        path="/security"
        element={
          <ProtectedRoute>
            <Security />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <Support />
          </ProtectedRoute>
        }
      />
      <Route
        path="/system-status"
        element={
          <ProtectedRoute>
            <SystemStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/triage"
        element={
          <ProtectedRoute>
            <TriageLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verify-doctors"
        element={
          <ProtectedRoute>
            <VerifyDoctors />
          </ProtectedRoute>
        }
      />

      {/* ❌ Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
