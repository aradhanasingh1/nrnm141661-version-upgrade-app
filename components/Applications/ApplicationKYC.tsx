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
  MenuItem,
  FormControlLabel,
  Switch
} from '@material-ui/core'

interface State {
  idType: string
  idNumber: string
  address: string
  simulateVerified: boolean
  fieldErrors: any
  success: boolean
  kycStatus: string
  apiMessage: string
}

class ApplicationKYC extends React.Component<any, State> {
  state: State = {
    idType: '',
    idNumber: '',
    address: '',
    simulateVerified: true,
    fieldErrors: {},
    success: false,
    kycStatus: '',
    apiMessage: ''
  }

  getApplicationId() {
    const params = new URLSearchParams(window.location.search)
    return params.get('id')
  }

  handleChange = (name: string) => (e: any) => {
    const updatedErrors = Object.assign({}, this.state.fieldErrors)
    updatedErrors[name] = undefined

    const newState: any = {}
    newState[name] = e.target.value
    newState.fieldErrors = updatedErrors

    this.setState(newState)
  }

  handleToggle = () => {
    this.setState({
      simulateVerified: !this.state.simulateVerified
    })
  }

  submitKYC = async () => {
    const id = this.getApplicationId()
    const { idType, idNumber, address, simulateVerified } = this.state

    const errors: any = {}
    if (!idType) errors.idType = 'ID Type is required'
    if (!idNumber) errors.idNumber = 'ID Number is required'
    if (!address) errors.address = 'Address is required'

    if (Object.keys(errors).length > 0) {
      this.setState({ fieldErrors: errors })
      return
    }

    try {
      /* ================= STEP 1: SUBMIT ================= */
      const submitRes = await fetch(`/api/applications/${id}/kyc/submit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idType,
          idNumber,
          address
        })
      })

      if (!submitRes.ok) {
        const err = await submitRes.json()
        alert(err.message || 'KYC submission failed')
        return
      }

      /* ================= STEP 2: COMPLETE ================= */
      const completeRes = await fetch(`/api/applications/${id}/kyc/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          result: simulateVerified ? 'VERIFIED' : 'FAILED'
        })
      })

      const completeData = await completeRes.json()

      if (!completeRes.ok) {
        alert(completeData.message || 'KYC completion failed')
        return
      }

      /* 🔥 USE BACKEND FINAL RESULT (NOT FRONTEND TOGGLE) */
      const finalStatus =
        completeData.message?.includes('verified') ||
        completeData.message?.includes('UNDERWRITING')
          ? 'VERIFIED'
          : 'FAILED'

      this.setState({
        success: true,
        kycStatus: finalStatus,
        apiMessage: completeData.message
      })

      if (finalStatus === 'VERIFIED') {
        setTimeout(function () {
          window.location.href =
            '/application?id=' + id
        }, 1500)
      }
    } catch (err) {
      alert('Unexpected error occurred')
    }
  }

  goBack = () => {
    window.history.back()
  }

  render() {
    const {
      idType,
      idNumber,
      address,
      simulateVerified,
      fieldErrors,
      success,
      kycStatus,
      apiMessage
    } = this.state

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
        <Paper
          elevation={3}
          style={{
            width: 520,
            padding: 32,
            borderRadius: 8
          }}
        >
          <Typography
            variant="title"
            style={{ marginBottom: 24, fontWeight: 600 }}
          >
            KYC Verification
          </Typography>

          {kycStatus && (
            <div style={{ marginBottom: 20 }}>
              <Chip
                label={'KYC Status: ' + kycStatus}
                color={
                  kycStatus === 'VERIFIED'
                    ? 'primary'
                    : 'secondary'
                }
              />
            </div>
          )}

          <Grid container spacing={8}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!fieldErrors.idType}>
                <InputLabel>ID Type</InputLabel>
                <Select
                  value={idType}
                  onChange={this.handleChange('idType')}
                >
                  <MenuItem value="AADHAR">Aadhar</MenuItem>
                  <MenuItem value="PAN">PAN</MenuItem>
                  <MenuItem value="PASSPORT">Passport</MenuItem>
                </Select>
                {fieldErrors.idType && (
                  <Typography color="error" variant="caption">
                    {fieldErrors.idType}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                // variant="contained"
                label="ID Number"
                fullWidth
                value={idNumber}
                onChange={this.handleChange('idNumber')}
                error={!!fieldErrors.idNumber}
                helperText={fieldErrors.idNumber}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                // variant="outlined"
                label="Address"
                fullWidth
                value={address}
                onChange={this.handleChange('address')}
                error={!!fieldErrors.address}
                helperText={fieldErrors.address}
              />
            </Grid>
          </Grid>

          <div style={{ marginTop: 20 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={simulateVerified}
                  onChange={this.handleToggle}
                  color="primary"
                />
              }
              label={
                simulateVerified
                  ? 'Simulate VERIFIED'
                  : 'Simulate FAILED'
              }
            />
          </div>

          <div
            style={{
              marginTop: 28,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Button variant="contained" color="primary" onClick={this.goBack}>
              ← Back
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={this.submitKYC}
            >
              Submit KYC
            </Button>
          </div>
        </Paper>

        <Snackbar
          open={success}
          autoHideDuration={2500}
          onClose={() => this.setState({ success: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Paper
            style={{
              padding: '10px 16px',
              background:
                kycStatus === 'VERIFIED'
                  ? '#4caf50'
                  : '#f44336',
              color: '#fff'
            }}
          >
            {apiMessage}
          </Paper>
        </Snackbar>
      </div>
    )
  }
}

export default ApplicationKYC
