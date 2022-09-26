import { ApiPromise, WsProvider } from "@polkadot/api";
import { ROCOCO } from "./constants";
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
      .signAndSend(sender, { signer: injector.signer }, (status) => {
        console.log("addProxy...");
      });
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
    .signAndSend(sender, { signer: injector.signer }, (status) => {
      console.log("transfer...");
    });
};
