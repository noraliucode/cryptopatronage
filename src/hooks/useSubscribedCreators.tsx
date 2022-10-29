import { useEffect, useState } from "react";
import { getBalances, getProxies } from "../utils/apiCalls";
import { CREATOR, DECIMALS, NETWORK, RATE } from "../utils/constants";

interface IState {
  subscribedCreators: string[];
}

export const useSubscribedCreators = (user: string) => {
  const [state, setState] = useState<IState>({
    subscribedCreators: [],
  });

  const getSubscribedCreators = async () => {
    try {
      const uncommittedNodes = [];
      const creatorProxies: any = await getProxies(CREATOR[NETWORK]);
      const creatorProxiesFiltered = creatorProxies.filter(
        // filter all nodes that the property is sender
        (node: any) => {
          const delegation = node[1].toHuman()[0][1];
          if (!delegation) {
            uncommittedNodes.push(node);
          } else {
            return delegation.delegate === user;
          }
        }
      );
      const creatorProxiesFilteredParsed = creatorProxiesFiltered.map(
        (proxy: any) => {
          return {
            real: proxy[0].toHuman()[0],
            delegation: proxy[1].toHuman()[0][0].delegate,
          };
        }
      );

      const balances = await getBalances(
        creatorProxiesFilteredParsed.map((proxy: any) => proxy.real)
      );

      const isRegistered = creatorProxiesFiltered.length > 0;

      const isSubscribed = balances.some((balance) => {
        return (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          balance.data.free.toNumber() / 10 ** DECIMALS[NETWORK] >= RATE &&
          isRegistered
        );
      });

      // TODO: creator list is hardcoded for now, should be fixed later
      setState((prev) => ({
        ...prev,
        subscribedCreators: isSubscribed ? [CREATOR[NETWORK]] : [],
      }));
    } catch (error) {
      console.error("getSubscribedCreators error", error);
    }
  };
  useEffect(() => {
    getSubscribedCreators();
  }, []);
  return { ...state, getSubscribedCreators };
};
