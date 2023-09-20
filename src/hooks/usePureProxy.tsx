import { useEffect, useState } from "react";
import { getSubscription } from "../utils/main";
import { INetwork } from "../utils/types";

interface IState {
  userPureProxy: string | null;
}

export const usePureProxy = (
  creator: string,
  supporter: string,
  network: INetwork
) => {
  const [state, setState] = useState<IState>({
    userPureProxy: null,
  });

  const getUserProxy = async () => {
    try {
      const subscription = await getSubscription(creator, supporter, network);
      const userPureProxy = subscription.pureProxy;

      setState((prev) => ({
        ...prev,
        userPureProxy,
      }));
    } catch (error) {
      console.error("getUserProxy error", error);
    }
  };
  useEffect(() => {
    getUserProxy();
  }, [supporter]);
  return { ...state };
};
