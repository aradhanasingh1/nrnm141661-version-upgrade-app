import React from 'react'
import {
  Paper,
  Typography,
  Button,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Divider,
  CircularProgress
} from '@material-ui/core'

interface State {
  app: any
  loading: boolean
}

const steps = ['Info', 'KYC', 'Underwriting', 'Decision']

const stageIndexMap: { [key: string]: number } = {
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
    } catch (error) {
      this.setState({ loading: false, app: null })
    }
  }

  goBack = () => {
    window.location.href = '/applications'
  }

  handleContinue = () => {
    const { app } = this.state
    const stage = app && (app.stage || app.currentStage)
    if (!stage) return

    const id = app._id || app.id

    if (stage === 'INFO')
      window.location.href = `/application/info?id=${id}`

    if (stage === 'KYC')
      window.location.href = `/application/kyc?id=${id}`

    if (stage === 'UNDERWRITING')
      window.location.href = `/application/underwriting?id=${id}`

    if (stage === 'DECISION')
      window.location.href = `/application/decision?id=${id}`
  }

  render() {
    const { app, loading } = this.state

    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <CircularProgress />
        </div>
      )
    }

    if (!app) {
      return (
        <div style={{ padding: 32 }}>
          <Paper style={{ padding: 24 }}>
            <Typography variant="title">
              No application found
            </Typography>
          </Paper>
        </div>
      )
    }

    const stage = app.stage || app.currentStage
    const activeStep =
      stageIndexMap[stage] !== undefined
        ? stageIndexMap[stage]
        : 0

    const info = app.info
    const kyc = app.kyc

    const hasInfo =
      info &&
      (info.address || info.dob || info.idType || info.idNumber)

    const hasKyc =
      kyc &&
      (kyc.idType || kyc.idNumber || kyc.address || kyc.status)

    return (
      <div style={{ padding: 5, background: '#f4f6f8', minHeight: '30vh' }}>

        {/* ================= PROGRESS ================= */}
        <Paper style={{ padding: 24, marginBottom: 24 }}>
          <Typography variant="title" style={{ fontWeight: 600, marginBottom: 20 }}>
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

        {/* ================= APPLICATION DETAILS ================= */}
        <Paper style={{ padding: 24, marginBottom: 24 }}>
          <Typography variant="title" style={{ fontWeight: 600, marginBottom: 16 }}>
            Application Details
          </Typography>

          <div style={{ marginBottom: 20 }}>
            <Chip
              label={`Stage: ${stage}`}
              color="primary"
              style={{ marginRight: 12 }}
            />
            <Chip
              label={`Status: ${app.currentStatus || app.status}`}
            />
          </div>

          <Divider style={{ marginBottom: 20 }} />

          <Grid container spacing={8}>
            {app._id || app.id ? (
              <Grid item xs={12} md={6}>
                <Typography><strong>Application ID:</strong></Typography>
                <Typography color="textSecondary">{app._id || app.id}</Typography>
              </Grid>
            ) : null}

            {app.applicantName && (
              <Grid item xs={12} md={6}>
                <Typography><strong>Applicant Name:</strong></Typography>
                <Typography color="textSecondary">{app.applicantName}</Typography>
              </Grid>
            )}

            {app.email && (
              <Grid item xs={12} md={6}>
                <Typography><strong>Email:</strong></Typography>
                <Typography color="textSecondary">{app.email}</Typography>
              </Grid>
            )}

            {app.mobile && (
              <Grid item xs={12} md={6}>
                <Typography><strong>Mobile:</strong></Typography>
                <Typography color="textSecondary">{app.mobile}</Typography>
              </Grid>
            )}

            {app.loanAmount && (
              <Grid item xs={12} md={6}>
                <Typography><strong>Loan Amount:</strong></Typography>
                <Typography color="primary" style={{ fontWeight: 600 }}>
                  ₹ {app.loanAmount}
                </Typography>
              </Grid>
            )}

            {app.annualIncome && (
              <Grid item xs={12} md={6}>
                <Typography><strong>Annual Income:</strong></Typography>
                <Typography color="textSecondary">
                  ₹ {app.annualIncome}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* ================= INFO DETAILS ================= */}
        {hasInfo && (
          <Paper style={{ padding: 24, marginBottom: 24 }}>
            <Typography variant="title" style={{ fontWeight: 600, marginBottom: 16 }}>
              Info Details
            </Typography>

            <Divider style={{ marginBottom: 20 }} />

            <Grid container spacing={8}>
              {info.address && (
                <Grid item xs={12} md={6}>
                  <Typography><strong>Address:</strong></Typography>
                  <Typography color="textSecondary">{info.address}</Typography>
                </Grid>
              )}

              {info.dob && (
                <Grid item xs={12} md={6}>
                  <Typography><strong>Date of Birth:</strong></Typography>
                  <Typography color="textSecondary">
                    {new Date(info.dob).toLocaleDateString()}
                  </Typography>
                </Grid>
              )}

              {info.idType && (
                <Grid item xs={12} md={6}>
                  <Typography><strong>ID Type:</strong></Typography>
                  <Typography color="textSecondary">{info.idType}</Typography>
                </Grid>
              )}

              {info.idNumber && (
                <Grid item xs={12} md={6}>
                  <Typography><strong>ID Number:</strong></Typography>
                  <Typography color="textSecondary">{info.idNumber}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        )}

        {/* ================= KYC DETAILS ================= */}
        {hasKyc && (
          <Paper style={{ padding: 24, marginBottom: 24 }}>
            <Typography variant="title" style={{ fontWeight: 600, marginBottom: 16 }}>
              KYC Details
            </Typography>

            <Divider style={{ marginBottom: 20 }} />

            <Grid container spacing={8}>
              {kyc.idType && (
                <Grid item xs={12} md={6}>
                  <Typography><strong>ID Type:</strong></Typography>
                  <Typography color="textSecondary">{kyc.idType}</Typography>
                </Grid>
              )}

              {kyc.idNumber && (
                <Grid item xs={12} md={6}>
                  <Typography><strong>ID Number:</strong></Typography>
                  <Typography color="textSecondary">{kyc.idNumber}</Typography>
                </Grid>
              )}

              {kyc.address && (
                <Grid item xs={12} md={6}>
                  <Typography><strong>Address:</strong></Typography>
                  <Typography color="textSecondary">{kyc.address}</Typography>
                </Grid>
              )}

              {kyc.status && (
                <Grid item xs={12} md={6}>
                  <Typography><strong>Status:</strong></Typography>
                  <Chip
                    label={kyc.status}
                    style={{
                      backgroundColor:
                        kyc.status === 'VERIFIED' ? '#4caf50' : '#f44336',
                      color: '#fff'
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Paper>
        )}

        {/* ================= ACTION BUTTONS ================= */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 20
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={this.goBack}
          >
            ← Back
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={this.handleContinue}
          >
            Continue →
          </Button>
        </div>

      </div>
    )
  }
}

export default ApplicationDetail
