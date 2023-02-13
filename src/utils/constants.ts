import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import MuseumIcon from "@mui/icons-material/Museum";

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
  { network: "POLKADOT", icon: `${assetPath}polkadot.svg` },
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
    label: "Explore",
    link: "/",
    icon: MuseumIcon,
  },
  {
    label: "Manage",
    link: "/manage",
    icon: SettingsIcon,
  },
  {
    label: "About",
    link: "/about",
    icon: HelpOutlineIcon,
  },
];

export const NAV_BAR_HEIGHT = 64;
export const FOOTER_HEIGHT = 58.5;

export const WALLETS = [
  { name: "subwallet-js", icon: "/assets/wallets/subwallet.svg" },
  { name: "polkadot-js", icon: "/assets/wallets/polkadot.svg" },
  { name: "talisman", icon: "/assets/wallets/talisman.svg" },
];

export const SUBSTRATE_WALLET = "SUBSTRATE_WALLET";
export const APP_SESSION = "APP_SESSION";
export const IMAGE_HEIGHT = 140;
export const IDENTITY_LABELS = ["Display Name", "Email", "Twitter", "Web"];
