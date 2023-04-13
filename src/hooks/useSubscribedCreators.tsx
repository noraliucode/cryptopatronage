import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import { APIService } from "../services/apiService";
import { NODE_ENDPOINT } from "../utils/constants";
import { parseEssentialInfo, parseSupporterProxies } from "../utils/helpers";
import { INetwork, IProxyParsedCreators } from "../utils/types";

interface IState {
  committedCreators: IProxyParsedCreators;
  uncommittedCreators: IProxyParsedCreators;
}

export const useSubscribedCreators = (supporter = "", network: INetwork) => {
  const [state, setState] = useState<IState>({
    committedCreators: [],
    uncommittedCreators: [],
  });

  const getSubscribedCreators = async () => {
    try {
      const wsProvider = new WsProvider(NODE_ENDPOINT[network]);
      const api = await ApiPromise.create({ provider: wsProvider });
      const apiService = new APIService(api);
      const supporterProxies: any = await apiService.getProxies();
      const { committedCreators, uncommittedCreators } = parseSupporterProxies(
        supporterProxies,
        supporter,
        network
      );

      // TODO: creators can pull payment anytime, so the balance is not necessarily greater than rate. The code below can be deleted later.
      // const balances = await apiService.getBalances(
      //   committedCreators.map((proxy: any) => proxy.pure)
      // );

      // const _committedCreators = committedCreators.filter((creator, index) => {
      //   if (creator.creator) {
      //     return (
      //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //       // @ts-ignore
      //       balances[index].data.free.toNumber() >= rate
      //     );
      //   }
      // });

      const identities = await apiService.getIdentities(
        committedCreators.map((x) => x.creator)
      );
      identities.map((x: any, index: number) => {
        const essentialInfo = parseEssentialInfo(x.toHuman()?.info);
        committedCreators[index] = {
          ...committedCreators[index],
          display: essentialInfo.display,
        };
      });

      setState((prev) => ({
        ...prev,
        committedCreators,
        uncommittedCreators,
      }));
    } catch (error) {
      console.error("getSubscribedCreators error", error);
    }
  };
  useEffect(() => {
    getSubscribedCreators();
  }, [supporter, network]);
  return { ...state, getSubscribedCreators };
};
