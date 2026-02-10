import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem
} from '@material-ui/core'

interface State {
  applicantName: string
  email: string
  mobile: string
  loanAmount: string
  loanType: string
  employmentType: string
  annualIncome: string
  purpose: string
}

class CreateApplicationDialog extends React.Component<any, State> {
  state: State = {
    applicantName: '',
    email: '',
    mobile: '',
    loanAmount: '',
    loanType: '',
    employmentType: '',
    annualIncome: '',
    purpose: ''
  }

  submit = async () => {
    await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantName: this.state.applicantName,
        email: this.state.email,
        mobile: this.state.mobile,
        loanAmount: Number(this.state.loanAmount),
        loanType: this.state.loanType,
        employmentType: this.state.employmentType,
        annualIncome: Number(this.state.annualIncome),
        purpose: this.state.purpose
      })
    })

    this.props.onClose()
  }

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Credit Application</DialogTitle>

        <DialogContent>
          <TextField label="Applicant Name" fullWidth margin="normal"
            onChange={e => this.setState({ applicantName: e.target.value })} />

          <TextField label="Email" fullWidth margin="normal"
            onChange={e => this.setState({ email: e.target.value })} />

          <TextField label="Mobile Number" fullWidth margin="normal"
            onChange={e => this.setState({ mobile: e.target.value })} />

          <TextField label="Loan Amount" type="number" fullWidth margin="normal"
            onChange={e => this.setState({ loanAmount: e.target.value })} />

          <TextField select label="Loan Type" fullWidth margin="normal" value={this.state.loanType} 
            onChange={e => this.setState({ loanType: e.target.value })}>
            <MenuItem value="HOME">Home Loan</MenuItem>
            <MenuItem value="PERSONAL">Personal Loan</MenuItem>
            <MenuItem value="AUTO">Auto Loan</MenuItem>
          </TextField>

          <TextField select label="Employment Type" fullWidth margin="normal" value={this.state.employmentType} 
            onChange={e => this.setState({ employmentType: e.target.value })}>
            <MenuItem value="SALARIED">Salaried</MenuItem>
            <MenuItem value="SELF_EMPLOYED">Self Employed</MenuItem>
          </TextField>

          <TextField label="Annual Income" type="number" fullWidth margin="normal"
            onChange={e => this.setState({ annualIncome: e.target.value })} />

          <TextField label="Purpose" fullWidth margin="normal"
            onChange={e => this.setState({ purpose: e.target.value })} />
        </DialogContent>

        <DialogActions>
          <Button onClick={this.props.onClose}>Cancel</Button>
          <Button color="primary" onClick={this.submit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default CreateApplicationDialog
