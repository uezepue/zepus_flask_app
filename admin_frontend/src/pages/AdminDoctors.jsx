import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck } from "lucide-react";

export default function DoctorsModule() {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [pendingFilter, setPendingFilter] = useState("all");
  const [approvedFilter, setApprovedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/admin/pending-doctors")
      .then(res => res.json())
      .then(data => setPendingDoctors(data.doctors || []));

    fetch("/api/admin/approved-doctors?status=approved&specialty=all")
      .then(res => res.json())
      .then(data => setApprovedDoctors(data.doctors || []));
  }, []);

  const handleVerify = (id, approve) => {
    const url = approve
      ? `/admin/approve-doctor/${id}`
      : `/admin/reject-doctor/${id}`;
    fetch(url, { method: "POST" })
      .then(res => res.json())
      .then(() => {
        setPendingDoctors(prev => prev.filter(doc => doc.id !== id));
      });
  };

  const renderStatusBadge = (status) => {
    const colorMap = {
      expired: "bg-red-100 text-red-700",
      flagged: "bg-yellow-100 text-yellow-700",
      pending: "bg-gray-100 text-gray-700"
    };
    return <Badge className={`${colorMap[status] || "bg-gray-100 text-gray-700"} ml-2`}>{status}</Badge>;
  };

  const filterDoctors = (doctors, status, term = "") => {
    let result = status === "all"
      ? doctors
      : doctors.filter(doc => doc.status === status);

    if (term.trim()) {
      result = result.filter(doc =>
        doc.name.toLowerCase().includes(term.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(term.toLowerCase())
      );
    }

    return result.sort((a, b) =>
      new Date(b.registered_at) - new Date(a.registered_at)
    );
  };

  const exportDoctors = (doctors, type) => {
    const headers = ["Name", "Specialty", "Email", "Phone", "Status"];
    const rows = doctors.map(doc => [
      doc.name,
      doc.specialty,
      doc.email,
      doc.phone,
      doc.status
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}-doctors.csv`;
    link.click();
  };

  return (
    <div className="mt-4 space-y-8">
      {/* Pending Doctors */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Pending Doctor Verifications</h3>
        <div className="flex items-center space-x-4 mb-4">
          <label>Filter:</label>
          <select
            value={pendingFilter}
            onChange={(e) => setPendingFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
            <option value="expired">Expired</option>
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name/specialty"
            className="border rounded px-2 py-1"
          />
          <Button onClick={() => exportDoctors(pendingDoctors, "pending")}>
            Export CSV
          </Button>
        </div>

        {filterDoctors(pendingDoctors, pendingFilter, searchTerm).length > 0 ? (
          filterDoctors(pendingDoctors, pendingFilter, searchTerm).map(doc => (
            <div key={doc.id} className="border p-3 rounded mb-3">
              <p><strong>{doc.name}</strong> ({doc.specialty}) {renderStatusBadge(doc.status)}</p>
              <p>Email: {doc.email} | Phone: {doc.phone}</p>
              <div className="flex flex-wrap space-x-2 mt-2 text-blue-600">
                {doc.license_path && <a href={`/uploads/${doc.license_path}`} target="_blank" rel="noopener noreferrer">License</a>}
                {doc.gov_id_path && <a href={`/uploads/${doc.gov_id_path}`} target="_blank" rel="noopener noreferrer">ID</a>}
                {doc.specialty_cert_path && <a href={`/uploads/${doc.specialty_cert_path}`} target="_blank" rel="noopener noreferrer">Certificate</a>}
                {doc.photo_path && <a href={`/uploads/${doc.photo_path}`} target="_blank" rel="noopener noreferrer">Photo</a>}
                {doc.cv_path && <a href={`/uploads/${doc.cv_path}`} target="_blank" rel="noopener noreferrer">CV</a>}
              </div>
              <div className="mt-2 space-x-2">
                <Button onClick={() => handleVerify(doc.id, true)}>Approve</Button>
                <Button variant="destructive" onClick={() => handleVerify(doc.id, false)}>Reject</Button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending doctors match the selected filters.</p>
        )}
      </Card>

      {/* Approved Doctors */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Approved Doctors</h3>
        <div className="flex items-center space-x-4 mb-4">
          <label>Filter:</label>
          <select
            value={approvedFilter}
            onChange={(e) => setApprovedFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
            <option value="expired">Expired</option>
          </select>
          <Button onClick={() => exportDoctors(approvedDoctors, "approved")}>
            Export CSV
          </Button>
        </div>

        {filterDoctors(approvedDoctors, approvedFilter).length > 0 ? (
          filterDoctors(approvedDoctors, approvedFilter).map(doc => (
            <div key={doc.id} className="border-b py-2">
              <p>{doc.name} ({doc.specialty}) {renderStatusBadge(doc.status)}</p>
            </div>
          ))
        ) : (
          <p>No approved doctors match the selected filters.</p>
        )}
      </Card>
    </div>
  );
}
