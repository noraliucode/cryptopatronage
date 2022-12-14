import React from "react";
import { NavigationBar } from "../components/NavigationBar";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../theme";
import { Web3ConnectedContextProvider } from "../context/Web3ConnectedContext";
import { Footer } from "../components/Footer";

export const Layout = ({ children }: { children: any }) => {
  return (
    <Web3ConnectedContextProvider>
      <ThemeProvider theme={theme}>
        <div className="App">
          <NavigationBar />
          {children}
          <Footer />
        </div>
      </ThemeProvider>
    </Web3ConnectedContextProvider>
  );
};
