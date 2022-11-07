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

export function getPaymentAmount(
  lastPaymentTime: number,
  rate: number
): number {
  const now = Date.now();
  // TODO: a better way to calculate PaymentAmount
  const amount = ((now - lastPaymentTime) / SECONDS_IN_ONE_DAY / rate) * 30;
  return amount;
}
