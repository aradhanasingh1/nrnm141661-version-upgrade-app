import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon
} from '@material-ui/core'

// Material UI icons (v1 compatible)
import DashboardIcon from '@material-ui/icons/Dashboard'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import AssignmentIcon from '@material-ui/icons/Assignment'
import PeopleIcon from '@material-ui/icons/People'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import GavelIcon from '@material-ui/icons/Gavel'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

const drawerWidth = 230

interface State {
  path: string
}

class Sidebar extends React.Component<{}, State> {
  state: State = {
    path: ''
  }

  componentDidMount() {
    // ✅ Safe for SSR
    this.setState({ path: window.location.pathname })
  }

  isActive = (route: string) => {
    return this.state.path.startsWith(route)
  }

  navigate = (url: string) => {
    window.location.href = url
  }

  menuItemStyle = (active: boolean) => ({
    padding: '10px 16px',
    margin: '4px 8px',
    borderRadius: 4,
    backgroundColor: active ? '#e6f0ff' : 'transparent',
    borderLeft: active ? '4px solid #1976d2' : '4px solid transparent'
  })

  textStyle = (active: boolean) => ({
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    color: active ? '#1976d2' : '#333'
  })

  render() {
    return (
      <Drawer
        variant="permanent"
        PaperProps={{
          style: {
            width: drawerWidth,
            background: 'linear-gradient(#f7f7f7, #eeeeee)',
            borderRight: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {/* ===== MAIN MENU ===== */}
        <List>

          <ListItem
            button
            style={this.menuItemStyle(this.isActive('/dashboard'))}
            onClick={() => this.navigate('/dashboard')}
          >
            <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
            <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{ style: this.textStyle(this.isActive('/dashboard')) }}
            />
          </ListItem>

          <ListItem
            button
            style={this.menuItemStyle(this.isActive('/offers'))}
            onClick={() => this.navigate('/offers')}
          >
            <ListItemIcon><LocalOfferIcon fontSize="small" /></ListItemIcon>
            <ListItemText
              primary="Offers"
              primaryTypographyProps={{ style: this.textStyle(this.isActive('/offers')) }}
            />
          </ListItem>

          <ListItem
            button
            style={this.menuItemStyle(this.isActive('/applications'))}
            onClick={() => this.navigate('/applications')}
          >
            <ListItemIcon><AssignmentIcon fontSize="small" /></ListItemIcon>
            <ListItemText
              primary="Applications"
              primaryTypographyProps={{ style: this.textStyle(this.isActive('/applications')) }}
            />
          </ListItem>

          <ListItem
            button
            style={this.menuItemStyle(this.isActive('/customers'))}
            onClick={() => this.navigate('/customers')}
          >
            <ListItemIcon><PeopleIcon fontSize="small" /></ListItemIcon>
            <ListItemText
              primary="Customers"
              primaryTypographyProps={{ style: this.textStyle(this.isActive('/customers')) }}
            />
          </ListItem>

          <ListItem
            button
            style={this.menuItemStyle(this.isActive('/prospects'))}
            onClick={() => this.navigate('/prospects')}
          >
            <ListItemIcon><PersonAddIcon fontSize="small" /></ListItemIcon>
            <ListItemText
              primary="Prospects"
              primaryTypographyProps={{ style: this.textStyle(this.isActive('/prospects')) }}
            />
          </ListItem>

          <ListItem
            button
            style={this.menuItemStyle(this.isActive('/underwriting'))}
            onClick={() => this.navigate('/underwriting')}
          >
            <ListItemIcon><GavelIcon fontSize="small" /></ListItemIcon>
            <ListItemText
              primary="Underwriting"
              primaryTypographyProps={{ style: this.textStyle(this.isActive('/underwriting')) }}
            />
          </ListItem>

        </List>

        {/* PUSH LOGOUT TO BOTTOM */}
        <div style={{ flexGrow: 1 }} />

        <Divider />

        {/* ===== LOGOUT ===== */}
        <List>
          <ListItem
            button
            style={{ padding: '10px 16px', margin: 8 }}
            onClick={() => {
              fetch('/auth/logout', { method: 'POST' }).finally(() => {
                this.navigate('/')
              })
            }}
          >
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" style={{ color: '#d32f2f' }} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                style: { fontSize: 13, color: '#d32f2f', fontWeight: 500 }
              }}
            />
          </ListItem>
        </List>
      </Drawer>
    )
  }
}

export default Sidebar
