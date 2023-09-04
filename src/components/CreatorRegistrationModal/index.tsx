import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  styled,
  DialogActions,
  Button,
} from "@mui/material";

const ContentWrapper = styled("div")(() => ({
  lineHeight: 1.5,
  width: 400,
}));

type IProps = {
  open: boolean;
  onClose: () => void;
  updateInfo: (_: boolean) => void;
};

export const CreatorRegistrationModal = (props: IProps) => {
  const { onClose, open, updateInfo } = props;

  const handleClose = () => {
    onClose();
  };

  const handleOnChainClick = () => {
    updateInfo(true);
  };

  const handleOffChainClick = () => {
    updateInfo(false);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Creator Registration</DialogTitle>
      <Divider />
      <DialogContent>
        <ContentWrapper>
          Choose your identity visibility. Each account can only choose one
          visibility setting Onchain:
          <br />
          <br />
          <strong>Onchain:</strong>
          <ul>
            <li>Requires a deposit to store identity information.</li>
            <li>Identity information is stored publicly and reliably.</li>
            <li>
              Data can be read from onchain and might be visible in other
              applications.
            </li>
          </ul>
          <strong>Offchain:</strong>
          <ul>
            <li>No deposit required to store identity information.</li>
            <li>Account creation is free.</li>
            <li>
              Identity information is only visible within this application.
            </li>
            <li>
              Transaction fees are only necessary to pull payment from
              supporters, except if using automated payments.
            </li>
          </ul>
        </ContentWrapper>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOnChainClick}
          fullWidth
        >
          On-Chain
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleOffChainClick}
          fullWidth
        >
          Off-Chain
        </Button>
      </DialogActions>
    </Dialog>
  );
};
