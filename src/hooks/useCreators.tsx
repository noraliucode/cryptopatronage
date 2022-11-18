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
      let identidies = await Promise.all(
        nodes.map((proxy: any) => {
          // TODO: Performance optimization
          const creator = proxy[1].toHuman()[0][0].delegate;
          return getIdentityPromise(creator);
        })
      );

      identidies = identidies.map((identity) => {
        if (identity) {
          return parseAdditionalInfo(identity);
        }
      });
      let creators = [] as any;
      identidies.forEach((identity: any, index: number) => {
        if (identity && identity.rate > 0 && identity.ps) {
          const address = nodes[index][1].toHuman()[0][0].delegate as string;
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
