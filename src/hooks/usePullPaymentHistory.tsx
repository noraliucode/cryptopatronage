import { useEffect, useState } from "react";
import { IHistoryList, INetwork } from "../utils/types";
import { getPullPaymentHistory } from "../utils/main";

interface IState {
  pullPaymentHistory: IHistoryList;
}

export const usePullPaymentHistory = (creator = "", network: INetwork) => {
  const [state, setState] = useState<IState>({
    pullPaymentHistory: [],
  });

  const getHistory = async () => {
    try {
      const pullPaymentHistory = await getPullPaymentHistory(creator);

      setState((prev) => ({
        ...prev,
        pullPaymentHistory,
      }));
    } catch (error) {
      console.error("getHistory error", error);
    }
  };
  useEffect(() => {
    getHistory();
  }, [network, creator]);
  return { ...state };
};
