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

export const useAccounts = (signerAddress?: string) => {
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let injector;
      if (signerAddress) {
        injector = await web3FromAddress(signerAddress);
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setState((prev) => ({ ...prev, accounts: allAccounts, injector }));
    } catch (error) {}
  };
  useEffect(() => {
    getAccounts();
  }, [signerAddress]);
  return { ...state, getAccounts };
};
