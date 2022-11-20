// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  AccountId,
  AccountIndex,
  Address,
} from "@polkadot/types/interfaces";
import { DAYS_IN_ONE_MONTH, SECONDS_IN_ONE_DAY } from "./constants";
import { ISupporters } from "./types";

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
  const additionalInfo = identity.toHuman()?.valueOf().info.additional[0][0][
    "Raw"
  ];
  return additionalInfo ? JSON.parse(additionalInfo) : {};
}

export function getUserPure(
  user: string,
  supporters: ISupporters
): string | undefined {
  if (!supporters) return;
  const supporter = supporters.find(
    (supporter) => supporter.supporter === user
  );
  return supporter?.pure;
}
