import React from 'react'
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Divider
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import styles from './Login.styles'

type Mode = 'SIGN_IN' | 'AD_SIGN_IN' | 'RESET_PASSWORD' | 'REGISTER'

interface Props {
  classes: any
}

interface State {
  mode: Mode
  email: string
  password: string
  newPassword: string
  confirmPassword: string
}

class LoginPage extends React.Component<Props, State> {
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
        window.location.href = '/dashboard'
      } else {
        const data = await res.json()
        alert(data.message || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      alert('Server error')
    }
  }

//   handleLogout = async () => {
//   try {
//     const res = await fetch('/auth/logout', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' }
//     });

//     if (res.ok) {
//       window.location.href = '/index';   // redirect back to login page
//     } else {
//       alert('Logout failed');
//     }
//   } catch (err) {
//     console.error(err);
//     alert('Server error');
//   }
// };


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
    const { classes } = this.props
    const { mode } = this.state

    return (
      <Grid container className={classes.root} justify="center" alignItems="center">
        <Paper className={classes.paper} elevation={4}>
          <Grid container>
            {/* LEFT PANEL */}
            <Grid item xs={12} md={7} className={classes.leftPanel}>
              <img src="/static/logo.png" alt="Logo" className={classes.logo} />
              <Typography className={classes.description}>
                Welcome to OnBoard!, the world’s most powerful onboarding tool.
              </Typography>
              <Typography className={classes.version}>v4.54.2-1</Typography>
            </Grid>

            {/* RIGHT PANEL */}
            <Grid item xs={12} md={5} className={classes.rightPanel}>
              <Typography variant="title" className={classes.signInTitle}>
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
                className={classes.primaryButton}
                onClick={mode === 'REGISTER' ? this.handleRegister : this.handleLogin}
              >
                {this.renderPrimaryButton()}
              </Button>

              {mode === 'SIGN_IN' && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  className={classes.secondaryButton}
                  onClick={() => this.setMode('REGISTER')}
                >
                  REGISTER
                </Button>
              )}

              {mode !== 'SIGN_IN' && (
                <Button
                  fullWidth
                  className={classes.backButton}
                  onClick={() => this.setMode('SIGN_IN')}
                >
                  ← Back to Sign In
                </Button>
              )}
            </Grid>
          </Grid>

          <Divider />
          <div className={classes.footer}>
            <Typography variant="caption">Powered by MVSi</Typography>
          </div>
        </Paper>
      </Grid>
    )
  }
}

export default withStyles(styles)(LoginPage);

