import React from "react"
import Router from "next/router"

import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import MenuItem from "@material-ui/core/MenuItem"
import { CenterFocusStrong } from "@material-ui/icons"

interface State {
  email: string
  password: string
  role: string
  error: string | null
  loading: boolean
}

class RegisterPage extends React.Component<{}, State> {
  state: State = {
    email: "",
    password: "",
    role: "USER",
    error: null,
    loading: false
  }

  handleChange = (name: keyof State) => (event: any) => {
    this.setState({ [name]: event.target.value } as any)
  }

  handleSubmit = async () => {
    this.setState({ loading: true, error: null })

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
          role: this.state.role
        })
      })

      const data = await res.json()

      if (!res.ok) {
        this.setState({
          loading: false,
          error: data.message || "Register failed"
        })
        return
      }

      Router.push("/")
    } catch (err) {
      this.setState({
        loading: false,
        error: "Network error"
      })
    }
  }

  render() {
    return (
      <Paper style={{ padding: 24, marginTop:100, marginLeft:500,width:500}}>
        <Typography variant="title" style={{ marginBottom: 16 }}>
          Register
        </Typography>

        <TextField
          fullWidth
          label="Email"
          value={this.state.email}
          onChange={this.handleChange("email")}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={this.state.password}
          onChange={this.handleChange("password")}
          style={{ marginTop: 16 }}
        />

        <TextField
          select
          fullWidth
          label="Role"
          value={this.state.role}
          onChange={this.handleChange("role")}
          style={{ marginTop: 16 }}
        >
          <MenuItem value="USER">USER</MenuItem>
          <MenuItem value="UNDERWRITER">UNDERWRITER</MenuItem>
          <MenuItem value="ADMIN">ADMIN</MenuItem>
        </TextField>

        {this.state.error && (
          <Typography style={{ marginTop: 12, color: "red" }}>
            {this.state.error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="raised"
          color="primary"
          style={{ marginTop: 24 }}
          disabled={this.state.loading}
          onClick={this.handleSubmit}
        >
          {this.state.loading ? "Registering..." : "Register"}
        </Button>

        <Button
          fullWidth
          style={{ marginTop: 12 }}
          onClick={() => Router.push("/")}
        >
          Back to Login
        </Button>
      </Paper>
    )
  }
}

export default RegisterPage
