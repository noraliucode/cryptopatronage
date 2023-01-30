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
  Content,
  SpaceBetweenWrapper,
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
    useSubscribedCreators(signer?.address, rate, network);

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
    if (!injector || !signer) return;
    const setLoading = (value: boolean) => {
      setState((prev) => ({
        ...prev,
        isUnsubscribing: value,
      }));
    };
    await unsubscribe(
      api,
      signer.address,
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
            {committedCreators.length > 0 ? (
              committedCreators.map((creator) => (
                <SpaceBetweenWrapper>
                  <Text>{creator.creator}</Text>
                  <Button onClick={_unsubscribe} variant="outlined">
                    Unsubscribe
                  </Button>
                </SpaceBetweenWrapper>
              ))
            ) : (
              <Content>
                <Text> N/A</Text>
              </Content>
            )}
            <Title>Uncommitted subscribed Creators</Title>
            {uncommittedCreators.length > 0 ? (
              uncommittedCreators.map((creator) => (
                <Text>{creator.creator}</Text>
              ))
            ) : (
              <Content>
                <Text> N/A</Text>
              </Content>
            )}
          </Wrapper>
        </Wrapper>
      </InputWrapper>
    </>
  );
};
