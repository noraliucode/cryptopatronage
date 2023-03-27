# Cryptopatronage
<img width="800" alt="image" src="https://user-images.githubusercontent.com/12429503/227880495-82acd8b7-f4bb-4b10-b460-2c1cf3240f14.png">


## About Project
CryptoPatronage is a platform that helps creators build a membership program by offering their followers exclusive content and a closer connection with their community.

## How to Run
```console
foo@bar:~$ cd ./<cryptopatronage>
foo@bar:cryptopatronage$ yarn 
foo@bar:cryptopatronage$ yarn start
```
## System Diagram
The fundamental illustration of how the creator-supporter mechanism operates through a pure proxy.

<img width="873" alt="image" src="https://user-images.githubusercontent.com/12429503/221556984-29f8f4b2-a1a0-4c7e-94ee-2373659e8598.png">



## Technological Overview
### @polkadot/api
```
// Import
const { ApiPromise, WsProvider } = require('@polkadot/api');
...
```
In this project we use the [[ApiPromise]] interface version of the API.
```
apiService.ts
```
The apiService.ts is the service provides all of the functionality used to add, get proxies and other functions in this dapp, It contains the following methods that enable proxy related interaction:
* **getProxies**(address：string)
* **createAnonymousProxy**(sender: string, injector: InjectedExtension, delay: u32)
* **getBalance**(address: string)
* **getIdentity**(creator: string)
* **batchCalls**(calls: Vec<Call>)
* **removeProxies**()
### @polkadot/extension-dapp
The @polkadot/extension-dapp package includes a tool that can access and modify the window.injectedWeb3 object to obtain all the provider information that has been added to a webpage.

```javascript
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';

// returns an array of all the injected sources
// (this needs to be called first, before other requests)
const allInjected = await web3Enable('my cool dapp');

// returns an array of { address, meta: { name, source } }
// meta.source contains the name of the extension that provides this account
const allAccounts = await web3Accounts();

// the address we use to use for signing, as injected
const SENDER = '5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE';

// finds an injector for an address
const injector = await web3FromAddress(SENDER);
```
## Features
**Supporter**
* Subscribe a creator 
* Unsubscribe a creator 
* Browse committed subscribed creators list 
* Browse uncommitted subscribed creators list 
* Withdraw(unnote preimages)
* Browse creators page

**Creator**
* Add rate
* Pull payment (committed, normal)
* Pull all payment (committed, normal)
* Pull payment (uncommitted, normal)
* Pull all payment (uncommitted, normal)
* Pull payment(delay)
* Pull all payment(delay)
* Browse committed subscribed supporter list 
* Browse uncommitted subscribed supporter list 
* Register to payment system
* Add image url

**Admin**
* Transfer payment(normal)
* Transfer all payment(normal)
* Transfer payment(delay)
* Transfer all payment(delay)
