import React from "react";
import "./App.css";
import { TabsMain } from "./components/Tabs";
import { useSubscribedCreators } from "./hooks/useSubscribedCreators";
import { useSupporters } from "./hooks/useSupporters";
import { CREATOR, SUPPORTER, NETWORK } from "./utils/constants";

function App() {
  const { subscribedCreators } = useSubscribedCreators(SUPPORTER[NETWORK]);
  const { supporters } = useSupporters(CREATOR[NETWORK]);

  return (
    <div className="App">
      <header className="App-header">
        <TabsMain
          subscribedCreators={subscribedCreators}
          supporters={supporters}
        />
      </header>
    </div>
  );
}

export default App;
