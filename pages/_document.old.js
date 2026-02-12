import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { SheetsRegistry } from 'react-jss'
import { JssProvider } from 'react-jss'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheetsRegistry = new SheetsRegistry()
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props =>
          (
            <JssProvider registry={sheetsRegistry}>
              <App {...props} />
            </JssProvider>
          ),
      })

    const initialProps = await Document.getInitialProps(ctx)

    return Object.assign({}, initialProps, {
      styles: (
        <React.Fragment>
          {initialProps.styles}
          <style id="jss-server-side">{sheetsRegistry.toString()}</style>
        </React.Fragment>
      ),
    })
  }

  render() {
    return (
      <html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

export default MyDocument
