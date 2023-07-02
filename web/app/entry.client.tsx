import { RemixBrowser } from "@remix-run/react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material";
import { theme } from "./styles/theme";

ReactDOM.hydrateRoot(
  document,
  <ThemeProvider theme={theme}>
    <RemixBrowser />
  </ThemeProvider>
);
