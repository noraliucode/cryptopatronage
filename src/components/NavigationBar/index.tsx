import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { NetworkSelector } from "../NetworkSelector";
import { SignerSelector } from "../SignerSelector";
import { AppBar, Divider, Toolbar, Typography } from "@mui/material";

export const NavigationBar = () => {
  const {
    accounts,
    setSigner,
    signer,
    setNetwork,
    network,
  }: IWeb3ConnectedContextState = useWeb3ConnectedContext();

  return (
    <AppBar color="secondary" enableColorOnDark>
      <Toolbar>
        <Typography variant="h6" sx={{ my: 2 }}>
          {"Cryptopatronage".toUpperCase()}
        </Typography>
        <Divider />
        <NetworkSelector setNetwork={setNetwork} network={network} />
        <SignerSelector
          signer={signer}
          setSigner={setSigner}
          accounts={accounts}
        />
      </Toolbar>
    </AppBar>
  );
};
