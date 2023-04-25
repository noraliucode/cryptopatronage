import { Divider, styled } from "@mui/material";
import React from "react";
import { SOCIAL_ITEMS } from "../utils/constants";
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
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  const isShowSubscribedCreators =
    open && (committedCreators.length > 0 || uncommittedCreators.length > 0);

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

  return (
    <div>
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
      {open && committedCreators && (
        <List>
          {committedCreators.map((item, index) => {
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
                    sx={listItemButtonStyle}
                  >
                    <ListItemIcon sx={listItemIconStyle}>
                      {/* <Icon /> */}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.display || stringShorten(item.creator, 5)}
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
    </div>
  );
};

export default SidebarList;
