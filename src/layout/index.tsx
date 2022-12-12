import React from "react";
import { NavigationBar } from "../components/NavigationBar";
import { TabsMain } from "../components/Tabs";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../theme";
import { Web3ConnectedContextProvider } from "../context/Web3ConnectedContext";

export const Layout = () => {
  return (
    <Web3ConnectedContextProvider>
      <ThemeProvider theme={theme}>
        <div className="App">
          <NavigationBar />
          <TabsMain />
        </div>
      </ThemeProvider>
    </Web3ConnectedContextProvider>
  );
};
