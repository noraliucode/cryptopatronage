import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import { APIService } from "../services/apiService";
import { NODE_ENDPOINT } from "../utils/constants";
import { parseAdditionalInfo } from "../utils/helpers";
import { INetwork } from "../utils/types";

interface IState {
  rate: number;
  isRegisterToPaymentSystem: boolean;
}

export const useIdentity = (creator: string, network: INetwork) => {
  const [state, setState] = useState<IState>({
    rate: 0,
    isRegisterToPaymentSystem: false,
  });

  const getRate = async () => {
    try {
      const wsProvider = new WsProvider(NODE_ENDPOINT[network]);
      const api = await ApiPromise.create({ provider: wsProvider });
      const apiService = new APIService(api);
      const identity = await apiService.getIdentity(creator);

      const additionalInfo = parseAdditionalInfo(identity);

      const rate = additionalInfo.rate;
      const isRegisterToPaymentSystem = additionalInfo.ps;

      setState((prev) => ({
        ...prev,
        rate: Number(rate),
        isRegisterToPaymentSystem,
      }));
    } catch (error) {
      console.error("getRate error", error);
    }
  };
  useEffect(() => {
    getRate();
  }, [creator]);
  return { ...state, getRate };
};
