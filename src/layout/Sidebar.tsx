import * as React from "react";
import { styled, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { NavigationBar } from "../components/NavigationBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SidebarList from "./SidebarList";
import { SwipeableDrawer } from "@mui/material";
import Logo from "../components/Logo";

export const drawerWidth = 240;

const openedMixin = (theme: Theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DesktopOnly = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

type IState = {
  open: boolean;
  tabletMobileOpen: boolean;
};

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<IState>({
    open: false,
    tabletMobileOpen: false,
  });

  const { open, tabletMobileOpen } = state;

  const toggleDrawer = () => {
    setState((prev) => ({
      ...prev,
      open: !open,
    }));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <NavigationBar />
      <DesktopOnly>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            {open && <Logo />}
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <SidebarList open={open} toggleDrawer={toggleDrawer} />
        </Drawer>
      </DesktopOnly>
      <SwipeableDrawer
        anchor={"left"}
        open={tabletMobileOpen}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
      >
        <SidebarList open={open} toggleDrawer={toggleDrawer} />
      </SwipeableDrawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
