import React, { useState, useEffect } from 'react';
import statesAndLgas from '../data/statesAndLgas.json';

export default function PatientRegistration() {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', dob: '', age: '', sex: '', phone: '',
    email: '', password: '', confirmPassword: '', address: '', city: '',
    state: '', lga: '', state_of_origin: '', marital_status: '', occupation: '',
    tribe: '', religion: '', race: ''
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
      const res = await fetch('/api/patient/register', {
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
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center text-primary mb-4">🧑‍⚕️ Patient Registration</h2>

        {error && <div className="alert alert-error mb-4">{error}</div>}
        {success && <div className="alert alert-success mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="flex gap-4">
            <input name="first_name" value={formData.first_name} placeholder="First Name" required className="input input-bordered w-1/2" onChange={handleChange} />
            <input name="last_name" value={formData.last_name} placeholder="Last Name" required className="input input-bordered w-1/2" onChange={handleChange} />
          </div>

          <div className="flex gap-4">
            <input name="dob" type="date" value={formData.dob} required className="input input-bordered w-1/2" onChange={handleChange} />
            <input name="age" value={formData.age} readOnly placeholder="Age" className="input input-disabled w-1/2" />
          </div>

          <select name="sex" required value={formData.sex} className="select select-bordered w-full" onChange={handleChange}>
            <option value="">Select Sex</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input name="phone" value={formData.phone} placeholder="Phone Number" required className="input input-bordered w-full" onChange={handleChange} />
          <input name="email" value={formData.email} type="email" placeholder="Email" required className="input input-bordered w-full" onChange={handleChange} />

          <div className="flex gap-4">
            <input name="password" value={formData.password} type="password" placeholder="Password" required className="input input-bordered w-1/2" onChange={handleChange} />
            <input name="confirmPassword" value={formData.confirmPassword} type="password" placeholder="Confirm Password" required className="input input-bordered w-1/2" onChange={handleChange} />
          </div>

          <input name="address" value={formData.address} placeholder="Residential Address" required className="input input-bordered w-full" onChange={handleChange} />
          <input name="city" value={formData.city} placeholder="City" required className="input input-bordered w-full" onChange={handleChange} />
          <input name="occupation" value={formData.occupation} placeholder="Occupation" className="input input-bordered w-full" onChange={handleChange} />

          <select name="marital_status" value={formData.marital_status} className="select select-bordered w-full" onChange={handleChange}>
            <option value="">Select Marital Status</option>
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
            <option>Widowed</option>
          </select>

          <select name="state" required value={formData.state} className="select select-bordered w-full" onChange={handleChange}>
            <option value="">Select State</option>
            {statesAndLgas.map((s, idx) => (
              <option key={idx} value={s.state}>{s.state}</option>
            ))}
          </select>

          <select name="lga" required value={formData.lga} className="select select-bordered w-full" onChange={handleChange}>
            <option value="">Select LGA</option>
            {lgaOptions.map((lga, idx) => (
              <option key={idx} value={lga}>{lga}</option>
            ))}
          </select>

          <select name="state_of_origin" required value={formData.state_of_origin} className="select select-bordered w-full" onChange={handleChange}>
            <option value="">State of Origin</option>
            {statesAndLgas.map((s, idx) => (
              <option key={idx} value={s.state}>{s.state}</option>
            ))}
          </select>

          <input name="tribe" value={formData.tribe} placeholder="Tribe" className="input input-bordered w-full" onChange={handleChange} />
          <input name="religion" value={formData.religion} placeholder="Religion" className="input input-bordered w-full" onChange={handleChange} />
          <input name="race" value={formData.race} placeholder="Race" className="input input-bordered w-full" onChange={handleChange} />

          <button type="submit" disabled={loading} className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
