import { createAnonymousProxy, transferViaProxy } from "./apiCalls";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import { RATE, ROCOCO_DECIAMLS } from "./constants";

type AnonymousData = {
  anonymous: string;
  who: string;
};

type AnonymousEvent = {
  data: AnonymousData;
};

export const subscribe = async (
  sender: string,
  injector: InjectedExtension
) => {
  try {
    console.log("ceate proxy account...");
    const proxyData = (await createAnonymousProxy(
      sender,
      injector
    )) as AnonymousEvent;
    const { anonymous, who } = proxyData.data;

    console.log("transfer to proxy account...");
    transferViaProxy(
      anonymous,
      who,
      injector,
      anonymous,
      RATE * 10 ** ROCOCO_DECIAMLS
    );
  } catch (error) {
    console.error("subscribe error >>", error);
  }
};
