import { InjectedExtension } from "@polkadot/extension-inject/types";

export type ISupporter = {
  address: string;
  balance: number;
  pure: string;
};

export type IAccounts = IAccount[] | null;

export type IAccount = {
  address: string;
  meta: IMeta;
};

type IMeta = {
  name: string;
};

export type IInjector = InjectedExtension | null;

export type IWeb3ConnectedContextState = {
  network: string;
  accounts: IAccounts;
  signer: string;
  injector: IInjector;
  setSigner: (value: string) => any;
  setNetwork: (value: string) => any;
};
