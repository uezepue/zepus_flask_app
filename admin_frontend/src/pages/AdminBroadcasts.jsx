import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger
} from "@/components/ui/select";

export default function AdminBroadcasts() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [group, setGroup] = useState("all");
  const [messages, setMessages] = useState([]);

  const loadBroadcasts = () => {
    fetch("/api/admin/broadcast/all")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(() => {
        alert("Failed to load broadcast messages.");
        setMessages([]);
      });
  };

  useEffect(() => {
    loadBroadcasts();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/admin/broadcast/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, target_group: group })
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Broadcast sent");
        setTitle("");
        setBody("");
        setGroup("all");
        loadBroadcasts();
      })
      .catch(() => {
        alert("Failed to send broadcast. Please try again.");
      });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Broadcast Manager</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-xl mb-10 space-y-4">
        <div>
          <Label className="block mb-1">Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label className="block mb-1">Message</Label>
          <Textarea
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        <div>
          <Label className="block mb-1">Target Group</Label>
          <Select value={group} onValueChange={setGroup}>
            <SelectTrigger>{group}</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="doctors">Doctors Only</SelectItem>
              <SelectItem value="patients">Patients Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">Send Broadcast</Button>
      </form>

      <div className="space-y-4">
        {messages.map((msg, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <h2 className="font-semibold text-lg text-blue-700">{msg.title}</h2>
              <p className="text-gray-700 mt-1">{msg.body}</p>
              <p className="text-sm text-gray-500 mt-2">
                Target: {msg.group?.toUpperCase()} | {new Date(msg.timestamp).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
