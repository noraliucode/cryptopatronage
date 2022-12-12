// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  AccountId,
  AccountIndex,
  Address,
} from "@polkadot/types/interfaces";
import { getDelegations } from "./apiCalls";
import { DAYS_IN_ONE_MONTH, SECONDS_IN_ONE_DAY } from "./constants";
import {
  ICreatorProxyParsed,
  IParsedProxies,
  IParsedSupporterProxies,
  IProxyParsedCreators,
} from "./types";

export function toShortAddress(
  _address?: AccountId | AccountIndex | Address | string | null | Uint8Array
): string {
  const address = (_address || "").toString();

  return address.length > 13
    ? `${address.slice(0, 6)}…${address.slice(-6)}`
    : address;
}

export function formatUnit(amount: number, decimals: number): number {
  return amount / 10 ** decimals;
}

function parseUnit(amount: number, decimals: number): number {
  return amount * 10 ** decimals;
}

export function getPaymentAmount(
  lastPaymentTime: number,
  rate: number,
  decimals: number
): number {
  const now = Date.now();
  // TODO: a better way to calculate PaymentAmount/better flow?
  const months =
    Math.round(now - lastPaymentTime) / SECONDS_IN_ONE_DAY / DAYS_IN_ONE_MONTH;

  const amount = months * rate;
  console.log("getPaymentAmount amount: ", amount);

  return parseUnit(amount, decimals);
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
    } else {
      committedCreators.push({
        creator: proxy[1].toHuman()[0][1]?.delegate,
        pure: proxy[0].toHuman()[0],
      });
    }
  });
  return { committedCreators, uncommittedCreators };
}

export async function parseCreatorProxies(
  // TODO: import type PalletProxyProxyDefinition
  proxies: any,
  creator: string
): Promise<IParsedSupporterProxies> {
  // TODO: not assignable to parameter of type never" error in TypeScript
  const committedSupporters: any = [];
  const uncommittedSupporters: any = [];
  const promise = new Promise(function (resolve, reject) {
    proxies.forEach((proxy: any) => {
      const delegations = proxy[1].toHuman()[0];

      if (delegations) {
        delegations.forEach(async (delegation: any) => {
          if (delegation.delegate === creator) {
            const pureProxyOrSupporter = proxy[0].toHuman()[0];
            // In the case of subscribtion adding pure proxy, supporter address is the first element.
            const committedSupporter = delegations[0].delegate;
            const nodes: any = await getDelegations(pureProxyOrSupporter);

            // and validate if it is pure
            const pureDelegations = nodes && nodes[0].toHuman();
            // In the case of subscribtion adding pure proxy, creator address is the first element.
            if (pureDelegations && pureDelegations[1]?.delegate === creator) {
              committedSupporters.push({
                supporter: committedSupporter,
                pure: pureProxyOrSupporter,
              });
            } else {
              uncommittedSupporters.push({
                supporter: pureProxyOrSupporter,
              });
            }
            resolve({ committedSupporters, uncommittedSupporters });
          }
        });
      }
    });
  });
  const result: any = await promise;
  return result;
}
