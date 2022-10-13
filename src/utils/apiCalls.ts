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
  try {
    await api.tx.proxy
      .addProxy(proxy, "Any", 0)
      .signAndSend(sender, { signer: injector.signer }, (status) => {});
  } catch (error) {
    console.error("addProxy error", error);
  }
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
  api.tx.balances
    .transfer(receiver, amount)
    .signAndSend(sender, { signer: injector.signer }, (status) => {});
};

export const transferViaProxy = async (
  real: string,
  sender: string,
  injector: any,
  receiver: string,
  amount: number
) => {
  const api = await ApiPromise.create({ provider: wsProvider });
  api.tx.proxy.proxy(real, null, transfer(sender, injector, receiver, amount));
};

export const createAnonymousProxy = async (sender: string, injector: any) => {
  const api = await ApiPromise.create({ provider: wsProvider });
  let promise = new Promise(function (resolve, reject) {
    api.tx.proxy
      .anonymous("any", 0, 0)
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
