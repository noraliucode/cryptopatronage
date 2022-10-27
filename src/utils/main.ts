import {
  addProxyViaProxy,
  batchCalls,
  callViaProxy,
  createAnonymousProxy,
  getProxies,
  getTransferFee,
  removeProxies,
  signAndSendAddProxyViaProxy,
  transfer,
} from "./apiCalls";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import {
  CREATOR,
  NETWORK,
  DECIMALS,
  USER_PAYMENT,
  M_DECIMALS,
} from "./constants";

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
  isCommitted = true,
  callback?: any,
  setLoading?: (_: boolean) => void
) => {
  try {
    setLoading && setLoading(true);
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

      const reserved = 0.00000000001 * 10 ** DECIMALS[NETWORK];

      // TODO: add total amount later to inform user
      // const fee = (await getTransferFee(anonymous, amount, sender)).split(
      //   " "
      // )[0];
      // const totalAmount =
      //   Math.ceil(Number(fee)) * 10 ** M_DECIMALS[NETWORK] + amount + reserved;

      const txs = await Promise.all([
        transfer(anonymous, amount + reserved),
        addProxyViaProxy(CREATOR[NETWORK], real),
      ]);

      console.log("normal transfer to anonymous proxy...");
      console.log("set creator as main proxy...");
      await batchCalls(txs, sender, injector, callback);
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
  } finally {
    setLoading && setLoading(false);
  }
};

export const unsubscribe = async (
  sender: string,
  injector: any,
  creator: string,
  callback?: any,
  setLoading?: (_: boolean) => void
) => {
  try {
    setLoading && setLoading(true);
    const creatorProxies: any = await getProxies(creator);
    const creatorProxiesFiltered = creatorProxies.filter(
      // filter all nodes that the property is sender
      (node: any) => node[1].toHuman()[0][1].delegate === sender
    );
    const reals = creatorProxiesFiltered.map(
      (node: any) => node[0].toHuman()[0]
    );

    // batch call removeProxies
    // get all txs
    const txs = await Promise.all(
      reals.map((real: any) => callViaProxy(removeProxies(), real))
    );
    await batchCalls(txs, sender, injector, callback);
  } catch (error) {
    console.error("unsubscribe error >>", error);
  } finally {
    setLoading && setLoading(false);
  }
};
