import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { useAccounts } from "../../hooks/useAccounts";
import { toShortAddress } from "../../utils/helpers";

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
  selectedAddress: string;
};

type IAccount = {
  address: string;
  meta: IMeta;
};

type IMeta = {
  name: string;
};

export const AccountSelector = () => {
  const { accounts }: { accounts: any } = useAccounts();

  const [state, setState] = useState<IState>({
    open: false,
    anchorEl: null,
    selectedAddress: "",
  });

  const { open, anchorEl, selectedAddress } = state;

  const handleClose = (address: string) => {
    setState((prev) => ({
      ...prev,
      open: !prev.open,
      selectedAddress: address,
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
        {typeof selectedAddress === "string" && selectedAddress
          ? toShortAddress(selectedAddress)
          : "Select Signer"}
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
        {accounts.map((account: IAccount) => {
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
