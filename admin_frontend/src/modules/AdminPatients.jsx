import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function PatientsModule() {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("/api/admin/patients")
      .then(res => res.json())
      .then(data => setPatients(data.patients));
  }, []);

  const filteredPatients = patients
    .filter(patient => filter === "all" || patient.status === filter)
    .filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.registered_at) - new Date(a.registered_at));

  const paginatedPatients = filteredPatients.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const exportPatients = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Status", "Registered At", "Gender", "Age"];
    const rows = filteredPatients.map(p => [
      p.id,
      p.name,
      p.email,
      p.phone,
      p.status,
      new Date(p.registered_at).toLocaleString(),
      p.gender || "",
      p.age || ""
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "patients.csv";
    link.click();
  };

  const handleStatusToggle = (id, status) => {
    const newStatus = status === "active" ? "suspended" : "active";
    fetch(`/api/admin/patient-status/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(() => {
        setPatients(prev =>
          prev.map(p =>
            p.id === id ? { ...p, status: newStatus } : p
          )
        );
      });
  };

  const renderStatusBadge = (status) => {
    const color = status === "active" ? "green" : "red";
    return <Badge className={`bg-${color}-100 text-${color}-700 ml-2`}>{status}</Badge>;
  };

  const summaryStats = {
    total: patients.length,
    active: patients.filter(p => p.status === "active").length,
    suspended: patients.filter(p => p.status === "suspended").length,
    today: patients.filter(p => new Date(p.registered_at).toDateString() === new Date().toDateString()).length,
  };

  return (
    <div className="mt-4 space-y-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Patient Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Card className="p-2 text-center">Total: {summaryStats.total}</Card>
          <Card className="p-2 text-center">Active: {summaryStats.active}</Card>
          <Card className="p-2 text-center">Suspended: {summaryStats.suspended}</Card>
          <Card className="p-2 text-center">New Today: {summaryStats.today}</Card>
        </div>

        <div className="mb-4 flex items-center space-x-4">
          <label>Filter by status:</label>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border p-1 rounded"
          />
          <Button onClick={exportPatients}>Export CSV</Button>
        </div>

        {paginatedPatients.length > 0 ? (
          <div className="space-y-3">
            {paginatedPatients.map(patient => (
              <div key={patient.id} className="border p-3 rounded">
                <p><strong>{patient.name}</strong> (ID: {patient.id}) {renderStatusBadge(patient.status)}</p>
                <p>Email: {patient.email} | Phone: {patient.phone}</p>
                <p>Registered: {new Date(patient.registered_at).toLocaleDateString()}</p>
                <p>Gender: {patient.gender || "-"} | Age: {patient.age || "-"}</p>
                <div className="mt-2 space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedPatient(patient)}>View Profile</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <pre>{JSON.stringify(selectedPatient, null, 2)}</pre>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={() => handleStatusToggle(patient.id, patient.status)}>
                    {patient.status === "active" ? "Suspend" : "Activate"}
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-between mt-4">
              <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <span>Page {page}</span>
              <Button
                disabled={page * itemsPerPage >= filteredPatients.length}
                onClick={() => setPage(p => p + 1)}
              >Next</Button>
            </div>
          </div>
        ) : (
          <p>No patients match the selected filters.</p>
        )}
      </Card>
    </div>
  );
}
