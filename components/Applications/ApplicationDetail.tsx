import React from 'react'
import {
  Paper,
  Typography,
  Button,
  Chip,
  Stepper,
  Step,
  StepLabel
} from '@material-ui/core'

interface State {
  app: any
  loading: boolean
}

const steps = ['Info', 'KYC', 'Underwriting', 'Decision']

const stageIndexMap: Record<string, number> = {
  INFO: 0,
  KYC: 1,
  UNDERWRITING: 2,
  DECISION: 3
}

class ApplicationDetail extends React.Component<any, State> {
  state: State = {
    app: null,
    loading: true
  }

  async componentDidMount() {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')

    if (!id) {
      this.setState({ loading: false })
      return
    }

    try {
      const res = await fetch(`/api/applications/${id}`)

      if (!res.ok) {
        this.setState({ loading: false, app: null })
        return
      }

      const data = await res.json()
      this.setState({ app: data, loading: false })
    } catch (e) {
      this.setState({ loading: false, app: null })
    }
  }

  goBack = () => {
    window.location.href = '/applications'
  }

  handleContinue = () => {
    const { app } = this.state
    if (!app?.stage) return

    if (app.stage === 'INFO')
      window.location.href = `/application/info?id=${app._id}`

    if (app.stage === 'KYC')
      window.location.href = `/application/kyc?id=${app._id}`

    if (app.stage === 'UNDERWRITING')
      window.location.href = `/application/underwriting?id=${app._id}`

    if (app.stage === 'DECISION')
      window.location.href = `/application/decision?id=${app._id}`
  }

  render() {
    const { app, loading } = this.state

    if (loading) {
      return <Typography>Loading...</Typography>
    }

    if (!app) {
      return (
        <Paper style={{ padding: 16 }}>
          <Typography>No application found</Typography>
        </Paper>
      )
    }

    const activeStep =
      stageIndexMap[app.stage] !== undefined
        ? stageIndexMap[app.stage]
        : 0

    return (
      <div style={{ padding: 24, background: '#f4f6f8', minHeight: '100vh' }}>
        {/* ================= STEPPER ================= */}
        <Paper style={{ padding: 24, marginBottom: 24 }}>
          <Typography style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>
            Application Progress
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(step => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* ================= DETAILS ================= */}
        <Paper style={{ padding: 24 }}>
          <Typography variant="title" style={{ marginBottom: 16 }}>
            Application Details
          </Typography>

          {/* CHIPS */}
          <div style={{ marginBottom: 16 }}>
            <Chip
              label={`Stage: ${app.stage}`}
              color="primary"
              style={{ marginRight: 8 }}
            />
            <Chip
              label={`Status: ${app.currentStatus || app.status}`}
              color={
                app.currentStatus === 'COMPLETED'
                  ? 'secondary'
                  : 'default'
              }
            />
          </div>

          {/* DETAILS */}
          <Typography><b>ID:</b> {app._id || app.id}</Typography>
          <Typography><b>Applicant:</b> {app.applicantName}</Typography>
          <Typography><b>Email:</b> {app.email}</Typography>
          <Typography><b>Mobile:</b> {app.mobile}</Typography>
          <Typography><b>Loan Amount:</b> {app.loanAmount}</Typography>
          <Typography><b>Loan Type:</b> {app.loanType}</Typography>
          <Typography><b>Employment Type:</b> {app.employmentType}</Typography>
          <Typography><b>Annual Income:</b> {app.annualIncome}</Typography>
          <Typography><b>Purpose:</b> {app.purpose}</Typography>

          <Typography style={{ marginTop: 8 }}>
            <b>Created At:</b>{' '}
            {app.createdAt
              ? new Date(app.createdAt).toLocaleString()
              : '-'}
          </Typography>

          {/* ACTION BUTTONS */}
          <div
            style={{
              marginTop: 32,
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
              onClick={this.handleContinue}
            >
              Continue
            </Button>
          </div>
        </Paper>
      </div>
    )
  }
}

export default ApplicationDetail
