import { Dialog, DialogContent, DialogTitle, styled } from "@mui/material";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { APP_SESSION } from "../../utils/constants";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { Text } from "../Manage";
import { WalletList } from "./walletList";

export const Title = styled("div")(({ theme }) => ({
  fontSize: 24,
  color: theme.palette.text.primary,
  fontWeight: 700,
}));

type IProps = {
  open: boolean;
  onClose: () => void;
};

export const WalletModal = (props: IProps) => {
  const { setSelectedWallet }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  const handleClick = async (value: string) => {
    localStorage.setItem(
      APP_SESSION,
      JSON.stringify({
        accountIndex: 0,
        connected: value,
      })
    );

    setSelectedWallet(value);
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        <Title>Connect</Title>
        <Text>Select wallet to connect to CryptoPatronage</Text>
      </DialogTitle>

      <DialogContent sx={{ padding: 0 }}>
        <WalletList onClick={handleClick} />
      </DialogContent>
    </Dialog>
  );
};
