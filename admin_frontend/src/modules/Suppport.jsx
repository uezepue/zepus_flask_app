import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle, CircleSlash } from "lucide-react";

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/support/tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data.tickets || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load support tickets:", err);
        setLoading(false);
      });
  }, []);

  const updateTicketStatus = (ticketId, status) => {
    fetch(`/api/admin/support/ticket/${ticketId}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTickets((prev) =>
            prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
          );
        }
      })
      .catch((err) => console.error("Status update failed:", err));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Support Ticket Desk</h2>
      {loading ? (
        <p>Loading support tickets...</p>
      ) : tickets.length === 0 ? (
        <p>No unresolved support tickets at the moment.</p>
      ) : (
        tickets.map((ticket) => (
          <Card key={ticket.id} className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-md font-semibold mb-1">{ticket.subject}</h3>
                  <p className="text-sm text-gray-600 mb-1">{ticket.message}</p>
                  <p className="text-xs text-gray-500">From: {ticket.userType} #{ticket.userId}</p>
                  <Badge className="mt-2">{ticket.status}</Badge>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => updateTicketStatus(ticket.id, "in_progress")}
                    variant="outline"
                    disabled={ticket.status !== "open"}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" /> Mark In Progress
                  </Button>
                  <Button
                    onClick={() => updateTicketStatus(ticket.id, "resolved")}
                    variant="success"
                    disabled={ticket.status === "resolved"}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Mark Resolved
                  </Button>
                  <Button
                    onClick={() => updateTicketStatus(ticket.id, "closed")}
                    variant="destructive"
                  >
                    <CircleSlash className="w-4 h-4 mr-1" /> Close Ticket
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
