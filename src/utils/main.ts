import { InjectedExtension } from "@polkadot/extension-inject/types";
import {
  DECIMALS,
  USER_PAYMENT,
  RESERVED_AMOUNT,
  SECONDS_IN_ONE_DAY,
} from "./constants";
import { getPaymentAmount, parseAdditionalInfo } from "./helpers";
import { Identity, INetwork, IParsedSupporterProxies } from "./types";
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
      await apiService.signAndSendAddProxy(sender, injector, creator);
    }
  } catch (error) {
    console.error("subscribe error >>", error);
    setLoading && setLoading(false);
  }
};

export const unsubscribe = async (
  api: ApiPromise | null,
  sender: string,
  injector: any,
  creator: string,
  callback?: any,
  setLoading?: (_: boolean) => void
) => {
  try {
    if (!api) return;
    const apiService = new APIService(api);
    setLoading && setLoading(true);
    const creatorProxies: any = await apiService.getProxies(creator);
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
      ...reals.map((real: any) =>
        apiService.removeProxiesViaProxy(apiService.removeProxies(), real)
      ),
      // uncommitted supporters
      apiService.getRemoveProxyPromise(creator),
    ]);

    await apiService.batchCalls(txs, sender, injector, callback);
  } catch (error) {
    console.error("unsubscribe error >>", error);
  } finally {
    setLoading && setLoading(false);
  }
};

export const setRate = async (
  api: ApiPromise | null,
  rate: number,
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
      _callBack
    );
  } catch (error) {
    console.error("setRate error", error);
    setLoading && setLoading(false);
  }
};

const getPaymentPromises = async (
  api: ApiPromise | null,
  real: string,
  sender: string,
  currentRate: number,
  decimals: number
) => {
  if (!api) return;
  const apiService = new APIService(api);
  const receiver = sender;
  const [creatorIdentity] = await Promise.all(
    [sender].map((x) => apiService.getIdentity(x))
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
    apiService.transferViaProxyPromise(real, receiver, amount),
    apiService.setIdentityPromise(creatorIdentity, {
      lastPaymentTime: Date.now(),
    }),
  ];

  return promises;
};

export const pullPayment = async (
  api: ApiPromise | null,
  real: string,
  sender: string,
  injector: any,
  currentRate: number,
  decimals: number
) => {
  if (!api) return;
  const apiService = new APIService(api);
  try {
    const promises = (await getPaymentPromises(
      api,
      real,
      sender,
      currentRate,
      decimals
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

// TODO: refactor set identity
export const setImageUrl = async (
  api: ApiPromise | null,
  sender: string,
  imgUrl: string,
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
      imgUrl,
    };

    const tx = await apiService.signAndSendSetIdentity(
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

export const parseCreatorProxies = async (
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
      const delegations = proxy[1].toHuman()[0];

      if (delegations) {
        delegations.forEach(async (delegation: any) => {
          if (delegation.delegate === creator) {
            const pureProxyOrSupporter = proxy[0].toHuman()[0];
            // In the case of subscribtion adding pure proxy, supporter address is the first element.
            const committedSupporter = delegations[0].delegate;
            const nodes: any = await apiService.getDelegations(
              pureProxyOrSupporter
            );

            // and validate if it is pure
            const pureDelegations = nodes && nodes[0].toHuman();
            // In the case of subscribtion adding pure proxy, creator address is the first element.
            if (pureDelegations && pureDelegations[1]?.delegate === creator) {
              committedSupporters.push({
                supporter: committedSupporter,
                pure: pureProxyOrSupporter,
              });
            } else {
              uncommittedSupporters.push({
                supporter: pureProxyOrSupporter,
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

// TODO: refactor - same functionality as setRate
export const setIdentity = async (
  api: ApiPromise | null,
  idetity: Identity,
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

    await apiService.signAndSendSetIdentity(
      essentialInfo,
      additionalInfo,
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
