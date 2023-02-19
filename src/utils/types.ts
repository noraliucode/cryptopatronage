import {
  InjectedExtension,
  InjectedAccountWithMeta,
} from "@polkadot/extension-inject/types";
import { ChangeEvent } from "react";

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
export type IAccounts = InjectedAccountWithMeta[] | null;

type IMeta = {
  name: string;
  genesisHash: string;
};

export type IInjector = InjectedExtension | null;

export type IWeb3ConnectedContextState = {
  network: INetwork;
  accounts: IAccounts;
  signer: InjectedAccountWithMeta | null;
  injector: IInjector;
  setSigner: (value: InjectedAccountWithMeta) => void;
  setNetwork: (value: string) => any;
  selectedWallet: string;
  setSelectedWallet: (value: string) => any;
};

export type ICreator = {
  address: string;
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

export type IWallet = {
  name: string;
  icon: string;
};

export type IHandleChange = (
  _: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => void;

export type IHandleCheck = (event: {
  target: { checked: boolean | ((prevState: boolean) => boolean) };
}) => void;
