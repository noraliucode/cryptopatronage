import { PURE_CREATED } from "../utils/constants";
import { ApiPromise, WsProvider } from "@polkadot/api";
import type { H256 } from "@polkadot/types/interfaces";
import type { Bytes } from "@polkadot/types";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import {
  formatAdditionalInfo,
  formatEssentialInfo,
  formatUpdatedInfo,
  getUserProxyInfo,
} from "../utils/helpers";
import { Identity } from "../utils/types";

class APIService {
  api: ApiPromise;
  constructor(api: ApiPromise) {
    this.api = api;
  }

  addProxy = async (
    sender: string,
    injector: InjectedExtension,
    proxy: string
  ) => {
    return this.api.tx.proxy.addProxy(proxy, "Any", 0);
  };

  signAndSendAddProxy = async (
    sender: string,
    injector: InjectedExtension,
    proxy: string
  ) => {
    this.api.tx.proxy
      .addProxy(proxy, "Any", 0)
      .signAndSend(sender, { signer: injector.signer });
  };

  signAndSendRemoveProxy = async (
    sender: string,
    injector: any,
    proxy: string
  ) => {
    try {
      await this.api.tx.proxy
        .removeProxy(proxy, "Any", 0)
        .signAndSend(sender, { signer: injector.signer }, (status) => {
          console.log("removeProxy status >>", status);
        });
    } catch (error) {
      console.error("removeProxy error", error);
    }
  };

  transfer = async (receiver: string, amount: number) => {
    return this.api.tx.balances.transfer(receiver, amount);
  };

  getTransferFee = async (receiver: string, amount: number, sender: string) => {
    const info = await this.api.tx.balances
      .transfer(receiver, amount)
      .paymentInfo(sender);
    return info.partialFee.toHuman();
  };

  transferViaProxy = async (
    real: string,
    sender: string,
    injector: any,
    receiver: string,
    amount: number
  ) => {
    await this.api.tx.proxy
      .proxy(real, null, this.api.tx.balances.transfer(receiver, amount))
      .signAndSend(sender, { signer: injector.signer });
  };

  transferViaProxyPromise = async (
    real: string,
    receiver: string,
    amount: number
  ) => {
    return this.api.tx.proxy.proxy(
      real,
      null,
      this.api.tx.balances.transfer(receiver, amount)
    );
  };

  signAndSendAddProxyViaProxy = async (
    sender: string,
    proxy: string,
    real?: string,
    injector?: any
  ) => {
    this.api.tx.proxy
      .proxy(real, null, this.api.tx.proxy.addProxy(proxy, "Any", 0))
      .signAndSend(sender, { signer: injector.signer }, (status) => {});
  };

  addProxyViaProxy = async (proxy: string, real?: string, delay = 0) => {
    return this.api.tx.proxy.proxy(
      real,
      null,
      this.api.tx.proxy.addProxy(proxy, "Any", delay)
    );
  };

  removeProxiesViaProxy = async (call: any, real?: string) => {
    return this.api.tx.proxy.proxy(
      real,
      null,
      this.api.tx.proxy.removeProxies()
    );
  };

  createAnonymousProxy = async (sender: string, injector: any, delay = 0) => {
    let promise = new Promise((resolve, reject) => {
      this.api.tx.proxy
        .createPure("any", delay, 0)
        .signAndSend(
          sender,
          { signer: injector.signer },
          ({ status, events = [] }) => {
            if (status.isInBlock) {
              const anonymousCreatedEvent = events.find((x) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const event = x.toHuman().event?.valueOf();
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return event.method === PURE_CREATED;
              });
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              resolve(anonymousCreatedEvent?.toHuman().event?.valueOf());
            }
          }
        );
    });

