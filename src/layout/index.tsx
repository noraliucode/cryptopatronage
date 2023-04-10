import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../theme";
import { Web3ConnectedContextProvider } from "../context/Web3ConnectedContext";
import Sidebar from "./Sidebar";

export const Layout = ({ children }: { children: any }) => {
  return (
    <Web3ConnectedContextProvider>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Sidebar children={children} />
        </div>
      </ThemeProvider>
    </Web3ConnectedContextProvider>
  );
};
