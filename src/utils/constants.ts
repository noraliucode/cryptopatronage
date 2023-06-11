import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import MuseumIcon from "@mui/icons-material/Museum";
import LanguageIcon from "@mui/icons-material/Language";
import { IPlaceHoper, Languages } from "./types";

export const ROCOCO = "wss://rococo-rpc.polkadot.io";
export const WESTEND = "wss://westend-rpc.polkadot.io";
export const KUSAMA = "wss://kusama-rpc.polkadot.io";
export const POLKADOT = "wss://rpc.polkadot.io";
export const KABOCHA = "wss://kabocha.jelliedowl.net";

export const SUPPORTER_LIST = "SUPPORTER_LIST";
export const RATE = 1;
export const USER_PAYMENT = 1;
export const ANONYMOUS_CREATED = "AnonymousCreated";
export const PURE_CREATED = "PureCreated";
export const RESERVED_AMOUNT = 0.001;
export const ZERO_BAL = 0;
export const NETWORK = "network";
export const SUPPORTERS = "supporters";
export const PULL_HISTORY = "pullHistory";
export const USER_PURE_PROXY = "userPureProxy";
export const IS_COMMITTED = "isCommitted";
export const IS_DELAYED = "isDelayed";

export const SUPPORTER = {
  ROCOCO: "5FWRBKS8qncTegjmBnVrEnQYVR2Py6FtZCtQFiKBuewDkhpr",
  WESTEND: "5FWRBKS8qncTegjmBnVrEnQYVR2Py6FtZCtQFiKBuewDkhpr",
  KUSAMA: "G22qdn1U9dPQLZCxVJu8jmYe1Jdmm551aj9eNb9PT9iVzKh",
};

export const DECIMALS = {
  ROCOCO: 12,
  WESTEND: 12,
  KUSAMA: 12,
  KABOCHA: 12,
  POLKADOT: 10,
};
export const M_DECIMALS = {
  ROCOCO: 9,
  WESTEND: 9,
  KUSAMA: 9,
};
export const DEFAULT_NETWORK = "KUSAMA";
export const NODE_ENDPOINT = {
  ROCOCO,
  WESTEND,
  KUSAMA,
  POLKADOT,
  KABOCHA,
};
export const SYMBOL = {
  ROCOCO: "ROC",
  WESTEND: "WND",
  KUSAMA: "KSM",
  POLKADOT: "DOT",
  KABOCHA: "KAB",
};

const assetPath = "/assets/networks/";

export const NETWORKS = [
  { network: "ROCOCO", icon: `${assetPath}rococo.svg` },
  { network: "WESTEND", icon: `${assetPath}westend.svg` },
  { network: "KUSAMA", icon: `${assetPath}kusama.gif` },
  // { network: "POLKADOT", icon: `${assetPath}polkadot.svg` }, // We believe that a deposit of 20 DOT for setting up an identity is excessive. As a result, we have decided to suspend our support polkadot for the time being.
  { network: "KABOCHA", icon: `${assetPath}kabocha.svg` },
];
export const SECONDS_IN_ONE_DAY = 60 * 60 * 24;
export const DAYS_IN_ONE_MONTH = 30.4;

export const GITHUB_URL = "https://github.com/noraliucode/cryptopatronage";

export const SOCIAL_ITEMS = [
  {
    id: "github",
    label: "github",
    icon: GitHubIcon,
    href: "https://github.com/noraliucode/cryptopatronage",
  },
  {
    id: "twitter",
    label: "twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/ShokuninNetwork",
  },
];

export const MENU = [
  {
    label: "About",
    link: "/about",
    icon: HelpOutlineIcon,
  },
  {
    label: "Language",
    link: "",
    icon: LanguageIcon,
  },
];

export const SIDE_BAR = [
  {
    label: "Explore",
    link: "/",
    icon: MuseumIcon,
  },
  {
    label: "Manage",
    link: "/manage",
    icon: SettingsIcon,
  },
];

export const NAV_BAR_HEIGHT = 64;
export const FOOTER_HEIGHT = 58.5;

export const WALLETS = [
  {
    name: "subwallet-js",
    icon: "/assets/wallets/subwallet.svg",
    url: "https://subwallet.app/",
  },
  {
    name: "polkadot-js",
    icon: "/assets/wallets/polkadot.svg",
    url: "https://polkadot.js.org/extension/",
  },
  {
    name: "talisman",
    icon: "/assets/wallets/talisman.svg",
    url: "https://www.talisman.xyz/",
  },
];

export const DISPLAY_NAME = "Display Name";
export const EMAIL = "Email";
export const TWITTER = "Twitter";
export const WEB = "Web";

export const SUBSTRATE_WALLET = "SUBSTRATE_WALLET";
export const APP_SESSION = "APP_SESSION";
export const IMAGE_HEIGHT = 140;
export const IDENTITY_LABELS = [DISPLAY_NAME, EMAIL, TWITTER, WEB];
export const PLACEHOLDER: IPlaceHoper = {
  [DISPLAY_NAME]: "userName",
  [EMAIL]: "exampleUser@gmail.com",
  [TWITTER]: "https://twitter.com/exampleUser",
  [WEB]: "https://www.example.com/",
};
export const Personal_Info = "Personal Info";
export const My_Supporters = "My Supporters";
export const My_Subscription = "My Subscription";
export const Clear_Identity = "Clear Identity";
export const Unregister = "Unregister";
export const Payment_System = "Payment System";
export const Unnote_Preimages = "Unnote Preimages";

export const MANAGE_SECTIONS = [
  {
    title: Payment_System,
    id: `#${Payment_System.split(" ").join("")}`,
  },
  {
    title: Personal_Info,
    id: `#${Personal_Info.split(" ").join("")}`,
  },
  {
    title: My_Supporters,
    id: `#${My_Supporters.split(" ").join("")}`,
  },
  {
    title: My_Subscription,
    id: `#${My_Subscription.split(" ").join("")}`,
  },
  {
    title: Unnote_Preimages,
    id: `#${Unnote_Preimages.split(" ").join("")}`,
  },
  {
    title: Clear_Identity,
    id: `#${Clear_Identity.split(" ").join("")}`,
  },
  {
    title: Unregister,
    id: `#${Unregister.split(" ").join("")}`,
  },
];

export const lngs: Languages = {
  en: { nativeName: "English" },
  zh: { nativeName: "中文" },
};

export const INFURA_URL = "https://ipfs.infura.io:5001/api/v0/";

export const COINGECKO_IDS = {
  ROCOCO: "rococo",
  WESTEND: "westend",
  KUSAMA: "kusama",
  POLKADOT: "polkadot",
  KABOCHA: "kabocha",
};
