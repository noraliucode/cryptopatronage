import {
  addProxyViaProxy,
  batchCalls,
  removeProxiesViaProxy,
  createAnonymousProxy,
  getIdentity,
  getProxies,
  removeProxies,
  signAndSendAddProxy,
  signAndSendSetIdentity,
  transfer,
  transferViaProxy,
  setIdentity,
} from "./apiCalls";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import {
  CREATOR,
  NETWORK,
  DECIMALS,
  USER_PAYMENT,
  RESERVED_AMOUNT,
} from "./constants";
import { getPaymentAmount, parseAdditionalInfo } from "./helpers";

type AnonymousData = {
  pure: string;
  who: string;
};

type AnonymousEvent = {
  data: AnonymousData;
};

export const subscribe = async (
  sender: string,
  injector: InjectedExtension,
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
      const { pure, who } = proxyData.data;
      real = pure;

      console.log("anonymous >>", pure);
      const amount = USER_PAYMENT * 10 ** DECIMALS[NETWORK];

      const reserved = RESERVED_AMOUNT * 10 ** DECIMALS[NETWORK];

      // TODO: add total amount later to inform user
      // const fee = (await getTransferFee(anonymous, amount, sender)).split(
      //   " "
      // )[0];
      // const totalAmount =
      //   Math.ceil(Number(fee)) * 10 ** M_DECIMALS[NETWORK] + amount + reserved;

      const txs = await Promise.all([
        transfer(pure, amount + reserved),
        addProxyViaProxy(CREATOR[NETWORK], real),
        getSetLastPaymentTimeTx(sender),
      ]);

      console.log("normal transfer to anonymous proxy...");
      console.log("set creator as main proxy...");
      console.log("set last payment time...");
      await batchCalls(txs, sender, injector, callback);
    } else {
      console.log("set creator as proxy...");
      await signAndSendAddProxy(sender, injector, CREATOR[NETWORK]);
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
      (node: any) => {
        const _node = node[1].toHuman()[0][1];
        if (_node) {
          return _node.delegate === sender;
        }
      }
    );

    const reals = creatorProxiesFiltered.map(
      (node: any) => node[0].toHuman()[0]
    );

    // batch call removeProxies
    // get all txs
    const txs = await Promise.all(
      reals.map((real: any) => removeProxiesViaProxy(removeProxies(), real))
    );
    await batchCalls(txs, sender, injector, callback);
  } catch (error) {
    console.error("unsubscribe error >>", error);
  } finally {
    setLoading && setLoading(false);
  }
};

export const setRate = async (
  rate: number,
  sender: string,
  injector: any,
  callback?: () => void,
  setLoading?: (_: boolean) => void
) => {
  try {
    setLoading && setLoading(true);
    const identity = await getIdentity(sender);
    const essentialInfo = identity
      ? identity
      : {
          display: "",
          legal: "",
          web: "",
          riot: "",
          email: "",
          image: "",
          twitter: "",
        };
    const additionalInfo = { rate };
    const _callBack = () => {
      callback && callback();
      setLoading && setLoading(false);
    };

    await signAndSendSetIdentity(
      essentialInfo,
      additionalInfo,
      sender,
      injector,
      _callBack
    );
  } catch (error) {
    console.error("setRate error", error);
    setLoading && setLoading(false);
  }
};

export const pullPayment = async (
  real: string,
  sender: string,
  injector: any,
  receiver: string,
  currentRate: number,
  decimals: number,
  supporter: string
) => {
  try {
    const [creatorIdentity, supporterIdentity] = await Promise.all(
      [sender, supporter].map((x) => getIdentity(x))
    );
    const getLastPaymentTime = (identity: any) => {
      return JSON.parse(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignores
        identity.toHuman()?.valueOf().info.additional[0][0]["Raw"]
      ).lastPaymentTime;
    };
    const lastPaymentTime = getLastPaymentTime(creatorIdentity)
      ? getLastPaymentTime(creatorIdentity)
      : getLastPaymentTime(supporterIdentity);

    const amount = getPaymentAmount(lastPaymentTime, currentRate, decimals);
    await transferViaProxy(real, sender, injector, receiver, amount);
  } catch (error) {
    console.error("pullPayment error", error);
  }
};

export const getSetLastPaymentTimeTx = async (sender: string) => {
  try {
    const identity = await getIdentity(sender);
    const essentialInfo = identity
      ? identity
      : {
          display: "",
          legal: "",
          web: "",
          riot: "",
          email: "",
          image: "",
          twitter: "",
        };

    const time = Date.now();
    const additionalInfo = { lastPaymentTime: Math.round(time / 1000) };

    const tx = await setIdentity(essentialInfo, additionalInfo);
    return tx;
  } catch (error) {
    console.error("setLastPaymentTime error", error);
  }
};

const getInfos = async (sender: string) => {
  const identity = await getIdentity(sender);
  const essentialInfo = identity
    ? identity
    : {
        display: "",
        legal: "",
        web: "",
        riot: "",
        email: "",
        image: "",
        twitter: "",
      };

  const additionalInfo = await parseAdditionalInfo(identity);

  return { essentialInfo, additionalInfo };
};

export const toggleIsRegisterToPaymentSystem = async (
  sender: string,
  isRegisterToPaymentSystem: boolean
) => {
  try {
    const { essentialInfo, additionalInfo } = await getInfos(sender);
    const _additionalInfo = { ...additionalInfo, isRegisterToPaymentSystem };

    const tx = await setIdentity(essentialInfo, _additionalInfo);
    return tx;
  } catch (error) {
    console.error("setLastPaymentTime error", error);
  }
};
