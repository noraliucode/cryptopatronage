import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { toShortAddress } from "../../utils/helpers";
import { IAccount, IAccounts } from "../../utils/types";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

type IState = {
  open: boolean;
  anchorEl: any;
};

type IProps = {
  setSigner: (_: string) => void;
  signer: string;
  accounts: IAccounts;
};

export const SignerSelector = ({ setSigner, signer, accounts }: IProps) => {
  const [state, setState] = useState<IState>({
    open: false,
    anchorEl: null,
  });

  const { open, anchorEl } = state;

  const handleClose = (address: string) => {
    if (typeof address === "string") {
      setSigner(address);
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
      <Button variant="contained" onClick={handleClick}>
        <AccountBalanceWalletIcon />
        &nbsp;
        {typeof signer === "string" && signer
          ? toShortAddress(signer)
          : "Connect"}
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
        {accounts?.map((account: IAccount, index: number) => {
          return (
            <MenuItem
              key={`${account.address}_${index}`}
              onClick={() => handleClose(account.address)}
            >
              {account.meta.name} {toShortAddress(account.address)}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
