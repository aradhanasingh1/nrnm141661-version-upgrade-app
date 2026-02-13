import React from 'react'
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Snackbar,
  LinearProgress,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'

interface State {
  income: string
  expenses: string
  creditScore: string
  loading: boolean
  role: string
  status: string
  success: boolean
  apiMessage: string
}

class ApplicationUnderwriting extends React.Component<any, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      income: '',
      expenses: '',
      creditScore: '',
      loading: true,
      role: 'USER',
      status: '',
      success: false,
      apiMessage: ''
    }
  }

  async componentDidMount() {
    if (typeof window !== 'undefined') {
      const roleFromStorage = localStorage.getItem('role')
      const id = this.getApplicationId()

      try {
        const res = await fetch(`/api/applications/${id}`)
        const app = await res.json()

        this.setState({
          role: roleFromStorage || 'USER',
          income: app.underwriting?.income || '',
          expenses: app.underwriting?.expenses || '',
          creditScore: app.underwriting?.creditScore || '',
          status: app.underwriting?.status || '',
          loading: false
        })
      } catch (err) {
        this.setState({ loading: false })
      }
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

  submitUnderwriting = async () => {
    const id = this.getApplicationId()
    this.setState({ loading: true })

    try {
      const res = await fetch(`/api/applications/${id}/underwriting/start`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          income: Number(this.state.income),
          expenses: Number(this.state.expenses),
          creditScore: Number(this.state.creditScore)
        })
      })

      const data = await res.json()
      this.setState({ loading: false })

      if (!res.ok) {
        alert(data.message)
        return
      }

      this.setState({
        success: true,
        status: 'SUBMITTED',
        apiMessage: data.message
      })

      setTimeout(() => {
        window.location.href = '/application?id=' + id
      }, 1500)

    } catch (err) {
      this.setState({ loading: false })
      alert('Error submitting underwriting')
    }
  }

  completeUnderwriting = async () => {
    const id = this.getApplicationId()
    this.setState({ loading: true })

    try {
      const res = await fetch(`/api/applications/${id}/underwriting/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-role': this.state.role
        }
      })

      const data = await res.json()
      this.setState({ loading: false })

      if (!res.ok) {
        alert(data.message)
        return
      }

      this.setState({
        success: true,
        status: 'COMPLETED',
        apiMessage: data.message
      })

      setTimeout(() => {
        window.location.href = '/application?id=' + id
      }, 1500)

    } catch (err) {
      this.setState({ loading: false })
      alert('Error completing underwriting')
    }
  }

  render() {
    const {
      income,
      expenses,
      creditScore,
      loading,
      role,
      status,
      success,
      apiMessage
    } = this.state

    if (loading && !status) {
      return <div style={{ padding: 50 }}>Loading...</div>
    }

    const isAdmin = role === 'ADMIN'

    const incomeNum = Number(income)
    const expenseNum = Number(expenses)
    const dti =
      incomeNum > 0 ? ((expenseNum / incomeNum) * 100).toFixed(2) : 0

    return (
      <div
        style={{
          padding: 32,
          background: '#f4f6f8',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Paper style={{ padding: 32, width: 700 }}>

          <Typography
            variant="title"
            style={{ marginBottom: 20, fontWeight: 600 }}
          >
            Underwriting Assessment
          </Typography>

          {loading && <LinearProgress style={{ marginBottom: 20 }} />}

          {status && (
            <Chip
              label={'Status: ' + status}
              style={{
                marginBottom: 20,
                backgroundColor:
                  status === 'COMPLETED'
                    ? '#4caf50'
                    : '#ff9800',
                color: '#fff'
              }}
            />
          )}

          {/* 🔵 Accordion 1 - Financial Inputs */}
          <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
              <Typography style={{ fontWeight: 500 }}>
                Financial Inputs
              </Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Grid container spacing={8}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Monthly Income"
                    fullWidth
                    disabled={isAdmin}
                    value={income}
                    onChange={(e) =>
                      this.setState({ income: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Monthly Expenses"
                    fullWidth
                    disabled={isAdmin}
                    value={expenses}
                    onChange={(e) =>
                      this.setState({ expenses: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Credit Score"
                    fullWidth
                    disabled={isAdmin}
                    value={creditScore}
                    onChange={(e) =>
                      this.setState({ creditScore: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          {/* 🔵 Accordion 2 - Summary */}
          {income && expenses && (
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                <Typography style={{ fontWeight: 500 }}>
                  Underwriting Summary
                </Typography>
              </ExpansionPanelSummary>

              <ExpansionPanelDetails>
                <Grid container spacing={8}>
                  <Grid item xs={6}>
                    <Typography>Debt-to-Income Ratio</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="primary">
                      {dti} %
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>Credit Score</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {creditScore}
                    </Typography>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )}

          {/* Buttons */}
          <div
            style={{
              marginTop: 24,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              disabled={loading}
              onClick={this.goBack}
            >
              ← Back
            </Button>

            {!isAdmin && (
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={this.submitUnderwriting}
              >
                Submit Underwriting
              </Button>
            )}

            {isAdmin && status === 'SUBMITTED' && (
              <Button
                variant="contained"
                disabled={loading}
                style={{ background: '#4caf50', color: '#fff' }}
                onClick={this.completeUnderwriting}
              >
                Complete Underwriting
              </Button>
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

export default ApplicationUnderwriting
