import { useEffect, useState } from "react";
import { getBalances, getProxies } from "../utils/apiCalls";
import { ISupporter } from "../utils/types";

interface IState {
  committedSupporters: ISupporter[] | null;
  uncommittedSupporters: string[];
}

export const useSupporters = (creator: string, rate: number) => {
  const [state, setState] = useState<IState>({
    committedSupporters: null,
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
        return node.balance.data.free.toNumber() >= rate;
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

      const committedSupporters = supporterProxyNodes.map(
        (nodes: any, index: number) => {
          const node = nodes[index][1].toHuman()[0][1];
          if (node) {
            return {
              address: node.delegate,
              balance:
                proxyNodesParsedFiltered[index].balance.data.free.toNumber(),
            };
          }
          return null;
        }
      );

      uncommittedSupporters = uncommittedSupporters.filter(
        (supporter) =>
          !committedSupporters
            .map((supporter: any) => supporter.address)
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
  }, [creator, rate]);
  return { ...state, getSupporters };
};
