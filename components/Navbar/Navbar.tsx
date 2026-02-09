import React from 'react'
import Router from 'next/router'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  withStyles,
  WithStyles,
  createStyles,
  Theme
} from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1, // 👈 above sidebar
      backgroundColor: theme.palette.primary.main
    },
    title: {
      flexGrow: 1
    }
  })

interface Props extends WithStyles<typeof styles> {
  title: string
}

class Navbar extends React.Component<Props> {
  handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    Router.push('/')
  }

  render() {
    const { classes, title } = this.props

    return (
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="title" className={classes.title}>
            {title}
          </Typography>
          <Button color="inherit" onClick={this.handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    )
  }
}

export default withStyles(styles)(Navbar)
