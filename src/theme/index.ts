import { ThemeOptions, createTheme } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#6e27e4",
    },
    secondary: {
      main: "#300f78",
    },
    text: {
      primary: "rgba(255,255,255,1)",
    },
    background: {
      default: "#15034f",
    },
    success: {
      main: "#fff",
    },
  },
};

export const theme = createTheme(themeOptions);
