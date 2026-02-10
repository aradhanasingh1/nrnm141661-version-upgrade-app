// pages/_app.js   👈 rename to .js if .tsx keeps failing

import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme();

export default function MyApp(props) {
  const { Component, pageProps } = props;
  return (
    <MuiThemeProvider theme={theme}>
      <Component {...pageProps} />
    </MuiThemeProvider>
  );
}
