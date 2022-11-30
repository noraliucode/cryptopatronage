import { styled } from "@mui/material/styles";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { NetworkSelector } from "../NetworkSelector";
import { SignerSelector } from "../SignerSelector";

const Root = styled("div")(({ theme }) => ({
  width: 600,
  height: 50,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  [theme.breakpoints.down("md")]: {
    width: "90%",
  },
}));

export const NavigationBar = () => {
  const {
    accounts,
    setSigner,
    signer,
    setNetwork,
    network,
  }: IWeb3ConnectedContextState = useWeb3ConnectedContext();

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
