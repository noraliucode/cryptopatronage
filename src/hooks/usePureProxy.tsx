import { useEffect, useState } from "react";
import { USER_PURE_PROXY } from "../utils/constants";
import { readJsonBinKeyValue } from "../utils/main";

interface IState {
  userPureProxy: string | null;
}

export const usePureProxy = (signer = "") => {
  const [state, setState] = useState<IState>({
    userPureProxy: null,
  });

  const getUserProxy = async () => {
    try {
      const result = await readJsonBinKeyValue(signer, USER_PURE_PROXY);
      const userPureProxy = result[signer].pureProxy;

      setState((prev) => ({
        ...prev,
        userPureProxy,
      }));
    } catch (error) {
      console.error("getUserProxy error", error);
    }
  };
  useEffect(() => {
    getUserProxy();
  }, [signer]);
  return { ...state };
};
