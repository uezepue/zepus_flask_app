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
      setError('❌ Please confirm that your documents are valid.');
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
    <div className="max-w-2xl mx-auto mt-10 bg-base-100 p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-center text-primary mb-6">🩺 Doctor Document Verification</h2>

      {error && <div className="alert alert-error mb-4">{error}</div>}
      {success && <div className="alert alert-success mb-4">{success}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
        <div>
          <label className="block font-medium mb-1">MDCN Folio Number</label>
          <input
            name="folio_number"
            type="text"
            required
            placeholder="Enter your MDCN folio number"
            value={info.folio_number}
            onChange={handleInfoChange}
            className="input input-bordered w-full"
          />
        </div>

        {[
          ['license', 'Medical License'],
          ['gov_id', 'Government Issued ID'],
          ['specialty_cert', 'Specialty Certificate'],
          ['photo', 'Passport Photo'],
          ['cv', 'Curriculum Vitae (CV)'],
        ].map(([field, label]) => (
          <div key={field}>
            <label className="block font-medium mb-1">{label}</label>
            <input type="file" name={field} required onChange={handleFileChange} className="file-input file-input-bordered w-full" />
          </div>
        ))}

        <div className="mt-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={confirm}
              onChange={(e) => setConfirm(e.target.checked)}
              className="checkbox checkbox-primary"
            />
            <span className="text-sm">I confirm that my uploaded documents are valid and truthful.</span>
          </label>
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-full ${success ? 'btn-success' : ''}`}
        >
          Submit Documents
        </button>
      </form>
    </div>
  );
}
