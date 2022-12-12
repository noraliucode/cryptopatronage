import { useEffect, useState } from "react";
import { getBalances, getProxies } from "../utils/apiCalls";
import { parseCreatorProxies } from "../utils/helpers";
import { IProxyParsedSupporters } from "../utils/types";
import type { Codec } from "@polkadot/types/types";
interface IState {
  committedSupporters: IProxyParsedSupporters;
  uncommittedSupporters: IProxyParsedSupporters;
}

export const useSupporters = (creator: string, rate: number) => {
  const [state, setState] = useState<IState>({
    committedSupporters: [],
    uncommittedSupporters: [],
  });

  const getSupporters = async () => {
    try {
      // get proxyNodes
      const proxyNodes: any = await getProxies();
      const { committedSupporters, uncommittedSupporters } =
        await parseCreatorProxies(proxyNodes, creator);

      // get balances
      const [committedSupporterBalances, uncommittedSupporterBalances]: [
        Codec[],
        Codec[]
      ] = await Promise.all([
        getBalances(
          committedSupporters.map((supporter) => supporter.pure as string)
        ),
        getBalances(
          uncommittedSupporters.map(
            (supporter) => supporter.supporter as string
          )
        ),
      ]);

      // filter accounts that has balances that is greater than the rate
      const _committedSupporters = committedSupporters.map(
        (supporter, index) => {
          const item = committedSupporterBalances[index];
          if (!item) return {};
          const _balance =
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            committedSupporterBalances[index].toHuman().data.free;
          // format number wirh commas: '1,000,890,001,100'
          const balance = Number(_balance.replace(/,/g, ""));

          if (balance > rate) {
            return {
              ...supporter,
              pureBalance: balance,
            };
          } else {
            return {};
          }
        }
      );

      const _uncommittedSupporters = uncommittedSupporters.map(
        (supporter: any, index: any) => {
          const _balance =
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            uncommittedSupporterBalances[index].toHuman().data.free;
          // format number wirh commas: '1,000,890,001,100'
          const balance = Number(_balance.replace(/,/g, ""));
          if (balance > rate) {
            return {
              ...supporter,
              supporterBalance: balance,
            };
          } else {
            return {};
          }
        }
      );

      setState((prev) => ({
        ...prev,
        committedSupporters: _committedSupporters,
        uncommittedSupporters: _uncommittedSupporters,
      }));
    } catch (error) {
      console.error("getSupporters error", error);
    }
  };
  useEffect(() => {
    getSupporters();
  }, [creator, rate]);
  return { ...state, getSupporters };
};
