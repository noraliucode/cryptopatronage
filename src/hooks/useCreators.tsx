import { useEffect, useState } from "react";
import { getBalances, getIdentity, getProxies } from "../utils/apiCalls";
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
          const delegations = proxy[1].toHuman()[0];
          // check if the account gives proxy permissions to exactly one other account
          // a committed pure proxy will have exactly 2 delegates, the creator, and the supporter

          if (delegations.length > 1) {
            const creator = proxy[1].toHuman()[0][0].delegate;
            return getIdentity(creator);
          } else {
            // do nothitng here for now as the RPC has timeout error
            // const creator = proxy[1].toHuman()[0][0].delegate;
            // console.log(
            //   "proxy[1].toHuman()",
            //   proxy[1].toHuman()[0][0].delegate
            // );
          }
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
