import React from "react";
import "./App.css";
import { TabsMain } from "./components/Tabs";
import { useSubscribedCreators } from "./hooks/useSubscribedCreators";
import { useSupporters } from "./hooks/useSupporters";
import { CREATOR, SUPPORTER, NETWORK } from "./utils/constants";

function App() {
  const { subscribedCreators, getSubscribedCreators } = useSubscribedCreators(
    SUPPORTER[NETWORK]
  );
  const { supporters, getSupporters } = useSupporters(CREATOR[NETWORK]);

  return (
    <div className="App">
      <header className="App-header">
        <TabsMain
          subscribedCreators={subscribedCreators}
          supporters={supporters}
          getSubscribedCreators={getSubscribedCreators}
          getSupporters={getSupporters}
        />
      </header>
    </div>
  );
}

export default App;
