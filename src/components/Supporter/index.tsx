import { Button, Snackbar, Tooltip } from "@mui/material";
import { useState } from "react";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { useApi } from "../../hooks/useApi";
import { useSubscribedCreators } from "../../hooks/useSubscribedCreators";
import { unsubscribe } from "../../utils/main";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { Modal } from "../Modal";
import {
  ActionWrapper,
  InputWrapper,
  Title,
  TitleWrapper,
  Text,
  Wrapper,
} from "../Tabs";

type IState = {
  rate: number;
  isSubscribing: boolean;
  isUnsubscribing: boolean;
  isModalOpen: boolean;
  isDelayed: boolean;
  selectedCreator: string;
  creatorUrl: string;
};

export const Supporter = () => {
  const [state, setState] = useState<IState>({
    rate: 0,
    isSubscribing: false,
    isUnsubscribing: false,
    isModalOpen: false,
    isDelayed: false,
    selectedCreator: "",
    creatorUrl: "",
  });

  const { rate, isSubscribing, isUnsubscribing, isModalOpen, selectedCreator } =
    state;

  const { signer, injector, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();

  const { committedCreators, uncommittedCreators, getSubscribedCreators } =
    useSubscribedCreators(signer, rate, network);

  const { api } = useApi(network);

  const checkSigner = () => {
    if (!signer || !injector) {
      setState((prev) => ({
        ...prev,
        isModalOpen: true,
      }));
      return;
    }
  };

  const callback = async () => {
    await getSubscribedCreators();
  };

  const _unsubscribe = async () => {
    checkSigner();
    if (!injector) return;
    const setLoading = (value: boolean) => {
      setState((prev) => ({
        ...prev,
        isUnsubscribing: value,
      }));
    };
    await unsubscribe(
      api,
      signer,
      injector,
      selectedCreator,
      callback,
      setLoading
    );
  };

  const _unnotePreimage = async () => {
    // await signAndSendUnnotePreimage(signer, injector, "");
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            isModalOpen: false,
          }))
        }
      />
      <InputWrapper>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={isSubscribing}
          message="Subscribing..."
        />
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={isUnsubscribing}
          message="Unsubscribing..."
        />
        <ActionWrapper></ActionWrapper>
        <TitleWrapper>
          <Title>Unnote Preimages</Title>
          <Tooltip title="Withdraw the deposit for delay proxy">
            <img alt="question" src="/assets/icons/question.svg" />
          </Tooltip>
        </TitleWrapper>
        <Button disabled onClick={_unnotePreimage} variant="contained">
          Unnote Preimage
        </Button>
        <Wrapper>
          <Wrapper>
            <Title>Committed subscribed Creators</Title>
            {committedCreators.map((creator) => (
              <>
                <Text>{creator.creator}</Text>
                <Button onClick={_unsubscribe} variant="outlined">
                  Unsubscribe
                </Button>
              </>
            ))}
            <Title>Uncommitted subscribed Creators</Title>
            {uncommittedCreators.map((creator) => (
              <Text>{creator.creator}</Text>
            ))}
          </Wrapper>
        </Wrapper>
      </InputWrapper>
    </>
  );
};
