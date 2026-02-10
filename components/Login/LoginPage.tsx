import React from 'react'
import Router from 'next/router'
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Divider
} from '@material-ui/core'

type Mode = 'SIGN_IN' | 'AD_SIGN_IN' | 'RESET_PASSWORD' | 'REGISTER'

interface State {
  mode: Mode
  email: string
  password: string
  newPassword: string
  confirmPassword: string
}

const styles = {
  root: {
    minHeight: '100vh',
    background: '#f2f2f2'
  },
  paper: {
    width: 900,
    minHeight: 420
  },
  leftPanel: {
    padding: 32,
    textAlign: 'center' as const,
    borderRight: '1px solid #e0e0e0'
  },
  rightPanel: {
    padding: 32
  },
  logo: {
    width: 120,
    marginBottom: 16
  },
  description: {
    fontSize: 13,
    color: '#555'
  },
  version: {
    marginTop: 32,
    fontSize: 12,
    color: '#888'
  },
  signInTitle: {
    marginBottom: 16
  },
  primaryButton: {
    marginTop: 24
  },
  secondaryButton: {
    marginTop: 16
  },
  backButton: {
    marginTop: 8,
    textTransform: 'none' as const,
    color: '#1976d2'
  },
  footer: {
    padding: 8,
    textAlign: 'right' as const
  }
}

class LoginPage extends React.Component<{}, State> {
  state: State = {
    mode: 'SIGN_IN',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  }

  handleChange = (name: keyof State) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ [name]: event.target.value } as Pick<State, keyof State>)
  }

  handleLogin = async () => {
    const { email, password } = this.state

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (res.ok) {
        // window.location.href = '/dashboard'
        Router.push('/dashboard')
      } else {
        const data = await res.json()
        alert(data.message || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      alert('Server error')
    }
  }

  handleRegister = async () => {
    const { email, password, confirmPassword } = this.state

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (res.ok) {
        alert('Registration successful! Please login.')
        this.setMode('SIGN_IN')
      } else {
        const data = await res.json()
        alert(data.message || 'Registration failed')
      }
    } catch (err) {
      console.error(err)
      alert('Server error')
    }
  }

  setMode = (mode: Mode) => {
    this.setState({ mode })
  }

  renderFormFields() {
    const { mode, email, password, confirmPassword } = this.state

    if (mode === 'RESET_PASSWORD') {
      return (
        <>
          <TextField label="Email *" fullWidth margin="normal" value={email} onChange={this.handleChange('email')} />
          <TextField label="New Password *" type="password" fullWidth margin="normal" onChange={this.handleChange('newPassword')} />
          <TextField label="Confirm Password *" type="password" fullWidth margin="normal" onChange={this.handleChange('confirmPassword')} />
        </>
      )
    }

    if (mode === 'REGISTER') {
      return (
        <>
          <TextField label="Email *" fullWidth margin="normal" value={email} onChange={this.handleChange('email')} />
          <TextField label="Password *" type="password" fullWidth margin="normal" value={password} onChange={this.handleChange('password')} />
          <TextField label="Confirm Password *" type="password" fullWidth margin="normal" value={confirmPassword} onChange={this.handleChange('confirmPassword')} />
        </>
      )
    }

    return (
      <>
        <TextField label="Email *" fullWidth margin="normal" value={email} onChange={this.handleChange('email')} />
        <TextField label="Password *" type="password" fullWidth margin="normal" value={password} onChange={this.handleChange('password')} />
      </>
    )
  }

  renderPrimaryButton() {
    const { mode } = this.state
    if (mode === 'RESET_PASSWORD') return 'UPDATE PASSWORD'
    if (mode === 'AD_SIGN_IN') return 'AD SIGN IN'
    if (mode === 'REGISTER') return 'REGISTER'
    return 'SIGN IN'
  }

  render() {
    const { mode } = this.state

    return (
      <Grid
        container
        style={styles.root}
        justify="center"
        alignItems="center"
      >
        <Paper style={styles.paper} elevation={4}>
          <Grid container>
            {/* LEFT PANEL */}
            <Grid item xs={12} md={7} style={styles.leftPanel}>
              <img src="/static/logo.png" alt="Logo" style={styles.logo} />
              <Typography style={styles.description}>
                Welcome to OnBoard!, the world’s most powerful onboarding tool.
              </Typography>
              <Typography style={styles.version}>
                v4.54.2-1
              </Typography>
            </Grid>

            {/* RIGHT PANEL */}
            <Grid item xs={12} md={5} style={styles.rightPanel}>
              <Typography variant="title" style={styles.signInTitle}>
                {mode === 'RESET_PASSWORD'
                  ? 'Reset Password'
                  : mode === 'REGISTER'
                  ? 'Register'
                  : 'Sign in'}
              </Typography>

              {this.renderFormFields()}

              <Button
                fullWidth
                variant="outlined"
                color="primary"
                style={styles.primaryButton}
                onClick={mode === 'REGISTER' ? this.handleRegister : this.handleLogin}
              >
                {this.renderPrimaryButton()}
              </Button>

              {mode === 'SIGN_IN' && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  style={styles.secondaryButton}
                  onClick={() => this.setMode('REGISTER')}
                >
                  REGISTER
                </Button>
              )}

              {mode !== 'SIGN_IN' && (
                <Button
                  fullWidth
                  style={styles.backButton}
                  onClick={() => this.setMode('SIGN_IN')}
                >
                  ← Back to Sign In
                </Button>
              )}
            </Grid>
          </Grid>

          <Divider />

          <div style={styles.footer}>
            <Typography variant="caption">
              Powered by MVSi
            </Typography>
          </div>
        </Paper>
      </Grid>
    )
  }
}

export default LoginPage
