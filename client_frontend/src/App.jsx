import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// General Pages
import Home from './pages/Home';
import Login from './pages/Login';

// Registration
import PatientRegistration from './pages/PatientRegistration';
import DoctorRegistration from './pages/DoctorRegistration';

// Dashboards
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

// Chat Rooms & Extras
import PatientChatRoom from './pages/PatientChatRoom';
import DoctorChatRoom from './pages/DoctorChatRoom';
import TriageBotRoom from './pages/TriageBotRoom';
import VerifyDocuments from './pages/VerifyDocuments';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Registration */}
        <Route path="/register/patient" element={<PatientRegistration />} />
        <Route path="/register/doctor" element={<DoctorRegistration />} />

        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/chat" element={<PatientChatRoom />} />
        <Route path="/patient/triage" element={<TriageBotRoom />} />

        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/chat" element={<DoctorChatRoom />} />
        <Route path="/doctor/verify-documents" element={<VerifyDocuments />} />

        {/* Fallback */}
        <Route path="*" element={<h1 className="p-6 text-red-600 text-center">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}
