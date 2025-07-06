import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

export default function VerifyDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

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

  const specialties = [...new Set(doctors.map(d => d.specialty))];
  let filtered = filterSpecialty === "all" ? doctors : doctors.filter(d => d.specialty === filterSpecialty);
  filtered = filtered.sort((a, b) =>
    sortOrder === "desc"
      ? new Date(b.registered_at) - new Date(a.registered_at)
      : new Date(a.registered_at) - new Date(b.registered_at)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center text-[#0a5275] mb-6">Verify Pending Doctors</h1>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filter by Specialty:</label>
          <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choose specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {specialties.map((s, i) => (
                <SelectItem key={i} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort by:</label>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length > 0 ? (
        filtered.map(doctor => (
          <div key={doctor.id} className="border rounded-lg p-4 mb-4 shadow bg-white" id={`doctor-${doctor.id}`}>
            <h3 className="text-lg font-semibold">{doctor.name} ({doctor.specialty})</h3>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Phone:</strong> {doctor.phone}</p>
            <p className="text-sm text-gray-500">
              <strong>Registered:</strong> {new Date(doctor.registered_at).toLocaleString()} 
              {doctor.country && ` | ${doctor.country}`}
            </p>
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 mt-1 rounded-full text-xs">
              Pending since {new Date(doctor.registered_at).toLocaleDateString()}
            </span>

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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => setSelectedDoctor({ ...doctor, approve: true })}>
                    Approve
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <p>Are you sure you want to <strong>APPROVE</strong> Dr. {selectedDoctor?.name}?</p>
                  <Button className="mt-4 w-full bg-green-600 hover:bg-green-700"
                    onClick={() => verifyDoctor(selectedDoctor.id, true)}>
                    Confirm Approval
                  </Button>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700" onClick={() => setSelectedDoctor({ ...doctor, approve: false })}>
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <p>Are you sure you want to <strong>REJECT</strong> Dr. {selectedDoctor?.name}?</p>
                  <Button className="mt-4 w-full bg-red-600 hover:bg-red-700"
                    onClick={() => verifyDoctor(selectedDoctor.id, false)}>
                    Confirm Rejection
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No unverified doctors at the moment.</p>
      )}
    </div>
  );
}
