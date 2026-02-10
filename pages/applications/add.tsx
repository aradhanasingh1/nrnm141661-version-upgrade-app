// pages/applications/add.tsx
import React, { useState } from "react";

export default function AddApplication() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    address: "",
  });

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
    window.location.href = "/dashboard"; // redirect back to dashboard
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Add Application</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: 400 }}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ marginBottom: 12, padding: 8 }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ marginBottom: 12, padding: 8 }}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          style={{ marginBottom: 12, padding: 8 }}
        />
        <input
          type="text"
          name="education"
          placeholder="Education Qualification"
          value={formData.education}
          onChange={handleChange}
          style={{ marginBottom: 12, padding: 8 }}
        />
        <textarea
          name="address"
          placeholder="Contact Address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          style={{ marginBottom: 12, padding: 8 }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Save
        </button>
      </form>
    </div>
  );
}
