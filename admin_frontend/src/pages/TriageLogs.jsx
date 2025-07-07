import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TriageLogs() {
  const [logs, setLogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [urgency, setUrgency] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetch("/api/admin/triage-logs")
      .then(res => res.json())
      .then(data => {
        setLogs(data.logs);
        setFiltered(data.logs);
      });
  }, []);

  useEffect(() => {
    let f = logs;
    if (urgency !== "all") f = f.filter(l => l.urgency === urgency);
    if (search) f = f.filter(l => l.patient_id.includes(search) || l.summary.toLowerCase().includes(search.toLowerCase()));
    if (startDate) f = f.filter(l => new Date(l.timestamp) >= new Date(startDate));
    if (endDate) f = f.filter(l => new Date(l.timestamp) <= new Date(endDate));
    setFiltered(f);
  }, [urgency, search, startDate, endDate, logs]);

  const exportCSV = () => {
    const headers = ["Patient ID", "Urgency", "Summary", "Timestamp"];
    const rows = filtered.map(log => [log.patient_id, log.urgency, log.summary, new Date(log.timestamp).toLocaleString()]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "triage_logs.csv";
    a.click();
  };

  const chartData = logs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartArray = Object.keys(chartData).map(date => ({ date, count: chartData[date] }));

  return (
    <div className="space-y-4 mt-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Triage Logs Overview</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <Input type="text" placeholder="Search by patient ID or summary" value={search} onChange={e => setSearch(e.target.value)} />
          <select value={urgency} onChange={e => setUrgency(e.target.value)}>
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} placeholder="Start date" />
          <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="End date" />
          <Button onClick={exportCSV}>Export CSV</Button>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartArray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4">
        <h3 className="text-md font-semibold mb-2">Recent Logs</h3>
        {filtered.length > 0 ? (
          filtered.map((log, i) => (
            <div key={i} className="border-b py-2">
              <p><strong>{log.patient_id}</strong> ({log.urgency.toUpperCase()})</p>
              <p>{log.summary}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">View Full</Button>
                </DialogTrigger>
                <DialogContent>
                  <pre>{JSON.stringify(log, null, 2)}</pre>
                </DialogContent>
              </Dialog>
            </div>
          ))
        ) : (
          <p>No logs found.</p>
        )}
      </Card>
    </div>
  );
}
