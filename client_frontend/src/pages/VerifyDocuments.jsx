// VerifyDocuments.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerifyDocuments() {
  const [files, setFiles] = useState({
    license: null,
    gov_id: null,
    specialty_cert: null,
    photo: null,
    cv: null,
  });
  const [info, setInfo] = useState({
    folio_number: '',
  });
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleInfoChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!confirm) {
      setError('Please confirm that your documents are valid.');
      return;
    }

    const formData = new FormData();
    for (const key in files) {
      if (files[key]) formData.append(key, files[key]);
    }
    for (const key in info) {
      formData.append(key, info[key]);
    }

    try {
      const res = await fetch('/api/doctor/upload-documents', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSuccess('Documents uploaded successfully.');
        setTimeout(() => navigate('/doctor/dashboard'), 2000);
      } else {
        setError(data.message || 'Upload failed.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during upload.');
    }
  };

  return (
    <div className="form-container">
      <h2>Doctor Verification – Document Upload</h2>
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>MDCN Folio Number</label>
        <input name="folio_number" placeholder="Enter your MDCN folio number" required value={info.folio_number} onChange={handleInfoChange} />

        <label>Medical License</label>
        <input type="file" name="license" required onChange={handleFileChange} />

        <label>Government ID</label>
        <input type="file" name="gov_id" required onChange={handleFileChange} />

        <label>Specialty Certificate</label>
        <input type="file" name="specialty_cert" required onChange={handleFileChange} />

        <label>Passport Photo</label>
        <input type="file" name="photo" required onChange={handleFileChange} />

        <label>Curriculum Vitae (CV)</label>
        <input type="file" name="cv" required onChange={handleFileChange} />

        <label className="mt-4">
          <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} />{' '}
          I confirm that my uploaded documents are valid
        </label>

        <button type="submit" className="btn-primary mt-4">Submit Documents</button>
      </form>
    </div>
  );
}
