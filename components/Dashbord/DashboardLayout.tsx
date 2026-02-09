import React, { useState } from 'react'
import { withStyles, createStyles, Theme, WithStyles } from '@material-ui/core'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../sidebar/sidebar'
import CreateApplication from '../applications/CreateApplication'
import ViewApplications from '../applications/ViewApplications'

const NAVBAR_HEIGHT = 64
const SIDEBAR_WIDTH = 2

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    content: {
      flexGrow: 1,
      marginTop: NAVBAR_HEIGHT,              // space for navbar
      marginLeft: SIDEBAR_WIDTH,             // space for sidebar
      height: `calc(100vh - ${NAVBAR_HEIGHT}px)`, // 👈 KEY FIX
      overflow: 'auto',                      // 👈 scroll only here
      padding: 24
    }
  })

interface Props extends WithStyles<typeof styles> {}

const DashboardLayout: React.FC<Props> = ({ classes }) => {
  const [selectedMenu, setSelectedMenu] = useState('VIEW_APP')

  const renderContent = () => {
    switch (selectedMenu) {
      case 'CREATE_APP':
        return <CreateApplication />
      case 'VIEW_APP':
        return <ViewApplications />
      default:
        return null
    }
  }

  return (
    <>
      <Navbar title="MVSI" />

      <div className={classes.root}>
        <Sidebar onMenuSelect={setSelectedMenu} />
        <main className={classes.content}>
          {renderContent()}
        </main>
      </div>
    </>
  )
}

export default withStyles(styles)(DashboardLayout)
