import { InjectedExtension } from "@polkadot/extension-inject/types";
import {
  DECIMALS,
  USER_PAYMENT,
  RESERVED_AMOUNT,
  SECONDS_IN_ONE_DAY,
  ZERO_BAL,
} from "./constants";
import {
  getPaymentAmount,
  parseAdditionalInfo,
  removeComma,
  renderAddress,
} from "./helpers";
import {
  IAdditionalInfo,
  Identity,
  INetwork,
  IParsedSupporterProxies,
  IProxyParsedSupporters,
} from "./types";
import type { H256 } from "@polkadot/types/interfaces";
import { ApiPromise } from "@polkadot/api";
import { APIService } from "../services/apiService";
import { SubmittableExtrinsic } from "@polkadot/api/types";

type AnonymousData = {
  pure: string;
  who: string;
};

type AnonymousEvent = {
  data: AnonymousData;
};

export const subscribe = async (
  api: ApiPromise | null,
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
    if (!api) return;
    const apiService = new APIService(api);
    setLoading && setLoading(true);
    let real = sender;
    let delay = isDelayed ? SECONDS_IN_ONE_DAY : 0;
    // let delay = isDelayed ? 300 : 0; // for testing
    if (isCommitted) {
      // check if the supporter has created pure proxy to the creator
      if (!pureProxy) {
        console.log("ceate anonymous proxy...");
        const proxyDepositBase: any = await apiService.getProxyDepositBase();
        const formattedProxyDepositBase = removeComma(
          proxyDepositBase.toString()
        );
        const bal = (await apiService.getBalance(sender)).toString();

        if (
          proxyDepositBase &&
          Number(bal) < Number(formattedProxyDepositBase)
        ) {
          setLoading && setLoading(false);
          // TODO: extract fee calculation code block
          return {
            text: "Insufficient Balance",
            proxyDepositBase: formattedProxyDepositBase,
          };
        }
        const proxyData = (await apiService.createAnonymousProxy(
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
        apiService.transfer(real, amount + reserved),
        apiService.addProxyViaProxy(creator, real, delay),
        // TODO: debug last payment time error
        // getSetLastPaymentTimeTx(api, sender),
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
          apiService.getAnnouncePromise(real, tranferTx.hash),
          apiService.getNotePreimagePromise(tranferTx.data),
        ];
        const extraTxs = await Promise.all(extras);
        txs = [...txs, ...extraTxs];
      } else {
        console.log("normal transfer to anonymous proxy...");
      }
      await apiService.batchCalls(txs, sender, injector, callback);
    } else {
      console.log("set creator as proxy...");
      await apiService.signAndSendAddProxy(sender, injector, creator, callback);
    }
  } catch (error) {
    console.error("subscribe error >>", error);
    setLoading && setLoading(false);
  }
};

export const unsubscribe = async (
  isCommitted: boolean,
  api: ApiPromise | null,
  sender: string,
  injector: any,
  creator: string,
  callback?: any,
  setLoading?: (_: boolean) => void,
  pureProxy?: string
) => {
  try {
    if (!api) return;
    const apiService = new APIService(api);
    setLoading && setLoading(true);
    if (isCommitted && pureProxy) {
      // check if there are funds in the pureProxy account
      const balance = await apiService.getBalance(pureProxy);
      // To use killPure, we need to pass block height and other parameters. Therefore, our conclusion is to simply break the relationship between creator and pureProxy by using removeProxy.
      // https://www.notion.so/517be2b31a69450bb145d5b2e39314ab?v=0df5c9bf2d1144b387ae7a962c9ac8e0&p=cd914b3b0b3f4c53b156a5906f152d06&pm=s
      const txs = [await apiService.removeProxyViaProxy(pureProxy, creator)];
      // withdraw if there are still funds
      if (balance > ZERO_BAL) {
        txs.push(
          await apiService.transferViaProxyPromise(pureProxy, sender, balance)
        );
      }
      await apiService.batchCalls(txs, sender, injector, callback);
    } else {
      // simply removeProxy and signer is the supporter
      apiService.signAndSendRemoveProxy(sender, injector, creator, callback);
    }
  } catch (error) {
    console.error("unsubscribe error >>", error);
  }
};

