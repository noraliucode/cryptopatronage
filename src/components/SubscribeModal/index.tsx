import {
  Checkbox,
  CircularProgress,
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
import { useApi } from "../../hooks/useApi";
import { APIService } from "../../services/apiService";
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
  isSubscribing: boolean;
  isSubscribingSucceeded: boolean;
  isNoFundsExclusivelyConfirmed: boolean;
};

export const HintText = styled("div")(() => ({
  color: "gray",
  fontSize: 11,
}));
const Wrapper = styled("div")(() => ({
  width: 400,
  height: 110,
}));
const WarningText = styled("div")(() => ({
  fontSize: 14,
  lineHeight: 2,
  color: "red",
}));

export const SubscribeModal = (props: IProps) => {
  const { onClose, open, selectedCreator } = props;
  const [state, setState] = useState<IState>({
    isCommitted: true,
    isDelayed: false,
    isSubscribing: false,
    isSubscribingSucceeded: false,
    isNoFundsExclusivelyConfirmed: false,
  });

  const {
    isCommitted,
    isDelayed,
    isSubscribing,
    isSubscribingSucceeded,
    isNoFundsExclusivelyConfirmed,
  } = state;

  const { signer, injector, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();

  const { api } = useApi(network);

  const isSubscribDisabled = !isCommitted && !isNoFundsExclusivelyConfirmed;

  const handleClose = () => {
    onClose();
  };

  const handleDelayedClick = () => {
    setState((prev) => ({
      ...prev,
      isDelayed: !prev.isDelayed,
    }));
  };

  const handleNoFundsExclusiveClick = () => {
    setState((prev) => ({
      ...prev,
      isNoFundsExclusivelyConfirmed: !prev.isNoFundsExclusivelyConfirmed,
    }));
  };

  const handleCommittedClick = () => {
    setState((prev) => ({
      ...prev,
      isCommitted: !prev.isCommitted,
    }));
  };

  const _subscribe = async () => {
    if (isSubscribingSucceeded) {
      handleClose();
      return;
    }
    if (!injector || !api) return;
    setState((prev) => ({
      ...prev,
      isSubscribing: true,
      isSubscribingSucceeded: false,
    }));
    const setLoading = (value: boolean) => {
      setState((prev) => ({
        ...prev,
        isSubscribing: value,
      }));
    };

    const callback = async () => {
      setState((prev) => ({
        ...prev,
        isSubscribingSucceeded: true,
        isSubscribing: false,
      }));
      // await getSubscribedCreators();
    };

    const apiService = new APIService(api);
    const supporterProxies: any = await apiService.getProxies(signer);
    const pure = findPure(supporterProxies, selectedCreator, signer);
    await subscribe(
      api,
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

  const renderContent = () => {
    if (isSubscribingSucceeded) return <Wrapper>Subscribed!</Wrapper>;
    if (isSubscribing) return <Wrapper>Subscribing...</Wrapper>;
    return (
      <Container>
        <Wrapper>
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
          {!isCommitted && (
            <CheckWrapper onClick={handleNoFundsExclusiveClick}>
              <Checkbox checked={isNoFundsExclusivelyConfirmed} />
              <WarningText>
                No creating proxy. Creators can withdraw from my account
                directly.
              </WarningText>
            </CheckWrapper>
          )}
        </Wrapper>
      </Container>
    );
  };

  const renderButton = () => {
    if (isSubscribing) return <CircularProgress size={30} thickness={5} />;
    if (isSubscribingSucceeded) return "Done";
    return "Subscribe";
  };

  return (
    <Dialog disableEscapeKeyDown onClose={handleClose} open={open}>
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent dividers>{renderContent()}</DialogContent>
      <DialogActions>
        <Button
          disabled={isSubscribing || isSubscribDisabled}
          style={{ width: 120 }}
          onClick={_subscribe}
          autoFocus
          variant="contained"
        >
          {renderButton()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
