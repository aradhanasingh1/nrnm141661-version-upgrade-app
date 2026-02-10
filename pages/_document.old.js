import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { SheetsRegistry } from 'react-jss'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

const theme = createMuiTheme()

export default class MyDocument extends Document {
  static getInitialProps(ctx) {
    const sheetsRegistry = new SheetsRegistry()
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => (
          <MuiThemeProvider theme={theme} sheetsRegistry={sheetsRegistry}>
            <CssBaseline />
            <App {...props} />
          </MuiThemeProvider>
        )
      })

    const initialProps = Document.getInitialProps(ctx)

    return {
      ...initialProps,
      styles: (
        <React.Fragment>
          {initialProps.styles}
          <style
            id="jss-server-side"
            dangerouslySetInnerHTML={{
              __html: sheetsRegistry.toString()
            }}
          />
        </React.Fragment>
      )
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
