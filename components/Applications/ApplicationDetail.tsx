import React from 'react'
import { Paper, Typography, Button } from '@material-ui/core'

interface State {
  app: any
  loading: boolean
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
    // Safer & predictable for your app
    window.location.href = '/applications'
    // If you prefer browser history instead:
    // window.history.back()
  }

  render() {
    const { app, loading } = this.state

    if (loading) {
      return <Typography>Loading...</Typography>
    }

    if (!app) {
      return (
        <Paper style={{ padding: 16 }}>
          <Button variant="outlined" onClick={this.goBack}>
            ← Back
          </Button>
          <Typography style={{ marginTop: 16 }}>
            No application found
          </Typography>
        </Paper>
      )
    }

    return (
      <Paper style={{ padding: 16 }}>
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Button
            variant="outlined"
            onClick={this.goBack}
            style={{ marginRight: 16 }}
          >
            ← Back
          </Button>

          <Typography variant="title">
            Application Details
          </Typography>
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
        <Typography><b>Status:</b> {app.status}</Typography>
        <Typography>
          <b>Created At:</b>{' '}
          {app.createdAt ? new Date(app.createdAt).toLocaleString() : '-'}
        </Typography>
      </Paper>
    )
  }
}

export default ApplicationDetail
