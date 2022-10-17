import { ApiPromise, WsProvider } from "@polkadot/api";
import { ANONYMOUS_CREATED, ROCOCO } from "./constants";
import { InjectedExtension } from "@polkadot/extension-inject/types";

const wsProvider = new WsProvider(ROCOCO);

export const addProxy = async (
  sender: string,
  injector: InjectedExtension,
  proxy: string
) => {
  const api = await ApiPromise.create({ provider: wsProvider });
  return api.tx.proxy.addProxy(proxy, "Any", 0);
};

export const removeProxy = async (
  sender: string,
  injector: any,
  proxy: string
) => {
  const api = await ApiPromise.create({ provider: wsProvider });
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

export const transfer = async (
  sender: string,
  injector: any,
  receiver: string,
  amount: number
) => {
  const api = await ApiPromise.create({ provider: wsProvider });
  await api.tx.balances
    .transfer(receiver, amount)
    .signAndSend(sender, { signer: injector.signer });
};

export const transferViaProxy = async (
  real: string,
  sender: string,
  injector: any,
  receiver: string,
  amount: number
) => {
  const api = await ApiPromise.create({ provider: wsProvider });
  await api.tx.proxy
    .proxy(real, null, api.tx.balances.transfer(receiver, amount))
    .signAndSend(sender, { signer: injector.signer });
};

export const addProxyViaProxy = async (
  real: string,
  sender: string,
  injector: any,
  proxy: string
) => {
  const api = await ApiPromise.create({ provider: wsProvider });
  api.tx.proxy
    .proxy(real, null, api.tx.proxy.addProxy(proxy, "Any", 0))
    .signAndSend(sender, { signer: injector.signer }, (status) => {});
};

export const createAnonymousProxy = async (
  sender: string,
  injector: any,
  delay = 0
) => {
  const api = await ApiPromise.create({ provider: wsProvider });
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
  const api = await ApiPromise.create({ provider: wsProvider });
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
  const api = await ApiPromise.create({ provider: wsProvider });
  const { parentHash } = await api.rpc.chain.getHeader();
  const apiAt = await api.at(parentHash);
  const balance = await apiAt.query.system.account(address);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignores
  return balance.data.free;
};

export const getBalances = async (addresses: string[]) => {
  const api = await ApiPromise.create({ provider: wsProvider });
  const balances = await api.query.system.account.multi(addresses);
  return balances;
};
