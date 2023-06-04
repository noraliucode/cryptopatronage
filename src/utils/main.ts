import { InjectedExtension } from "@polkadot/extension-inject/types";
import {
  DECIMALS,
  USER_PAYMENT,
  RESERVED_AMOUNT,
  SECONDS_IN_ONE_DAY,
  ZERO_BAL,
  SUPPORTERS,
  PULL_HISTORY,
} from "./constants";
import {
  calculateExpiryTimestamp,
  getPaymentAmount,
  parseAdditionalInfo,
  removeComma,
  renderAddress,
} from "./helpers";
import {
  IAdditionalInfo,
  Identity,
  IHistory,
  INetwork,
  IParsedSupporterProxies,
  ISupporter,
} from "./types";
import type { H256 } from "@polkadot/types/interfaces";
import { ApiPromise } from "@polkadot/api";
import { APIService } from "../services/apiService";
import JsonBinService from "../services/jsonBinService";

type AnonymousData = {
  pure: string;
  who: string;
};

type AnonymousEvent = {
  data: AnonymousData;
};

export const subscribe = async (
  setExpiryDate: (_: number) => void,
  api: ApiPromise | null,
  creator: string,
  sender: string,
  injector: InjectedExtension,
  isCommitted = true,
  network: INetwork,
  months = 1,
  tokenUsdPrice: number,
  rate: number,
  callback?: any,
  setLoading?: (_: boolean) => void,
  pureProxy?: string | null,
  isDelayed = false,
  isUsd = false
) => {
  try {
    if (!api) return;
    const apiService = new APIService(api);
    setLoading && setLoading(true);
    let real = sender;
    let delay = isDelayed ? SECONDS_IN_ONE_DAY : 0;
    const supporter = sender;
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

      const KsmToPlanckUnit = 10 ** DECIMALS[network];
      console.log("pure proxy >>", real);
      let amount = 0;
      if (isUsd) {
        amount = (rate / KsmToPlanckUnit / tokenUsdPrice) * months;
      } else {
        amount = rate * months;
      }

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

      // TODO: add delay transfer later
      // if (isDelayed) {
      //   console.log(
      //     "publish the hash of a proxy-call that will be made in the future...."
      //   );
      //   console.log("register a preimage on-chain....");
      //   const tranferTx = txs[0] as any;
      //   // remove transfer tx
      //   txs.shift();
      //   const extras = [
      //     apiService.getAnnouncePromise(real, tranferTx.hash),
      //     apiService.getNotePreimagePromise(tranferTx.data),
      //   ];
      //   const extraTxs = await Promise.all(extras);
      //   txs = [...txs, ...extraTxs];
      // } else {
      //   console.log("normal transfer to anonymous proxy...");
      // }
      const _callBack = async () => {
        callback && callback();
        setLoading && setLoading(false);
      };

      const tx = await apiService.batchCalls(txs, sender, injector, _callBack);
      if (tx) {
        console.log("set subscribed time...");
        const now = new Date().getTime();
        const expiryDate = calculateExpiryTimestamp(now, months);
        setExpiryDate(expiryDate);
        const supporterInfo: ISupporter = {
          address: sender,
          subscribedTime: Date.now(),
          expiresOn: expiryDate,
          pureProxy: isCommitted ? real : null,
        };
        await updateCreatorKeyValue(creator, [supporterInfo], SUPPORTERS);
      }
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
  const creatorIdentity = await apiService.getIdentity(sender);

  if (!creatorIdentity) return;

  const getLastPaymentTime = (identity: any) => {
    return parseAdditionalInfo(identity)?.lastPaymentTime;
  };

  let transactionInfos: any = [];
  let pullHistory: any = [];

  supporters.forEach((supporter: ISupporter) => {
    let lastPaymentTime = getLastPaymentTime(creatorIdentity);
    const amount = getPaymentAmount(currentRate, lastPaymentTime);
    const real = isCommitted ? supporter.pureProxy : supporter.address;
    const isBalanceSufficient = isCommitted
      ? supporter.pureBalance && supporter.pureBalance > amount
      : supporter.supporterBalance && supporter.supporterBalance > amount;
    if (!isBalanceSufficient && real) {
      pullHistory.push({
        supporter: supporter.address || "",
        pure: real,
        time: Date.now(),
        amount,
      });

      transactionInfos.push({
        real,
        receiver,
        amount,
        supporter: supporter.address,
      });
    }
  });

  const promises: any = [];
  const additionalInfo = parseAdditionalInfo(creatorIdentity);

  transactionInfos.forEach((info: any) => {
    const transferFn = isCommitted
      ? apiService.transferViaProxyPromise(info.real, receiver, info.amount)
      : apiService.transfer(receiver, info.amount);
    promises.push(
      transferFn,
      apiService.setIdentityPromise(creatorIdentity, {
        ...additionalInfo,
        // TODO: pass network
        [`lt_${renderAddress(info.supporter, "ROCOCO", 4)}`]: Date.now(),
      })
    );
  });

  return { promises, pullHistory };
};

export const pullPayment = async (
  api: ApiPromise | null,
  supporters: ISupporter,
  sender: string,
  injector: any,
  currentRate: number,
  decimals: number,
  isCommitted: boolean,
  setLoading: (_: boolean) => void
) => {
  if (!api) return;
  setLoading(true);
  const apiService = new APIService(api);
  try {
    const { promises, pullHistory } = (await getPaymentPromises(
      api,
      supporters,
      sender,
      currentRate,
      decimals,
      isCommitted
    )) as any;

    const txs = await Promise.all(promises);

    const tx = await apiService.batchCalls(txs, sender, injector);
    let _pullHistory;
    if (tx) {
      _pullHistory = pullHistory.map((x: IHistory) => ({ ...x, tx }));
    }

    await updateCreatorKeyValue(sender, _pullHistory, PULL_HISTORY);
    setLoading(false);
  } catch (error) {
    console.error("pullPayment error", error);
    setLoading(false);
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

export const getSupportersForCreator = async (creator = "") => {
  const result = await readJsonBin();
  const supporters = result[creator].supporters;
  console.log("supporters", supporters);

  const committedSupporters = supporters.filter(
    (supporter: any) => supporter.pureProxy
  );
  console.log("committedSupporters");

  const uncommittedSupporters = supporters.filter(
    (supporter: any) => !supporter.pureProxy
  );

  return { committedSupporters, uncommittedSupporters };
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
    callback && callback();
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

export const updateJsonBin = async (data: any) => {
  const jsonBinService = new JsonBinService();
  try {
    await jsonBinService.updateData(data);
  } catch (error) {
    console.error("updateJsonBin error", error);
  }
};

const readJsonBin = async () => {
  const jsonBinService = new JsonBinService();
  try {
    let result = await jsonBinService.readData();

    result = result.record;
    return result;
  } catch (error) {
    console.error("readJsonBin error", error);
  }
};

export const readJsonBinKeyValue = async (signer: string, key: string) => {
  try {
    const result = await readJsonBin();
    return result[signer] ? result[signer][key] : null;
  } catch (error) {
    console.error("readJsonBinKeyValue error", error);
  }
};

export const updateCreatorKeyValue = async (
  creator: string,
  value: any,
  key: string
) => {
  const result = await readJsonBin();
  const originalKeyValue = result[creator] ? result[creator][key] : null;
  let data;
  if (originalKeyValue) {
    data = {
      ...result[creator],
      [key]: [...originalKeyValue, value],
    };
  } else {
    data = {
      [key]: value,
    };
  }

  await updateJsonBin({ [creator]: data, ...result });
};
