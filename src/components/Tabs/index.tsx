import { Box, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChangeEvent, useState } from "react";
import Button from "@mui/material/Button";
import { pullPayment, setRate, subscribe, unsubscribe } from "../../utils/main";
import { CREATOR, DECIMALS, NETWORK, SYMBOL } from "../../utils/constants";
import Checkbox from "@mui/material/Checkbox";
import { formatUnit, toShortAddress } from "../../utils/helpers";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import {
  ISupporter,
  ISupporters,
  IWeb3ConnectedContextState,
} from "../../utils/types";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";

const Root = styled("div")(() => ({
  width: 600,
  height: 500,
}));
const Text = styled("div")(() => ({
  color: "black",
  fontSize: 14,
  lineHeight: 2,
}));
const Container = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
  justifyContent: "center",
}));
const Wrapper = styled("div")(() => ({
  marginTop: "15px",
}));
const Title = styled("div")(() => ({
  color: "black",
  fontSize: 18,
  margin: "20px 0 0 0",
  textAlign: "left",
}));
const ActionWrapper = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));
const InputWrapper = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  marginBottom: 50,
  flexDirection: "column",
}));
const PullPaymentWrapper = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
  alignItems: "center",
}));

type IProps = {
  subscribedCreators: string[];
  committedSupporters: ISupporters;
  uncommittedSupporters: ISupporters;
  getSubscribedCreators: () => void;
  getSupporters: () => void;
  currentRate: number;
  getRate: () => void;
};

type IState = {
  value: number;
  isCommitted: boolean;
  anonymous: string;
  rate: number;
  isSubscribing: boolean;
  isUnsubscribing: boolean;
  open: boolean;
  message: string;
};

export const TabsMain = (props: IProps) => {
  const [state, setState] = useState<IState>({
    value: 0,
    isCommitted: true,
    anonymous: "",
    rate: 0,
    isSubscribing: false,
    isUnsubscribing: false,
    open: false,
    message: "",
  });
  const {
    subscribedCreators,
    committedSupporters,
    getSubscribedCreators,
    getSupporters,
    uncommittedSupporters,
    currentRate,
    getRate,
  } = props;
  const {
    value,
    isCommitted,
    rate,
    isSubscribing,
    isUnsubscribing,
    message,
    open,
  } = state;

  const { signer, injector }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();

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
    if (!injector) return;
    const setLoading = (value: boolean) => {
      setState((prev) => ({
        ...prev,
        isSubscribing: value,
      }));
    };
    await subscribe(signer, injector, isCommitted, callback, setLoading);
  };

  const _unsubscribe = async () => {
    const setLoading = (value: boolean) => {
      setState((prev) => ({
        ...prev,
        isUnsubscribing: value,
      }));
    };
    await unsubscribe(signer, injector, CREATOR[NETWORK], callback, setLoading);
  };

  const setLoading = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      open: value,
    }));
  };

  const _setRate = async () => {
    setState((prev) => ({
      ...prev,
      message: "Setting Rate...",
    }));

    await setRate(
      rate * 10 ** DECIMALS[NETWORK],
      CREATOR[NETWORK],
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
      CREATOR[NETWORK],
      injector,
      CREATOR[NETWORK],
      currentRate,
      DECIMALS[NETWORK],
      supporter
    );
  };

  const handleClick = () => {
    setState((prev) => ({
      ...prev,
      isCommitted: !prev.isCommitted,
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

  return (
    <Root>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Creator" />
          <Tab label="Supporter" />
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
          <InputWrapper>
            <Title>Add Rate</Title>
            <TextField
              id="standard-basic"
              label="Rate"
              variant="standard"
              placeholder={`Input the amount of ${SYMBOL[NETWORK]}`}
              onChange={handleInputChange}
            />
            &nbsp;
            <Button onClick={_setRate} variant="contained">
              Set Rate
            </Button>
            <Title>Current Rate</Title>
            <Text>
              {currentRate
                ? `${formatUnit(currentRate, DECIMALS[NETWORK])} ${NETWORK}`
                : "N/A"}
            </Text>
          </InputWrapper>
          <Title>Committed Supporters</Title>
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
                          DECIMALS[NETWORK]
                        )} ${NETWORK}`}
                      </Text>

                      <Button
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
          <Title>Uncommitted Supporters</Title>
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
                      DECIMALS[NETWORK]
                    )} ${NETWORK}`}
                  </Text>

                  <Button
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
          <Title>Commit and Subscribe</Title>
          <Text>{toShortAddress(CREATOR[NETWORK])}</Text>
          <Container>
            <ActionWrapper>
              <Container>
                <Checkbox checked={isCommitted} onClick={handleClick} />
                <Text>Earmark funds exclusively for this creator</Text>
              </Container>
              <Container>
                <Button onClick={_subscribe} variant="contained">
                  Subscribe
                </Button>
                &nbsp;
                <Button onClick={_unsubscribe} variant="outlined">
                  Unsubscribe
                </Button>
              </Container>
            </ActionWrapper>
          </Container>
          <Wrapper>
            <hr />
            <Wrapper>
              <Title>Subscribed Creators</Title>
              {subscribedCreators.map((address) => (
                <Text>{address}</Text>
              ))}
            </Wrapper>
          </Wrapper>
        </InputWrapper>
      )}
    </Root>
  );
};
