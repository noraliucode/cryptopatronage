import { useEffect, useState } from "react";
import { getIdentity } from "../utils/apiCalls";
import { parseAdditionalInfo } from "../utils/helpers";

interface IState {
  rate: number;
  isRegisterToPaymentSystem: boolean;
}

export const useIdentity = (creator: string) => {
  const [state, setState] = useState<IState>({
    rate: 0,
    isRegisterToPaymentSystem: false,
  });

  const getRate = async () => {
    try {
      const identity = await getIdentity(creator);
      const additionalInfo = parseAdditionalInfo(identity);

      const rate = additionalInfo.rate;
      const isRegisterToPaymentSystem = additionalInfo.ps;

      setState((prev) => ({ ...prev, rate, isRegisterToPaymentSystem }));
    } catch (error) {
      console.error("getRate error", error);
    }
  };
  useEffect(() => {
    getRate();
  }, [creator]);
  return { ...state, getRate };
};
