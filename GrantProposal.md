# CryptoPatronage

- **Team Name:** CryptoPatronage Development Team (CPDT)
- **Payment Address:** 0x981540f1eDD3A41A232fe3E4B436e7b01e76156f (Ethereum ERC20 address)
- **[Level]:** 2

### Overview

#### Why CryptoPatronage Payment System

In early 2022, we started an experiment that would turn into the Shokunin Network, with a core premise that resource distribution in the Kusama Network ecosystem was too centralized and bottlenecked on majority agreement.

#### What is CryptoPatronage Payment System

CryptoPatronage is a platform that helps creators build a membership program by offering their followers exclusive content and a closer connection with their community.

### Project Details

#### For Patrons
Publicly show your support and commitment to your chosen creators.
Have confidence that your support will go directly to a creator with no middleman, and that you will spend no more than you have committed.
Become known to those you support - and potentially be rewarded for it.
We do not yet provide a service to support with cash or credit/debit, so if that is what the creators you support want or need, we are likely not the right solution for them, or you!

#### For Creators
There are many options in the cryptocurrency ecosystem to monetize your work and make an income regardless of where you are and what you do - CryptoPatronage simply tries to provide a more human and considerate approach, based on the needs of real creators, instead of assuming all of your work can be tokenized as an NFT.

CryptoPatronage is similar to token streaming protocols that already exist, but with permissionless discovery that allows potential supporters to discover your profile and support you on-platform, alongside ways to link directly to your profile from off-platform, similarly to our non-blockchain-based equivalents.

By default, we take no platform fees, and you only pay blockchain transaction fees when pulling your earnings from supporters - which, on the networks we operate on, are negligible, even for creators not based in affluent locales.

If you want to have an experience similar to traditional crowdfunding websites, we (will soon) provide automatic payment execution as an always-optional, fee-added service, at a rate that outcompetes all comparable non-blockchain-based equivalents.

Page 1: creators page
<img width="1149" alt="image" src="https://github.com/noraliucode/cryptopatronage/assets/12429503/189e52d0-067a-4cd5-affe-b7dc1c863b28">

Page 2: manage page
<img width="1068" alt="image" src="https://github.com/noraliucode/cryptopatronage/assets/12429503/9b9b4a94-756d-457d-adda-8487e96af076">

Page 3: create creator wizard
<img width="1069" alt="image" src="https://github.com/noraliucode/cryptopatronage/assets/12429503/78056551-6e08-46e2-8e90-b4a4e6515cde">

Page 4: creator page
<img width="1067" alt="image" src="https://github.com/noraliucode/cryptopatronage/assets/12429503/2a9eb25d-b4d2-46b5-ac22-5d653c9cc97c">


### Key Features

#### Supporter
- Subscribe a creator
- Unsubscribe a creator
- Browse committed subscribed creators list
- Browse uncommitted subscribed creators list
- Withdraw(unnote preimages)
- Browse creators page

#### Creator
- Add rate
- Pull payment (committed, normal)
- Pull all payment (committed, normal)
- Pull payment (uncommitted, normal)
- Pull all payment (uncommitted, normal)
- Pull payment(delay)
- Pull all payment(delay)
- Browse committed subscribed supporter list
- Browse uncommitted subscribed supporter list
- Register to payment system
- Add image url

#### Admin
- Transfer payment(normal)
- Transfer all payment(normal)
- Transfer payment(delay)
- Transfer all payment(delay)
 
### Infrastructure

#### why we use pure proxy:
<img width="821" alt="image" src="https://github.com/noraliucode/cryptopatronage/assets/12429503/800e1d78-ee6a-4d60-98c2-8c2f1b21abf2">
<br/>A creator utilizes a Pure Proxy, a keyless and non-deterministic account set up by a Supporter. This proxy acts as an intermediary for operations, enhancing security by preventing the direct access to supporter's account. The decentralized nature of this proxy, which operates without central ownership or a private key, serves to protect the identity and credentials of the original account holder in blockchain interactions.


#### high-level dApp architecture diagram: 
<img width="827" alt="image" src="https://github.com/noraliucode/cryptopatronage/assets/12429503/0a2be45d-8b4d-417c-ab12-8e87b8604228">
<br/>The dApp has a front-end built using HTML, CSS, and JavaScript, served to users via a browser. The backend runs on Node.js and is deployed using Vercel, which also manages scheduled tasks through cron jobs. The system interfaces with a database for data storage and employs the Polkadot.js library to interact with the Polkadot blockchain network via JSON-RPC calls. This setup enables blockchain-related functionalities for users accessing the platform.


### Ecosystem Fit

CryptoPatronage carves a niche in the blockchain space, focusing on a direct, bankless membership model for content creators within the Polkadot network. This precise approach is ideal for creators seeking immediate support from their community, ensuring transparency and lower fees than traditional support systems. It resonates with users in crypto-friendly regions or communities, bypassing the need for traditional banking. Although there is some functional overlap with Subsocial within the Polkadot ecosystem, which includes a similar feature, CryptoPatronage distinguishes itself from other tools in it's vertical by catering to users who either prefer or require operating without a bank account.

