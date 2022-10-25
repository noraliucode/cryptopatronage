import { useEffect, useState } from "react";
import { getBalances, getProxies } from "../utils/apiCalls";
import { DECIMALS, NETWORK, RATE } from "../utils/constants";

interface IState {
  supporters: string[];
}

export const useSupporters = (creator: string) => {
  const [state, setState] = useState<IState>({
    supporters: [""],
  });

  const getSupporters = async () => {
    try {
      // input creator address
      // get proxyNodes
      const proxyNodes: any = await getProxies(creator);

      let proxyNodesParsed = proxyNodes.map((proxy: any) => {
        return {
          real: proxy[0].toHuman()[0],
          delegation: proxy[1].toHuman()[0][0].delegate,
        };
      });

      // get balances
      const balances = await getBalances(
        proxyNodesParsed.map((node: any) => node.real)
      );

      proxyNodesParsed = proxyNodesParsed.map((node: any, index: number) => {
        return {
          ...node,
          balance: balances[index],
        };
      });

      // filter delegation balances that greater than rate
      const proxyNodesParsedFiltered = proxyNodesParsed.filter((node: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return (
          node.balance.data.free.toNumber() / 10 ** DECIMALS[NETWORK] >= RATE
        );
      });

      const supporterProxyNodes: any = await Promise.all(
        proxyNodesParsedFiltered.map((node: any) => getProxies(node.delegation))
      );

      const supporters = supporterProxyNodes.map((nodes: any) => {
        return nodes[0][1].toHuman()[0][1].delegate;
      });

      setState((prev) => ({ ...prev, supporters }));
    } catch (error) {
      console.error("getSupporters error", error);
    }
  };
  useEffect(() => {
    getSupporters();
  }, []);
  return { ...state };
};
