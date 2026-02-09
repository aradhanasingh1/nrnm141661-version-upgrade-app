import React from "react"
import Router from "next/router"

import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import InputAdornment from "@material-ui/core/InputAdornment"

import EmailIcon from "@material-ui/icons/Email"
import LockIcon from "@material-ui/icons/Lock"

interface State {
  email: string
  password: string
  error: string | null
  loading: boolean
}

class LoginPage extends React.Component<{}, State> {
  state: State = {
    email: "",
    password: "",
    error: null,
    loading: false
  }

  handleChange = (name: keyof State) => (event: any) => {
    this.setState({ [name]: event.target.value } as any)
  }

  handleSubmit = async () => {
    this.setState({ loading: true, error: null })

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        this.setState({
          loading: false,
          error: data.message || "Login failed"
        })
        return
      }

      if (data.role === "ADMIN") Router.push("/admin")
      else if (data.role === "UNDERWRITER") Router.push("/underwriter")
      else Router.push("/applications")
    } catch (err) {
      this.setState({
        loading: false,
        error: "Network error"
      })
    }
  }

  render() {
    return (
      <div style={styles.page}>
        {/* Keyframes injected safely */}
        <style>{css}</style>

        <Paper style={styles.card} elevation={6}>
          {/* TOP BAR */}
          <div style={styles.topBar}>
            <div style={styles.brandRow}>
              <div style={styles.fakeLogo}>MVSi</div>
              <div>
                <Typography style={styles.brandTitle}>
                  Customer Support Centre
                </Typography>
                <Typography style={styles.brandSubTitle}>
                  How can we help you today?
                </Typography>
              </div>
            </div>
          </div>

          <Divider />

          {/* MAIN BODY */}
          <div style={styles.body}>
            {/* LEFT */}
            <div style={styles.left}>
              {/* ✅ Animated Infinity */}
              <div style={styles.infinityWrap}>
                <div style={styles.infinityGlow} />
                <div style={styles.infinityIcon}>∞</div>
              </div>

              <Typography style={styles.welcomeTitle}>
                Welcome to OnBoard!
              </Typography>

              <Typography style={styles.welcomeText}>
                The world’s most powerful onboarding tool. In this notification
                panel we’ll keep you up to date on enhancements and notices.
                <br />
                <br />
                <b>Current notices:</b> None
              </Typography>

              <div style={styles.footerLeft}>
                <Typography style={styles.smallMuted}>v4.54.2-1</Typography>
                <Typography style={styles.smallMuted}>Powered by MVSI</Typography>
              </div>
            </div>

            {/* RIGHT */}
            <div style={styles.right}>
              <Typography style={styles.signInTitle}>Sign in</Typography>

              <div style={{ marginTop: 18 }}>
                <TextField
                  fullWidth
                  label="Email *"
                  value={this.state.email}
                  onChange={this.handleChange("email")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </div>

              <div style={{ marginTop: 18 }}>
                <TextField
                  fullWidth
                  label="Password *"
                  type="password"
                  value={this.state.password}
                  onChange={this.handleChange("password")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </div>

              {this.state.error && (
                <Typography style={styles.error}>{this.state.error}</Typography>
              )}

              <Button
                fullWidth
                variant="outlined"
                color="primary"
                style={styles.primaryButton}
                disabled={this.state.loading}
                onClick={this.handleSubmit}
              >
                {this.state.loading ? "SIGNING IN..." : "SIGN IN"}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="primary"
                style={styles.secondaryButton}
                onClick={() => alert("Not implemented")}
              >
                AD SIGN IN
              </Button>

              <Button
                fullWidth
                variant="outlined"
                style={styles.resetButton}
                onClick={() => alert("Not implemented")}
              >
                RESET PASSWORD
              </Button>

              <Button
                fullWidth
                style={styles.registerLink}
                onClick={() => Router.push("/register")}
              >
                Create Account
              </Button>
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}

/**
 * ✅ CSS animations (safe in Next 6)
 * No external library needed
 */
const css = `
@keyframes mvsiFloat {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
}

@keyframes mvsiPulse {
  0% { transform: scale(1); opacity: 0.25; }
  50% { transform: scale(1.15); opacity: 0.45; }
  100% { transform: scale(1); opacity: 0.25; }
}
`

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#f2f2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },

  card: {
    width: 980,
    maxWidth: "100%",
    borderRadius: 4,
    overflow: "hidden"
  },

  topBar: {
    padding: "14px 22px",
    background: "#fff"
  },

  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 14
  },

  fakeLogo: {
    width: 64,
    height: 34,
    borderRadius: 4,
    background: "#e9e9e9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    letterSpacing: 1
  },

  brandTitle: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: "16px"
  },

  brandSubTitle: {
    fontSize: 12,
    color: "#777"
  },

  body: {
    display: "flex",
    minHeight: 420
  },

  left: {
    flex: 1,
    padding: 36,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },

  /** ✅ Infinity animation wrapper */
  infinityWrap: {
    position: "relative",
    width: 260,
    height: 120,
    margin: "-15px auto 10px auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  /** Glow behind */
  infinityGlow: {
    position: "absolute",
    width: 160,
    height: 60,
    borderRadius: 999,
    background: "#393b3d",
    filter: "blur(28px)",
    opacity: 0.25,
    animation: "mvsiPulse 2.4s ease-in-out infinite"
  },

  /** The infinity symbol */
  infinityIcon: {
    position: "relative",
    fontSize: 90,
    lineHeight: "90px",
    fontWeight: 600,
    color: "#121213",
    animation: "mvsiFloat 2.2s ease-in-out infinite",
    userSelect: "none"
  },

  welcomeTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 10
  },

  welcomeText: {
    fontSize: 12,
    color: "#666",
    lineHeight: "18px",
    maxWidth: 360
  },

  footerLeft: {
    marginTop: 30,
    display: "flex",
    justifyContent: "space-between",
    maxWidth: 420
  },

  smallMuted: {
    fontSize: 11,
    color: "#999"
  },

  right: {
    width: 340,
    borderLeft: "1px solid #eee",
    background: "#fff",
    padding: 28,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },

  signInTitle: {
    fontSize: 26,
    fontWeight: 300,
    color: "#1e88e5"
  },

  error: {
    marginTop: 14,
    fontSize: 12,
    color: "red"
  },

  primaryButton: {
    marginTop: 22,
    borderWidth: 2,
    fontWeight: 600
  },

  secondaryButton: {
    marginTop: 12,
    borderWidth: 2,
    fontWeight: 600
  },

  resetButton: {
    marginTop: 12,
    borderWidth: 2,
    fontWeight: 600,
    color: "#444"
  },

  registerLink: {
    marginTop: 18,
    textTransform: "none",
    fontSize: 12,
    color: "#1e88e5"
  }
}

export default LoginPage
