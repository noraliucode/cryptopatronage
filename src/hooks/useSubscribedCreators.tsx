import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import { APIService } from "../services/apiService";
import { NODE_ENDPOINT } from "../utils/constants";
import { parseSupporterProxies } from "../utils/helpers";
import { INetwork, IProxyParsedCreators } from "../utils/types";

interface IState {
  committedCreators: IProxyParsedCreators;
  uncommittedCreators: IProxyParsedCreators;
}

export const useSubscribedCreators = (
  supporter: string,
  rate: number,
  network: INetwork
) => {
  const [state, setState] = useState<IState>({
    committedCreators: [],
    uncommittedCreators: [],
  });

  const getSubscribedCreators = async () => {
    try {
      const wsProvider = new WsProvider(NODE_ENDPOINT[network]);
      const api = await ApiPromise.create({ provider: wsProvider });
      const apiService = new APIService(api);
      const supporterProxies: any = await apiService.getProxies(supporter);
      const { committedCreators, uncommittedCreators } = parseSupporterProxies(
        supporterProxies,
        supporter
      );
      const balances = await apiService.getBalances(
        committedCreators.map((proxy: any) => proxy.pure)
      );

      const _committedCreators = committedCreators.filter((creator, index) => {
        if (creator.creator) {
          return (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            balances[index].data.free.toNumber() >= rate
          );
        }
      });

      setState((prev) => ({
        ...prev,
        committedCreators: _committedCreators,
        uncommittedCreators,
      }));
    } catch (error) {
      console.error("getSubscribedCreators error", error);
    }
  };
  useEffect(() => {
    getSubscribedCreators();
  }, [supporter, rate, network]);
  return { ...state, getSubscribedCreators };
};
