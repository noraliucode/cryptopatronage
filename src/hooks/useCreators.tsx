import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import { APIService } from "../services/apiService";
import { NODE_ENDPOINT } from "../utils/constants";
import { parseAdditionalInfo, parseEssentialInfo } from "../utils/helpers";
import { ICreator, INetwork } from "../utils/types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as _ from "lodash";
interface IState {
  creators: (ICreator | undefined)[] | null;
  loading: boolean;
}
export const useCreators = (
  network: INetwork,
  isShowSensitiveContent: boolean
) => {
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
          /* see apiService.ts `getProxies` method */
          /* Retain the old code until a better solution for this issue becomes available. */
          /* const delegations = proxy[1].toHuman()[0]; */

          const delegations = proxy.toHuman()[0];
          delegations.forEach((delegation: any) => {
            allDelegations.push(delegation.delegate);
          });
        });
        return allDelegations;
      };
      let identidies = await apiService.getIdentities(getAllDelegations());
      identidies = identidies.map((identity: any) => {
        if (identity) {
          const _identity = {
            ...parseEssentialInfo(identity.toHuman()?.info),
            ...parseAdditionalInfo(identity),
          };

          return _identity;
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
            email: identity.email,
            twitter: identity.twitter,
            display: identity.display,
            web: identity.web,
          };
          creators.push(creator);
        }
      });

      let _creators = _.uniqBy(creators, "address") as ICreator[];
      if (isShowSensitiveContent) {
        _creators = [];
      }

      // TODO: filter with supporter and calculate funds

      setState((prev) => ({
        ...prev,
        creators: _creators,
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
  }, [network, isShowSensitiveContent]);
  return { ...state, getCreators };
};
