// pages/applications/index.tsx
import React, { useEffect, useState } from "react";

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => setApps(data));
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1>Applications</h1>
      <button
        onClick={() => (window.location.href = "/applications/add")}
        style={{ marginBottom: 20, padding: "10px 20px", backgroundColor: "#1976d2", color: "#fff" }}
      >
        Add Application
      </button>
      <ul>
        {apps.map((app) => (
          <li key={app._id}>
            {app.name} — {app.email} — {app.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}
