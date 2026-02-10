import React from 'react';
import Router from 'next/router';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  withStyles,
  WithStyles,
  createStyles,
  Theme
} from '@material-ui/core';
 
const styles = (theme: Theme) => createStyles({
  root: { flexGrow: 1 },
  flex: { flex: 1 },
  appBar: { backgroundColor: theme.palette.primary.main }
});
 
interface Props extends WithStyles<typeof styles> {
  title: string;
}
 
class Navbar extends React.Component<Props> {
  handleLogout = async () => {
    try {
      const response = await fetch('/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
 
      if (response.ok) {
        // After server clears the cookie, redirect to login
        Router.push('/index');
      }
    } catch (err) {
      console.error('Logout failed', err);
    }
  };
 
  render() {
    const { classes, title } = this.props;
 
    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              {title}
            </Typography>
            {/* <Button color="inherit" onClick={this.handleLogout}>
              Logout
            </Button> */}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
 
export default withStyles(styles)(Navbar);