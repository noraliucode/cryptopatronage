import { useEffect, useState } from "react";
import { getIdentity } from "../utils/apiCalls";

interface IState {
  rate: number;
}

export const useRate = (creator: string) => {
  const [state, setState] = useState<IState>({
    rate: 0,
  });

  const getRate = async () => {
    try {
      const identity = await getIdentity(creator);
      const rate = JSON.parse(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignores
        identity.toHuman()?.valueOf().info.additional[0][0]["Raw"]
      ).rate;
      setState((prev) => ({ ...prev, rate }));
    } catch (error) {}
  };
  useEffect(() => {
    getRate();
  }, [creator]);
  return { ...state, getRate };
};
