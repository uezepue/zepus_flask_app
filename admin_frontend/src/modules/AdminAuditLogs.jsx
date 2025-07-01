import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterAdmin, setFilterAdmin] = useState('');

  useEffect(() => {
    const levelQuery = filterLevel === 'all' ? '' : filterLevel;
    fetch(`/api/admin/auditlogs?level=${levelQuery}&admin=${filterAdmin}`)
      .then(res => res.json())
      .then(setLogs);
  }, [filterLevel, filterAdmin]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center text-[#0a5275] mb-6">Admin Audit Logs</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Select onValueChange={setFilterLevel} value={filterLevel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder="Enter admin name"
          value={filterAdmin}
          onChange={(e) => setFilterAdmin(e.target.value)}
          className="w-[200px]"
        />

        <Button onClick={() => {
          setFilterLevel(filterLevel);
          setFilterAdmin(filterAdmin);
        }}>
          Apply
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow">
          <thead className="bg-[#0a5275] text-white">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Admin</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Target</th>
              <th className="px-4 py-2">Level</th>
              <th className="px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{log.id}</td>
                <td className="border px-4 py-2">{log.admin}</td>
                <td className="border px-4 py-2">{log.action}</td>
                <td className="border px-4 py-2">{log.target}</td>
                <td className={`border px-4 py-2 font-bold ${log.level === 'high' ? 'text-red-600' : log.level === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}> 
                  {log.level.charAt(0).toUpperCase() + log.level.slice(1)}
                </td>
                <td className="border px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
