import {
  addProxyViaProxy,
  batchCalls,
  createAnonymousProxy,
  signAndSendAddProxyViaProxy,
  transfer,
} from "./apiCalls";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import { CREATOR, NETWORK, DECIMALS, USER_PAYMENT } from "./constants";

type AnonymousData = {
  anonymous: string;
  who: string;
};

type AnonymousEvent = {
  data: AnonymousData;
};

export const subscribe = async (
  sender: string,
  injector?: InjectedExtension | null,
  isCommitted = true
) => {
  try {
    let real = sender;
    if (isCommitted) {
      console.log("ceate anonymous proxy...");
      const proxyData = (await createAnonymousProxy(
        sender,
        injector
      )) as AnonymousEvent;
      const { anonymous, who } = proxyData.data;
      real = anonymous;

      console.log("anonymous >>", anonymous);

      const amount = USER_PAYMENT * 10 ** DECIMALS[NETWORK];

      const txs = await Promise.all([
        transfer(anonymous, amount),
        addProxyViaProxy(CREATOR[NETWORK], real),
      ]);

      console.log("normal transfer to anonymous proxy...");
      console.log("set creator as main proxy...");
      await batchCalls(txs, sender, injector);
    } else {
      await signAndSendAddProxyViaProxy(
        sender,
        CREATOR[NETWORK],
        real,
        injector
      );
    }
  } catch (error) {
    console.error("subscribe error >>", error);
  }
};
