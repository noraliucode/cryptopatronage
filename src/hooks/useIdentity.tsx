import { useEffect, useState } from "react";
import { getIdentity } from "../utils/apiCalls";

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
      const additionalInfo = JSON.parse(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignores
        identity.toHuman()?.valueOf().info.additional[0][0]["Raw"]
      );

      const rate = additionalInfo.rate;
      const isRegisterToPaymentSystem = additionalInfo.ps;

      setState((prev) => ({ ...prev, rate, isRegisterToPaymentSystem }));
    } catch (error) {}
  };
  useEffect(() => {
    getRate();
  }, [creator]);
  return { ...state, getRate };
};
