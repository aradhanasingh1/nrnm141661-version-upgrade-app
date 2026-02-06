import React from 'react';
import { Paper, Typography, withStyles, WithStyles, createStyles, Theme } from '@material-ui/core';
import Navbar from '../Navbar/Navbar'; // Adjust path based on your structure
 
const styles = (theme: Theme) => createStyles({
  container: {
    padding: theme.spacing.unit * 3,
    margin: theme.spacing.unit * 3,
  }
});
 
interface Props extends WithStyles<typeof styles> {}
 
class DashboardPage extends React.Component<Props> {
  render() {
    const { classes } = this.props;
 
    return (
      <div>
        <Navbar title="User Dashboard" />
        <Paper className={classes.container}>
          <Typography variant="headline" gutterBottom>
            Welcome to the Dashboard
          </Typography>
          <Typography variant="body1">
            Only authorized users can see this content.
          </Typography>
        </Paper>
      </div>
    );
  }
}
 
export default withStyles(styles)(DashboardPage);