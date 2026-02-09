import React, { useState } from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  withStyles,
  createStyles,
  Theme,
  WithStyles
} from '@material-ui/core'

const drawerWidth = 240

const styles = (theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth,
      top: 64 // 👈 BELOW NAVBAR (64px)
    },
    toolbarOffset: theme.mixins.toolbar
  })

interface Props extends WithStyles<typeof styles> {
  onMenuSelect: (menu: string) => void
}

const Sidebar: React.FC<Props> = ({ classes, onMenuSelect }) => {
  const [open, setOpen] = useState(false)

  return (
    <Drawer
      variant="permanent"
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
    >
      <Typography variant="title" style={{ padding: 16 }}>
        Dashboard
      </Typography>

      <Divider />

      <List>
        <ListItem button onClick={() => setOpen(!open)}>
          <ListItemText primary="Applications" />
        </ListItem>

        {open && (
          <>
            <ListItem button onClick={() => onMenuSelect('CREATE_APP')}>
              <ListItemText inset primary="Create Application" />
            </ListItem>
            <ListItem button onClick={() => onMenuSelect('VIEW_APP')}>
              <ListItemText inset primary="View Applications" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  )
}

export default withStyles(styles)(Sidebar)
