// import React from 'react'
// import App, { Container } from 'next/app'
// import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
// import CssBaseline from '@material-ui/core/CssBaseline'

// const theme = createMuiTheme()

// class MyApp extends App {
//   componentDidMount() {
//     const jssStyles = document.querySelector('#jss-server-side')
//     if (jssStyles) {
//       jssStyles.parentNode.removeChild(jssStyles)
//     }
//   }

//   render() {
//     const { Component, pageProps } = this.props

//     return (
//       <Container>
//         <MuiThemeProvider theme={theme}>
//           <CssBaseline />
//           <Component {...pageProps} />
//         </MuiThemeProvider>
//       </Container>
//     )
//   }
// }

// export default MyApp

import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'

export default class MyApp extends React.Component {
  componentDidMount() {
    // Remove server-side injected CSS
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <CssBaseline />
        <Component {...pageProps} />
      </>
    )
  }
}

