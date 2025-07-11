import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import PatientRegistration from './pages/PatientRegistration';
import DoctorRegistration from './pages/DoctorRegistration';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientChatRoom from './pages/PatientChatRoom';
import DoctorChatRoom from './pages/DoctorChatRoom';
import TriageBotRoom from './pages/TriageBotRoom';
import VerifyDocuments from './pages/VerifyDocuments';
import NotFound from './pages/NotFound'; // ✅ Import the custom 404 page

import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/patient" element={<PatientRegistration />} />
      <Route path="/register/doctor" element={<DoctorRegistration />} />

      {/* Protected Patient Routes */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute role="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/chat"
        element={
          <ProtectedRoute role="patient">
            <PatientChatRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/triage"
        element={
          <ProtectedRoute role="patient">
            <TriageBotRoom />
          </ProtectedRoute>
        }
      />

      {/* Protected Doctor Routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/chat"
        element={
          <ProtectedRoute role="doctor">
            <DoctorChatRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/verify-documents"
        element={
          <ProtectedRoute role="doctor">
            <VerifyDocuments />
          </ProtectedRoute>
        }
      />

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
