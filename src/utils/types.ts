import { InjectedExtension } from "@polkadot/extension-inject/types";

export type ISupporter = {
  supporter?: string;
  pure?: string;
  pureBalance?: number;
  supporterBalance?: number;
};
export type ISupporters = ISupporter[] | null;

export type IAccount = {
  address: string;
  meta: IMeta;
};
export type IAccounts = IAccount[] | null;

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

export type ICreator = {
  address?: string;
  transferableBalance?: number;
  supporterBalance?: number;
};
