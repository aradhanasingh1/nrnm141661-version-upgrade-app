import React from 'react'
import { CssBaseline } from '@material-ui/core'
import Sidebar from '../Sidebar/Sidebar'
import Navbar from '../Navbar/Navbar'

const SIDEBAR_WIDTH = 230
const NAVBAR_HEIGHT = 56

const rootStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  background: '#f4f6f8'
}

const mainStyle: React.CSSProperties = {
  flexGrow: 1,
  marginLeft: SIDEBAR_WIDTH
}

const contentStyle: React.CSSProperties = {
  padding: 24,
  marginTop: NAVBAR_HEIGHT,
  minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`
}

interface Props {
  children: React.ReactNode
  title?: string
}

interface State {
  mounted: boolean
}

class MainLayout extends React.Component<Props, State> {
  state: State = {
    mounted: false
  }

  componentDidMount() {
    // ✅ prevents SSR + window errors
    this.setState({ mounted: true })
  }

  render() {
    const { mounted } = this.state
    const { children, title } = this.props

    return (
      <div style={rootStyle}>
        <CssBaseline />

        {/* Sidebar – client only */}
        {mounted && <Sidebar />}

        <div style={mainStyle}>
          {/* Navbar */}
          <Navbar title={title || 'Dashboard'} />

          {/* Page Content */}
          <main style={contentStyle}>
            {children}
          </main>
        </div>
      </div>
    )
  }
}

export default MainLayout

