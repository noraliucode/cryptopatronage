import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { NETWORKS } from "../../utils/constants";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useApi } from "../../hooks/useApi";
import { INetwork } from "../../utils/types";
import { DesktopContentWarpper } from "../NavigationBar";
import { styled } from "@mui/material/styles";

const Wrapper = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
}));

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

  // TODO: refactor network object selecting
  const selectedNework = NETWORKS.find((x) => x.network === network);

  return (
    <>
      <Button
        sx={{ background: "rgba(41,35,107,0.5)", margin: "0 10px" }}
        onClick={handleClick}
        variant="contained"
      >
        {typeof network === "string" && network ? (
          <Wrapper>
            <img
              className="network-icon"
              alt="icon"
              src={selectedNework?.icon}
            />
            <DesktopContentWarpper>{network}</DesktopContentWarpper>
          </Wrapper>
        ) : (
          "Select Network"
        )}
        <PlayArrowIcon className="selector-image" sx={{ fontSize: 14 }} />
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
        {NETWORKS.map((network: any, index: number) => {
          return (
            <MenuItem
              key={`${network}_${index}`}
              onClick={() => handleClose(network.network)}
            >
              <img className="network-icon" alt="icon" src={network.icon} />
              {network.network}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