const getPaymentPromises = async (
  api: ApiPromise | null,
  supporters: any, // pureProxies
  sender: string,
  currentRate: number,
  decimals: number,
  isCommitted: boolean
) => {
  if (!api) return;
  const apiService = new APIService(api);
  const receiver = sender;
  const creatorIdentity = apiService.getIdentity(sender);

  const getLastPaymentTime = (identity: any) => {
    return parseAdditionalInfo(identity).lastPaymentTime;
  };

  const lastPaymentTime = getLastPaymentTime(creatorIdentity);

  const transactionInfos = supporters.map((supporter: any) => {
    const amount = getPaymentAmount(
      currentRate,
      lastPaymentTime[supporter.supporter]
    );
    const real = isCommitted ? supporter.pure : supporter.supporter;
    return {
      real,
      receiver,
      amount,
      supporter: supporter.supporter,
    };
  });

  const promises = transactionInfos.map((info: any) => {
    const transferFn = isCommitted
      ? apiService.transferViaProxyPromise(info.real, receiver, info.amount)
      : apiService.transfer(receiver, info.amount);
    return [
      transferFn,
      apiService.setIdentityPromise(creatorIdentity, {
        [`lt_${renderAddress(info.supporter, "ROCOCO", 4)}`]: Date.now(),
      }),
    ];
  });

  return promises;
};

export const pullPayment = async (
  api: ApiPromise | null,
  supporters: IProxyParsedSupporters,
  sender: string,
  injector: any,
  currentRate: number,
  decimals: number,
  isCommitted: boolean
) => {
  if (!api) return;
  const apiService = new APIService(api);
  try {
    const promises = (await getPaymentPromises(
      api,
      supporters,
      sender,
      currentRate,
      decimals,
      isCommitted
    )) as Promise<SubmittableExtrinsic<"promise">>[];

    const txs = await Promise.all(promises);
    await apiService.batchCalls(txs, sender, injector);
  } catch (error) {
    console.error("pullPayment error", error);
  }
};

export const pullAllPayment = async (
  api: ApiPromise | null,
  reals: string[],
  sender: string,
  injector: any,
  currentRate: number,
  decimals: number
) => {
  try {
    if (!api) return;
    const apiService = new APIService(api);
    const promises: any[] = [];
    reals.forEach(async (real) => {
      promises.push(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...(await getPaymentPromises(api, real, sender, currentRate, decimals))
      );
    });
    const txs = await Promise.all(promises);
    await apiService.batchCalls(txs, sender, injector);
  } catch (error) {
    console.error("pull All Payment error", error);
  }
};

export const getSetLastPaymentTimeTx = async (
  api: ApiPromise | null,
  sender: string
) => {
  try {
    if (!api) return;
    const apiService = new APIService(api);
    const identity = await apiService.getIdentity(sender);
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

    const tx = await apiService.setIdentity(essentialInfo, additionalInfo);
    return tx;
  } catch (error) {
    console.error("setLastPaymentTime error", error);
  }
};

