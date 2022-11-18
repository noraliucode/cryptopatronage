import React from "react";
import "./App.css";
import { TabsMain } from "./components/Tabs";
import { Web3ConnectedContextProvider } from "./context/Web3ConnectedContext";
import { NavigationBar } from "./components/NavigationBar";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Web3ConnectedContextProvider>
          <>
            <NavigationBar />
            <TabsMain />
          </>
        </Web3ConnectedContextProvider>
      </header>
    </div>
  );
}

export default App;
