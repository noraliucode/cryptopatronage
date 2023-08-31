import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import { APIService } from "../services/apiService";
import { NODE_ENDPOINT } from "../utils/constants";
import { parseAdditionalInfo, parseEssentialInfo } from "../utils/helpers";
import { ICreator, INetwork } from "../utils/types";
import * as _ from "lodash";
import DatabaseService from "../services/databaseService";
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
      const databaseService = new DatabaseService();

      let identidies = (await apiService.getAllRegisteredIdentities()) as any;
      identidies = identidies.map((identity: any) => {
        if (identity) {
          const _identity = {
            address: identity.address,
            ...parseEssentialInfo(identity.identity.toHuman()?.info),
            ...parseAdditionalInfo(identity.identity),
          };

          return _identity;
        }
      });

      let creators = [] as any;
      identidies.forEach((identity: any, index: number) => {
        if (identity && identity.rate > 0) {
          const creator: ICreator = {
            address: identity.address,
            rate: identity.rate,
            imageUrl: identity.imgUrl,
            email: identity.email,
            twitter: identity.twitter,
            display: identity.display,
            web: identity.web,
            isSensitive: identity.isSensitive === "true" ? true : false,
            isUsd: identity.isUsd,
          };
          creators.push(creator);
        }
      });

      // TODO: remove any
      let _creators = _.uniqBy(creators, "address") as any[];

      // fetch creators from the database
      let offChainCreators = await databaseService.getCreators();
      offChainCreators = offChainCreators.map((creator: any) => {
        const { rate, imgUrl, isSensitive, isUsd } = creator.additionalInfo;
        const { email, twitter, display, web } = creator.identity;
        return {
          address: creator.address,
          network: creator.network,
          isOnchained: creator.isOnchained,
          // additionalInfo
          rate: rate?.toString(),
          imageUrl: imgUrl,
          isSensitive: isSensitive,
          isUsd: isUsd,
          // essentialInfo
          email: email,
          twitter: twitter,
          display: display,
          web: web,
        };
      });

      _creators = [...creators, ...offChainCreators];

      _creators = _creators.filter((creator) => {
        return (
          creator.isSensitive === isShowSensitiveContent &&
          // TODO: creators onchain don't have isOnchained property
          (creator.isOnchained === undefined
            ? true
            : creator.network === network)
        );
      });

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
