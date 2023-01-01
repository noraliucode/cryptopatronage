import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { NetworkSelector } from "../NetworkSelector";
import { SignerSelector } from "../SignerSelector";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Text } from "../Tabs";
import { useState } from "react";
import { Drawer } from "../Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { MENU } from "../../utils/constants";
import { Link as StyledLink } from "../Link";

export const Wrapper = styled("div")(() => ({
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
}));
const Logo = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
}));
const DesktopContentWarpper = styled("div")(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));
const MobileContentWarpper = styled("div")(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("sm")]: {
    display: "flex",
  },
}));
const ButtonsWarpper = styled("div")(() => ({
  display: "flex",
}));
const MenuWarpper = styled("div")(() => ({
  alignItems: "center",
  marginLeft: "10px",
  display: "flex",
}));

type IState = {
  open: boolean;
};

export const NavigationBar = () => {
  const {
    accounts,
    setSigner,
    signer,
    setNetwork,
    network,
  }: IWeb3ConnectedContextState = useWeb3ConnectedContext();

  const [state, setState] = useState<IState>({
    open: false,
  });

  const { open } = state;

  const toggleDrawer = (event?: any) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState((prev) => ({
      ...prev,
      open: !open,
    }));
  };

  return (
    <AppBar position="static" color="secondary" enableColorOnDark>
      <MobileContentWarpper>
        <Drawer open={open} toggleDrawer={toggleDrawer} />
      </MobileContentWarpper>
      <Toolbar>
        <Wrapper>
          <StyledLink to={"/"}>
            <Logo>
              <img
                alt="question"
                src="/assets/icons/logo.png"
                className="logo"
              />
              <DesktopContentWarpper>
                <Text>
                  <Typography variant="h6" sx={{ my: 2 }}>
                    CryptoPatronage
                  </Typography>
                </Text>
              </DesktopContentWarpper>
            </Logo>
          </StyledLink>

          <ButtonsWarpper>
            <DesktopContentWarpper>
              {MENU.map((item) => {
                return (
                  <Button>
                    <StyledLink to={item.link}>
                      <Text> {item.label}</Text>
                    </StyledLink>
                  </Button>
                );
              })}
            </DesktopContentWarpper>
            <NetworkSelector setNetwork={setNetwork} network={network} />
            <SignerSelector
              signer={signer}
              setSigner={setSigner}
              accounts={accounts}
            />
            <MobileContentWarpper>
              <MenuWarpper>
                <MenuIcon onClick={toggleDrawer} />
              </MenuWarpper>
            </MobileContentWarpper>
          </ButtonsWarpper>
        </Wrapper>
      </Toolbar>
    </AppBar>
  );
};
