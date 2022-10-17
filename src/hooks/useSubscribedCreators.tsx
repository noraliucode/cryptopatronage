import { useEffect, useState } from "react";
import { getBalances, getProxies } from "../utils/apiCalls";
import { CREATOR_1, RATE, ROCOCO_DECIMALS } from "../utils/constants";

interface IState {
  subscribedCreators: string[];
}

export const useSubscribedCreators = (user: string) => {
  const [state, setState] = useState<IState>({
    subscribedCreators: [],
  });

  const getSubscribedCreators = async () => {
    try {
      // input user's account
      // use proxy.proxy to get all the accounts that has proxies
      const userProxies: any = await getProxies(user);

      // TODO: get Proxies that main proxy is creator
      // a static file of creator list?

      const balances = await getBalances(
        userProxies.map((proxy: any) => proxy[0].toHuman()[0])
      );

      const isSubscribed = balances.some((balance) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return balance.data.free.toNumber() / 10 ** ROCOCO_DECIMALS >= RATE;
      });

      if (isSubscribed) {
        // TODO: creator list is hardcoded for now, should be fixed later
        setState((prev) => ({ ...prev, subscribedCreators: [CREATOR_1] }));
      }
    } catch (error) {
      console.error("getSubscribedCreators error", error);
    }
  };
  useEffect(() => {
    getSubscribedCreators();
  }, []);
  return { ...state, getSubscribedCreators };
};
