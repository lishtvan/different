import { createTheme } from "@mui/material";
import { DARK_COLOR, MAIN_COLOR } from "~/constants/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: MAIN_COLOR,
      dark: DARK_COLOR,
      contrastText: "#fff",
    },
  },
  components: {
    MuiList: {
      styleOverrides: {
        root: {
          paddingTop: "0px",
          paddingBottom: "0px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
        },
      },
    },
  },
});