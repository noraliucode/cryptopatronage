import { createContext, useContext, useEffect, useState } from "react";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";

export type IWeb3ConnectedContextState = {
  network: string;
  accounts: IAccount[] | null;
  signer: string;
  injector: InjectedExtension | null;
  setSigner: (value: string) => any;
  setNetwork: (value: string) => any;
};

interface IProps {
  children?: React.ReactElement;
}

export type IAccount = {
  address: string;
  meta: IMeta;
};

type IMeta = {
  name: string;
};

const SIGNER = "signer";
const NETWORK = "network";

const Web3ConnectedContext = createContext<IWeb3ConnectedContextState>(null!);
const useWeb3ConnectedContext = () => useContext(Web3ConnectedContext);

const Web3ConnectedContextProvider: React.FC<IProps> = ({ children }) => {
  const setValue = (value: string, key: string) => {
    setState((prev: IWeb3ConnectedContextState) => ({ ...prev, [key]: value }));
  };
  const [state, setState] = useState<IWeb3ConnectedContextState>({
    network: "",
    accounts: null,
    signer: "",
    injector: null,
    setSigner: (value) => setValue(value, SIGNER),
    setNetwork: (value) => setValue(value, NETWORK),
  });
  const { network, accounts, signer, injector, setSigner, setNetwork } = state;

  const getAccounts = async () => {
    try {
      const extensions = await web3Enable("Cryptopatronage");
      if (extensions.length === 0) {
        // no extension installed, or the user did not accept the authorization
        // in this case we should inform the use and give a link to the extension
        return;
      }

      const allAccounts = await web3Accounts();
      const injector = await web3FromAddress(signer);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setState((prev) => ({ ...prev, accounts: allAccounts, injector }));
    } catch (error) {}
  };

  useEffect(() => {
    getAccounts();
  }, [signer, network]);

  const value = {
    network,
    accounts,
    signer,
    injector,
    setSigner,
    setNetwork,
  };

  return (
    <Web3ConnectedContext.Provider value={value}>
      {children}
    </Web3ConnectedContext.Provider>
  );
};

export { Web3ConnectedContextProvider, useWeb3ConnectedContext };
