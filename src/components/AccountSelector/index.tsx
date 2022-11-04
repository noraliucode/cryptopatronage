import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { toShortAddress } from "../../utils/helpers";
import {
  IAccount,
  IWeb3ConnectedContextState,
  useWeb3ConnectedContext,
} from "../../context/Web3ConnectedContext";

const Root = styled("div")(() => ({
  width: 600,
  height: 50,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
}));

type IState = {
  open: boolean;
  anchorEl: any;
};

export const AccountSelector = () => {
  const { accounts, setSigner, signer }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();

  const [state, setState] = useState<IState>({
    open: false,
    anchorEl: null,
  });

  const { open, anchorEl } = state;

  const handleClose = (address: string) => {
    setSigner(address);
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
    <Root>
      <Button variant="contained" onClick={handleClick}>
        {signer ? toShortAddress(signer) : "Select Signer"}
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
        {accounts?.map((account: IAccount) => {
          return (
            <MenuItem onClick={() => handleClose(account.address)}>
              {account.meta.name} {toShortAddress(account.address)}
            </MenuItem>
          );
        })}
      </Menu>
    </Root>
  );
};
