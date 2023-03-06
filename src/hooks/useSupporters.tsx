import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import { APIService } from "../services/apiService";
import { NODE_ENDPOINT } from "../utils/constants";
import { parseCreatorProxies } from "../utils/main";
import {
  INetwork,
  IProxyParsedSupporter,
  IProxyParsedSupporters,
} from "../utils/types";
interface IState {
  committedSupporters: IProxyParsedSupporters;
  uncommittedSupporters: IProxyParsedSupporters;
}

export const useSupporters = (
  creator: string | undefined,
  rate: number,
  network: INetwork
) => {
  const [state, setState] = useState<IState>({
    committedSupporters: [],
    uncommittedSupporters: [],
  });

  const getSupporters = async () => {
    try {
      const wsProvider = new WsProvider(NODE_ENDPOINT[network]);
      const api = await ApiPromise.create({ provider: wsProvider });
      const apiService = new APIService(api);
      // get proxyNodes
      const proxyNodes: any = await apiService.getProxies(creator);
      const { committedSupporters, uncommittedSupporters } =
        // TODO: naming issue
        await parseCreatorProxies(api, proxyNodes, creator);

      // get balances
      const committedSupporterBalances = await apiService.getBalances(
        committedSupporters.map(
          (supporter: IProxyParsedSupporter) => supporter.pure as string
        )
      );
      const uncommittedSupporterBalances = await apiService.getBalances(
        uncommittedSupporters.map(
          (supporter: IProxyParsedSupporter) => supporter.supporter as string
        )
      );

      const _committedSupporters: any[] = [];
      const _uncommittedSupporters: any[] = [];
      // filter accounts that has balances that is greater than the rate
      committedSupporters.forEach(
        (supporter: IProxyParsedSupporter, index: number) => {
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
        }
      );

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
