// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  AccountId,
  AccountIndex,
  Address,
} from "@polkadot/types/interfaces";
import { SECONDS_IN_ONE_DAY } from "./constants";

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
  // TODO: a better way to calculate PaymentAmount
  console.log("getPaymentAmount lastPaymentTime: ", lastPaymentTime);
  console.log("getPaymentAmount rate: ", rate);

  const amount = ((now - lastPaymentTime) / SECONDS_IN_ONE_DAY / rate) * 30;
  console.log("getPaymentAmount amount: ", amount);

  return Math.round(parseUnit(amount, decimals));
}

export function parseAdditionalInfo(identity: any) {
  const additionalInfo = JSON.parse(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignores
    identity.toHuman()?.valueOf().info.additional[0][0]["Raw"]
  );
  return additionalInfo;
}
