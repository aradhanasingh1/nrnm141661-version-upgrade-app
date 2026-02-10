import React from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Typography
} from '@material-ui/core'
import CreateApplicationDialog from './CreateApplicationDialog'

interface State {
  applications: any[]
  open: boolean
}

class ApplicationsList extends React.Component<{}, State> {
  state: State = {
    applications: [],
    open: false
  }

  componentDidMount() {
    this.load()
  }

  load = async () => {
    try {
      const res = await fetch('/api/applications')
      const data = await res.json()
      this.setState({ applications: data })
    } catch (e) {
      console.error('Failed to load applications', e)
    }
  }

  navigateToDetail = (id: any) => {
    if (!id) {
      console.error('Invalid application id', id)
      return
    }
    window.location.href = `/application?id=${id}`
  }

  goBack = () => {
    window.location.href = '/dashboard'
  }

  render() {
    console.log('ApplicationsList rendered')

    const { applications, open } = this.state

    return (
      <Paper style={{ padding: 16 }}>
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>

          <Typography variant="title">
            Applications
          </Typography>
        </div>

        {/* CREATE BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.setState({ open: true })}
        >
          Create New Application
        </Button>
        <Button
            variant="contained"
            color="primary"
            onClick={this.goBack}
            style={{ marginRight: 20 }}
          >
            ← Back
          </Button>
          </div>

        {/* CREATE DIALOG */}
        <CreateApplicationDialog
          open={open}
          onClose={() => {
            this.setState({ open: false })
            this.load()
          }}
        />

        {/* TABLE */}
        <Table style={{ marginTop: 16 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Applicant</TableCell>
              <TableCell>Mobile No</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Loan Type</TableCell>
              <TableCell>Employment Type</TableCell>
              <TableCell>Annual Income</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {applications.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No applications found
                </TableCell>
              </TableRow>
            )}

            {applications.map(app => (
              <TableRow
                key={app._id}
                hover
                style={{ cursor: 'pointer' }}
                onClick={() => this.navigateToDetail(app._id)}
              >
                <TableCell>{app._id}</TableCell>
                <TableCell>{app.applicantName}</TableCell>
                <TableCell>{app.mobile}</TableCell>
                <TableCell>{app.loanAmount}</TableCell>
                <TableCell>{app.loanType}</TableCell>
                <TableCell>{app.employmentType}</TableCell>
                <TableCell>{app.annualIncome}</TableCell>
                <TableCell>{app.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

export default ApplicationsList
