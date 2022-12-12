import { Box, Tabs, Tab, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChangeEvent, useState } from "react";
import Button from "@mui/material/Button";
import {
  pullPayment,
  setRate,
  subscribe,
  toggleIsRegisterToPaymentSystem,
  unsubscribe,
} from "../../utils/main";
import { CREATOR, DECIMALS, SYMBOL } from "../../utils/constants";
import Checkbox from "@mui/material/Checkbox";
import { findPure, formatUnit, toShortAddress } from "../../utils/helpers";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { useIdentity } from "../../hooks/useIdentity";
import { useSupporters } from "../../hooks/useSupporters";
import { useSubscribedCreators } from "../../hooks/useSubscribedCreators";
import { PaymentSystem } from "../PaymentSystem";
import { Modal } from "../Modal";
import { getProxies, signAndSendUnnotePreimage } from "../../utils/apiCalls";

const Root = styled("div")(({ theme }) => ({
  width: 600,
  [theme.breakpoints.down("md")]: {
    width: "90%",
  },
  background: "#300f78",
  padding: "20px",
  borderRadius: "5px",
  margin: "auto",
  marginTop: 30,
}));
const Text = styled("div")(() => ({
  fontSize: 14,
  lineHeight: 2,
  color: "white",
}));
const CheckWrapper = styled("div")(() => ({
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
}));
const Container = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
  justifyContent: "center",
}));
const Wrapper = styled("div")(() => ({
  marginTop: "15px",
  width: "100%",
}));
const Title = styled("div")(() => ({
  color: "white",
  fontSize: 18,
  margin: "20px 10px 20px 0",
  textAlign: "left",
  fontWeight: 700,
}));
const ActionWrapper = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));
const InputWrapper = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
}));
const PullPaymentWrapper = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
  alignItems: "center",
}));
const Subtitle = styled("div")(() => ({
  color: "white",
  fontSize: 16,
  margin: "20px 0 0 0",
}));
const TitleWrapper = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  marginTop: 20,
}));

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

