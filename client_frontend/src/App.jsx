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
import NotFound from './pages/NotFound';

import Services from './pages/Services';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Blog from './pages/Blog';
import FAQs from './pages/FAQs';

import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* ✅ Public Standalone Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/patient" element={<PatientRegistration />} />
      <Route path="/register/doctor" element={<DoctorRegistration />} />

      {/* ✅ Public Pages with Shared Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/faqs" element={<FAQs />} />
      </Route>

      {/* ✅ Protected Patient Routes */}
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

      {/* ✅ Protected Doctor Routes */}
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

      {/* ✅ Catch-All 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
