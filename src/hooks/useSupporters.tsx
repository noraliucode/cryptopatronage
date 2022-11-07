import { useEffect, useState } from "react";
import { getBalances, getProxies } from "../utils/apiCalls";
import { ISupporter, ISupporters } from "../utils/types";

interface IState {
  committedSupporters: ISupporter[] | null;
  uncommittedSupporters: ISupporter[] | null;
}

export const useSupporters = (creator: string, rate: number) => {
  const [state, setState] = useState<IState>({
    committedSupporters: null,
    uncommittedSupporters: null,
  });

  const getSupporters = async () => {
    try {
      // get proxyNodes
      const proxyNodes: any = await getProxies(creator);
      let committedSupporters: ISupporters = [];
      let uncommittedSupporters: ISupporters = [];

      // get all creator related proxies
      proxyNodes.map((proxy: any) => {
        if (!(committedSupporters && uncommittedSupporters)) {
          return;
        }
        const delegations = proxy[1].toHuman()[0];
        // check if the account gives proxy permissions to exactly one other account
        // a committed pure proxy will have exactly 2 delegates, the creator, and the supporter
        if (delegations.length > 1) {
          committedSupporters.push({
            supporter: proxy[1].toHuman()[0][1].delegate,
            pure: proxy[0].toHuman()[0],
            pureBalance: 0,
          });
        } else {
          uncommittedSupporters.push({
            supporter: proxy[0].toHuman()[0],
            supporterBalance: 0,
          });
        }
      });

      // get balances
      const [committedSupporterBalances, uncommittedSupporterBalances] =
        await Promise.all([
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
      committedSupporters = committedSupporters.map((supporter, index) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const _balance = committedSupporterBalances[index].toHuman().data.free;
        // format number wirh commas: '1,000,890,001,100'
        const balance = Number(_balance.replace(/,/g, ""));

        if (balance > rate) {
          return {
            ...supporter,
            // pureBalance: balance,
            pureBalance: balance,
          };
        } else {
          return {};
        }
      });

      uncommittedSupporters = uncommittedSupporters.map((supporter, index) => {
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
      });

      setState((prev) => ({
        ...prev,
        committedSupporters,
        uncommittedSupporters,
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
