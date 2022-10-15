import { useEffect, useState } from "react";
import { getBalances, getUserAnonymousProxies } from "../utils/apiCalls";

interface IState {
  subscribedCreators: string[];
}

export const useSubscribedCreators = (user: string) => {
  const [state, setState] = useState<IState>({
    subscribedCreators: [],
  });

  const getSubscribedCreators = async () => {
    try {
      let subscribedCreators = [""];
      // input user's account
      // use proxy.proxy get all the accounts that has proxy
      const userProxies: any = await getUserAnonymousProxies(user);
      // TODO: get Proxies that main proxy is creator

      const balances = await getBalances(
        userProxies.map((proxy: any) => proxy[0].toHuman()[0])
      );

      // TODO: filter balance grater than rate
      const isSubscribed = balances.some((balance) => {
        // console.log("balance >>", balance.data.free.toHuman());
      });

      setState((prev) => ({ ...prev, subscribedCreators }));
    } catch (error) {
      console.error("getSubscribedCreators error", error);
    }
  };
  useEffect(() => {
    getSubscribedCreators();
  }, []);
  return { ...state };
};
