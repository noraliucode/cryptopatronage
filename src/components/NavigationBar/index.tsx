import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { NetworkSelector } from "../NetworkSelector";
import { SignerSelector } from "../SignerSelector";
import { AppBar, Toolbar, Button, Switch } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Text } from "../Manage";
import { useState } from "react";
import { Drawer } from "../Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { MENU } from "../../utils/constants";
import { Link as StyledLink } from "../Link";
import { useApi } from "../../hooks/useApi";
import { Modal } from "../Modal";
import LanguageSelector from "../LanguageSelector";
import { useTranslation } from "react-i18next";
import Logo from "../Logo";

export const Wrapper = styled("div")(() => ({
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
}));
export const DesktopContentWarpper = styled("div")(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));
export const MobileContentWarpper = styled("div")(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("md")]: {
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
const LogoWarpper = styled("div")(() => ({
  marginLeft: "45px",
}));

type IState = {
  open: boolean;
  isModalOpen: boolean;
};

export const NavigationBar = () => {
  const {
    accounts,
    setSigner,
    signer,
    setNetwork,
    network,
    // TODO: Move these to a global context later
    isShowSensitiveContent,
    setIsShowSensitiveContent,
  }: IWeb3ConnectedContextState = useWeb3ConnectedContext();

  const [state, setState] = useState<IState>({
    open: false,
    isModalOpen: false,
  });

  const { open, isModalOpen } = state;
  const { api } = useApi(network);
  const { t } = useTranslation();
  const theme = useTheme();

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

  const handleChange = () => {
    if (isShowSensitiveContent) {
      setIsShowSensitiveContent(false);
    } else {
      setState((prev) => ({
        ...prev,
        isModalOpen: true,
      }));
    }
  };

  return (
    <AppBar position="fixed" color="secondary" enableColorOnDark>
      <Modal
        title="Version Switch"
        content="Are you sure you want to switch to a version where the creator's image has been specifically labeled as sensitive content?"
        open={isModalOpen}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            isModalOpen: false,
          }))
        }
        action={() => setIsShowSensitiveContent(true)}
      />
      <MobileContentWarpper>
        <Drawer open={open} toggleDrawer={toggleDrawer} />
      </MobileContentWarpper>
      <Toolbar>
        <MobileContentWarpper>
          <MenuWarpper>
            <MenuIcon onClick={toggleDrawer} />
          </MenuWarpper>
        </MobileContentWarpper>
        <Wrapper>
          <LogoWarpper>
            <Logo />
          </LogoWarpper>
          <ButtonsWarpper>
            <DesktopContentWarpper>
              <StyledLink to={"/create"}>
                <Button color="primary" aria-label="Create" variant="contained">
                  <Text>{t("button.create")}</Text>
                </Button>
              </StyledLink>
              {MENU.map((item) => {
                const Icon = item.icon;
                if (item.label === "Language") {
                  return <LanguageSelector item={item} />;
                }
                return (
                  <StyledLink to={item.link}>
                    <Button color="primary" aria-label={item.label}>
                      <Icon htmlColor="white" titleAccess={item.label} />
                      {/* <Text>{item.label}</Text> */}
                    </Button>
                  </StyledLink>
                );
              })}
              <Switch
                checked={isShowSensitiveContent}
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            </DesktopContentWarpper>
            <NetworkSelector setNetwork={setNetwork} network={network} />
            <SignerSelector
              signer={signer}
              setSigner={setSigner}
              accounts={accounts}
              network={network}
              genesisHash={api?.genesisHash}
            />
          </ButtonsWarpper>
        </Wrapper>
      </Toolbar>
    </AppBar>
  );
};
