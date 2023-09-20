import {
  Collapse,
  Divider,
  styled,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import React from "react";
import { MENU, SOCIAL_ITEMS, lngs } from "../utils/constants";
import { stringShorten } from "@polkadot/util";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import { SIDE_BAR } from "../utils/constants";
import { Link as StyledLink } from "../components/Link";
import { useTranslation } from "react-i18next";
import { useSubscribedCreators } from "../hooks/useSubscribedCreators";
import { useWeb3ConnectedContext } from "../context/Web3ConnectedContext";
import { IWeb3ConnectedContextState } from "../utils/types";
import { MobileContentWarpper } from "../components/NavigationBar";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { usePureProxy } from "../hooks/usePureProxy";

const Link = styled("a")(() => ({
  textDecoration: "none",
}));

const MarginLeftWrapper = styled("a")(() => ({
  marginLeft: 10,
}));

const SectionTitle = styled("div")(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: 14,
  margin: 14,
  textAlign: "left",
}));

type Props = {
  open: boolean;
  toggleDrawer: () => void;
};

const SidebarList = (props: Props) => {
  const { open, toggleDrawer } = props;
  const { t } = useTranslation();
  const { signer, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();
  const { committedCreators, uncommittedCreators } = useSubscribedCreators(
    signer?.address,
    network
  );
  const [state, setState] = React.useState({
    selectedIndex: 1,
    isLanguageOpen: false,
  });
  const { selectedIndex, isLanguageOpen } = state;
  const { i18n } = useTranslation();
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setState((prev) => ({
      ...prev,
      selectedIndex: index,
    }));
  };

  const isShowSubscribedCreators =
    open && (committedCreators?.length > 0 || uncommittedCreators?.length > 0);

  const listItemButtonStyle = {
    minHeight: 48,
    justifyContent: open ? "initial" : "center",
    px: 2.5,
  };

  const listItemIconStyle = {
    minWidth: 0,
    mr: open ? 3 : "auto",
    justifyContent: "center",
  };

  const handleLanguageClick = () => {
    setState((prev) => ({
      ...prev,
      isLanguageOpen: !isLanguageOpen,
    }));
  };

  return (
    <div>
      <List>
        {SIDE_BAR.map((item, index) => {
          const Icon = item.icon;

          return (
            <StyledLink key={`${item.label}_${index}`} to={item.link}>
              <ListItem
                key={item.label}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton sx={listItemButtonStyle}>
                  <ListItemIcon sx={listItemIconStyle}>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(`sidebar.${item.label}`)}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            </StyledLink>
          );
        })}
      </List>
      <Divider />
      {!open && (
        <List>
          <ListItemButton sx={listItemButtonStyle} onClick={toggleDrawer}>
            <ListItemIcon sx={listItemIconStyle}>
              <CardMembershipIcon />
            </ListItemIcon>
            <ListItemText
              primary={"My Subscribtion"}
              sx={{ opacity: open ? 1 : 0 }}
            />
          </ListItemButton>
        </List>
      )}
      {isShowSubscribedCreators && (
        <MarginLeftWrapper>
          <SectionTitle>My Subscribtion</SectionTitle>
        </MarginLeftWrapper>
      )}
      {open && committedCreators?.length > 0 && (
        <List>
          {committedCreators.map((item, index) => {
            return (
              <StyledLink
                key={`${item.creator}_${index}`}
                to={`/creators/${item.address}/?network=${network}`}
              >
                <ListItem key={item.creator} disablePadding>
                  <ListItemButton
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(event, index)}
                    sx={listItemButtonStyle}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={item.display}
                        src={
                          item.imgUrl
                            ? item.imgUrl
                            : "/assets/images/default.webp"
                        }
                      />
                    </ListItemAvatar>

                    <ListItemText
                      primary={item.display || stringShorten(item.address, 5)}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </StyledLink>
            );
          })}
        </List>
      )}
      {isShowSubscribedCreators && <Divider />}
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
                <ListItemButton sx={listItemButtonStyle}>
                  <ListItemIcon sx={listItemIconStyle}>
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
      <Divider />
      <MobileContentWarpper>
        <List>
          {MENU.map((item, index) => {
            const Icon = item.icon;

            return (
              <StyledLink key={`${item.label}_${index}`} to={item.link}>
                <ListItem
                  key={item.label}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    onClick={() => {
                      if (item.label === "Language") handleLanguageClick();
                    }}
                    sx={listItemButtonStyle}
                  >
                    <ListItemIcon sx={listItemIconStyle}>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(`sidebar.${item.label}`)}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                    {item.label === "Language" && (
                      <>{isLanguageOpen ? <ExpandLess /> : <ExpandMore />}</>
                    )}
                  </ListItemButton>
                  {item.label === "Language" && (
                    <Collapse in={isLanguageOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {Object.keys(lngs).map((lng) => (
                          <ListItemButton
                            key={`${lng}`}
                            sx={{ pl: 4 }}
                            onClick={() => {
                              i18n.changeLanguage(lng);
                            }}
                          >
                            <ListItemText primary={lngs[lng].nativeName} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </ListItem>
              </StyledLink>
            );
          })}
        </List>
      </MobileContentWarpper>
    </div>
  );
};

export default SidebarList;
