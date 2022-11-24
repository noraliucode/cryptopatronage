import { Dialog, DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

type IProps = {
  open: boolean;
  onClose: () => void;
};

export const Modal = (props: IProps) => {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Please select signer</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
};
