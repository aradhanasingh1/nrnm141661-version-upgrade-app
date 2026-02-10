import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon
} from '@material-ui/core'

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
  role: string
}

// ✅ Role → menu mapping
const ROLE_MENU: Record<string, string[]> = {
  ADMIN: [
    '/dashboard',
    '/offers',
    '/applications',
    '/customers',
    '/prospects',
    '/underwriting'
  ],
  UNDERWRITER: ['/dashboard', '/applications', '/underwriting'],
  AGENT: ['/dashboard', '/applications']
}

class Sidebar extends React.Component<{}, State> {
  state: State = {
    path: '',
    role: 'AGENT'
  }

  componentDidMount() {
    const role = localStorage.getItem('role') || 'AGENT'
    this.setState({
      path: window.location.pathname,
      role
    })
  }

  isActive = (route: string) => {
    return this.state.path.startsWith(route)
  }

  canShow = (route: string) => {
    return ROLE_MENU[this.state.role]?.includes(route)
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
        <List>

          {this.canShow('/dashboard') && (
            <ListItem
              button
              style={this.menuItemStyle(this.isActive('/dashboard'))}
              onClick={() => this.navigate('/dashboard')}
            >
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText
                primary="Dashboard"
                primaryTypographyProps={{
                  style: this.textStyle(this.isActive('/dashboard'))
                }}
              />
            </ListItem>
          )}

          {this.canShow('/offers') && (
            <ListItem
              button
              style={this.menuItemStyle(this.isActive('/offers'))}
              onClick={() => this.navigate('/offers')}
            >
              <ListItemIcon><LocalOfferIcon /></ListItemIcon>
              <ListItemText primary="Offers" />
            </ListItem>
          )}

          {this.canShow('/applications') && (
            <ListItem
              button
              style={this.menuItemStyle(this.isActive('/applications'))}
              onClick={() => this.navigate('/applications')}
            >
              <ListItemIcon><AssignmentIcon /></ListItemIcon>
              <ListItemText primary="Applications" />
            </ListItem>
          )}

          {this.canShow('/customers') && (
            <ListItem
              button
              style={this.menuItemStyle(this.isActive('/customers'))}
              onClick={() => this.navigate('/customers')}
            >
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Customers" />
            </ListItem>
          )}

          {this.canShow('/prospects') && (
            <ListItem
              button
              style={this.menuItemStyle(this.isActive('/prospects'))}
              onClick={() => this.navigate('/prospects')}
            >
              <ListItemIcon><PersonAddIcon /></ListItemIcon>
              <ListItemText primary="Prospects" />
            </ListItem>
          )}

          {this.canShow('/underwriting') && (
            <ListItem
              button
              style={this.menuItemStyle(this.isActive('/underwriting'))}
              onClick={() => this.navigate('/underwriting')}
            >
              <ListItemIcon><GavelIcon /></ListItemIcon>
              <ListItemText primary="Underwriting" />
            </ListItem>
          )}

        </List>

        <div style={{ flexGrow: 1 }} />
        <Divider />

        <List>
          <ListItem
            button
            onClick={() => {
              fetch('/auth/logout', { method: 'POST' }).finally(() => {
                localStorage.removeItem('role')
                this.navigate('/')
              })
            }}
          >
            <ListItemIcon>
              <ExitToAppIcon style={{ color: '#d32f2f' }} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    )
  }
}

export default Sidebar
