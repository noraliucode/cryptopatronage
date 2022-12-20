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
  getRemoveProxyPromise,
  getAnnouncePromise,
  getNotePreimagePromise,
  getPreimageStatus,
  getPreimageData,
  setIdentityPromise,
  transferViaProxyPromise,
} from "./apiCalls";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import {
  DECIMALS,
  USER_PAYMENT,
  RESERVED_AMOUNT,
  SECONDS_IN_ONE_DAY,
} from "./constants";
import { getPaymentAmount, parseAdditionalInfo } from "./helpers";
import { INetwork } from "./types";
import type { H256 } from "@polkadot/types/interfaces";

type AnonymousData = {
  pure: string;
  who: string;
};

type AnonymousEvent = {
  data: AnonymousData;
};

export const subscribe = async (
  creator: string,
  sender: string,
  injector: InjectedExtension,
  isCommitted = true,
  network: INetwork,
  callback?: any,
  setLoading?: (_: boolean) => void,
  pureProxy?: string,
  isDelayed = false
) => {
  try {
    setLoading && setLoading(true);
    let real = sender;
    let delay = isDelayed ? SECONDS_IN_ONE_DAY : 0;
    // let delay = isDelayed ? 300 : 0; // for testing
    if (isCommitted) {
      // check if the supporter has created pure proxy to the creator
      if (!pureProxy) {
        console.log("ceate anonymous proxy...");
        const proxyData = (await createAnonymousProxy(
          sender,
          injector,
          delay
        )) as AnonymousEvent;
        const { pure, who } = proxyData.data;
        real = pure;
      } else {
        real = pureProxy;
      }

      console.log("pure proxy >>", real);
      const amount = USER_PAYMENT * 10 ** DECIMALS[network];

      const reserved = RESERVED_AMOUNT * 10 ** DECIMALS[network];

      // TODO: add total amount later to inform user
      // const fee = (await getTransferFee(anonymous, amount, sender)).split(
      //   " "
      // )[0];
      // const totalAmount =
      //   Math.ceil(Number(fee)) * 10 ** M_DECIMALS[NETWORK] + amount + reserved;

      const promises = [
        transfer(real, amount + reserved),
        addProxyViaProxy(creator, real, delay),
        getSetLastPaymentTimeTx(sender),
      ];

      let txs = await Promise.all(promises);

      console.log("set creator as main proxy...");
      console.log("set last payment time...");
      if (isDelayed) {
        console.log(
          "publish the hash of a proxy-call that will be made in the future...."
        );
        console.log("register a preimage on-chain....");
        const tranferTx = txs[0] as any;
        // remove transfer tx
        txs.shift();
        const extras = [
          getAnnouncePromise(real, tranferTx.hash),
          getNotePreimagePromise(tranferTx.data),
        ];
        const extraTxs = await Promise.all(extras);
        txs = [...txs, ...extraTxs];
      } else {
        console.log("normal transfer to anonymous proxy...");
      }
      await batchCalls(txs, sender, injector, callback);
    } else {
      console.log("set creator as proxy...");
      await signAndSendAddProxy(sender, injector, creator);
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

    // get all txs
    const txs = await Promise.all([
      ...reals.map((real: any) => removeProxiesViaProxy(removeProxies(), real)),
      // uncommitted supporters
      getRemoveProxyPromise(creator),
    ]);

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

    const { essentialInfo, additionalInfo } = await getInfos(sender);
    const _additionalInfo = {
      ...additionalInfo,
      rate,
    };
    const _callBack = () => {
      callback && callback();
      setLoading && setLoading(false);
    };

    await signAndSendSetIdentity(
      essentialInfo,
      _additionalInfo,
      sender,
      injector,
      _callBack
    );
  } catch (error) {
    console.error("setRate error", error);
    setLoading && setLoading(false);
  }
};

const getPaymentPromises = async (
  real: string,
  sender: string,
  currentRate: number,
  decimals: number
) => {
  const receiver = sender;
  const [creatorIdentity] = await Promise.all(
    [sender].map((x) => getIdentity(x))
  );
  const getLastPaymentTime = (identity: any) => {
    return parseAdditionalInfo(identity).lastPaymentTime;
  };

  const lastPaymentTime = getLastPaymentTime(creatorIdentity);

  const amount = getPaymentAmount(
    currentRate,
    decimals,
    lastPaymentTime && lastPaymentTime
  );

  const promises = [
    transferViaProxyPromise(real, receiver, amount),
    setIdentityPromise(creatorIdentity, { lastPaymentTime: Date.now() }),
  ];

  return promises;
};

export const pullPayment = async (
  real: string,
  sender: string,
  injector: any,
  currentRate: number,
  decimals: number
) => {
  try {
    const promises = await getPaymentPromises(
      real,
      sender,
      currentRate,
      decimals
    );

    const txs = await Promise.all(promises);
    await batchCalls(txs, sender, injector);
  } catch (error) {
    console.error("pullPayment error", error);
  }
};

export const pullAllPayment = async (
  reals: string[],
  sender: string,
  injector: any,
  currentRate: number,
  decimals: number
) => {
  try {
    const promises: any[] = [];
    reals.forEach(async (real) => {
      promises.push(
        ...(await getPaymentPromises(real, sender, currentRate, decimals))
      );
    });
    const txs = await Promise.all(promises);
    await batchCalls(txs, sender, injector);
  } catch (error) {
    console.error("pull All Payment error", error);
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
    const additionalInfo = { lastPaymentTime: Math.round(time) };

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
  isRegisterToPaymentSystem: boolean,
  injector: InjectedExtension
) => {
  try {
    const { essentialInfo, additionalInfo } = await getInfos(sender);
    const _additionalInfo = {
      ...additionalInfo,
      ps: isRegisterToPaymentSystem,
    };

    const tx = await signAndSendSetIdentity(
      essentialInfo,
      _additionalInfo,
      sender,
      injector
    );

    return tx;
  } catch (error) {
    console.error("toggleIsRegisterToPaymentSystem error", error);
  }
};

export const executePreimages = async (
  sender: string,
  injector: InjectedExtension,
  hash: H256
) => {
  try {
    const status = await getPreimageStatus(hash);
    console.log("status", status);

    const preimage = await getPreimageData(hash);
    await batchCalls(preimage, sender, injector);
  } catch (error) {
    console.error("executePreimage error", error);
  }
};

// TODO: refactor set identity
export const setImageUrl = async (
  sender: string,
  imgUrl: string,
  injector: InjectedExtension
) => {
  try {
    const { essentialInfo, additionalInfo } = await getInfos(sender);
    const _additionalInfo = {
      ...additionalInfo,
      imgUrl,
    };

    const tx = await signAndSendSetIdentity(
      essentialInfo,
      _additionalInfo,
      sender,
      injector
    );

    return tx;
  } catch (error) {
    console.error("setImage error", error);
  }
};
