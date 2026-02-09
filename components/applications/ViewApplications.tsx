import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button
} from '@material-ui/core'

interface Application {
  applicationNumber: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  amount: number
  currency: string
  applicationType: string
  purpose: string
  purposeDescription: string
}

const ViewApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [error, setError] = useState('')

  const fetchAllApplications = () => {
    axios
      .get('/api/application/applications')
      .then(res => {
        setApplications(res.data)
        setError('')
      })
      .catch(() => setError('Failed to load applications'))
  }

  useEffect(() => {
    fetchAllApplications()
  }, [])

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      fetchAllApplications()
      return
    }

    try {
      const res = await axios.get(
        `/api/application/${searchValue.trim()}`
      )
      setApplications([res.data]) // wrap single result in array
      setError('')
    } catch (err) {
      setApplications([])
      setError('Application not found')
    }
  }

  return (
    <Paper style={{ padding: 24, width: '100%', overflowX: 'auto' }}>
      <Typography variant="title" gutterBottom>
        Applications
      </Typography>

      {/* 🔍 Search Bar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <TextField
          label="Search"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          onClick={fetchAllApplications}
        >
          Reset
        </Button>
      </div>

      {error && (
        <Typography color="error" style={{ marginBottom: 16 }}>
          {error}
        </Typography>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Applicant Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell>Application Type</TableCell>
            <TableCell>Purpose</TableCell>
            <TableCell>Purpose Description</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {applications.map(app => (
            <TableRow key={app.applicationNumber} hover>
              <TableCell>{app.applicantName}</TableCell>
              <TableCell>{app.applicantEmail}</TableCell>
              <TableCell>{app.applicantPhone}</TableCell>
              <TableCell>{app.amount}</TableCell>
              <TableCell>{app.currency}</TableCell>
              <TableCell>{app.applicationType}</TableCell>
              <TableCell>{app.purpose}</TableCell>
              <TableCell>{app.purposeDescription}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default ViewApplications
