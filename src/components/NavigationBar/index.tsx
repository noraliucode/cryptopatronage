import styled from "@emotion/styled";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { NetworkSelector } from "../NetworkSelector";
import { SignerSelector } from "../SignerSelector";

const Root = styled("div")(() => ({
  width: 600,
  height: 50,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
}));

export const NavigationBar = () => {
  const {
    accounts,
    setSigner,
    signer,
    setNetwork,
    network,
  }: IWeb3ConnectedContextState = useWeb3ConnectedContext();

  console.log("accounts", accounts);

  return (
    <Root>
      <NetworkSelector setNetwork={setNetwork} network={network} />
      <SignerSelector
        signer={signer}
        setSigner={setSigner}
        accounts={accounts}
      />
    </Root>
  );
};
