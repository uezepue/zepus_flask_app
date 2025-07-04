// PatientRegistration.jsx
import React, { useState } from 'react';
import '../styles/FormStyles.css'; // Optional external styling

export default function PatientRegistration() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    dob: '',
    sex: '',
    marital_status: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Post form data to your backend
    fetch('/api/patient/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          alert('Registration successful!');
          window.location.href = '/login';
        } else {
          alert(data.message || 'Registration failed');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error occurred during registration');
      });
  };

  return (
    <div className="form-container">
      <h2>Register as a Patient</h2>
      <form onSubmit={handleSubmit}>
        <input name="first_name" placeholder="First Name" required onChange={handleChange} />
        <input name="last_name" placeholder="Last Name" required onChange={handleChange} />
        <input name="age" placeholder="Age" type="number" required onChange={handleChange} />
        <input name="dob" placeholder="Date of Birth" type="date" required onChange={handleChange} />
        <select name="sex" required onChange={handleChange}>
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select name="marital_status" required onChange={handleChange}>
          <option value="">Marital Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
        </select>
        <input name="address" placeholder="Address" required onChange={handleChange} />
        <input name="city" placeholder="City" required onChange={handleChange} />
        <input name="state" placeholder="State" required onChange={handleChange} />
        <input name="country" placeholder="Country" required onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" required onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" required onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" required onChange={handleChange} />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} />
        <button type="submit" className="btn-primary">Register</button>
      </form>
    </div>
  );
}
