import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { NetworkSelector } from "../NetworkSelector";
import { SignerSelector } from "../SignerSelector";
import { AppBar, Divider, Toolbar, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const Wrapper = styled("div")(() => ({
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
}));
const Logo = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
}));
const TextWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    display: "none",
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
    <AppBar position="static" color="secondary" enableColorOnDark>
      <Toolbar>
        <Wrapper>
          <Logo>
            <img alt="question" src="/assets/icons/logo.png" className="logo" />
            <TextWrapper>
              <Typography variant="h6" sx={{ my: 2 }}>
                CryptoPatronage
              </Typography>
            </TextWrapper>
          </Logo>
          <div>
            <NetworkSelector setNetwork={setNetwork} network={network} />
            <SignerSelector
              signer={signer}
              setSigner={setSigner}
              accounts={accounts}
            />
          </div>
        </Wrapper>
      </Toolbar>
    </AppBar>
  );
};
