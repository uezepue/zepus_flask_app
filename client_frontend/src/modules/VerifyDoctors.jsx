import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function VerifyDoctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetch('/api/admin/unverified-doctors')
      .then(res => res.json())
      .then(setDoctors);
  }, []);

  const verifyDoctor = (doctorId, approve) => {
    const url = approve ? `/admin/approve-doctor/${doctorId}` : `/admin/reject-doctor/${doctorId}`;
    fetch(url, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'approved' || data.status === 'rejected') {
          setDoctors(prev => prev.filter(doc => doc.id !== doctorId));
        }
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center text-[#0a5275] mb-6">Verify Pending Doctors</h1>

      {doctors.length > 0 ? (
        doctors.map(doctor => (
          <div key={doctor.id} className="border rounded-lg p-4 mb-4 shadow bg-white" id={`doctor-${doctor.id}`}>
            <h3 className="text-lg font-semibold">{doctor.name} ({doctor.specialty})</h3>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Phone:</strong> {doctor.phone}</p>

            <div className="mt-2">
              <strong>Uploaded Documents:</strong>
              <ul className="list-disc ml-6">
                {doctor.license_path && (
                  <li><a href={`/admin/uploads/${doctor.license_path.split('/').pop()}`} target="_blank" rel="noopener noreferrer">License</a></li>
                )}
                {doctor.gov_id_path && (
                  <li><a href={`/admin/uploads/${doctor.gov_id_path.split('/').pop()}`} target="_blank" rel="noopener noreferrer">Government ID</a></li>
                )}
                {doctor.specialty_cert_path && (
                  <li><a href={`/admin/uploads/${doctor.specialty_cert_path.split('/').pop()}`} target="_blank" rel="noopener noreferrer">Specialty Certificate</a></li>
                )}
                {doctor.photo_path && (
                  <li><a href={`/admin/uploads/${doctor.photo_path.split('/').pop()}`} target="_blank" rel="noopener noreferrer">Passport Photo</a></li>
                )}
                {doctor.cv_path && (
                  <li><a href={`/admin/uploads/${doctor.cv_path.split('/').pop()}`} target="_blank" rel="noopener noreferrer">Curriculum Vitae</a></li>
                )}
              </ul>
            </div>

            <div className="flex gap-4 mt-4">
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => verifyDoctor(doctor.id, true)}>Approve</Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={() => verifyDoctor(doctor.id, false)}>Reject</Button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No unverified doctors at the moment.</p>
      )}
    </div>
  );
}
