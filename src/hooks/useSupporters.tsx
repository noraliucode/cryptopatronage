import { useEffect, useState } from "react";
import { getBalances, getProxies } from "../utils/apiCalls";
import { parseCreatorProxies } from "../utils/helpers";
import { IProxyParsedSupporters } from "../utils/types";
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
      const committedSupporterBalances = await getBalances(
        committedSupporters.map((supporter) => supporter.pure as string)
      );
      const uncommittedSupporterBalances = await getBalances(
        uncommittedSupporters.map((supporter) => supporter.supporter as string)
      );

      const _committedSupporters: any[] = [];
      const _uncommittedSupporters: any[] = [];
      // filter accounts that has balances that is greater than the rate
      committedSupporters.forEach((supporter, index) => {
        const _balance =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          committedSupporterBalances[index]?.toHuman().data.free;
        // format number wirh commas: '1,000,890,001,100'
        const balance = Number(_balance?.replace(/,/g, ""));

        if (balance > rate) {
          _committedSupporters.push({
            ...supporter,
            pureBalance: balance,
          });
        }
      });

      uncommittedSupporters.forEach((supporter: any, index: any) => {
        const _balance =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          uncommittedSupporterBalances[index]?.toHuman().data.free;
        // format number wirh commas: '1,000,890,001,100'
        const balance = Number(_balance?.replace(/,/g, ""));
        if (balance > rate) {
          _uncommittedSupporters.push({
            ...supporter,
            supporterBalance: balance,
          });
        }
      });

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
