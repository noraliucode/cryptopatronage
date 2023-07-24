import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
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
  display?: string;
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
export type IExtension = InjectedExtension[] | null;

export type IWeb3ConnectedContextState = {
  network: INetwork;
  accounts: IAccounts;
  signer: InjectedAccountWithMeta | null;
  injector: IInjector;
  setSigner: (value: InjectedAccountWithMeta | null) => void;
  setNetwork: (value: string) => any;
  selectedWallet: string;
  setSelectedWallet: (value: string) => any;
  // TODO: Move these to a global context later
  isShowSensitiveContent: boolean;
  setIsShowSensitiveContent: (value: boolean) => void;
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
  isSensitive: boolean;
  isUsd: boolean;
};

export type IAdditionalInfo = {
  rate: number;
  imgUrl: string;
  isSensitive: boolean;
  ps?: string;
  [lt_address: string]: unknown;
  isUsd: boolean;
};

export type INetwork = keyof ICreatorAddress;

export type ICreatorAddress = {
  ROCOCO: string;
  WESTEND: string;
  KUSAMA: string;
  POLKADOT: string;
};

export type IParsedProxies = {
  committedCreators: IProxyParsedCreators;
  uncommittedCreators: IProxyParsedCreators;
};

export type IParsedSupporterProxies = {
  committedSupporters: ISupporters;
  uncommittedSupporters: ISupporters;
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
  url: string;
  text: string;
  isInstalled: boolean;
};

export type IHandleChange = (
  _: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => void;

export type IHandleCheck = (event: {
  target: { checked: boolean | ((prevState: boolean) => boolean) };
}) => void;

export type IPlaceHoper = { [key: string]: string };

export type IUrls = {
  web: string;
  img: string;
  twitter: string;
};
interface LanguageInfo {
  nativeName: string;
}

export type Languages = {
  [key: string]: LanguageInfo;
};

export type IMenuItem = {
  label: string;
  link: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string };
};

export interface DataMapping {
  [address: string]: { imgUrl: string };
}

export type ISupporter = {
  address: string;
  subscribedTime: number;
  expiresOn: number;
  pureProxy: string | null;
  pureBalance?: number;
  supporterBalance?: number;
  callHash?: string;
};

export type ISupporters = ISupporter[] | [];

export type IHistory = {
  supporter: string;
  pure: string;
  time: number;
  amount: number;
  tx?: string;
};

export type IHistoryList = IHistory[] | [] | undefined;

export type ISupporterInfo = {
  address: string;
  pubKey: string;
};

export type IContentLink = {
  title: string;
  encryptedContent: string;
  decryptedContent: string;
  date: number;
  creator: string;
  encryptedSymKey: string;
  iv: string;
};

export type IContentLinks = IContentLink[] | [];

type IContentLinkKeys = {
  [pubKey: string]: string;
};
export interface IContentLinkDatabase {
  date: number;
  title: string;
  content: string;
  encryptedSymKey: string;
  keys: IContentLinkKeys;
}

export type IContent = { contentTitle: string; contentLink: string };

export type IAnnounce = {
  isExecuted: boolean;
  delegate: string;
  real: string;
};
