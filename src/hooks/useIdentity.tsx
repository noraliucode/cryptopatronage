import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import { APIService } from "../services/apiService";
import { NODE_ENDPOINT } from "../utils/constants";
import { parseAdditionalInfo, parseEssentialInfo } from "../utils/helpers";
import { IAdditionalInfo, Identity, INetwork } from "../utils/types";
import DatabaseService from "../services/databaseService";

interface IState {
  rate: number;
  isRegisterToPaymentSystem: boolean;
  additionalInfo: IAdditionalInfo | null;
  identity: Identity | null;
  loading: boolean;
  isOnchained: boolean;
  network?: INetwork;
}

export const useIdentity = (creator: string | undefined, network: INetwork) => {
  const defaultState: IState = {
    rate: 0,
    isRegisterToPaymentSystem: false,
    additionalInfo: null,
    identity: null,
    loading: false,
    isOnchained: false,
  };
  const [state, setState] = useState<IState>(defaultState);
  const resetState = () => {
    setState(defaultState);
  };

  const getIdentity = async () => {
    try {
      if (!creator) return;
      setState((prev) => ({
        ...prev,
        loading: true,
      }));

      const databaseService = new DatabaseService();

      const data = await databaseService.getCreator(creator, network);

      if (data) {
        setState((prev) => ({
          ...prev,
          rate: Number(data?.rate),
          isRegisterToPaymentSystem: data?.isRegisterToPaymentSystem,
          additionalInfo: data?.additionalInfo,
          identity: data?.identity,
          isOnchained: false,
        }));
      } else {
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

        // When off-chain users unregistered, no data is returned. Therefore we need to reset state
        if (!rate) {
          resetState();
        } else {
          setState((prev) => ({
            ...prev,
            // TODO: fix different identity format from useCreators.tsx / remove useless properties
            rate: Number(rate),
            isRegisterToPaymentSystem,
            additionalInfo,
            identity,
            isOnchained: true,
          }));
        }
      }
    } catch (error) {
      console.error("getIdentity error", error);
    } finally {
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };
  useEffect(() => {
    getIdentity();
  }, [creator, network]);
  return { ...state, getIdentity };
};
