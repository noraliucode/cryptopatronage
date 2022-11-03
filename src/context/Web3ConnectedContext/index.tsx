import { createContext, useContext } from "react";
import { InjectedExtension } from "@polkadot/extension-inject/types";

type IState = {
  network: string;
  accounts: string[];
  signer: string;
  injector: InjectedExtension | null;
};

const Web3ConnectedContext = createContext<IState>(null!);
const useWeb3ConnectedContext = () => useContext(Web3ConnectedContext);

const value = {
  network: "",
  accounts: [""],
  signer: "",
  injector: null,
};

const Web3ConnectedContextProvider = () => {
  return (
    <Web3ConnectedContext.Provider
      value={value}
    ></Web3ConnectedContext.Provider>
  );
};

export default { Web3ConnectedContextProvider, useWeb3ConnectedContext };
