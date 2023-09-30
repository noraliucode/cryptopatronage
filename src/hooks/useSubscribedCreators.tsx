import { useEffect, useState } from "react";
import { IFormattedSubscriptions, INetwork } from "../utils/types";
import { getSubscriptions } from "../utils/main";

interface IState {
  committedCreators: IFormattedSubscriptions;
  uncommittedCreators: IFormattedSubscriptions;
}

export const useSubscribedCreators = (supporter = "", network: INetwork) => {
  const [state, setState] = useState<IState>({
    committedCreators: [],
    uncommittedCreators: [],
  });

  const getSubscribedCreators = async () => {
    try {
      const subscriptions = await getSubscriptions(supporter, network);

      if (!subscriptions) {
        setState((prev) => ({
          ...prev,
          committedCreators: [],
          uncommittedCreators: [],
        }));
        return;
      }
      const { committedCreators, uncommittedCreators } = subscriptions;

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
