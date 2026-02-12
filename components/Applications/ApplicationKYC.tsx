import React from 'react'
import {
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  Snackbar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core'

interface State {
  idType: string
  idNumber: string
  address: string
  fieldErrors: any
  success: boolean
  kycStatus: string
  apiMessage: string
  role: string
  loading: boolean
}

class ApplicationKYC extends React.Component<any, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      idType: '',
      idNumber: '',
      address: '',
      fieldErrors: {},
      success: false,
      kycStatus: '',
      apiMessage: '',
      role: 'USER',
      loading: true
    }
  }

  async componentDidMount() {
    if (typeof window !== 'undefined') {
      const roleFromStorage = localStorage.getItem('role')
      const id = this.getApplicationId()

      const res = await fetch(`/api/applications/${id}`)
      const app = await res.json()

      this.setState({
        role: roleFromStorage || 'USER',
        idType: app.kyc?.idType || '',
        idNumber: app.kyc?.idNumber || '',
        address: app.kyc?.address || '',
        kycStatus: app.kyc?.status || '',
        loading: false
      })
    }
  }

  getApplicationId() {
    const params = new URLSearchParams(window.location.search)
    return params.get('id')
  }

  goBack = () => {
    const id = this.getApplicationId()
    window.location.href = '/application?id=' + id
  }

  handleChange(name: string) {
    return (e: any) => {
      var updatedErrors = Object.assign({}, this.state.fieldErrors)
      updatedErrors[name] = undefined

      var newState: any = {}
      newState[name] = e.target.value
      newState.fieldErrors = updatedErrors

      this.setState(newState)
    }
  }

  submitKYC = async () => {
    const id = this.getApplicationId()
    const { idType, idNumber, address } = this.state

    try {
      const res = await fetch(`/api/applications/${id}/kyc/submit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idType: idType,
          idNumber: idNumber,
          address: address
        })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message)
        return
      }

      this.setState({
        success: true,
        kycStatus: 'SUBMITTED',
        apiMessage: 'KYC submitted successfully.'
      })

      setTimeout(() => {
        window.location.href = '/application?id=' + id
      }, 1500)

    } catch (err) {
      alert('Error submitting KYC')
    }
  }

  verifyKYC = async (result: 'VERIFIED' | 'FAILED') => {
    const id = this.getApplicationId()

    const res = await fetch(`/api/applications/${id}/kyc/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-role': this.state.role
      },
      body: JSON.stringify({ result: result })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message)
      return
    }

    this.setState({
      success: true,
      kycStatus: result,
      apiMessage: data.message
    })

    setTimeout(() => {
      window.location.href = '/application?id=' + id
    }, 1500)
  }

  render() {
    const {
      idType,
      idNumber,
      address,
      success,
      kycStatus,
      apiMessage,
      role,
      loading
    } = this.state

    if (loading) {
      return <div style={{ padding: 50 }}>Loading...</div>
    }

    const isAdmin = role === 'ADMIN'

    return (
      <div
        style={{
          minHeight: '50vh',
          background: '#f4f6f8',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24
        }}
      >
        <Paper elevation={3} style={{ width: 520, padding: 32 }}>
          <Typography
            variant="title"
            style={{ marginBottom: 24, fontWeight: 600 }}
          >
            KYC Verification
          </Typography>

          {kycStatus && (
            <Chip
              label={'KYC Status: ' + kycStatus}
              style={{
                marginBottom: 20,
                backgroundColor:
                  kycStatus === 'VERIFIED'
                    ? '#4caf50'
                    : kycStatus === 'FAILED'
                    ? '#f44336'
                    : '#ff9800',
                color: '#fff'
              }}
            />
          )}

          <Grid container spacing={8}>
            <Grid item xs={12}>
              <FormControl fullWidth disabled={isAdmin}>
                <InputLabel>ID Type</InputLabel>
                <Select
                  value={idType}
                  onChange={this.handleChange('idType')}
                >
                  <MenuItem value="AADHAR">Aadhar</MenuItem>
                  <MenuItem value="PAN">PAN</MenuItem>
                  <MenuItem value="PASSPORT">Passport</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="ID Number"
                fullWidth
                value={idNumber}
                disabled={isAdmin}
                onChange={this.handleChange('idNumber')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                value={address}
                disabled={isAdmin}
                onChange={this.handleChange('address')}
              />
            </Grid>
          </Grid>

          <div
            style={{
              marginTop: 28,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={this.goBack}
            >
              ← Back
            </Button>

            {!isAdmin && (
              <Button
                variant="contained"
                color="primary"
                onClick={this.submitKYC}
              >
                Submit KYC
              </Button>
            )}

            {isAdmin && kycStatus === 'SUBMITTED' && (
              <div>
                <Button
                  variant="contained"
                  style={{
                    background: '#4caf50',
                    color: '#fff',
                    marginRight: 10
                  }}
                  onClick={() => this.verifyKYC('VERIFIED')}
                >
                  Verify
                </Button>

                <Button
                  variant="contained"
                  style={{
                    background: '#f44336',
                    color: '#fff'
                  }}
                  onClick={() => this.verifyKYC('FAILED')}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </Paper>

        <Snackbar
          open={success}
          autoHideDuration={2500}
          onClose={() => this.setState({ success: false })}
        >
          <Paper style={{ padding: 10 }}>
            {apiMessage}
          </Paper>
        </Snackbar>
      </div>
    )
  }
}

export default ApplicationKYC
