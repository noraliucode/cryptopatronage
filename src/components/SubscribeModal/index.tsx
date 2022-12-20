import {
  Checkbox,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  styled,
} from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { useState } from "react";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { getProxies } from "../../utils/apiCalls";
import { findPure } from "../../utils/helpers";
import { subscribe } from "../../utils/main";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { CheckWrapper, Text } from "../Tabs";

type IProps = {
  open: boolean;
  onClose: () => void;
  selectedCreator: string;
};

type IState = {
  isCommitted: boolean;
  isDelayed: boolean;
};

const HintText = styled("div")(() => ({
  color: "gray",
  fontSize: 11,
}));

export const SubscribeModal = (props: IProps) => {
  const { onClose, open, selectedCreator } = props;
  const [state, setState] = useState<IState>({
    isCommitted: true,
    isDelayed: false,
  });

  const { isCommitted, isDelayed } = state;

  const { signer, injector, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();

  const handleClose = () => {
    onClose();
  };

  const handleDelayedClick = () => {
    setState((prev) => ({
      ...prev,
      isDelayed: !prev.isDelayed,
    }));
  };

  const handleCommittedClick = () => {
    setState((prev) => ({
      ...prev,
      isCommitted: !prev.isCommitted,
    }));
  };

  const checkSigner = () => {
    if (!signer || !injector) {
      setState((prev) => ({
        ...prev,
        isModalOpen: true,
      }));
      return;
    }
  };

  const _subscribe = async () => {
    checkSigner();
    if (!injector) return;
    const setLoading = (value: boolean) => {
      setState((prev) => ({
        ...prev,
        isSubscribing: value,
      }));
    };

    const callback = async () => {
      // await getSubscribedCreators();
    };

    const supporterProxies: any = await getProxies(signer);
    const pure = findPure(supporterProxies, selectedCreator, signer);
    await subscribe(
      selectedCreator,
      signer,
      injector,
      isCommitted,
      network,
      callback,
      setLoading,
      pure,
      isDelayed
    );
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent dividers>
        <Container>
          <CheckWrapper onClick={handleCommittedClick}>
            <Checkbox checked={isCommitted} />
            <Text>Earmark funds exclusively for this creator</Text>
          </CheckWrapper>
          <CheckWrapper
            onClick={() => {
              // handleDelayedClick()
            }}
          >
            <Checkbox disabled checked={isDelayed} />
            <Text>Delay transfer</Text>
            &nbsp;<HintText>*coming soon</HintText>
          </CheckWrapper>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button onClick={_subscribe} autoFocus variant="contained">
          Subscribe
        </Button>
      </DialogActions>
    </Dialog>
  );
};
