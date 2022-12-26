import { useEffect, useState } from "react";
import { INetwork } from "../utils/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { NODE_ENDPOINT } from "../utils/constants";

interface IState {
  api: ApiPromise | null;
}

export const useApi = (network: INetwork) => {
  const [state, setState] = useState<IState>({
    api: null,
  });

  const createApiObj = async () => {
    try {
      const wsProvider = new WsProvider(NODE_ENDPOINT[network]);
      const api = await ApiPromise.create({ provider: wsProvider });

      setState((prev) => ({
        ...prev,
        api,
      }));
    } catch (error) {
      console.error("useCreators error", error);
    }
  };
  useEffect(() => {
    createApiObj();
  }, [network]);
  return { ...state };
};
