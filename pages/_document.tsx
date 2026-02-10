import React from "react"
import Document, { Head, Main, NextScript } from "next/document"
import { SheetsRegistry } from "react-jss"
import JssProvider from "react-jss/lib/JssProvider"
import { createGenerateClassName } from "@material-ui/core/styles"
 
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheetsRegistry = new SheetsRegistry()
    const generateClassName = createGenerateClassName()
 
    const originalRenderPage = ctx.renderPage
 
    // ✅ Next 6 correct way:
    ctx.renderPage = () =>
      originalRenderPage(App => props =>
        React.createElement(
          JssProvider,
          { registry: sheetsRegistry, generateClassName },
          React.createElement(App, props)
        )
      )
 
    const initialProps = await Document.getInitialProps(ctx)
 
    return Object.assign({}, initialProps, {
      styles: React.createElement(
        "div",
        null,
        initialProps.styles,
        React.createElement("style", {
          id: "jss-server-side",
          dangerouslySetInnerHTML: { __html: sheetsRegistry.toString() }
        })
      )
    })
  }
 
  render() {
    return React.createElement(
      "html",
      null,
      React.createElement(Head, null),
      React.createElement(
        "body",
        null,
        React.createElement(Main, null),
        React.createElement(NextScript, null)
      )
    )
  }
}