export const TabsMain = () => {
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
  } = useIdentity(CREATOR[network]);
  const { committedCreators, uncommittedCreators, getSubscribedCreators } =
    useSubscribedCreators(signer, rate, network);
  const { committedSupporters, getSupporters, uncommittedSupporters } =
    useSupporters(signer, rate);

  const handleChange = (event: any, newValue: any) => {
    setState((prev) => ({
      ...prev,
      value: newValue,
    }));
  };

  const callback = async () => {
    await getSubscribedCreators();
    await getSupporters();
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
    // TODO: current selected creator
    const pure = findPure(supporterProxies, CREATOR[network], signer);
    await subscribe(
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
    await unsubscribe(signer, injector, CREATOR[network], callback, setLoading);
  };

  const _unnotePreimage = async () => {
    // await signAndSendUnnotePreimage(signer, injector, "");
  };

  const setLoading = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      open: value,
    }));
  };

  const _setRate = async () => {
    checkSigner();
    if (!injector) return;

    setState((prev) => ({
      ...prev,
      message: "Setting Rate...",
    }));

    await setRate(
      rate * 10 ** DECIMALS[network],
      CREATOR[network],
      injector,
      getRate,
      setLoading
    );
  };

  const _pullPayment = async (real: string, supporter: string) => {
    setState((prev) => ({
      ...prev,
      message: "Pulling Payment...",
    }));
    await pullPayment(
      real,
      CREATOR[network],
      injector,
      CREATOR[network],
      currentRate,
      DECIMALS[network],
      supporter
    );
  };

  const _pullAll = async () => {};

  const handleRegisterClick = () => {
    checkSigner();
    if (!injector) return;
    toggleIsRegisterToPaymentSystem(
      signer,
      isRegisterToPaymentSystem ? !isRegisterToPaymentSystem : true,
      injector
    );
  };

  const handleCommittedClick = () => {
    setState((prev) => ({
      ...prev,
      isCommitted: !prev.isCommitted,
    }));
  };

  const handleDelayedClick = () => {
    setState((prev) => ({
      ...prev,
      isDelayed: !prev.isDelayed,
    }));
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState((prev) => ({
      ...prev,
      rate: Number(event.target.value),
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

  const isSetRateDisabled = !rate || rate === 0;

  const showAllCreators = () => {
    setState((prev) => ({
      ...prev,
      isShowAllCreators: true,
    }));
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
      selectedCreator: selectedCreator,
    }));
  };

  return (
    <Root>
      <Modal
        open={isModalOpen}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            isModalOpen: false,
          }))
        }
      />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          textColor="primary"
        >
          <Tab label="Creator" />
          <Tab label="Supporter" />
          <Tab label="Payment System" />
        </Tabs>
      </Box>
      {value === 0 && (
        <>
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            open={open}
            message={message}
          />
          <TitleWrapper>
            <Title>Register to payment system</Title>
            <Tooltip title="Register to Cryptopatronage payment system. Payment will automically transfer to your recipient account. (1% fee required)">
              <img alt="question" src="/assets/icons/question.svg" />
            </Tooltip>
          </TitleWrapper>

          <InputWrapper>
            <Text>
              Status:{" "}
              {isRegisterToPaymentSystem ? "Registered" : "Not Registered"}
            </Text>
            <br />
            <Button onClick={handleRegisterClick} variant="contained">
              {isRegisterToPaymentSystem ? "Cancel" : "Register"}
            </Button>
          </InputWrapper>
          <InputWrapper>
            <TitleWrapper>
              <Title>Add Rate</Title>
              <Tooltip title="Add rate for current selected creator(signer)">
                <img alt="question" src="/assets/icons/question.svg" />
              </Tooltip>
            </TitleWrapper>
            <TextField
              id="standard-basic"
              label="Rate"
              variant="standard"
              placeholder={`Input the amount of ${SYMBOL[network]}`}
              onChange={handleInputChange}
            />
            &nbsp;
            <Button
              disabled={isSetRateDisabled}
              onClick={_setRate}
              variant="contained"
            >
              Set Rate
            </Button>
            <TitleWrapper>
              <Title>Current Rate</Title>
              <Tooltip title="Rate for current selected creator(signer)">
                <img alt="question" src="/assets/icons/question.svg" />
              </Tooltip>
            </TitleWrapper>
            <Text>
              {currentRate
                ? `${formatUnit(currentRate, DECIMALS[network])} ${network}`
                : "N/A"}
            </Text>
          </InputWrapper>
          <TitleWrapper>
            <Title>Committed Supporters</Title>
            <Tooltip title="Supporters that are committed to transfer fund meets the rate. Creators can not pull payment manually once register to payment system">
              <img alt="question" src="/assets/icons/question.svg" />
            </Tooltip>
          </TitleWrapper>

          <Wrapper>
            {committedSupporters &&
              committedSupporters.map(
                (supporter, index) =>
                  supporter.pureBalance && (
                    <PullPaymentWrapper key={index}>
                      <Text>{toShortAddress(supporter?.supporter)}</Text>
                      {/* for testing */}
                      {/* <Text>{supporter?.pure}</Text> */}

                      <Text>
                        {`${formatUnit(
                          Number(supporter?.pureBalance),
                          DECIMALS[network]
                        )} ${network}`}
                      </Text>

                      <Button
                        disabled={isRegisterToPaymentSystem}
                        onClick={() =>
                          _pullPayment(
                            supporter?.pure as string,
                            supporter?.supporter as string
                          )
                        }
                        variant="contained"
                      >
                        Pull Payment
                      </Button>
                    </PullPaymentWrapper>
                  )
              )}
          </Wrapper>

          <TitleWrapper>
            <Title>Uncommitted Supporters</Title>
            <Tooltip title="Supporters that are not committed to transfer fund meets the rate">
              <img alt="question" src="/assets/icons/question.svg" />
            </Tooltip>
          </TitleWrapper>

          <Wrapper>
            {uncommittedSupporters &&
              uncommittedSupporters.map((supporter, index) => (
                <PullPaymentWrapper key={index}>
                  <Text>{toShortAddress(supporter?.supporter)}</Text>
                  {/* for testing */}
                  {/* <Text>{supporter?.pure}</Text> */}

                  <Text>
                    {`${formatUnit(
                      Number(supporter?.supporterBalance),
                      DECIMALS[network]
                    )} ${network}`}
                  </Text>

                  <Button
                    disabled={isRegisterToPaymentSystem}
                    onClick={() =>
                      _pullPayment(
                        supporter?.supporter as string,
                        supporter?.supporter as string
                      )
                    }
                    variant="contained"
                  >
                    Pull Payment
                  </Button>
                </PullPaymentWrapper>
              ))}
          </Wrapper>
          <InputWrapper>
            <Button
              disabled={isRegisterToPaymentSystem}
              onClick={() => {
                _pullAll();
              }}
              variant="contained"
            >
              Pull All
            </Button>
          </InputWrapper>
        </>
      )}
      {value === 1 && (
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
      )}

      {value === 2 && (
        <>
          <TitleWrapper>
            <Title>Creators registered to payment system</Title>
            <Tooltip title="Admins manually transfer fund to creators' account in case of failure">
              <img alt="question" src="/assets/icons/question.svg" />
            </Tooltip>
          </TitleWrapper>
          {isShowAllCreators ? (
            <PaymentSystem />
          ) : (
            <ActionWrapper>
              <Button onClick={showAllCreators} variant="contained">
                Show all creators
              </Button>
            </ActionWrapper>
          )}
        </>
      )}
    </Root>
  );
};
