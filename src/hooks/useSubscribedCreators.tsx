import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import { APIService } from "../services/apiService";
import { NODE_ENDPOINT } from "../utils/constants";
import {
  getSubscribedCreatorsForSupporters,
  parseAdditionalInfo,
  parseEssentialInfo,
} from "../utils/helpers";
import { INetwork, IProxyParsedCreators } from "../utils/types";
import { getCreatorsForSuppporter } from "../utils/main";

interface IState {
  committedCreators: IProxyParsedCreators;
  uncommittedCreators: IProxyParsedCreators;
}

export const useSubscribedCreators = (
  supporter = "",
  network: INetwork,
  pureProxy: string | null
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

      // TODO: can be deleted later
      // const { committedCreators, uncommittedCreators } =
      //   getSubscribedCreatorsForSupporters(
      //     supporter,
      //     pureProxy,
      //     supporterProxies,
      //     network
      //   );

      const { committedCreators, uncommittedCreators } =
        await getCreatorsForSuppporter(supporter);

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

      if (committedCreators) {
        const identities = await apiService.getIdentities(
          committedCreators.map((x: any) => x.address)
        );
        identities.map((x: any, index: number) => {
          const essentialInfo = parseEssentialInfo(x.toHuman()?.info);
          const identity = parseAdditionalInfo(x);

          committedCreators[index] = {
            ...committedCreators[index],
            display: essentialInfo.display,
            imgUrl: identity.imgUrl,
          };
        });
      }

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
