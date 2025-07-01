import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Clock, Server, Loader2 } from "lucide-react";

export default function SystemStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/system/status")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch system status:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">System Activity & Performance</h2>
      {loading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin w-4 h-4" />
          <span>Loading system metrics...</span>
        </div>
      ) : status ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-semibold">CPU Usage</h3>
                  <p className="text-xl">{status.cpu}%</p>
                  <Badge variant={status.cpu > 90 ? "destructive" : "default"}>Live</Badge>
                </div>
                <Cpu className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-semibold">Memory Usage</h3>
                  <p className="text-xl">{status.memory}%</p>
                  <Badge variant={status.memory > 90 ? "destructive" : "default"}>Live</Badge>
                </div>
                <Server className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-semibold">Uptime</h3>
                  <p className="text-xl">{status.uptime}</p>
                  <Badge>Active</Badge>
                </div>
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <p className="text-red-600">System data unavailable.</p>
      )}
    </div>
  );
}
