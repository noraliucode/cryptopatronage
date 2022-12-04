import { ThemeOptions, createTheme } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#6e27e4",
    },
    secondary: {
      main: "#f50057",
    },
  },
};

export const theme = createTheme(themeOptions);
