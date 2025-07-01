import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function FinanceLedger() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetch("/api/admin/ledger")
      .then(res => res.json())
      .then(data => setEntries(data.entries));
  }, []);

  const filtered = entries.filter(e => {
    const dateCheck = (!startDate || new Date(e.date) >= new Date(startDate)) && (!endDate || new Date(e.date) <= new Date(endDate));
    const searchCheck = search === "" || e.description.toLowerCase().includes(search.toLowerCase()) || e.transaction_id.includes(search);
    return dateCheck && searchCheck;
  });

  const totalCredits = filtered.filter(e => e.type === "credit").reduce((sum, e) => sum + e.amount, 0);
  const totalDebits = filtered.filter(e => e.type === "debit").reduce((sum, e) => sum + e.amount, 0);
  const balance = totalCredits - totalDebits;

  return (
    <div className="space-y-4 mt-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Company Ledger</h3>
        <div className="flex gap-2 mb-4">
          <Input type="text" placeholder="Search by transaction or description" value={search} onChange={e => setSearch(e.target.value)} />
          <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <Card className="p-2">Total Credits: ₦{totalCredits.toLocaleString()}</Card>
          <Card className="p-2">Total Debits: ₦{totalDebits.toLocaleString()}</Card>
          <Card className="p-2 font-bold">Balance: ₦{balance.toLocaleString()}</Card>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Source</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Transaction ID</th>
                <th className="px-4 py-2">View</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{entry.date}</td>
                  <td className={`px-4 py-2 ${entry.type === "credit" ? "text-green-600" : "text-red-600"}`}>{entry.type.toUpperCase()}</td>
                  <td className="px-4 py-2">₦{entry.amount.toLocaleString()}</td>
                  <td className="px-4 py-2">{entry.source}</td>
                  <td className="px-4 py-2">{entry.description}</td>
                  <td className="px-4 py-2">{entry.transaction_id}</td>
                  <td className="px-4 py-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <pre>{JSON.stringify(entry, null, 2)}</pre>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
