import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import { APIService } from "../services/apiService";
import { NODE_ENDPOINT } from "../utils/constants";
import { parseAdditionalInfo, parseEssentialInfo } from "../utils/helpers";
import { IAdditionalInfo, Identity, INetwork } from "../utils/types";

interface IState {
  rate: number;
  isRegisterToPaymentSystem: boolean;
  additionalInfo: IAdditionalInfo | null;
  identity: Identity | null;
  loading: boolean;
  isOnchained: boolean;
}

export const useIdentity = (creator: string | undefined, network: INetwork) => {
  const [state, setState] = useState<IState>({
    rate: 0,
    isRegisterToPaymentSystem: false,
    additionalInfo: null,
    identity: null,
    loading: false,
    isOnchained: false,
  });

  const getRate = async () => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
      }));
      // TODO: get data from the database
      const isOnchained = true;

      const wsProvider = new WsProvider(NODE_ENDPOINT[network]);
      const api = await ApiPromise.create({ provider: wsProvider });
      const apiService = new APIService(api);
      const _identity: any = await apiService.getIdentity(creator);

      const identity = {
        ...parseEssentialInfo(_identity.toHuman()?.info),
      };

      const additionalInfo = parseAdditionalInfo(_identity);

      const rate = additionalInfo.rate;
      const isRegisterToPaymentSystem = additionalInfo.ps;

      setState((prev) => ({
        ...prev,
        // TODO: fix different identity format from useCreators.tsx / remove useless properties
        rate: Number(rate),
        isRegisterToPaymentSystem,
        additionalInfo,
        identity,
        isOnchained,
      }));
    } catch (error) {
      console.error("getRate error", error);
    } finally {
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };
  useEffect(() => {
    getRate();
  }, [creator, network]);
  return { ...state, getRate };
};
