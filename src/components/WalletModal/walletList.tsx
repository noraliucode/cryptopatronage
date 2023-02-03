import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { WALLETS } from "../../utils/constants";
import { IWallet } from "../../utils/types";
import { Text } from "../Tabs";
import { Divider, styled } from "@mui/material";

export const Name = styled("div")(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.text.primary,
  fontWeight: 700,
}));
export const Wrapper = styled("div")(() => ({
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  alignItems: "center",
}));

export const WalletList = () => {
  return (
    <List
      dense
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "rgba(0,0,0,0)",
      }}
    >
      {WALLETS.map((value: IWallet) => {
        return (
          <>
            <ListItem sx={{ width: "100%" }} key={value.name} disablePadding>
              <ListItemButton sx={{ height: 100 }}>
                <ListItemAvatar>
                  <Avatar alt={value.name} src={value.icon} />
                </ListItemAvatar>
                <Wrapper>
                  <div>
                    <Name>{value.name}</Name>
                    <Text>{`Connect extension`}</Text>
                  </div>
                  <ArrowForwardIosIcon sx={{ width: 14, height: 14 }} />
                </Wrapper>
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
          </>
        );
      })}
    </List>
  );
};
