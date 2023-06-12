// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Keyring } from "@polkadot/api";
import type {
  AccountId,
  AccountIndex,
  Address,
} from "@polkadot/types/interfaces";
import { ICreatorProxyParsed, IParsedProxies, IUrls } from "./types";
import config from "./ss58-registry.json";

export function toShortAddress(
  _address?: AccountId | AccountIndex | Address | string | null | Uint8Array,
  number = 5
): string {
  const address = (_address || "").toString();

  return address.length > 13
    ? `${address.slice(0, number)}…${address.slice(number * -1 + 1)}`
    : address;
}

export function formatUnit(amount: number, decimals: number): number {
  return amount / 10 ** decimals;
}

function parseUnit(amount: number, decimals: number): number {
  return amount * 10 ** decimals;
}

export function getPaymentAmount(rate: number, lastPaymentTime?: any): number {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const today: any = new Date();
  const timestampToday = today.getTime();

  const _lastPaymentTime = lastPaymentTime
    ? lastPaymentTime
    : getFirstDayOfMonthTimestamp(); // TODO: store user's subscription start time

  /* user's subscription start time should be stored in the following format, in a ipfs storage:
    {
      [address]: {
        last_pull_time: timestamp,
        subscription_start_time: {
          [creator_address]: timestamp
        }
      }
    }
    */

  const daysSinceWithdrawal = Math.floor(
    (timestampToday - _lastPaymentTime) / millisecondsPerDay
  );

  const withdrawableAmount = Math.floor(rate / 30) * daysSinceWithdrawal;
  return withdrawableAmount;
}

export function parseAdditionalInfo(identity: any) {
  const additionalInfo = {} as any;
  identity
    ?.toHuman()
    ?.valueOf()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignores
    .info.additional.forEach((keyValue: any) => {
      additionalInfo[keyValue[0]["Raw"]] = keyValue[1]["Raw"];
    });

  return additionalInfo;
}

export function formatAdditionalInfo(additionalInfo: any) {
  const _additionalInfo = [] as any;

  for (let key in additionalInfo) {
    const item = [
      {
        Raw: key,
      },
      { Raw: additionalInfo[key] },
    ];

    _additionalInfo.push(item);
  }

  return _additionalInfo; // [[{Raw: key}, {Raw: value}], [{Raw: key2}, {Raw: value2}]]
}

export function findPure(
  proxies: any,
  creator: string,
  supporter: string,
  network: string
): string {
  const { committedCreators } = parseSupporterProxies(
    proxies,
    supporter,
    network
  );
  const proxy: ICreatorProxyParsed | undefined = committedCreators.find(
    (proxy: ICreatorProxyParsed) => proxy.creator === creator
  );
  const pure = proxy ? proxy.creator : "";
  return pure;
}

export function parseSupporterProxies(
  // TODO: import type PalletProxyProxyDefinition
  proxies: any,
  supporter: string,
  network: string
): IParsedProxies {
  // TODO: not assignable to parameter of type never" error in TypeScript
  const committedCreators: any = [];
  const uncommittedCreators: any = [];
  proxies.forEach((proxy: any) => {
    const delegations = proxy[1].toHuman()[0];
    if (proxy[0].toHuman()[0] === renderAddress(supporter, network)) {
      delegations.forEach((delegation: any) => {
        uncommittedCreators.push({
          creator: delegation.delegate,
        });
      });
    }

    // supporter address is the second element in our flow
    if (
      proxy[1].toHuman()[0][1]?.delegate === renderAddress(supporter, network)
    ) {
      committedCreators.push({
        creator: proxy[1].toHuman()[0][0]?.delegate,
        pure: proxy[0].toHuman()[0],
      });
    }
  });
  return { committedCreators, uncommittedCreators };
}

export const getSubscribedCreatorsForSupporters = (
  supporter = "",
  pure: string | null,
  proxies: any,
  network: string
) => {
  const committedCreators: any = [];
  const uncommittedCreators: any = [];

  proxies.forEach((proxy: any) => {
    const delegations = proxy[1].toHuman()[0];
    //1. fine entry[0] is pure from entries
    if (proxy[0].toHuman()[0] === renderAddress((pure = ""), network)) {
      // 2. delegates shold only have 2 address, the one which is not supporter should be creator
      // 3. addresses under this category is committed supporter (Not considering the situations that addresses are more than two when users can sign only their own)
      const creator =
        delegations[0]?.delegate === renderAddress(supporter, network)
          ? delegations[1]?.delegate
          : delegations[0]?.delegate;
      committedCreators.push({ creator, pure });
    }
    if (proxy[0].toHuman()[0] === renderAddress(supporter, network)) {
      // 4. fine entry[0] is supporter from entries
      // 5. delegates might have many addresses in this case.
      // 6. addresses under this category is uncommitted supporter
      const creator = delegations[0]?.delegate;
      uncommittedCreators.push({ creator });
    }
  });

  return { committedCreators, uncommittedCreators };
};

