import { Dialog, DialogContent, DialogTitle, styled } from "@mui/material";
import { Text } from "../Tabs";
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
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        <Title>Connect</Title>
        <Text>Select wallet to connect to CryptoPatronage</Text>
      </DialogTitle>

      <DialogContent sx={{ padding: 0 }}>
        <WalletList />
      </DialogContent>
    </Dialog>
  );
};
