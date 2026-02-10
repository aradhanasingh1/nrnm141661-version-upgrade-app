import React, { useState } from "react";
import {
  IconButton,
  Typography,
  TextField,
  Button,
  MenuItem,
  Snackbar,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const roles = ["User", "Admin"];

const SignUpPage = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "User",
  });

  const [popupMessage, setPopupMessage] = useState("");
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Frontend validation
    if (!formData.username || !formData.password) {
      setPopupMessage("Username and password are required");
      setOpen(true);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setPopupMessage(data.message);
        setOpen(true);

        // ✅ Close form after success
        if (onClose) onClose();
      } else {
        setPopupMessage(data.error || "Registration failed");
        setOpen(true);
      }
    } catch (err) {
      setPopupMessage("Request failed. Please try again.");
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPopupMessage("");
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <IconButton
        style={{ position: "absolute", top: 8, right: 8 }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="headline" gutterBottom>
        Sign Up
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required // ✅ enforce mandatory
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required // ✅ enforce mandatory
        />
        <TextField
          select
          fullWidth
          margin="normal"
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "1rem" }}
        >
          Register
        </Button>
      </form>

      {/* ✅ Snackbar popup */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={<span>{popupMessage}</span>}
      />
    </div>
  );
};

export default SignUpPage;
