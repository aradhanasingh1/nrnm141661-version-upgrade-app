import React from 'react'
import Router from 'next/router'
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  MenuItem
} from '@material-ui/core'

type Mode = 'SIGN_IN' | 'RESET_PASSWORD' | 'REGISTER'

interface State {
  mode: Mode
  email: string
  password: string
  confirmPassword: string
  role: 'AGENT' | 'UNDERWRITER' | 'ADMIN'
}

const styles = {
  root: { minHeight: '100vh', background: '#f2f2f2' },
  paper: { width: 900, minHeight: 420 },
  leftPanel: {
    padding: 32,
    textAlign: 'center' as const,
    borderRight: '1px solid #e0e0e0'
  },
  rightPanel: { padding: 32 },
  logo: { width: 120, marginBottom: 16 },
  description: { fontSize: 13, color: '#555' },
  version: { marginTop: 32, fontSize: 12, color: '#888' },
  signInTitle: { marginBottom: 16 },
  primaryButton: { marginTop: 24 },
  secondaryButton: { marginTop: 16 },
  backButton: {
    marginTop: 8,
    textTransform: 'none' as const,
    color: '#1976d2'
  },
  footer: { padding: 8, textAlign: 'right' as const }
}

class LoginPage extends React.Component<{}, State> {
  state: State = {
    mode: 'SIGN_IN',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'AGENT'
  }

  handleChange = (name: keyof State) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ [name]: e.target.value } as Pick<State, keyof State>)
  }

  // ================= LOGIN =================
  handleLogin = async () => {
    const { email, password } = this.state

    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (res.ok) {
      const data = await res.json()
      if (data.user?.role) {
        localStorage.setItem('role', data.user.role)
      }
      Router.push('/dashboard')
    } else {
      alert('Login failed')
    }
  }

  // ================= REGISTER =================
  handleRegister = async () => {
    const { email, password, confirmPassword, role } = this.state

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        role // ✅ THIS WAS MISSING
      })
    })

    if (res.ok) {
      alert('Registration successful. Please login.')
      this.setState({ mode: 'SIGN_IN' })
    } else {
      alert('Registration failed')
    }
  }

  renderRegisterFields() {
    const { email, password, confirmPassword, role } = this.state

    return (
      <>
        <TextField
          label="Email *"
          fullWidth
          margin="normal"
          value={email}
          onChange={this.handleChange('email')}
        />

        <TextField
          label="Password *"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={this.handleChange('password')}
        />

        <TextField
          label="Confirm Password *"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={this.handleChange('confirmPassword')}
        />

        {/* ✅ ROLE SELECT */}
        <TextField
          select
          label="Role *"
          fullWidth
          margin="normal"
          value={role}
          onChange={this.handleChange('role')}
        >
          <MenuItem value="AGENT">Agent</MenuItem>
          <MenuItem value="UNDERWRITER">Underwriter</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </TextField>
      </>
    )
  }

  render() {
    const { mode, email, password } = this.state

    return (
      <Grid container style={styles.root} justify="center" alignItems="center">
        <Paper style={styles.paper}>
          <Grid container>
            <Grid item xs={12} md={7} style={styles.leftPanel}>
              <img src="/static/logo.png" style={styles.logo} />
              <Typography style={styles.description}>
                Welcome to OnBoard!
              </Typography>
              <Typography style={styles.version}>v4.54.2</Typography>
            </Grid>

            <Grid item xs={12} md={5} style={styles.rightPanel}>
              <Typography variant="title" style={styles.signInTitle}>
                {mode === 'REGISTER' ? 'Register' : 'Sign In'}
              </Typography>

              {mode === 'REGISTER' ? (
                this.renderRegisterFields()
              ) : (
                <>
                  <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={this.handleChange('email')}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={this.handleChange('password')}
                  />
                </>
              )}

              <Button
                fullWidth
                variant="outlined"
                color="primary"
                style={styles.primaryButton}
                onClick={mode === 'REGISTER' ? this.handleRegister : this.handleLogin}
              >
                {mode === 'REGISTER' ? 'REGISTER' : 'SIGN IN'}
              </Button>

              {mode === 'SIGN_IN' && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  style={styles.secondaryButton}
                  onClick={() => this.setState({ mode: 'REGISTER' })}
                >
                  REGISTER
                </Button>
              )}

              {mode === 'REGISTER' && (
                <Button
                  fullWidth
                  style={styles.backButton}
                  onClick={() => this.setState({ mode: 'SIGN_IN' })}
                >
                  ← Back to Sign In
                </Button>
              )}
            </Grid>
          </Grid>

          <Divider />

          <div style={styles.footer}>
            <Typography variant="caption">Powered by MVSi</Typography>
          </div>
        </Paper>
      </Grid>
    )
  }
}

export default LoginPage

