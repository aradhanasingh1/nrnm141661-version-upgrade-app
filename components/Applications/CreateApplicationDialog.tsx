// import React from 'react'
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   MenuItem,
//   Paper,
//   Snackbar
// } from '@material-ui/core'

// interface State {
//   applicantName: string
//   email: string
//   mobile: string
//   loanAmount: string
//   loanType: string
//   employmentType: string
//   annualIncome: string
//   purpose: string
//   success: boolean
//   error: string
// }

// class CreateApplicationDialog extends React.Component<any, State> {
//   state: State = {
//     applicantName: '',
//     email: '',
//     mobile: '',
//     loanAmount: '',
//     loanType: '',
//     employmentType: '',
//     annualIncome: '',
//     purpose: '',
//     success: false,
//     error: ''
//   }

//   submit = async () => {
//   try {
//     const res = await fetch('/api/applications', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         applicantName: this.state.applicantName,
//         email: this.state.email,
//         mobile: this.state.mobile,
//         loanAmount: this.state.loanAmount,
//         loanType: this.state.loanType,
//         employmentType: this.state.employmentType,
//         annualIncome: this.state.annualIncome,
//         purpose: this.state.purpose
//       })
//     })

//     if (res.ok) {
//       this.setState({ success: true })

//       // close dialog after short delay
//       setTimeout(() => {
//         this.setState({ success: false })
//         this.props.onClose()
//       }, 1500)
//     } else {
//       this.setState({ error: 'Failed to create application' })
//     }
//   } catch (err) {
//     this.setState({ error: 'Server error' })
//   }
// }


//   render() {
//     return (
//       <Dialog open={this.props.open} onClose={this.props.onClose} maxWidth="sm" fullWidth>
//         <DialogTitle>Create Credit Application</DialogTitle>

//         <DialogContent>
//           <TextField label="Applicant Name" fullWidth margin="normal"
//             onChange={e => this.setState({ applicantName: e.target.value })} />

//           <TextField label="Email" fullWidth margin="normal"
//             onChange={e => this.setState({ email: e.target.value })} />

//           <TextField label="Mobile Number" fullWidth margin="normal"
//             onChange={e => this.setState({ mobile: e.target.value })} />

//           <TextField label="Loan Amount" type="number" fullWidth margin="normal"
//             onChange={e => this.setState({ loanAmount: e.target.value })} />

//           <TextField select label="Loan Type" fullWidth margin="normal" value={this.state.loanType} 
//             onChange={e => this.setState({ loanType: e.target.value })}>
//             <MenuItem value="HOME">Home Loan</MenuItem>
//             <MenuItem value="PERSONAL">Personal Loan</MenuItem>
//             <MenuItem value="AUTO">Auto Loan</MenuItem>
//           </TextField>

//           <TextField select label="Employment Type" fullWidth margin="normal" value={this.state.employmentType} 
//             onChange={e => this.setState({ employmentType: e.target.value })}>
//             <MenuItem value="SALARIED">Salaried</MenuItem>
//             <MenuItem value="SELF_EMPLOYED">Self Employed</MenuItem>
//           </TextField>

//           <TextField label="Annual Income" type="number" fullWidth margin="normal"
//             onChange={e => this.setState({ annualIncome: e.target.value })} />

//           <TextField label="Purpose" fullWidth margin="normal"
//             onChange={e => this.setState({ purpose: e.target.value })} />
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={this.props.onClose}>Cancel</Button>
//           <Button color="primary" onClick={this.submit}>
//             Create
//           </Button>
//         </DialogActions>
//         <Snackbar
//   open={this.state.success}
//   autoHideDuration={2000}
//   onClose={() => this.setState({ success: false })}
//   anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
// >
//   <Paper
//     style={{
//       padding: '10px 16px',
//       background: '#4caf50',
//       color: '#fff',
//       fontWeight: 500
//     }}
//   >
//     Application created successfully
//   </Paper>
// </Snackbar>

//       </Dialog>
//     )
//   }
// }

// export default CreateApplicationDialog

