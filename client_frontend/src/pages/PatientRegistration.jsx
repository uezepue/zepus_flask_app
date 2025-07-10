import React, { useState, useEffect } from 'react';
import statesAndLgas from '../data/statesAndLgas.json';

export default function PatientRegistration() {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', age: '', dob: '', sex: '', marital_status: '',
    address: '', city: '', state: '', lga: '', country: 'Nigeria',
    phone: '', email: '', password: '', confirmPassword: ''
  });

  const [availableLGAs, setAvailableLGAs] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      setFormData(prev => ({ ...prev, age }));
    }
  }, [formData.dob]);

  useEffect(() => {
    const selected = statesAndLgas.find(s => s.state === formData.state);
    const lgas = selected ? selected.lgas : [];
    setAvailableLGAs(lgas);
    if (!lgas.includes(formData.lga)) {
      setFormData(prev => ({ ...prev, lga: '' }));
    }
  }, [formData.state]);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/patient/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSuccess('✅ Registration successful! Check your email to verify.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('Error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-800">Register as a Patient</h2>

      {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}
      {success && <p className="text-green-600 text-sm text-center mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="first_name" placeholder="First Name" required onChange={handleChange} className="p-3 border border-gray-300 rounded-md" />
          <input name="last_name" placeholder="Last Name" required onChange={handleChange} className="p-3 border border-gray-300 rounded-md" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input name="dob" type="date" required onChange={handleChange} className="p-3 border border-gray-300 rounded-md" />
          <input name="age" type="number" readOnly value={formData.age} className="p-3 bg-gray-100 border border-gray-300 rounded-md" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select name="sex" required onChange={handleChange} className="p-3 border border-gray-300 rounded-md">
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select name="marital_status" required onChange={handleChange} className="p-3 border border-gray-300 rounded-md">
            <option value="">Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>

        <input name="address" placeholder="Address" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
        <input name="city" placeholder="City" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />

        <select name="state" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md">
          <option value="">Select State</option>
          {statesAndLgas.map(s => (
            <option key={s.state} value={s.state}>{s.state}</option>
          ))}
        </select>

        {availableLGAs.length > 0 && (
          <select name="lga" required value={formData.lga} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md">
            <option value="">Select LGA</option>
            {availableLGAs.map(lga => (
              <option key={lga} value={lga}>{lga}</option>
            ))}
          </select>
        )}

        <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
        <input name="phone" placeholder="Phone Number" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
        <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />

        <div className="grid grid-cols-2 gap-4">
          <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="p-3 border border-gray-300 rounded-md" />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} className="p-3 border border-gray-300 rounded-md" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full ${isSubmitting ? 'bg-blue-300' : 'bg-blue-700 hover:bg-blue-800'} text-white py-2 px-4 rounded`}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
