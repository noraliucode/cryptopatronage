import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { toShortAddress } from "../../utils/helpers";
import { IAccount, IAccounts } from "../../utils/types";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Identicon from "@polkadot/react-identicon";
import { styled } from "@mui/material/styles";
import { Keyring } from "@polkadot/keyring";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export const Wrapper = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  marginLeft: 15,
  textAlign: "left",
}));
export const Name = styled("div")(
  ({ lineHeight = 18 }: { lineHeight?: number }) => ({
    fontWeight: 700,
    fontSize: 14,
    lineHeight: `${lineHeight}px`,
  })
);
export const Address = styled("div")(
  ({ lineHeight = 18 }: { lineHeight?: number }) => ({
    fontSize: 14,
    lineHeight: `${lineHeight}px`,
  })
);

type IState = {
  open: boolean;
  anchorEl: any;
};

type IProps = {
  setSigner: (_: IAccount) => void;
  signer: IAccount | null;
  accounts: IAccounts;
};

export const SignerSelector = ({ setSigner, signer, accounts }: IProps) => {
  const [state, setState] = useState<IState>({
    open: false,
    anchorEl: null,
  });

  const { open, anchorEl } = state;

  const handleClose = (account: IAccount) => {
    if (typeof account.address === "string") {
      setSigner(account);
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

  const renderAddress = (address: string, number?: number) => {
    const keyring = new Keyring();
    const encodedAddress = keyring.encodeAddress(address, 2);
    return toShortAddress(encodedAddress, number);
  };

  return (
    <>
      <Button variant="contained" onClick={handleClick}>
        {typeof signer?.address === "string" && signer ? (
          <Identicon value={signer.address} size={size} theme={theme} />
        ) : (
          <AccountBalanceWalletIcon />
        )}
        &nbsp;
        {typeof signer?.address === "string" && signer ? (
          <>
            <Wrapper>
              <Name lineHeight={14}>{signer.meta.name}</Name>{" "}
              <Address lineHeight={14}>{renderAddress(signer.address)}</Address>
            </Wrapper>
            <PlayArrowIcon
              className="selector-image"
              sx={{ fontSize: 14, marginLeft: "20px" }}
            />
          </>
        ) : (
          "Connect"
        )}
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
              onClick={() => handleClose(account)}
            >
              <Identicon value={account.address} size={size} theme={theme} />
              <Wrapper>
                <Name>{account.meta.name}</Name>{" "}
                <Address>{renderAddress(account.address, 10)}</Address>
              </Wrapper>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
