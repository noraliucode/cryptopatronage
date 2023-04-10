import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { NetworkSelector } from "../NetworkSelector";
import { SignerSelector } from "../SignerSelector";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Switch,
  IconButton,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import { Text } from "../Tabs";
import { useState } from "react";
import { Drawer } from "../Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { MENU } from "../../utils/constants";
import { Link as StyledLink } from "../Link";
import { useApi } from "../../hooks/useApi";
import { Modal } from "../Modal";
import LanguageSelector from "../LanguageSelector";
import { useTranslation } from "react-i18next";
import { drawerWidth } from "../../layout/Sidebar";

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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

type IState = {
  open: boolean;
  isModalOpen: boolean;
};

export const NavigationBar = ({
  isSidebarOpen,
  handleDrawerOpen,
  handleDrawerClose,
}: {
  isSidebarOpen: boolean;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
}) => {
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

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  return (
    <AppBar
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // TODO: fix type checking errors out "open" is not a prop of AppBar. Sample code see: https://mui.com/material-ui/react-drawer/
      open={isSidebarOpen}
      position="fixed"
      color="secondary"
      enableColorOnDark
    >
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
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(isSidebarOpen && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>

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
                  <Typography variant="h6">CryptoPatronage</Typography>
                </Text>
              </DesktopContentWarpper>
            </Logo>
          </StyledLink>

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
