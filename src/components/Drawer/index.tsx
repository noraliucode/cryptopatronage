import * as React from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import SidebarList from "../../layout/SidebarList";

export const Drawer = ({
  open,
  toggleDrawer,
}: {
  open: boolean;
  toggleDrawer: () => void;
}) => {
  return (
    <div>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
      >
        <SidebarList open={open} toggleDrawer={toggleDrawer} />
      </SwipeableDrawer>
    </div>
  );
};
