import { InjectedExtension } from "@polkadot/extension-inject/types";

export type IProxyParsedSupporter = {
  supporter?: string;
  pure?: string;
  pureBalance?: number;
  supporterBalance?: number;
};
export type IProxyParsedSupporters = IProxyParsedSupporter[] | [];

export type ICreatorProxyParsed = {
  creator: string;
  pure?: string;
};
export type IProxyParsedCreators = ICreatorProxyParsed[] | [];

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
  network: INetwork;
  accounts: IAccounts;
  signer: IAccount | null;
  injector: IInjector;
  setSigner: (value: IAccount) => void;
  setNetwork: (value: string) => any;
};

export type ICreator = {
  address?: string;
  transferableBalance?: number;
  supporterBalance?: number;
  rate?: string;
  imageUrl?: string;
  email: string;
  twitter: string;
  display: string;
  web: string;
};

export type IAdditionalInfo = {
  rate: string;
  ps: string;
};

export type INetwork = keyof ICreatorAddress;

export type ICreatorAddress = {
  ROCOCO: string;
  WESTEND: string;
  KUSAMA: string;
};

export type IParsedProxies = {
  committedCreators: IProxyParsedCreators;
  uncommittedCreators: IProxyParsedCreators;
};

export type IParsedSupporterProxies = {
  committedSupporters: IProxyParsedSupporters;
  uncommittedSupporters: IProxyParsedSupporters;
};

export type Identity = {
  email: string;
  twitter: string;
  display: string;
  web: string;
};
