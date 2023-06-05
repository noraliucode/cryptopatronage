import { useEffect, useState } from "react";
import { IHistoryList, INetwork } from "../utils/types";
import { getPullPaymentHistory } from "../utils/main";

interface IState {
  pullPaymentHistory: IHistoryList;
  loading: boolean;
}

export const usePullPaymentHistory = (creator = "", network: INetwork) => {
  const [state, setState] = useState<IState>({
    pullPaymentHistory: [],
    loading: false,
  });

  const getHistory = async () => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
      }));
      const pullPaymentHistory = await getPullPaymentHistory(creator);

      setState((prev) => ({
        ...prev,
        pullPaymentHistory,
      }));
    } catch (error) {
      console.error("getHistory error", error);
    } finally {
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };
  useEffect(() => {
    getHistory();
  }, [network, creator]);
  return { ...state };
};
