import { useEffect, useState } from "react";
import { getBalances, getProxies } from "../utils/apiCalls";
import { CREATOR } from "../utils/constants";
import { parseSupporterProxies } from "../utils/helpers";
import { INetwork, IProxyParsedCreators } from "../utils/types";

interface IState {
  committedCreators: IProxyParsedCreators;
  uncommittedCreators: IProxyParsedCreators;
}

export const useSubscribedCreators = (
  supporter: string,
  rate: number,
  creator: string
) => {
  const [state, setState] = useState<IState>({
    committedCreators: [],
    uncommittedCreators: [],
  });

  const getSubscribedCreators = async () => {
    try {
      const supporterProxies: any = await getProxies(supporter);
      const { committedCreators, uncommittedCreators } =
        parseSupporterProxies(supporterProxies);
      const balances = await getBalances(
        committedCreators.map((proxy: any) => proxy.pure)
      );

      const _committedCreators = committedCreators.filter((creator, index) => {
        return (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          balances[index].data.free.toNumber() >= rate
        );
      });

      setState((prev) => ({
        ...prev,
        committedCreators: _committedCreators,
        uncommittedCreators,
      }));
    } catch (error) {
      console.error("getSubscribedCreators error", error);
    }
  };
  useEffect(() => {
    getSubscribedCreators();
  }, [supporter, rate]);
  return { ...state, getSubscribedCreators };
};
