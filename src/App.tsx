import React from "react";
import "./App.css";
import { TabsMain } from "./components/Tabs";
import { useRate } from "./hooks/useRate";
import { useSubscribedCreators } from "./hooks/useSubscribedCreators";
import { useSupporters } from "./hooks/useSupporters";
import { CREATOR, SUPPORTER, NETWORK } from "./utils/constants";
import { Web3ConnectedContextProvider } from "./context/Web3ConnectedContext";
import { NavigationBar } from "./components/NavigationBar";

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
        <Web3ConnectedContextProvider>
          <>
            <NavigationBar />
            <TabsMain
              subscribedCreators={subscribedCreators}
              committedSupporters={committedSupporters}
              getSubscribedCreators={getSubscribedCreators}
              getSupporters={getSupporters}
              uncommittedSupporters={uncommittedSupporters}
              currentRate={rate}
              getRate={getRate}
            />
          </>
        </Web3ConnectedContextProvider>
      </header>
    </div>
  );
}

export default App;
