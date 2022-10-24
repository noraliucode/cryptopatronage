import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";
import { useEffect, useState } from "react";

interface IState {
  accounts: InjectedAccountWithMeta[];
  injector: InjectedExtension | null;
}

export const useAccounts = (signerAddress: string) => {
  const [state, setState] = useState<IState>({
    accounts: [],
    injector: null,
  });

  const getAccounts = async () => {
    try {
      const extensions = await web3Enable("Cryptopatronage");
      if (extensions.length === 0) {
        // no extension installed, or the user did not accept the authorization
        // in this case we should inform the use and give a link to the extension
        return;
      }

      const allAccounts = await web3Accounts();
      // // const injector = await web3FromAddress(SUPPORTER_1);
      const injector = await web3FromAddress(signerAddress);

      setState((prev) => ({ ...prev, accounts: allAccounts, injector }));
    } catch (error) {}
  };
  useEffect(() => {
    getAccounts();
  }, [signerAddress]);
  return { ...state, getAccounts };
};
