import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Security() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/security/alerts")
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data.alerts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load security alerts:", err);
        setLoading(false);
      });
  }, []);

  const toggleLockAccount = (userId, lock, type) => {
    const endpoint = `/api/admin/security/${lock ? "lock" : "unlock"}-account/${userId}?type=${type}`;
    fetch(endpoint, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAlerts((prev) =>
            prev.map((a) =>
              a.userId === userId ? { ...a, accountLocked: lock } : a
            )
          );
        }
      })
      .catch((err) => console.error("Lock/Unlock failed:", err));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Security Alerts & Account Controls</h2>
      {loading ? (
        <p>Loading security data...</p>
      ) : alerts.length === 0 ? (
        <p>No current alerts or security concerns.</p>
      ) : (
        alerts.map((alert) => (
          <Card key={alert.id} className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-semibold">{alert.title}</h3>
                  <p className="text-sm text-gray-600">{alert.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Detected: {new Date(alert.timestamp).toLocaleString()}
                  </p>
                  <Badge variant="destructive" className="mt-2 inline-flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" /> {alert.level.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm">User ID: {alert.userId}</p>
                  {alert.accountLocked ? (
                    <Button
                      onClick={() => toggleLockAccount(alert.userId, false, alert.accountType)}
                      variant="outline"
                      className="mt-2"
                    >
                      <Unlock className="w-4 h-4 mr-1" /> Unlock
                    </Button>
                  ) : (
                    <Button
                      onClick={() => toggleLockAccount(alert.userId, true, alert.accountType)}
                      variant="destructive"
                      className="mt-2"
                    >
                      <Lock className="w-4 h-4 mr-1" /> Lock Account
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
