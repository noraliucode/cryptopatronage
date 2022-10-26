import { ApiPromise, WsProvider } from "@polkadot/api";
import { ANONYMOUS_CREATED, NETWORK, NODE_ENDPOINT } from "./constants";
import { InjectedExtension } from "@polkadot/extension-inject/types";

const wsProvider = new WsProvider(NODE_ENDPOINT[NETWORK]);
const createApi = async () => {
  const api = await ApiPromise.create({ provider: wsProvider });
  return api;
};

export const addProxy = async (
  sender: string,
  injector: InjectedExtension,
  proxy: string
) => {
  const api = await createApi();
  return api.tx.proxy.addProxy(proxy, "Any", 0);
};

export const removeProxy = async (
  sender: string,
  injector: any,
  proxy: string
) => {
  const api = await createApi();
  try {
    await api.tx.proxy
      .removeProxy(proxy, "Any", 0)
      .signAndSend(sender, { signer: injector.signer }, (status) => {
        console.log("removeProxy status >>", status);
      });
  } catch (error) {
    console.error("removeProxy error", error);
  }
};

export const transfer = async (receiver: string, amount: number) => {
  const api = await createApi();
  return api.tx.balances.transfer(receiver, amount);
};

export const transferViaProxy = async (
  real: string,
  sender: string,
  injector: any,
  receiver: string,
  amount: number
) => {
  const api = await createApi();
  await api.tx.proxy
    .proxy(real, null, api.tx.balances.transfer(receiver, amount))
    .signAndSend(sender, { signer: injector.signer });
};

export const signAndSendAddProxyViaProxy = async (
  sender: string,
  proxy: string,
  real?: string,
  injector?: any
) => {
  const api = await createApi();
  api.tx.proxy
    .proxy(real, null, api.tx.proxy.addProxy(proxy, "Any", 0))
    .signAndSend(sender, { signer: injector.signer }, (status) => {});
};

export const addProxyViaProxy = async (proxy: string, real?: string) => {
  const api = await createApi();
  return api.tx.proxy.proxy(real, null, api.tx.proxy.addProxy(proxy, "Any", 0));
};

export const callViaProxy = async (call: any, real?: string) => {
  const api = await createApi();
  return api.tx.proxy.proxy(real, null, api.tx.proxy.removeProxies());
};

export const createAnonymousProxy = async (
  sender: string,
  injector: any,
  delay = 0
) => {
  const api = await createApi();
  let promise = new Promise(function (resolve, reject) {
    api.tx.proxy
      .anonymous("any", delay, 0)
      .signAndSend(
        sender,
        { signer: injector.signer },
        ({ status, events = [] }) => {
          if (status.isInBlock) {
            const anonymousCreatedEvent = events.find((x) => {
              const event = x.toHuman().event?.valueOf();
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              return event.method === ANONYMOUS_CREATED;
            });
            resolve(anonymousCreatedEvent?.toHuman().event?.valueOf());
          }
        }
      );
  });

  const anonymousCreatedEvent = await promise;
  return anonymousCreatedEvent;
};

export const getProxies = async (address: string) => {
  const api = await createApi();
  let promise = new Promise(function (resolve, reject) {
    api.query.proxy.proxies.entries(async (nodes: any) => {
      const proxyNodes = nodes.filter((node: any) => {
        return node[1].toHuman()[0][0].delegate === address;
      });
      resolve(proxyNodes);
    });
  });

  const proxyNodes = await promise;
  return proxyNodes;
};

export const getBalance = async (address: string) => {
  const api = await createApi();
  const { parentHash } = await api.rpc.chain.getHeader();
  const apiAt = await api.at(parentHash);
  const balance = await apiAt.query.system.account(address);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignores
  return balance.data.free;
};

export const getBalances = async (addresses: string[]) => {
  const api = await createApi();
  const balances = await api.query.system.account.multi(addresses);
  return balances;
};

export const setRate = async (rate: number, sender: string, injector: any) => {
  try {
    const api = await createApi();
    const identity = await api.query.identity.identityOf(sender);
    console.log("identity", identity.toHuman());
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
    const result = await api.tx.identity
      .setIdentity({
        ...essentialInfo,
        additional: [[{ Raw: JSON.stringify(additionalInfo) }]],
      })
      .signAndSend(sender, { signer: injector.signer });

    console.log("result", result.toHuman());
  } catch (error) {
    console.error("setRate error", error);
  }
};

export const batchCalls = async (calls: any, sender: string, injector: any) => {
  const api = await createApi();
  await api.tx.utility
    .batchAll(calls)
    .signAndSend(sender, { signer: injector.signer });
};

export const removeProxies = async () => {
  const api = await createApi();
  return api.tx.proxy.removeProxies;
};

export const signAndSendRemoveProxies = async (
  sender: string,
  injector: any,
  proxy: string
) => {
  const api = await createApi();
  await api.tx.proxy
    .removeProxy(proxy, "any", 0)
    .signAndSend(sender, { signer: injector.signer });
};
