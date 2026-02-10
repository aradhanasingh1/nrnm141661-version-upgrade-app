// pages/login.tsx
import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogContent,
} from "@material-ui/core";
import SignupPage from "../Signup/SignUp";
import { withRouter } from "next/router"; // ✅ legacy router

const LoginPage = ({ router }) => {   // ✅ router comes in as a prop
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openSignup, setOpenSignup] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Login success:", data);

      // ✅ Save token in localStorage
      localStorage.setItem("token", data.token);

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      setError(data.error || "Login failed");
    }
  } catch (err) {
    console.error("Request failed:", err);
    setError("Request failed. Please try again.");
  }
};


  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Grid container style={{ minHeight: "100vh" }}>
        {/* Left panel */}
        <Grid
          item
          xs={12}
          sm={6}
          style={{
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
            textAlign: "center",
          }}
        >
          <img src="/static/logo.png" alt="Company Logo" width={150} height={50} />
          <Typography variant="headline" style={{ marginTop: 24 }}>
            Welcome to...
          </Typography>
          <Typography variant="body1" style={{ marginTop: 16 }}>
            We’re thrilled to have you here. Stay up to date with the latest enhancements,
            notices, and tips to make your onboarding experience smooth and seamless.
          </Typography>
        </Grid>

        {/* Right panel (login form) */}
        <Grid
          item
          xs={12}
          sm={6}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          <Paper style={{ padding: 32, width: "100%", maxWidth: 400 }} elevation={3}>
            <Typography variant="headline" style={{ marginBottom: 8 }}>
              Login
            </Typography>
            <Typography variant="body1" style={{ marginBottom: 24 }}>
              Welcome! Login to get amazing discounts and offers only for you.
            </Typography>

            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ marginBottom: 16 }}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!error}
                helperText={error}
                style={{ marginBottom: 16 }}
              />

              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Remember me"
                style={{ marginBottom: 16 }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginBottom: 16 }}
              >
                LOGIN
              </Button>
            </form>

            <Typography variant="body2" align="center">
              New User?{" "}
              <span
                style={{ color: "#1976d2", cursor: "pointer" }}
                onClick={() => setOpenSignup(true)}
              >
                Signup
              </span>
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Signup Popup */}
      <Dialog
        open={openSignup}
        onClose={() => setOpenSignup(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <SignupPage onClose={() => setOpenSignup(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default withRouter(LoginPage); // ✅ wrap withRouter
