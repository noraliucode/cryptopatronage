import React from "react";
import "./App.css";
import { TabsMain } from "./components/Tabs";
import { useRate } from "./hooks/useRate";
import { useSubscribedCreators } from "./hooks/useSubscribedCreators";
import { useSupporters } from "./hooks/useSupporters";
import { CREATOR, SUPPORTER, NETWORK } from "./utils/constants";

function App() {
  const { subscribedCreators, getSubscribedCreators } = useSubscribedCreators(
    SUPPORTER[NETWORK]
  );
  const { committedSupporters, getSupporters, uncommittedSupporters } =
    useSupporters(CREATOR[NETWORK]);

  const { rate, getRate } = useRate(CREATOR[NETWORK]);

  return (
    <div className="App">
      <header className="App-header">
        <TabsMain
          subscribedCreators={subscribedCreators}
          committedSupporters={committedSupporters}
          getSubscribedCreators={getSubscribedCreators}
          getSupporters={getSupporters}
          uncommittedSupporters={uncommittedSupporters}
          currentRate={rate}
          getRate={getRate}
        />
      </header>
    </div>
  );
}

export default App;
