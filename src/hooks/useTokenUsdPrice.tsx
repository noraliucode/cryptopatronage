import { useEffect, useState } from "react";
import { INetwork } from "../utils/types";
import { COINGECKO_IDS } from "../utils/constants";
import { getTokenUsdPrice } from "../utils/helpers";

interface IState {
  tokenUsdPrice: number;
}

export const useTokenUsdPrice = (network: INetwork) => {
  const [state, setState] = useState<IState>({
    tokenUsdPrice: 0,
  });

  const getPrice = async () => {
    try {
      // TODO: getting 429 rate limit by fecthing ids, so hardcode it for now
      // const id = await getCoinGeckoIDs([SYMBOL[network]]);
      const price = await getTokenUsdPrice(COINGECKO_IDS[network]);

      setState((prev) => ({
        ...prev,
        tokenUsdPrice: price,
      }));
    } catch (error) {
      console.error("getPrice error", error);
    }
  };
  useEffect(() => {
    getPrice();
  }, [network]);
  return { ...state };
};
