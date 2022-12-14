import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { NETWORKS } from "../../utils/constants";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useApi } from "../../hooks/useApi";
import { INetwork } from "../../utils/types";

type IState = {
  open: boolean;
  anchorEl: any;
};

type IProps = {
  setNetwork: (_: string) => void;
  network: INetwork;
};

export const NetworkSelector = ({ setNetwork, network }: IProps) => {
  const [state, setState] = useState<IState>({
    open: false,
    anchorEl: null,
  });

  const { open, anchorEl } = state;
  useApi(network);

  const handleClose = (network: string) => {
    if (typeof network === "string") {
      setNetwork(network);
    }
    setState((prev) => ({
      ...prev,
      open: !prev.open,
    }));
  };
  const handleClick = (event: any) => {
    setState((prev) => ({
      ...prev,
      open: !prev.open,
      anchorEl: event.currentTarget,
    }));
  };

  return (
    <>
      <Button onClick={handleClick}>
        {typeof network === "string" && network ? network : "Select Network"}
        <PlayArrowIcon className="selector-image" />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {NETWORKS.map((network: string, index: number) => {
          return (
            <MenuItem
              key={`${network}_${index}`}
              onClick={() => handleClose(network)}
            >
              {network}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