export const checkProxyAssociation = async (
  account: string,
  proxyAddress: string,
  proxies: string[]
) => {
  if (proxies.includes(proxyAddress)) {
    console.log(`Account ${account} has pure proxy ${proxyAddress}`);
    return true;
  } else {
    console.log(`Account ${account} does not have pure proxy ${proxyAddress}`);
    return false;
  }
};

export function formatEssentialInfo(info: any) {
  const _info: any = {};
  for (const key in info) {
    if (info[key] && info[key] !== "None") {
      _info[key] = info[key];
    }
  }
  return _info;
}

export function formatUpdatedInfo(info: any) {
  const _info: any = {};
  for (const key in info) {
    if (info[key] && info[key] !== "None") {
      _info[key] = { Raw: info[key] };
    }
  }
  return _info;
}

export function parseEssentialInfo(info: any) {
  const _info: any = {};
  for (const key in info) {
    if (info[key] && info[key] !== "None") {
      _info[key] = info[key]["Raw"];
    }
  }
  return _info;
}

export const removeComma = (text: string) => {
  return text.replace(/,/g, "");
};

export const renderAddress = (
  address: string,
  network: string,
  number?: number
) => {
  if (!address) return "";
  const keyring = new Keyring();
  const registry = config.registry.find(
    (x) => x.network.toLowerCase() === network.toLowerCase()
  );
  const encodedAddress = keyring.encodeAddress(address, registry?.prefix);
  if (number) {
    return toShortAddress(encodedAddress, number);
  } else {
    return encodedAddress;
  }
};

export function isValidUrl(url: string): boolean {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );

  return !!urlPattern.test(url);
}

export function isValidImageUrl(url: string): boolean {
  // First, check if the URL is in a valid format
  if (!isValidUrl(url)) {
    return false;
  }

  // Next, check if the URL points to a valid image file
  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "svg",
    "tiff",
  ];
  const urlExtension = url.split(".")?.pop()?.toLowerCase();
  if (!urlExtension) return false;
  return imageExtensions.includes(urlExtension);
}

export function isTwitterProfileUrl(url: string): boolean {
  const twitterProfilePattern = new RegExp(
    "^(https?:\\/\\/)?(www\\.)?twitter\\.com\\/[A-Za-z0-9_]{1,15}$",
    "i"
  );

  return !!twitterProfilePattern.test(url);
}

export function generateText(obj: { [key: string]: boolean }) {
  const incorrectFormats = [];

  for (const key in obj) {
    if (!obj[key]) {
      incorrectFormats.push(`"${key}"`);
    }
  }

  if (incorrectFormats.length > 0) {
    const lastIncorrectFormat = incorrectFormats.pop();
    const formattedIncorrectFormats =
      incorrectFormats.length > 0
        ? incorrectFormats.join(", ") + " and " + lastIncorrectFormat
        : lastIncorrectFormat;
    return `${formattedIncorrectFormats} format incorrect`;
  } else {
    return null;
  }
}

export function validateUrls(urlsObj: IUrls): string | null {
  const validationResults = {
    web: urlsObj.web ? isValidUrl(urlsObj.web) : true,
    img: urlsObj.img ? isValidImageUrl(urlsObj.img) : true,
    twitter: urlsObj.twitter ? isTwitterProfileUrl(urlsObj.twitter) : true,
  };

  return generateText(validationResults);
}

export function getFirstDayOfMonthTimestamp() {
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  const timestamp = now.getTime();
  return timestamp;
}

export const getCoinGeckoIDs = async (tokens: string[]) => {
  const url = "https://api.coingecko.com/api/v3/coins/list";
  const response = await fetch(url);
  const coins = await response.json();
  if (coins.error) throw coins.error;

  return tokens.map((token) => {
    const rateIds = [];
    for (const coin of coins) {
      if (coin.symbol.toLowerCase() === token.toLowerCase())
        rateIds.push(coin.id);
    }
    return rateIds[0];
  });
};

export const getTokenUsdPrice = async (tokenSymbol: string) => {
  const tokenId = tokenSymbol.toLowerCase();
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`;
  const response = await fetch(url);
  const result = await response.json();

  return Number(result[tokenId].usd);
};

export function calculateExpiryTimestamp(
  currentTimestamp: number,
  months: number
) {
  // Create a new Date object from the current timestamp
  let expiryDate = new Date(currentTimestamp);

  // Add the number of months to the date
  expiryDate.setMonth(expiryDate.getMonth() + months);

  // Return the timestamp of the expiry date
  return expiryDate.getTime();
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  let month = date.getMonth() + 1; // JavaScript months are 0-11.
  let day = date.getDate();

  // Ensure month and day are two digits.
  month = Number(("0" + month).slice(-2));
  day = Number(("0" + day).slice(-2));

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export function formatTimestampClear(timestamp: number): string {
  let date = new Date(timestamp);
  let formatted_date = `${date.getDate()} ${date.toLocaleString("default", {
    month: "long",
  })}, ${date.getFullYear()}`;
  return formatted_date;
}
