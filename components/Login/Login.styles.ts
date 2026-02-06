
const styles = (theme: any) => ({
  root: {
    minHeight: '100vh',
    background: '#f2f2f2'
  },
  paper: {
    width: 900,
    minHeight: 420
  },
  leftPanel: {
    padding: theme.spacing.unit * 4,
    textAlign: 'center',
    borderRight: '1px solid #e0e0e0'
  },
  rightPanel: {
    padding: theme.spacing.unit * 4
  },
  logo: {
    width: 120,
    marginBottom: theme.spacing.unit * 2
  },
  description: {
    fontSize: 13,
    color: '#555'
  },
  version: {
    marginTop: theme.spacing.unit * 4,
    fontSize: 12,
    color: '#888'
  },
  signInTitle: {
    marginBottom: theme.spacing.unit * 2
  },
  primaryButton: {
    marginTop: theme.spacing.unit * 3
  },
  secondaryButton: {
    marginTop: theme.spacing.unit * 2
  },
  resetButton: {
    marginTop: theme.spacing.unit * 2,
    color: '#555'
  },
  backButton: {
  marginTop: 8,
  textTransform: 'none',
  color: '#1976d2'
},
  footer: {
    padding: theme.spacing.unit,
    textAlign: 'right'
  }
})

export default styles
