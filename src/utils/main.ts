import { mnemonicGenerate } from "@polkadot/util-crypto";
import keyring from "@polkadot/ui-keyring";
import { addProxy, transfer } from "./apiCalls";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import { RATE, ROCOCO, ROCOCO_DECIAMLS, SUPPORTER_LIST } from "./constants";
import { ApiPromise, WsProvider } from "@polkadot/api";

const wsProvider = new WsProvider(ROCOCO);

export const subscribe = async (
  sender: string,
  injector: InjectedExtension
) => {
  // the WASM libraries needs to be loaded and initialized
  console.log("ceate proxy account...");

  await ApiPromise.create({ provider: wsProvider });
  // keyring initialization
  keyring.loadAll({ ss58Format: 42, type: "sr25519" });

  // create a new account(proxy)
  // generate a random mnemonic, 12 words in length
  const mnemonic = mnemonicGenerate(12);
  // add the account, encrypt the stored JSON with an account-specific password
  const { pair } = keyring.addUri(mnemonic, "myStr0ngP@ssworD", {
    name: "mnemonic acc",
  });
  const proxy = pair.address;

  //add proxy
  console.log("addProxy...");
  await addProxy(sender, injector, proxy);

  // transfer to proxy account
  console.log("transfer...");
  await transfer(sender, injector, proxy, RATE * 10 ** ROCOCO_DECIAMLS);

  // edit supporter list
  let supporterList = JSON.parse(localStorage.getItem(SUPPORTER_LIST) || "{}");
  localStorage.setItem(
    SUPPORTER_LIST,
    JSON.stringify({ ...supporterList, [proxy]: sender })
  );
  supporterList = localStorage.getItem(SUPPORTER_LIST);
  console.log("supporterList", supporterList);
};
