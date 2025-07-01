import React, { useEffect, useState } from "react";

const AdminAnalytics = () => {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    fetch("/api/admin/analytics/summary")
      .then((res) => res.json())
      .then((data) => setSummary(data));
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f9fc] p-8">
      <h1 className="text-3xl text-center text-[#0a5275] font-bold mb-10">
        Admin Analytics
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(summary).map(([key, value]) => (
          <div
            key={key}
            className="bg-white p-6 rounded-2xl shadow-md text-center"
          >
            <h2 className="text-4xl text-[#0077b6] font-bold">{value}</h2>
            <p className="mt-2 text-sm font-semibold text-gray-700">
              {key.replace(/_/g, " ").toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnalytics;