const getInfos = async (api: ApiPromise | null, sender: string) => {
  if (!api) return;
  const apiService = new APIService(api);
  const identity = await apiService.getIdentity(sender);
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
  api: ApiPromise | null,
  sender: string,
  isRegisterToPaymentSystem: boolean,
  injector: InjectedExtension
) => {
  try {
    if (!api) return;
    const apiService = new APIService(api);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { essentialInfo, additionalInfo } = await getInfos(api, sender);
    const _additionalInfo = {
      ...additionalInfo,
      ps: isRegisterToPaymentSystem,
    };

    const tx = await apiService.signAndSendSetIdentity(
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
  api: ApiPromise | null,
  sender: string,
  injector: InjectedExtension,
  hash: H256
) => {
  try {
    if (!api) return;
    const apiService = new APIService(api);
    const status = await apiService.getPreimageStatus(hash);
    const preimage = await apiService.getPreimageData(hash);
    await apiService.batchCalls(preimage, sender, injector);
  } catch (error) {
    console.error("executePreimage error", error);
  }
};

export const parseCreatorProxies = async (
  network: string,
  api: ApiPromise | null,
  // TODO: import type PalletProxyProxyDefinition
  proxies: any,
  creator?: string
): Promise<IParsedSupporterProxies> => {
  const _api = api as ApiPromise;
  const apiService = new APIService(_api);
  // TODO: not assignable to parameter of type never" error in TypeScript
  const committedSupporters: any = [];
  const uncommittedSupporters: any = [];
  const promise = new Promise(function (resolve, reject) {
    proxies.forEach((proxy: any) => {
      const real = proxy[0].toHuman()[0];
      const delegations = proxy[1].toHuman()[0];

      if (
        delegations &&
        delegations[0] &&
        delegations[0]?.proxyType === "Any"
      ) {
        delegations.forEach(async (delegation: any) => {
          if (
            delegations[0]?.delegate &&
            creator &&
            delegations[0]?.delegate === renderAddress(creator, network)
          ) {
            committedSupporters.push({
              supporter: delegations[1]?.delegate,
              pure: real,
            });

            if (creator === renderAddress(delegations[0]?.delegate, network)) {
              uncommittedSupporters.push({
                supporter: real,
              });
            }
            resolve({ committedSupporters, uncommittedSupporters });
          }
        });
      }
    });
  });
  const result: any = await promise;
  return result;
};

export const updateInfo = async (
  api: ApiPromise | null,
  idetity: Identity,
  updatedAdditionalInfo: IAdditionalInfo,
  sender: string,
  injector: any,
  callback?: () => void,
  setLoading?: (_: boolean) => void
) => {
  try {
    if (!api) return;
    const apiService = new APIService(api);
    setLoading && setLoading(true);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { essentialInfo, additionalInfo } = await getInfos(api, sender);
    const _callBack = () => {
      callback && callback();
      setLoading && setLoading(false);
    };

    const _additionalInfo = {
      ...additionalInfo,
      ...updatedAdditionalInfo,
    };

    await apiService.signAndSendSetIdentity(
      essentialInfo,
      _additionalInfo,
      sender,
      injector,
      _callBack,
      idetity
    );
  } catch (error) {
    console.error("set identity error", error);
    setLoading && setLoading(false);
  }
};

export const create = async (
  api: ApiPromise | null,
  rate: number,
  imgUrl: string,
  identity: Identity,
  sender: string,
  injector: any,
  callback?: () => void,
  setLoading?: (_: boolean) => void
) => {
  try {
    if (!api) return;
    const apiService = new APIService(api);
    setLoading && setLoading(true);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { essentialInfo, additionalInfo } = await getInfos(api, sender);
    const _additionalInfo = {
      ...additionalInfo,
      rate,
      imgUrl,
    };
    const _callBack = () => {
      callback && callback();
      setLoading && setLoading(false);
    };

    await apiService.signAndSendSetIdentity(
      essentialInfo,
      _additionalInfo,
      sender,
      injector,
      _callBack,
      identity
    );
  } catch (error) {
    console.error("create error", error);
    setLoading && setLoading(false);
  }
};

export const clearIdentity = async (
  api: ApiPromise | null,
  sender: string,
  injector: any,
  callback?: () => void,
  setLoading?: (_: boolean) => void
) => {
  if (!api) return;
  const apiService = new APIService(api);
  try {
    setLoading && setLoading(true);
    await apiService.signAndSendSetIdentity(
      null,
      null,
      sender,
      injector,
      callback
    );
  } catch (error) {
    console.log("clearIdentity error", error);
  }
};

export const unregister = async (
  api: ApiPromise | null,
  sender: string,
  injector: any,
  callback?: () => void,
  setLoading?: (_: boolean) => void
) => {
  if (!api) return;
  const apiService = new APIService(api);
  try {
    setLoading && setLoading(true);
    const { essentialInfo }: any = await getInfos(api, sender);
    const _callBack = () => {
      setLoading && setLoading(false);
    };
    await apiService.signAndSendSetIdentity(
      essentialInfo,
      null,
      sender,
      injector,
      _callBack
    );
  } catch (error) {
    console.log("clearIdentity error", error);
  }
};
