import React from "react";
import "./App.css";
import { TabsMain } from "./components/Tabs";
import { useSubscribedCreators } from "./hooks/useSubscribedCreators";
import { useSupporters } from "./hooks/useSupporters";
import { CREATOR_1 } from "./utils/constants";

function App() {
  const { subscribedCreators } = useSubscribedCreators(
    "5FWRBKS8qncTegjmBnVrEnQYVR2Py6FtZCtQFiKBuewDkhpr"
  );
  const { supporters } = useSupporters(CREATOR_1);

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
