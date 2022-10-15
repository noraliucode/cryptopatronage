import {
  addProxy,
  callViaProxy,
  createAnonymousProxy,
  transfer,
  transferViaProxy,
} from "./apiCalls";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import { CREATOR_1, RATE, ROCOCO_DECIAMLS } from "./constants";

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
    console.log("ceate anonymous proxy...");
    const proxyData = (await createAnonymousProxy(
      sender,
      injector
    )) as AnonymousEvent;
    const { anonymous, who } = proxyData.data;
    console.log("anonymous >>", anonymous);

    console.log("normal transfer to anonymous proxy...");
    await transfer(sender, injector, anonymous, RATE * 10 ** ROCOCO_DECIAMLS);

    console.log("add creator account as mainProxy...");
    await addProxy(sender, injector, CREATOR_1);
  } catch (error) {
    console.error("subscribe error >>", error);
  }
};
