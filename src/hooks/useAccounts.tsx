import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";
import { SUPPORTER_1 } from "../utils/constants";
import { useEffect, useState } from "react";

interface IState {
  accounts: InjectedAccountWithMeta[];
  injector: InjectedExtension | null;
}

export const useAccounts = () => {
  const [state, setState] = useState<IState>({
    accounts: [],
    injector: null,
  });

  const getAccounts = async () => {
    try {
      await web3Enable("Cryptopatronage");
      const allAccounts = await web3Accounts();
      const injector = await web3FromAddress(SUPPORTER_1);
      setState((prev) => ({ ...prev, accounts: allAccounts, injector }));
    } catch (error) {}
  };
  useEffect(() => {
    getAccounts();
  }, []);
  return { ...state, getAccounts };
};
