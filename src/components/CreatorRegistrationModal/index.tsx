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
          <Button
            variant="contained"
            color="primary"
            onClick={handleOnChainClick}
          >
            On-Chain
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOffChainClick}
          >
            Off-Chain
          </Button>
        </ContentWrapper>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
