// pages/dashboard.tsx
import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    address: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const fetchApplications = async () => {
    const res = await fetch("/api/applications");
    const data = await res.json();
    setApps(data);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setShowForm(false);
    setFormData({ name: "", email: "", phone: "", education: "", address: "" });
    fetchApplications(); // refresh list
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, backgroundColor: "#1976d2", color: "#fff", padding: 20 }}>
        <h2 style={{ marginBottom: 20 }}>MVSI</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: 12, cursor: "pointer" }}>Dashboard</li>
            <li style={{ marginBottom: 12, cursor: "pointer" }}>Reports</li>
            <li style={{ marginBottom: 12, cursor: "pointer" }}>Settings</li>
            <li style={{ marginBottom: 12, fontWeight: "bold" }}>Applications</li>
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          style={{
            marginTop: 40,
            padding: "10px 20px",
            backgroundColor: "#fff",
            color: "#1976d2",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 32 }}>
        {/* Header with search + add */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
              width: "40%",
            }}
          />
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            + Add Application
          </button>
        </header>

        {/* Applications list */}
        <section>
          <h2 style={{ marginBottom: 16 }}>Application List</h2>
          {filteredApps.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <ul>
              {filteredApps.map((app) => (
                <li key={app._id}>
                  {app.name} — {app.email} — {app.phone}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Popup Form */}
        {showForm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ backgroundColor: "#fff", padding: 32, borderRadius: 8, width: 400 }}>
              <h2>Add Application</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ marginBottom: 12, padding: 8, width: "100%" }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ marginBottom: 12, padding: 8, width: "100%" }}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={{ marginBottom: 12, padding: 8, width: "100%" }}
                />
                <input
                  type="text"
                  name="education"
                  placeholder="Education Qualification"
                  value={formData.education}
                  onChange={handleChange}
                  style={{ marginBottom: 12, padding: 8, width: "100%" }}
                />
                <textarea
                  name="address"
                  placeholder="Contact Address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  style={{ marginBottom: 12, padding: 8, width: "100%" }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      marginRight: 12,
                      padding: "8px 16px",
                      backgroundColor: "#ccc",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
