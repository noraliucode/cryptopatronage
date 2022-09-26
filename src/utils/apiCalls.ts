import { ApiPromise, WsProvider } from "@polkadot/api";
import { ROCOCO } from "./constants";
const wsProvider = new WsProvider(ROCOCO);

export const addProxy = async (
  sender: string,
  injector: any,
  proxy: string
) => {
  const api = await ApiPromise.create({ provider: wsProvider });
  try {
    await api.tx.proxy
      .addProxy(proxy, "Any", 0)
      .signAndSend(sender, { signer: injector.signer }, (status) => {
        console.log("addProxy status >>", status);
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
