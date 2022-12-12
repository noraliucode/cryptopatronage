import { Codec } from "@polkadot/types-codec/types";
import { useEffect, useState } from "react";
import { getIdentityPromise, getProxies } from "../utils/apiCalls";
import { parseAdditionalInfo } from "../utils/helpers";
import { ICreator } from "../utils/types";

interface IState {
  creators: (ICreator | undefined)[] | null;
}

export const useCreators = () => {
  const [state, setState] = useState<IState>({
    creators: null,
  });

  const getCreators = async () => {
    try {
      // get all prixies nodes.
      const nodes = (await getProxies()) as any;
      // promise all getIdentity and see creator it has rate / ps
      const allDelegations: string[] = [];
      const getAllDelegations = () => {
        const promises: Promise<Codec>[] = [];
        nodes.forEach((proxy: any) => {
          // TODO: Performance optimization

          const delegations = proxy[1].toHuman()[0];
          delegations.forEach((delegation: any) => {
            promises.push(getIdentityPromise(delegation.delegate));
            allDelegations.push(delegation.delegate);
          });
        });
        return promises;
      };

      let identidies = await Promise.all(getAllDelegations());

      identidies = identidies.map((identity) => {
        if (identity) {
          return parseAdditionalInfo(identity);
        }
      });
      let creators = [] as any;
      identidies.forEach((identity: any, index: number) => {
        if (identity && identity.rate > 0 && identity.ps) {
          const address = allDelegations[index];
          const creator: ICreator = {
            address,
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
    }
  };
  useEffect(() => {
    getCreators();
  }, []);
  return { ...state, getCreators };
};
