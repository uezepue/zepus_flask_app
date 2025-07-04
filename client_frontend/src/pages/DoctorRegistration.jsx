// client_frontend/src/pages/DoctorRegistration.jsx
import React, { useState } from 'react';
import '../styles/FormStyles.css'; // Ensure this path is correct

export default function DoctorRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    bio: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [documents, setDocuments] = useState({
    license: null,
    gov_id: null,
    specialty_cert: null,
    photo: null,
    cv: null,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setDocuments({ ...documents, [e.target.name]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const fullForm = new FormData();
    for (const key in formData) {
      fullForm.append(key, formData[key]);
    }
    for (const key in documents) {
      if (documents[key]) fullForm.append(key, documents[key]);
    }

    try {
      const res = await fetch('/api/doctor/register', {
        method: 'POST',
        body: fullForm,
      });

      const data = await res.json();

      if (data.status === 'success') {
        alert('Registration successful. Awaiting verification.');
        window.location.href = '/dashboard/doctor'; // or '/doctor/login'
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred during registration');
    }
  };

  return (
    <div className="form-container">
      <h2>Register as a Doctor</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="name" placeholder="Full Name" required onChange={handleChange} />
        <input name="specialty" placeholder="Specialty" required onChange={handleChange} />
        <textarea name="bio" placeholder="Short Bio" rows="3" onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" required onChange={handleChange} />
        <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" required onChange={handleChange} />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} />

        <label>Upload License</label>
        <input type="file" name="license" onChange={handleFileChange} />
        <label>Upload Government ID</label>
        <input type="file" name="gov_id" onChange={handleFileChange} />
        <label>Upload Specialty Certificate</label>
        <input type="file" name="specialty_cert" onChange={handleFileChange} />
        <label>Upload Passport Photo</label>
        <input type="file" name="photo" onChange={handleFileChange} />
        <label>Upload CV</label>
        <input type="file" name="cv" onChange={handleFileChange} />

        <button type="submit" className="btn-primary">Register</button>
      </form>
    </div>
  );
}