## Team :busts_in_silhouette:

### Team members

We will pleased to offer github accounts, LinkedIn and any other information in private.

All team members can contact privately for any specific information.

- Jam: team leader, consultant
- Nora Liu: Fullstack development
  - responsible for the development of the dApp.

### Team's Experience

- Jam:
  - ex-member of Kusama and Polkadot councils (from chain genesis to ~2021), ~9 years experience in blockchain technical support, consulting, and app prototyping.

- Nora Liu:
  - Frontend development with 7 years working experience.

### Contact

- **Contact Name:** Nora Liu
- **Contact Email:** noraliu.web3@gmail.com
- **Website:** [Will provide later]

### Legal Structure

We will be pleased to offer specific information in private.

### Team Code Repos

- https://github.com/noraliucode/cryptopatronage
- https://github.com/noraliucode/patronage-api
- https://github.com/noraliucode/cron

### Team LinkedIn Profiles

We will provide in private through Google Form.

## Development Roadmap :nut_and_bolt:

### Overview

- **Total Estimated Duration:** 12 weeks
- **Full-time equivalent (FTE):** 2
- **Total Costs:**  20,000 USD

### Milestone 1 — Payment System & Subscription / Pull Payment Refactor & Creator Page Improvement

* **Estimated Duration:** 6 weeks
- **FTE:**  2
- **Costs:**  10,000 USD

| Number | Deliverable | Specification |
| ------------- | ------------- | ------------- |
| 0a. | License | The project will be released under the Apache 2.0 License, ensuring open-source usage and contributions. |
| 0b. | Documentation | Comprehensive documentation will be provided, including setup guides, feature overviews and examples of usage. |
| 0c. | Testing Guide | A detailed testing guide will be created, outlining steps for automated and manual testing, including test cases, and expected results |
| 1. | Payment System | An automated system is set up to disburse payments to creators who have enrolled in a payment system, utilizing cron jobs to schedule and execute the distribution. |
| 2. | Subscription / Pull Payment Refactor | Refinement of the existing subscription system to support pull payments, allowing creators to set up and manage recurring revenue streams. |
| 3. | Creator Page Improvement | Enhancements to the creator page UI/UX, including customizable profiles, improved content display, and encrypted/decrypted content list |
| 4. | Beta Testing | A structured beta testing phase involving real users to gather feedback, identify bugs, and ensure stability and usability of the platform. |


### Milestone 2 — Delay Payment(Announced calls) & Database Security Improvement & UI Upgrade

* **Estimated Duration:** 6 weeks
- **FTE:**  2
- **Costs:**  10,000 USD

| Number | Deliverable | Specification |
| ------------- | ------------- | ------------- |
| 0a. | License | Apache 2.0 |
| 0b. | Documentation | The project will provide comprehensive documentation covering usage guidelines, with a focus on ease of understanding to facilitate adoption by new users. |
| 0c. | Testing Guide | A detailed testing guide will be created, outlining steps for automated and manual testing, including test cases, and expected results |
| 1. | Delay Payment(Announced calls) | Implement a feature to ensure that transactions are not triggered immediately, with security measures in place to guarantee that the transactions are executed only at the specified time. |
| 2. | Database Security Improvement | Enhance the existing database architecture with encryption at rest and in transit, role-based access control, and continuous monitoring for any potential security breaches. |
| 3. | UI Upgrade | Redesign the user interface to improve user experience with modern design principles, ensuring the UI is responsive and accessible across various devices and platforms. |
| 4. | Beta Testing | Conduct a beta testing phase with a selected user group to collect feedback on the usability and functionality of the system, and to identify and rectify any issues before the general release. |


## Development Status

https://patronage.shokunin.network/

The cryptoPatronage dApp is live currently on the above link. 

## Future Plans

- As the payment system released, the project would equipped the ability to sustain itself financially.
- And then, we are going to support cross-chain cooperation with other project and potentially introduce paymaster for web2 users to be able to pay by credit card. 
- After that, We will launch our own Polkadot para-chain tokens and the creators and supporters will receive tokens by completing registering and subscribing.

## FAQ

> Why not use Patreon?

Our application emphasizes the unique demand for cryptopatronage in serving real-world communities. We are driven by a genuine desire to support our peers who lack access to traditional banking facilities, enabling them to monetize their online presence. Utilizing Polkadot technology was the most accessible solution, extending beyond the Polkadot community itself. Our platform caters to individuals for whom Patreon is not an option. Additionally, we offer a highly competitive fee structure compared to existing services.

> How is user data stored?

User data is maintained in two distinct ways depending on the creator's preference. Those who operate on-chain have their identity information secured within the blockchain. Meanwhile, creators preferring an off-chain, more traditional web experience initially have their details housed in a centralized database. Nonetheless, they retain the option to transition their data to the blockchain as they grow more accustomed to the web3 environment.