    const anonymousCreatedEvent = await promise;
    return anonymousCreatedEvent;
  };

  getProxies = async (address?: string) => {
    /* Retain the old code until a better solution for this issue becomes available. */
    /*
    let promise = new Promise((resolve, reject) => {
      this.api.query.proxy.proxies
        .entries(async (nodes: any) => {
          if (address) {
            const proxyNodes = nodes.filter((node: any) => {
              return (
                // node[0] is real account, and node[1] is delegations
                node[1].toHuman()[0][0].delegate === address ||
                node[0].toHuman()[0] === address
              );
            });
            resolve(proxyNodes);
          } else {
            resolve(nodes);
          }
        })
        .catch((error) => {
          // Catch Error: Unable to decode storage proxy.proxies
          // https://github.com/polkadot-js/api/issues/4948
          // an unmigrated storage item in a previous format
          console.log("getProxies error: ", error);
        });
    });
    */

    let keys = await this.api.query.proxy.proxies.keys();

    let proxyAddresses = [];
    for (const key of keys) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        proxyAddresses.push(key.args.map((k) => k.toHuman()?.valueOf()));
      } catch (error) {
        console.log("parse proxy key value error", error);
      }
    }
    proxyAddresses = proxyAddresses.map((address) => {
      return address.flat()[0];
    });

    let proxyNodes;
    try {
      // unable to use `multi`
      // throws an error in the next line: Unable to decode storage proxy.proxies: entry 197:: createType((Vec<PalletProxyProxyDefinition>,u128)):: decodeU8a: failed at 0x0898c8a3d01da9877b7b30877c717ae8… (index 1/2): Vec<PalletProxyProxyDefinition>:: decodeU8aVec: failed at 0x1da9877b7b30877c717ae8f2a7e726ce… (index 2/2):
      // proxyNodes = await this.api.query.proxy.proxies.multi(proxyAddresses);
      proxyNodes = await Promise.all(
        proxyAddresses.map((address) => {
          return this.api.query.proxy.proxies(address);
        })
      );
    } catch (error) {
      console.log("get proxy.proxy error", error);
      if (!proxyNodes) {
        return [];
      }
    }

    if (address) {
      proxyNodes = getUserProxyInfo(address, proxyNodes);
    }

    /* Retain the old code until a better solution for this issue becomes available. */
    /* const proxyNodes = await promise; */
    return proxyNodes;
  };

  getDelegations = async (address?: string) => {
    const delegations = await this.api.query.proxy.proxies(address);
    return delegations;
  };

  getBalance = async (address: string) => {
    const { parentHash } = await this.api.rpc.chain.getHeader();
    const apiAt = await this.api.at(parentHash);
    const balance = await apiAt.query.system.account(address);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignores
    return balance.data.free;
  };

  getBalances = async (addresses: string[]) => {
    const balances = await this.api.query.system.account.multi(addresses);
    return balances;
  };

  getIdentity = async (creator?: string) => {
    const identity = await this.api.query.identity.identityOf(creator);
    return identity;
  };

  getIdentities = async (creators: string[]) => {
    const result = await this.api.query.identity.identityOf.multi(creators);
    return result;
  };

  signAndSendSetIdentity = async (
    essentialInfo: any,
    additionalInfo: any,
    sender: string,
    injector: any,
    callback?: () => void,
    updatedInfo?: Identity
  ) => {
    let _essentialInfo;
    if (essentialInfo) {
      _essentialInfo = formatEssentialInfo(essentialInfo.toHuman().info);
    }

    _essentialInfo = updatedInfo
      ? { ..._essentialInfo, ...formatUpdatedInfo(updatedInfo) }
      : { ..._essentialInfo };

    const identity = {
      ..._essentialInfo,
      additional: formatAdditionalInfo(additionalInfo),
    };

    await this.api.tx.identity
      .setIdentity(identity)
      .signAndSend(
        sender,
        { signer: injector.signer },
        ({ status, events = [], dispatchError }) => {
          if (status.isInBlock) {
            callback && callback();
          }
          // status would still be set, but in the case of error we can shortcut
          // to just check it (so an error would indicate InBlock or Finalized)
          if (dispatchError) {
            if (dispatchError.isModule) {
              // for module errors, we have the section indexed, lookup
              const decoded = this.api.registry.findMetaError(
                dispatchError.asModule
              );
              const { docs, name, section } = decoded;

              console.log(`${section}.${name}: ${docs.join(" ")}`);
            } else {
              // Other, CannotLookup, BadOrigin, no extra info
              console.log(dispatchError.toString());
            }
          }
        }
      );
  };

  setIdentityPromise = async (essentialInfo: any, additionalInfo: any) => {
    return this.api.tx.identity.setIdentity({
      ...essentialInfo,
      additional: formatAdditionalInfo(additionalInfo),
    });
  };

  batchCalls = async (
    calls: any,
    sender: string,
    injector: any,
    callback?: any
  ) => {
    await this.api.tx.utility
      .batchAll(calls)
      .signAndSend(sender, { signer: injector.signer }, (status) => {
        if (status.isInBlock) {
          callback && callback();
        }
      });
  };

  removeProxies = async () => {
    return this.api.tx.proxy.removeProxies;
  };

  getRemoveProxyPromise = async (proxy: string) => {
    return this.api.tx.proxy.removeProxy(proxy, "any", 0);
  };

  signAndSendRemoveProxies = async (
    sender: string,
    injector: any,
    proxy: string
  ) => {
    await this.api.tx.proxy
      .removeProxy(proxy, "any", 0)
      .signAndSend(sender, { signer: injector.signer });
  };

  setIdentity = async (essentialInfo: any, additionalInfo: any) => {
    return this.api.tx.identity.setIdentity({
      ...essentialInfo,
      additional: [[{ Raw: JSON.stringify(additionalInfo) }]],
    });
  };

  getAnnouncePromise = async (real: string, call_hash: H256) => {
    return this.api.tx.proxy.announce(real, call_hash);
  };

  getNotePreimagePromise = async (bytes: Bytes) => {
    return this.api.tx.preimage.notePreimage(bytes);
  };

  signAndSendUnnotePreimage = async (
    sender: string,
    injector: any,
    hash: H256
  ) => {
    await this.api.tx.preimage
      .unnotePreimage(hash)
      .signAndSend(sender, { signer: injector.signer });
  };

  getPreimageStatus = async (hash: H256) => {
    await this.api.query.preimage.statusFor(hash);
  };

  getPreimageData = async (hash: H256) => {
    await this.api.query.preimage.preimageFor(hash);
  };
}

export { APIService };
