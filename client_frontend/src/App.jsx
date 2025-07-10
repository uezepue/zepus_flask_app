import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import VerifyDocuments from './pages/VerifyDocuments';
import DoctorChatRoom from './pages/DoctorChatRoom';
import PatientChatRoom from './pages/PatientChatRoom';
import TriageBotRoom from './pages/TriageBotRoom';
import DoctorRegistration from './pages/DoctorRegistration';
import PatientRegistration from './pages/PatientRegistration';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/patient" element={<PatientRegistration />} />
        <Route path="/register/doctor" element={<DoctorRegistration />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/patient/chat" element={<PatientChatRoom />} />
        <Route path="/doctor/chat" element={<DoctorChatRoom />} />
        <Route path="/patient/triage" element={<TriageBotRoom />} />
        <Route path="/doctor/verify-documents" element={<VerifyDocuments />} />
      </Routes>
    </Router>
  );
}
