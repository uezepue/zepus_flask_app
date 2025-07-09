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

  const [info, setInfo] = useState({ folio_number: '' });
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
        setSuccess('✅ Documents uploaded successfully.');
        setTimeout(() => navigate('/doctor/dashboard'), 2000);
      } else {
        setError(data.message || '❌ Upload failed.');
      }
    } catch (err) {
      console.error(err);
      setError('❌ An error occurred during upload.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold text-center text-blue-800 mb-6">🩺 Doctor Verification</h2>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-600 mb-4 text-center">{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <div>
          <label className="block font-medium mb-1">MDCN Folio Number</label>
          <input
            name="folio_number"
            type="text"
            required
            placeholder="Enter your MDCN folio number"
            value={info.folio_number}
            onChange={handleInfoChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Medical License</label>
          <input type="file" name="license" required onChange={handleFileChange} className="w-full" />
        </div>

        <div>
          <label className="block font-medium mb-1">Government ID</label>
          <input type="file" name="gov_id" required onChange={handleFileChange} className="w-full" />
        </div>

        <div>
          <label className="block font-medium mb-1">Specialty Certificate</label>
          <input type="file" name="specialty_cert" required onChange={handleFileChange} className="w-full" />
        </div>

        <div>
          <label className="block font-medium mb-1">Passport Photo</label>
          <input type="file" name="photo" required onChange={handleFileChange} className="w-full" />
        </div>

        <div>
          <label className="block font-medium mb-1">Curriculum Vitae (CV)</label>
          <input type="file" name="cv" required onChange={handleFileChange} className="w-full" />
        </div>

        <div className="mt-4">
          <label className="inline-flex items-center">
            <input type="checkbox" checked={confirm} onChange={e => setConfirm(e.target.checked)} className="mr-2" />
            I confirm that my uploaded documents are valid.
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded mt-4"
        >
          Submit Documents
        </button>
      </form>
    </div>
  );
}