import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Paper,
  Snackbar
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
  success: boolean
  error: string
  fieldErrors: any
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
    purpose: '',
    success: false,
    error: '',
    fieldErrors: {}
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
    this.setState({ error: '', fieldErrors: {} })

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName: this.state.applicantName,
          email: this.state.email,
          mobile: this.state.mobile,
          loanAmount: this.state.loanAmount,
          loanType: this.state.loanType,
          employmentType: this.state.employmentType,
          annualIncome: this.state.annualIncome,
          purpose: this.state.purpose
        })
      })

      const data = await res.json()

      if (res.ok) {
        this.setState({ success: true })

        setTimeout(() => {
          this.setState({ success: false })
          this.props.onClose()
        }, 1500)
      } else {
        if (data.errors && data.errors.fieldErrors) {
          this.setState({ fieldErrors: data.errors.fieldErrors })
        } else {
          this.setState({
            error: data.message || 'Failed to create application'
          })
        }
      }
    } catch (err) {
      this.setState({ error: 'Server error' })
    }
  }

  render() {
    const fieldErrors = this.state.fieldErrors

    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Credit Application</DialogTitle>

        <DialogContent>

          <TextField
            label="Applicant Name"
            fullWidth
            margin="normal"
            value={this.state.applicantName}
            onChange={this.handleChange('applicantName')}
            error={!!fieldErrors.applicantName}
            helperText={
              fieldErrors.applicantName
                ? fieldErrors.applicantName[0]
                : ''
            }
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={this.state.email}
            onChange={this.handleChange('email')}
            error={!!fieldErrors.email}
            helperText={
              fieldErrors.email ? fieldErrors.email[0] : ''
            }
          />

          <TextField
            label="Mobile Number"
            fullWidth
            margin="normal"
            value={this.state.mobile}
            onChange={this.handleChange('mobile')}
            error={!!fieldErrors.mobile}
            helperText={
              fieldErrors.mobile ? fieldErrors.mobile[0] : ''
            }
          />

          <TextField
            label="Loan Amount"
            type="number"
            fullWidth
            margin="normal"
            value={this.state.loanAmount}
            onChange={this.handleChange('loanAmount')}
            error={!!fieldErrors.loanAmount}
            helperText={
              fieldErrors.loanAmount ? fieldErrors.loanAmount[0] : ''
            }
          />

          <TextField
            select
            label="Loan Type"
            fullWidth
            margin="normal"
            value={this.state.loanType}
            onChange={this.handleChange('loanType')}
            error={!!fieldErrors.loanType}
            helperText={
              fieldErrors.loanType ? fieldErrors.loanType[0] : ''
            }
          >
            <MenuItem value="HOME">Home Loan</MenuItem>
            <MenuItem value="PERSONAL">Personal Loan</MenuItem>
            <MenuItem value="AUTO">Auto Loan</MenuItem>
          </TextField>

          <TextField
            select
            label="Employment Type"
            fullWidth
            margin="normal"
            value={this.state.employmentType}
            onChange={this.handleChange('employmentType')}
            error={!!fieldErrors.employmentType}
            helperText={
              fieldErrors.employmentType
                ? fieldErrors.employmentType[0]
                : ''
            }
          >
            <MenuItem value="SALARIED">Salaried</MenuItem>
            <MenuItem value="SELF_EMPLOYED">Self Employed</MenuItem>
          </TextField>

          <TextField
            label="Annual Income"
            type="number"
            fullWidth
            margin="normal"
            value={this.state.annualIncome}
            onChange={this.handleChange('annualIncome')}
            error={!!fieldErrors.annualIncome}
            helperText={
              fieldErrors.annualIncome
                ? fieldErrors.annualIncome[0]
                : ''
            }
          />

          <TextField
            label="Purpose"
            fullWidth
            margin="normal"
            value={this.state.purpose}
            onChange={this.handleChange('purpose')}
            error={!!fieldErrors.purpose}
            helperText={
              fieldErrors.purpose ? fieldErrors.purpose[0] : ''
            }
          />

          {this.state.error && (
            <div style={{ color: 'red', marginTop: 10 }}>
              {this.state.error}
            </div>
          )}

        </DialogContent>

        <DialogActions>
          <Button onClick={this.props.onClose}>Cancel</Button>
          <Button color="primary" onClick={this.submit}>
            Create
          </Button>
        </DialogActions>

        <Snackbar
          open={this.state.success}
          autoHideDuration={2000}
          onClose={() => this.setState({ success: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Paper
            style={{
              padding: '10px 16px',
              background: '#4caf50',
              color: '#fff',
              fontWeight: 500
            }}
          >
            Application created successfully
          </Paper>
        </Snackbar>
      </Dialog>
    )
  }
}

export default CreateApplicationDialog
