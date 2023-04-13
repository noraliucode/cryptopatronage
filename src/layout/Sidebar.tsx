import * as React from "react";
import { styled, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NavigationBar } from "../components/NavigationBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { SIDE_BAR, SOCIAL_ITEMS } from "../utils/constants";
import { Link as StyledLink } from "../components/Link";
import { useSubscribedCreators } from "../hooks/useSubscribedCreators";
import { useWeb3ConnectedContext } from "../context/Web3ConnectedContext";
import { IWeb3ConnectedContextState } from "../utils/types";
import { Title, Text } from "../components/Tabs";

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

const Link = styled("a")(() => ({
  textDecoration: "none",
}));

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  const { signer, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();

  const { committedCreators, uncommittedCreators, getSubscribedCreators } =
    useSubscribedCreators(signer?.address, network);

  console.log("committedCreators", committedCreators);
  console.log("uncommittedCreators", uncommittedCreators);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <NavigationBar
        isSidebarOpen={open}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
      />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {SIDE_BAR.map((item, index) => {
            const Icon = item.icon;

            return (
              <StyledLink to={item.link}>
                <ListItem
                  key={item.label}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Icon />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </StyledLink>
            );
          })}
        </List>
        <Divider />
        <Title>
          <Text>My Subscribtion</Text>
        </Title>
        <List>
          {committedCreators &&
            committedCreators.map((item, index) => {
              // const Icon = item.icon;

              return (
                <StyledLink to={`/creators/${item.creator}`}>
                  <ListItem
                    key={item.creator}
                    disablePadding
                    sx={{ display: "block" }}
                  >
                    <ListItemButton
                      selected={selectedIndex === index}
                      onClick={(event) => handleListItemClick(event, index)}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {/* <Icon /> */}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.creator}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                </StyledLink>
              );
            })}
        </List>
        <Divider />
        <List>
          {SOCIAL_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                target="_blank"
                rel="noreferrer"
                href={item.href}
                key={item.href}
              >
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Icon />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            );
          })}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
