import React from "react";
import "./App.css";
import { AccountSelector } from "./components/AccountSelector";
import { TabsMain } from "./components/Tabs";
import { useRate } from "./hooks/useRate";
import { useSubscribedCreators } from "./hooks/useSubscribedCreators";
import { useSupporters } from "./hooks/useSupporters";
import { CREATOR, SUPPORTER, NETWORK } from "./utils/constants";

function App() {
  const { rate, getRate } = useRate(CREATOR[NETWORK]);
  const { subscribedCreators, getSubscribedCreators } = useSubscribedCreators(
    SUPPORTER[NETWORK],
    rate
  );
  const { committedSupporters, getSupporters, uncommittedSupporters } =
    useSupporters(CREATOR[NETWORK], rate);

  return (
    <div className="App">
      <header className="App-header">
        <AccountSelector />
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
