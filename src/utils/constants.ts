import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";

export const ROCOCO = "wss://rococo-rpc.polkadot.io";
export const WESTEND = "wss://westend-rpc.polkadot.io";
export const KUSAMA = "wss://kusama-rpc.polkadot.io";

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
};
export const M_DECIMALS = {
  ROCOCO: 9,
  WESTEND: 9,
  KUSAMA: 9,
};
export const DEFAULT_NETWORK = "ROCOCO";
export const NODE_ENDPOINT = {
  ROCOCO: "wss://rococo-rpc.polkadot.io",
  WESTEND: "wss://westend-rpc.polkadot.io",
  KUSAMA: "wss://kusama-rpc.polkadot.io",
};
export const SYMBOL = {
  ROCOCO: "ROC",
  WESTEND: "WND",
  KUSAMA: "KSM",
};

export const NETWORKS = ["ROCOCO", "WESTEND", "KUSAMA"];
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
  },
  {
    label: "Manage",
    link: "/manage",
  },
  {
    label: "About",
    link: "/about",
  },
];
