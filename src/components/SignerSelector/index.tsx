import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { toShortAddress } from "../../utils/helpers";
import { IAccount, IAccounts } from "../../utils/types";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Identicon from "@polkadot/react-identicon";
import { styled } from "@mui/material/styles";

export const Wrapper = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  marginLeft: 20,
}));
export const Name = styled("div")(() => ({
  fontWeight: 700,
}));
export const Address = styled("div")(() => ({
  fontSize: 14,
}));

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

  const size = 24;
  // theme (optional), depicts the type of icon, one of
  // 'polkadot', 'substrate' (default), 'beachball' or 'jdenticon'
  const theme = "polkadot";

  return (
    <>
      <Button variant="contained" onClick={handleClick}>
        {typeof signer === "string" && signer ? (
          <Identicon value={signer} size={size} theme={theme} />
        ) : (
          <AccountBalanceWalletIcon />
        )}
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
              <Identicon value={account.address} size={size} theme={theme} />
              <Wrapper>
                <Name>{account.meta.name}</Name>{" "}
                <Address>{toShortAddress(account.address, 10)}</Address>
              </Wrapper>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
