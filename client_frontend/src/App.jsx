import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/patient" element={<PatientRegistration />} />
        <Route path="/register/doctor" element={<DoctorRegistration />} />

        {/* Patient Routes (Protected) */}
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

        {/* Doctor Routes (Protected) */}
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

        {/* Fallback */}
        <Route
          path="*"
          element={
            <h1 className="p-6 text-red-600 text-center">
              404 - Page Not Found
            </h1>
          }
        />
      </Routes>
    </Router>
  );
}
