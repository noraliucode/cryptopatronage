import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import { APIService } from "../services/apiService";
import { NODE_ENDPOINT } from "../utils/constants";
import { parseAdditionalInfo } from "../utils/helpers";
import { ICreator, INetwork } from "../utils/types";

interface IState {
  creators: (ICreator | undefined)[] | null;
  loading: boolean;
}
export const useCreators = (network: INetwork) => {
  const [state, setState] = useState<IState>({
    creators: null,
    loading: false,
  });

  const getCreators = async () => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
      }));
      const wsProvider = new WsProvider(NODE_ENDPOINT[network]);
      const api = await ApiPromise.create({ provider: wsProvider });
      const apiService = new APIService(api);

      // get all prixies nodes.
      const nodes = (await apiService.getProxies()) as any;
      // getIdentity and see creator it has rate / ps
      const allDelegations: string[] = [];
      const getAllDelegations = () => {
        nodes.forEach((proxy: any) => {
          const delegations = proxy[1].toHuman()[0];
          delegations.forEach((delegation: any) => {
            allDelegations.push(delegation.delegate);
          });
        });
        return allDelegations;
      };
      let identidies = await apiService.getIdentities(getAllDelegations());
      identidies = identidies.map((identity) => {
        if (identity) {
          return parseAdditionalInfo(identity);
        }
      });
      let creators = [] as any;
      identidies.forEach((identity: any, index: number) => {
        if (identity && identity.rate > 0) {
          const address = allDelegations[index];
          const creator: ICreator = {
            address,
            rate: identity.rate,
            imageUrl: identity.imgUrl,
          };
          creators.push(creator);
        }
      });

      // TODO: filter with supporter and calculate funds

      setState((prev) => ({
        ...prev,
        creators,
      }));
    } catch (error) {
      console.error("useCreators error", error);
    } finally {
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };
  useEffect(() => {
    getCreators();
  }, [network]);
  return { ...state, getCreators };
};
