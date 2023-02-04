import { createContext, useContext, useEffect, useState } from "react";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import { IInjector, IWeb3ConnectedContextState } from "../../utils/types";
import { APP_SESSION, DEFAULT_NETWORK } from "../../utils/constants";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

interface IProps {
  children?: React.ReactElement;
}

const SIGNER = "signer";
const NETWORK = "network";
const SELECTED_WALLET = "selectedWallet";

const Web3ConnectedContext = createContext<IWeb3ConnectedContextState>(null!);
const useWeb3ConnectedContext = () => useContext(Web3ConnectedContext);

const Web3ConnectedContextProvider: React.FC<IProps> = ({ children }) => {
  const setValue = (value: string | InjectedAccountWithMeta, key: string) => {
    setState((prev: IWeb3ConnectedContextState) => ({ ...prev, [key]: value }));
  };
  const [state, setState] = useState<IWeb3ConnectedContextState>({
    network: DEFAULT_NETWORK,
    accounts: null,
    signer: null,
    injector: null,
    setSigner: (value) => setValue(value, SIGNER),
    setNetwork: (value) => setValue(value, NETWORK),
    selectedWallet: "",
    setSelectedWallet: (value) => setValue(value, SELECTED_WALLET),
  });
  const {
    network,
    accounts,
    signer,
    injector,
    setSigner,
    setNetwork,
    selectedWallet,
    setSelectedWallet,
  } = state;

  const connector = localStorage.getItem(APP_SESSION);
  let allAccounts = [] as any;

  const getAccounts = async () => {
    try {
      const extensions = await web3Enable("Cryptopatronage");
      if (extensions.length === 0) {
        // no extension installed, or the user did not accept the authorization
        // in this case we should inform the use and give a link to the extension
        return;
      }
      console.log("selectedWallet", selectedWallet);

      const _selectedWallet = connector
        ? JSON.parse(connector).connected
        : selectedWallet;

      console.log("extensions", extensions);
      console.log("_selectedWallet", _selectedWallet);

      const _allAccounts = await web3Accounts();
      allAccounts = _allAccounts.filter(
        (account) => account.meta.source === _selectedWallet
      );
      console.log("allAccounts", allAccounts);
      if (!connector) {
        await localStorage.setItem(
          APP_SESSION,
          JSON.stringify({
            accountIndex: 0,
            connected: selectedWallet,
          })
        );

        setSigner(allAccounts[0]);
      } else {
        setSigner(allAccounts[JSON.parse(connector).accountIndex]);
      }
      let injector: IInjector = null;
      if (signer) {
        injector = await web3FromAddress(signer.address);
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setState((prev) => ({ ...prev, accounts: allAccounts, injector }));
    } catch (error) {
      console.error("Web3ConnectedContextProvider error", error);
    }
  };

  useEffect(() => {
    if (!connector) {
      localStorage.setItem(
        APP_SESSION,
        JSON.stringify({
          accountIndex: 0,
          connected: selectedWallet,
        })
      );

      setSigner(allAccounts[0]);
    } else {
      setSigner(allAccounts[JSON.parse(connector).accountIndex]);
    }
  }, []);

  useEffect(() => {
    getAccounts();
  }, [signer, network, selectedWallet]);

  const value = {
    network,
    accounts,
    signer,
    injector,
    setSigner,
    setNetwork,
    selectedWallet,
    setSelectedWallet,
  };

  return (
    <Web3ConnectedContext.Provider value={value}>
      {children}
    </Web3ConnectedContext.Provider>
  );
};

export { Web3ConnectedContextProvider, useWeb3ConnectedContext };
