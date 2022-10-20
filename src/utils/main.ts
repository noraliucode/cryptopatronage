import { addProxyViaProxy, createAnonymousProxy, transfer } from "./apiCalls";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import { CREATOR_1, RATE, ROCOCO_DECIMALS } from "./constants";

type AnonymousData = {
  anonymous: string;
  who: string;
};

type AnonymousEvent = {
  data: AnonymousData;
};

export const subscribe = async (
  sender: string,
  real?: string,
  injector?: InjectedExtension | null
) => {
  try {
    console.log("add creator account as mainProxy...");
    await addProxyViaProxy(sender, CREATOR_1, real, injector);
  } catch (error) {
    console.error("subscribe error >>", error);
  }
};

export const commit = async (
  sender: string,
  injector?: InjectedExtension | null
) => {
  try {
    console.log("ceate anonymous proxy...");
    const proxyData = (await createAnonymousProxy(
      sender,
      injector
    )) as AnonymousEvent;
    const { anonymous, who } = proxyData.data;
    console.log("anonymous >>", anonymous);

    console.log("normal transfer to anonymous proxy...");
    await transfer(
      sender,
      injector,
      anonymous,
      (RATE + 0.1) * 10 ** ROCOCO_DECIMALS
    );

    return anonymous;
  } catch (error) {
    console.error("subscribe error >>", error);
  }
};
