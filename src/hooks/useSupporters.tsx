import { useEffect, useState } from "react";
import { getBalances, getProxies } from "../utils/apiCalls";
import { DECIMALS, NETWORK, RATE } from "../utils/constants";

interface IState {
  committedSupporters: string[];
  uncommittedSupporters: string[];
}

export const useSupporters = (creator: string) => {
  const [state, setState] = useState<IState>({
    committedSupporters: [""],
    uncommittedSupporters: [""],
  });

  const getSupporters = async () => {
    try {
      // get proxyNodes
      const proxyNodes: any = await getProxies(creator);

      // get all creator related proxies
      let proxyNodesParsed = proxyNodes.map((proxy: any) => {
        return {
          real: proxy[0].toHuman()[0], // pure
          delegation: proxy[1].toHuman()[0][0].delegate, // creator
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

      // get nodes that the balance greater than the rate
      let supporterProxyNodes: any = await Promise.all(
        proxyNodesParsedFiltered.map((node: any) => getProxies(node.delegation))
      );

      // TODO: a better way to get uncommittedSupporters (Which don't have pures)
      const allProxyNodes: any = await Promise.all(
        proxyNodesParsed.map((node: any) => {
          return getProxies(node.delegation);
        })
      );

      let uncommittedSupporters: string[] = [];
      allProxyNodes.forEach((nodes: any, index: number) => {
        const node = nodes[index][1].toHuman()[0][1];
        if (!node) {
          // TODO: a better way to get uncommittedSupporters (Which don't have pures)
          uncommittedSupporters.push(proxyNodesParsed[index].real);
        }
      });

      const committedSupporters = supporterProxyNodes.forEach(
        (nodes: any, index: number) => {
          const node = nodes[index][1].toHuman()[0][1];
          if (node) {
            return node.delegate;
          }
        }
      );

      uncommittedSupporters = uncommittedSupporters.filter(
        (supporter) =>
          !committedSupporters
            .map((supporter: any) => supporter)
            .includes(supporter)
      );

      setState((prev) => ({
        ...prev,
        committedSupporters,
        uncommittedSupporters,
      }));
    } catch (error) {
      console.error("getSupporters error", error);
    }
  };
  useEffect(() => {
    getSupporters();
  }, []);
  return { ...state, getSupporters };
};
