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
import config from "../../utils/ss58-registry.json";
import { Hash } from "@polkadot/types/interfaces/runtime/types";
import { WalletModal } from "../WalletModal";
import { APP_SESSION } from "../../utils/constants";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

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
  walletModalOpen: boolean;
};

type IProps = {
  setSigner: (_: InjectedAccountWithMeta) => void;
  signer: InjectedAccountWithMeta | null;
  accounts: IAccounts;
  network: string;
  genesisHash?: Hash | undefined;
};

export const SignerSelector = ({
  setSigner,
  signer,
  accounts,
  network,
  genesisHash,
}: IProps) => {
  const [state, setState] = useState<IState>({
    open: false,
    anchorEl: null,
    walletModalOpen: false,
  });

  const { open, anchorEl, walletModalOpen } = state;

  const handleClose = (account: InjectedAccountWithMeta) => {
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
  const toogleModal = () => {
    setState((prev) => ({
      ...prev,
      walletModalOpen: !walletModalOpen,
    }));
  };

  const size = 24;
  // theme (optional), depicts the type of icon, one of
  // 'polkadot', 'substrate' (default), 'beachball' or 'jdenticon'
  const theme = "polkadot";

  const renderAddress = (address: string, number?: number) => {
    const keyring = new Keyring();
    const registry = config.registry.find(
      (x) => x.network.toLowerCase() === network.toLowerCase()
    );
    const encodedAddress = keyring.encodeAddress(address, registry?.prefix);
    return toShortAddress(encodedAddress, number);
  };

  const renderWalletModal = () => {
    return (
      <>
        <WalletModal open={walletModalOpen} onClose={toogleModal} />
        <Button variant="contained" onClick={toogleModal}>
          <AccountBalanceWalletIcon />
          &nbsp;Connect
        </Button>
      </>
    );
  };

  const renderWallet = () => {
    if (!signer) return;
    return (
      <>
        <Button variant="contained" onClick={handleClick}>
          <Identicon value={signer.address} size={size} theme={theme} />
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
          {accounts?.map((account: InjectedAccountWithMeta, index: number) => {
            if (
              account.meta.genesisHash === genesisHash?.toHex() ||
              !account.meta.genesisHash
            ) {
              return (
                <MenuItem
                  key={`${account.address}_${index}`}
                  onClick={() => handleClose(account)}
                >
                  <Identicon
                    value={account.address}
                    size={size}
                    theme={theme}
                  />
                  <Wrapper>
                    <Name>{account.meta.name}</Name>{" "}
                    <Address>{renderAddress(account.address, 10)}</Address>
                  </Wrapper>
                </MenuItem>
              );
            }
          })}
        </Menu>
      </>
    );
  };

  return (
    <>
      {accounts && accounts.length > 0 ? renderWallet() : renderWalletModal()}
    </>
  );
};
