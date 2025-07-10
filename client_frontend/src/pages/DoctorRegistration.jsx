import React, { useState, useEffect } from 'react';
import statesAndLgas from '../data/statesAndLgas.json';

export default function DoctorRegistration() {
  const [formData, setFormData] = useState({
    name: '', dob: '', age: '', sex: '', specialty: '', qualification: '',
    bio: '', phone: '', email: '', password: '', confirmPassword: '',
    address_line: '', city: '', state: '', lga: '', state_of_origin: ''
  });

  const [lgaOptions, setLgaOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
    setLgaOptions(selected ? selected.lgas : []);
    if (!selected?.lgas.includes(formData.lga)) {
      setFormData(prev => ({ ...prev, lga: '' }));
    }
  }, [formData.state]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('❌ Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/doctor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSuccess('✅ Registration successful! Please check your email to verify.');
        setTimeout(() => window.location.href = '/login', 3000);
      } else {
        setError(data.message || '❌ Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('❌ An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Register as a Doctor</h2>

      {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}
      {success && <p className="text-green-600 text-sm text-center mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Full Name" required className="w-full p-3 border border-gray-300 rounded-md" onChange={handleChange} />

        <div className="flex gap-4">
          <input name="dob" type="date" required className="w-1/2 p-3 border border-gray-300 rounded-md" onChange={handleChange} />
          <input name="age" value={formData.age} readOnly placeholder="Age" className="w-1/2 p-3 bg-gray-100 border border-gray-200 rounded-md" />
        </div>

        <select name="sex" required value={formData.sex} className="w-full p-3 border border-gray-300 rounded-md" onChange={handleChange}>
          <option value="">Select Sex</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input name="specialty" placeholder="Specialty" required className="w-full p-3 border border-gray-300 rounded-md" onChange={handleChange} />
        <input name="qualification" placeholder="Qualification (e.g. MBBS, FWACS)" required className="w-full p-3 border border-gray-300 rounded-md" onChange={handleChange} />
        <textarea name="bio" rows="3" placeholder="Short Bio" className="w-full p-3 border border-gray-300 rounded-md" onChange={handleChange}></textarea>
        <input name="phone" placeholder="Phone Number" required className="w-full p-3 border border-gray-300 rounded-md" onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" required className="w-full p-3 border border-gray-300 rounded-md" onChange={handleChange} />

        <div className="flex gap-4">
          <input name="password" type="password" placeholder="Password" required className="w-1/2 p-3 border border-gray-300 rounded-md" onChange={handleChange} />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" required className="w-1/2 p-3 border border-gray-300 rounded-md" onChange={handleChange} />
        </div>

        <input name="address_line" placeholder="Residential Address" required className="w-full p-3 border border-gray-300 rounded-md" onChange={handleChange} />
        <input name="city" placeholder="City" required className="w-full p-3 border border-gray-300 rounded-md" onChange={handleChange} />

        <select name="state" required value={formData.state} className="w-full p-3 border border-gray-300 rounded-md" onChange={handleChange}>
          <option value="">Select State</option>
          {statesAndLgas.map((s, idx) => (
            <option key={idx} value={s.state}>{s.state}</option>
          ))}
        </select>

        <select name="lga" required value={formData.lga} className="w-full p-3 border border-gray-300 rounded-md" onChange={handleChange}>
          <option value="">Select LGA</option>
          {lgaOptions.map((lga, idx) => (
            <option key={idx} value={lga}>{lga}</option>
          ))}
        </select>

        <select name="state_of_origin" required value={formData.state_of_origin} className="w-full p-3 border border-gray-300 rounded-md" onChange={handleChange}>
          <option value="">State of Origin</option>
          {statesAndLgas.map((s, idx) => (
            <option key={idx} value={s.state}>{s.state}</option>
          ))}
        </select>

        <button type="submit" disabled={loading} className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded mt-2">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
