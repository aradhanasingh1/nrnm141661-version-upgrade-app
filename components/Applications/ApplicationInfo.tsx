import React from 'react'
import {
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  Snackbar
} from '@material-ui/core'

interface State {
  address: string
  dob: string
  pan: string
  success: boolean
  error: string
  fieldErrors: any
}

class ApplicationInfo extends React.Component<any, State> {
  state: State = {
    address: '',
    dob: '',
    pan: '',
    success: false,
    error: '',
    fieldErrors: {}
  }

  getApplicationId() {
    const params = new URLSearchParams(window.location.search)
    return params.get('id')
  }

  handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedErrors = Object.assign({}, this.state.fieldErrors)
    delete updatedErrors[name]

    const newState: any = {}
    newState[name] = e.target.value
    newState.fieldErrors = updatedErrors

    this.setState(newState)
  }

  submit = async () => {
    const id = this.getApplicationId()

    this.setState({ error: '', fieldErrors: {} })

    try {
      const res = await fetch('/api/applications/' + id + '/info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: this.state.address,
          dob: this.state.dob,
          pan: this.state.pan
        })
      })

      const data = await res.json()

      if (res.ok) {
        this.setState({ success: true })

        setTimeout(() => {
          window.location.href = '/application?id=' + id
        }, 1500)
      } else {
        if (data.errors && data.errors.fieldErrors) {
          this.setState({ fieldErrors: data.errors.fieldErrors })
        } else {
          this.setState({
            error: data.message || 'Failed to save info'
          })
        }
      }
    } catch (err) {
      this.setState({ error: 'Server error' })
    }
  }

  goBack = () => {
    window.history.back()
  }

  render() {
    const fieldErrors = this.state.fieldErrors

    return (
      <div
        style={{
          padding: 24,
          background: '#f4f6f8',
          minHeight: '60vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Paper style={{ padding: 32, width: 500 }}>
          <Typography variant="title" gutterBottom>
            Applicant Information
          </Typography>

          <Grid container spacing={16}>

            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                margin="normal"
                value={this.state.address}
                onChange={this.handleChange('address')}
                error={!!fieldErrors.address}
                helperText={
                  fieldErrors.address ? fieldErrors.address[0] : ''
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Date of Birth"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={this.state.dob}
                onChange={this.handleChange('dob')}
                error={!!fieldErrors.dob}
                helperText={
                  fieldErrors.dob ? fieldErrors.dob[0] : ''
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="PAN Number"
                fullWidth
                margin="normal"
                value={this.state.pan}
                onChange={this.handleChange('pan')}
                error={!!fieldErrors.pan}
                helperText={
                  fieldErrors.pan ? fieldErrors.pan[0] : ''
                }
              />
            </Grid>

          </Grid>

          {this.state.error && (
            <div style={{ color: 'red', marginTop: 10 }}>
              {this.state.error}
            </div>
          )}

          <div
            style={{
              marginTop: 24,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={this.goBack}
            >
              ← Back
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={this.submit}
            >
              Submit & Continue
            </Button>
          </div>
        </Paper>

        <Snackbar
          open={this.state.success}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={() => this.setState({ success: false })}
        >
          <Paper
            style={{
              padding: '10px 16px',
              background: '#4caf50',
              color: '#fff',
              fontWeight: 500
            }}
          >
            Info saved successfully
          </Paper>
        </Snackbar>
      </div>
    )
  }
}

export default ApplicationInfo
