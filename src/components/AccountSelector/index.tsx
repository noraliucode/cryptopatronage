import { useState } from "react";
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
};

type IAccount = {
  address: string;
};

export const AccountSelector = () => {
  const { accounts }: { accounts: any } = useAccounts();

  console.log("accounts", accounts);

  const [state, setState] = useState<IState>({
    open: false,
    anchorEl: null,
  });

  const { open, anchorEl } = state;

  const handleClose = () => {
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
      <Button
        variant="contained"
        // id="basic-button"
        // aria-controls={open ? "basic-menu" : undefined}
        // aria-haspopup="true"
        // aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Select Signer
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
            <MenuItem onClick={handleClose}>
              {toShortAddress(account.address)}
            </MenuItem>
          );
        })}
      </Menu>
    </Root>
  );
};
