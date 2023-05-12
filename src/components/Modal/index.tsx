import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  styled,
} from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

const ContentWrapper = styled("div")(() => ({
  lineHeight: 1.5,
}));

type IProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  content?: string;
  action?: () => void;
};

export const Modal = (props: IProps) => {
  const {
    onClose,
    open,
    title = "Please select signer",
    content,
    action,
  } = props;

  const handleClose = () => {
    onClose();
  };

  const onActionClick = () => {
    action && action();
    handleClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      {content && (
        <>
          <Divider />
          <DialogContent>
            <ContentWrapper>{content}</ContentWrapper>
          </DialogContent>
        </>
      )}
      <DialogActions>
        <Button onClick={onActionClick} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
