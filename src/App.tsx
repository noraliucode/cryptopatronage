import React from "react";
import "./App.css";
import { useAccounts } from "./hooks/useAccounts";
import { TabsMain } from "./components/Tabs";
import { useSubscribedCreators } from "./hooks/useSubscribedCreators";

function App() {
  const { injector } = useAccounts();
  const { subscribedCreators } = useSubscribedCreators(
    "5FWRBKS8qncTegjmBnVrEnQYVR2Py6FtZCtQFiKBuewDkhpr"
  );

  return (
    <div className="App">
      <header className="App-header">
        <TabsMain subscribedCreators={subscribedCreators} />
      </header>
    </div>
  );
}

export default App;
