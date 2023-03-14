// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  AccountId,
  AccountIndex,
  Address,
} from "@polkadot/types/interfaces";
import { DAYS_IN_ONE_MONTH, SECONDS_IN_ONE_DAY } from "./constants";
import {
  ICreatorProxyParsed,
  IParsedProxies,
  IParsedSupporterProxies,
  IProxyParsedCreators,
} from "./types";

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

export function getPaymentAmount(
  rate: number,
  decimals: number,
  lastPaymentTime?: number
): number {
  const now = Date.now();
  // TODO: a better way to calculate PaymentAmount/better flow?
  const months = lastPaymentTime
    ? Math.round((now - lastPaymentTime) / 1000) /
      SECONDS_IN_ONE_DAY /
      DAYS_IN_ONE_MONTH
    : 1;

  const amount = months * rate;
  console.log("getPaymentAmount amount: ", amount);

  return amount;
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
  supporter: string
): string {
  const { committedCreators } = parseSupporterProxies(proxies, supporter);
  const proxy: ICreatorProxyParsed | undefined = committedCreators.find(
    (proxy: ICreatorProxyParsed) => proxy.creator === creator
  );
  const pure = proxy ? proxy.creator : "";
  return pure;
}

export function parseSupporterProxies(
  // TODO: import type PalletProxyProxyDefinition
  proxies: any,
  supporter: string
): IParsedProxies {
  // TODO: not assignable to parameter of type never" error in TypeScript
  const committedCreators: any = [];
  const uncommittedCreators: any = [];
  proxies.forEach((proxy: any) => {
    const delegations = proxy[1].toHuman()[0];
    if (proxy[0].toHuman()[0] === supporter) {
      delegations.forEach((delegation: any) => {
        uncommittedCreators.push({
          creator: delegation.delegate,
        });
      });
    }

    // supporter address is the second element in our flow
    if (proxy[1].toHuman()[0][1]?.delegate === supporter) {
      committedCreators.push({
        creator: proxy[1].toHuman()[0][0]?.delegate,
        pure: proxy[0].toHuman()[0],
      });
    }
  });
  return { committedCreators, uncommittedCreators };
}

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
