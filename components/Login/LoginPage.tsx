// import React from 'react';
// import Router from 'next/router';
// import {
//   Button,
//   TextField,
//   Paper,
//   Typography,
//   withStyles,
//   WithStyles,
//   createStyles,
//   Theme
// } from '@material-ui/core';

// const styles = (theme: Theme) => createStyles({
//   layout: {
//     width: 'auto',
//     display: 'block',
//     marginLeft: theme.spacing.unit * 3,
//     marginRight: theme.spacing.unit * 3,
//     [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
//       width: 400,
//       marginLeft: 'auto',
//       marginRight: 'auto',
//     },
//   },
//   paper: {
//     marginTop: theme.spacing.unit * 8,
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
//   },
//   form: {
//     width: '100%',
//     marginTop: theme.spacing.unit,
//   },
//   submit: {
//     marginTop: theme.spacing.unit * 3,
//   },
//   errorText: {
//     color: theme.palette.error.main,
//     textAlign: 'center',
//     marginTop: theme.spacing.unit * 2,
//   }
// });

// interface State {
//   email: string;
//   password: string;
//   error: string | null;
//   loading: boolean;
// }

// interface Props extends WithStyles<typeof styles> { }

// class LoginPage extends React.Component<Props, State> {
//   state: State = {
//     email: '',
//     password: '',
//     error: null,
//     loading: false
//   };

//   handleChange = (name: keyof State) => (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     this.setState({ [name]: event.target.value } as unknown as Pick<State, keyof State>);
//   };

//   handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     const { email, password } = this.state;

//     this.setState({ loading: true, error: null });

//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         // Success! Redirect to dashboard
//         Router.push('/dashboard');
//       } else {
//         // Handle logic errors (User not found, invalid password)
//         this.setState({
//           error: data.message || 'Login failed',
//           loading: false
//         });
//       }
//     } catch (err) {
//       // Handle network errors
//       this.setState({
//         error: 'A server error occurred. Please try again later.',
//         loading: false
//       });
//     }
//   };

//   render() {
//     const { classes } = this.props;
//     const { email, password, error, loading } = this.state;

//     return (
//       <main className={classes.layout}>
//         <Paper className={classes.paper}>
//           <Typography component="h1" variant="headline">
//             Sign in
//           </Typography>
//           <form className={classes.form} onSubmit={this.handleSubmit}>
//             <TextField
//               label="Email Address"
//               fullWidth
//               required
//               margin="normal"
//               value={email}
//               onChange={this.handleChange('email')}
//               disabled={loading}
//             />
//             <TextField
//               label="Password"
//               fullWidth
//               required
//               margin="normal"
//               type="password"
//               value={password}
//               onChange={this.handleChange('password')}
//               disabled={loading}
//             />

//             {error && (
//               <Typography variant="body2" className={classes.errorText}>
//                 {error}
//               </Typography>
//             )}

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               color="primary"
//               disabled={loading}
//               className={classes.submit}
//             >
//               {loading ? 'Processing...' : 'Sign in'}
//             </Button>
//             <Button
//               fullWidth
//               color="secondary"
//               className={classes.submit}
//               onClick={() => Router.push('/register')}
//             >
//               No account? Register here
//             </Button>
//           </form>
//         </Paper>
//       </main>
//     );
//   }
// }

// export default withStyles(styles)(LoginPage);

import React, { useState } from 'react'
import Router from 'next/router'
import axios from 'axios'
import {
  Grid,
  Paper,
  Card,
  Typography,
  TextField,
  Button,
  Divider
} from '@material-ui/core'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  setLoading(true);
  setError(null);

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Success! Redirect to dashboard
      Router.push('/dashboard');
    } else {
      // Handle logic errors (User not found, invalid password)
      setError(data.message || 'Login failed');
      setLoading(false);
    }
  } catch (err) {
    // Handle network errors
    setError('A server error occurred. Please try again later.');
    setLoading(false);
  }
};


  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      style={{ minHeight: '100vh', backgroundColor: '#f2f2f2' }}
    >
      <Grid item xs={11} md={10}>
        <Paper elevation={4}>
          {/* Header */}
          <div style={{ padding: 16 }}>
            <Typography variant="title">
              MVSI Customer Support Centre
            </Typography>
            <Typography variant="caption">
              How can we help you today?
            </Typography>
          </div>

          <Divider />

          {/* Main Content */}
          <Grid container>
            {/* Left Side */}
            <Grid
              item
              xs={12}
              md={7}
              style={{ padding: 40, textAlign: 'center' }}
            >
              <Typography variant="headline">
                Welcome to OnBoard!
              </Typography>

              <Typography variant="body1" style={{ marginTop: 20 }}>
                The world’s most powerful onboarding tool.
                We’ll keep you up to date on enhancements
                and notices.
              </Typography>

              <Typography
                variant="caption"
                style={{ marginTop: 20, display: 'block' }}
              >
                Current notices: None
              </Typography>
            </Grid>

            {/* Right Side Login */}
            <Grid
              item
              xs={12}
              md={5}
              style={{ borderLeft: '1px solid #ddd', padding: 40 }}
            >
              <Card style={{ padding: 24 }}>
                <Typography
                  variant="headline"
                  color="primary"
                  gutterBottom
                >
                  Sign in
                </Typography>

                <TextField
                  label="Email"
                  fullWidth
                  required
                  disabled={loading}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  margin="normal"
                />

                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  disabled={loading}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  margin="normal"
                />

                {error && (
                  <Typography
                    color="error"
                    variant="caption"
                    style={{ marginTop: 8, display: 'block' }}
                  >
                    {error}
                  </Typography>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ marginTop: 20 }}
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? 'Processing...' : 'SIGN IN'}
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  style={{ marginTop: 10 }}
                  disabled={loading}
                  onClick={() => Router.push('/register')}
                >
                  No account? Register here
                </Button>
              </Card>
            </Grid>
          </Grid>

          {/* Footer */}
          <Divider />
          <div style={{ padding: 12, textAlign: 'right' }}>
            <Typography variant="caption">
              Powered by MVSI
            </Typography>
          </div>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Login
