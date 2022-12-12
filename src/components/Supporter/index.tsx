import {
  Button,
  Checkbox,
  Container,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { useIdentity } from "../../hooks/useIdentity";
import { useSubscribedCreators } from "../../hooks/useSubscribedCreators";
import { getProxies } from "../../utils/apiCalls";
import { CREATOR, DECIMALS } from "../../utils/constants";
import { findPure, formatUnit } from "../../utils/helpers";
import { subscribe, unsubscribe } from "../../utils/main";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { Modal } from "../Modal";
import {
  ActionWrapper,
  InputWrapper,
  Title,
  TitleWrapper,
  Text,
  CheckWrapper,
  Wrapper,
} from "../Tabs";

type IState = {
  value: number;
  isCommitted: boolean;
  anonymous: string;
  rate: number;
  isSubscribing: boolean;
  isUnsubscribing: boolean;
  open: boolean;
  message: string;
  isModalOpen: boolean;
  isDelayed: boolean;
  isShowAllCreators: boolean;
  selectedCreator: string;
  creatorUrl: string;
};

export const Supporter = () => {
  const [state, setState] = useState<IState>({
    value: 0,
    isCommitted: true,
    anonymous: "",
    rate: 0,
    isSubscribing: false,
    isUnsubscribing: false,
    open: false,
    message: "",
    isModalOpen: false,
    isDelayed: false,
    isShowAllCreators: false,
    selectedCreator: "",
    creatorUrl: "",
  });

  const {
    value,
    isCommitted,
    rate,
    isSubscribing,
    isUnsubscribing,
    message,
    open,
    isModalOpen,
    isDelayed,
    isShowAllCreators,
    selectedCreator,
    creatorUrl,
  } = state;

  const { signer, injector, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();

  const {
    rate: currentRate,
    getRate,
    isRegisterToPaymentSystem,
  } = useIdentity(selectedCreator);

  const { committedCreators, uncommittedCreators, getSubscribedCreators } =
    useSubscribedCreators(signer, rate, network);

  const checkSigner = () => {
    if (!signer || !injector) {
      setState((prev) => ({
        ...prev,
        isModalOpen: true,
      }));
      return;
    }
  };

  const setCreatorUrl = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState((prev) => ({
      ...prev,
      creatorUrl: event.target.value,
    }));
  };

  const setSelectedCreator = () => {
    setState((prev) => ({
      ...prev,
      selectedCreator: creatorUrl,
    }));
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

  const callback = async () => {
    await getSubscribedCreators();
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

  const _unsubscribe = async () => {
    checkSigner();
    if (!injector) return;
    const setLoading = (value: boolean) => {
      setState((prev) => ({
        ...prev,
        isUnsubscribing: value,
      }));
    };
    await unsubscribe(signer, injector, selectedCreator, callback, setLoading);
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
          <Title>Commit and Subscribe</Title>

          <Tooltip title="Subscribe to current selected creator">
            <img alt="question" src="/assets/icons/question.svg" />
          </Tooltip>
        </TitleWrapper>
        <Text>
          Current selected creator:
          <br />
          {selectedCreator ? selectedCreator : "N/A"}
        </Text>
        <TextField
          id="standard-basic"
          label="Creator"
          variant="standard"
          placeholder={`Input the creator's url or address`}
          onChange={setCreatorUrl}
        />
        &nbsp;
        <Button onClick={setSelectedCreator} variant="contained">
          Slelect this Creator
        </Button>
        <ActionWrapper>
          <TitleWrapper>
            <Title>Current Rate</Title>
            <Tooltip title="Rate for current selected creator">
              <img alt="question" src="/assets/icons/question.svg" />
            </Tooltip>
          </TitleWrapper>
          <Text>
            {currentRate
              ? `${formatUnit(currentRate, DECIMALS[network])} ${network}`
              : "N/A"}
          </Text>
          <Container>
            <CheckWrapper onClick={handleCommittedClick}>
              <Checkbox checked={isCommitted} />
              <Text>Earmark funds exclusively for this creator</Text>
            </CheckWrapper>
            <CheckWrapper onClick={handleDelayedClick}>
              <Checkbox checked={isDelayed} />
              <Text>Delay transfer</Text>
            </CheckWrapper>
          </Container>
          <Container>
            <Button onClick={_subscribe} variant="contained">
              Subscribe
            </Button>
            &nbsp;
            <Button onClick={_unsubscribe} variant="outlined">
              Unsubscribe
            </Button>
            &nbsp;
          </Container>
        </ActionWrapper>
        <TitleWrapper>
          <Title>Unnote Preimages</Title>
          <Tooltip title="Withdraw the deposit for delay proxy">
            <img alt="question" src="/assets/icons/question.svg" />
          </Tooltip>
        </TitleWrapper>
        <Button onClick={_unnotePreimage} variant="contained">
          Unnote Preimage
        </Button>
        <Wrapper>
          <Wrapper>
            <Title>Committed subscribed Creators</Title>
            {committedCreators.map((creator) => (
              <Text>{creator.creator}</Text>
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
