import React from 'react';
import Router from 'next/router';
import { 
  Button, 
  TextField, 
  Paper, 
  Typography, 
  withStyles, 
  WithStyles, 
  createStyles, 
  Theme 
} from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
  layout: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  backButton: {
    marginTop: theme.spacing.unit * 1,
    textAlign: 'center',
    display: 'block',
    cursor: 'pointer',
    color: theme.palette.primary.main,
    textDecoration: 'none'
  },
  errorText: {
    color: theme.palette.error.main,
    textAlign: 'center',
    marginTop: theme.spacing.unit * 2,
  }
});

interface State {
  email: string;
  password: string;
  confirmPassword: string;
  error: string | null;
  loading: boolean;
}

interface Props extends WithStyles<typeof styles> {}

class RegisterPage extends React.Component<Props, State> {
  state: State = {
    email: '',
    password: '',
    confirmPassword: '',
    error: null,
    loading: false
  };

  handleChange = (name: keyof State) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ [name]: event.target.value } as any);
  };

  handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { email, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      return this.setState({ error: 'Passwords do not match' });
    }

    this.setState({ loading: true, error: null });

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successfully registered, send to login
        Router.push('/index');
      } else {
        this.setState({ 
          error: data.message || 'Registration failed', 
          loading: false 
        });
      }
    } catch (err) {
      this.setState({ 
        error: 'Connection error. Please try again.', 
        loading: false 
      });
    }
  };

  render() {
    const { classes } = this.props;
    const { email, password, confirmPassword, error, loading } = this.state;

    return (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="headline">
            Create Account
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <TextField
              label="Email Address"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={this.handleChange('email')}
              disabled={loading}
            />
            <TextField
              label="Password"
              fullWidth
              required
              margin="normal"
              type="password"
              value={password}
              onChange={this.handleChange('password')}
              disabled={loading}
            />
            <TextField
              label="Confirm Password"
              fullWidth
              required
              margin="normal"
              type="password"
              value={confirmPassword}
              onChange={this.handleChange('confirmPassword')}
              disabled={loading}
            />
            
            {error && (
              <Typography variant="body2" className={classes.errorText}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              className={classes.submit}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>

            <Typography 
              variant="caption" 
              className={classes.backButton}
              onClick={() => Router.push('/index')}
            >
              Already have an account? Sign In
            </Typography>
          </form>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(RegisterPage);