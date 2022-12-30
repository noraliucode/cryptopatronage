import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { MENU } from "../../utils/constants";
import { Link as StyledLink } from "../Link";

export const Drawer = ({
  open,
  toggleDrawer,
}: {
  open: boolean;
  toggleDrawer: () => void;
}) => {
  const list = () => (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {MENU.map((item, index) => {
          return (
            <StyledLink to={item.link}>
              <ListItem key={item.label} disablePadding>
                <ListItemButton>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            </StyledLink>
          );
        })}
      </List>
    </Box>
  );

  return (
    <div>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
      >
        {list()}
      </SwipeableDrawer>
    </div>
  );
};
