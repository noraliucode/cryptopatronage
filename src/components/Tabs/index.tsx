import { Box, Tabs, Tab, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChangeEvent, useState } from "react";
import Button from "@mui/material/Button";
import {
  pullAllPayment,
  pullPayment,
  setImageUrl,
  setRate,
  toggleIsRegisterToPaymentSystem,
} from "../../utils/main";
import {
  DECIMALS,
  FOOTER_HEIGHT,
  NAV_BAR_HEIGHT,
  SYMBOL,
} from "../../utils/constants";
import { formatUnit, toShortAddress } from "../../utils/helpers";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { useIdentity } from "../../hooks/useIdentity";
import { useSupporters } from "../../hooks/useSupporters";
import { PaymentSystem } from "../PaymentSystem";
import { Modal } from "../Modal";
import { Supporter } from "../Supporter";
import { useApi } from "../../hooks/useApi";
import { HintText } from "../SubscribeModal";

const IDENTITY_LABELS = ["Display Name", "Email", "Twitter"];

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
  minHeight: `calc(100vh - (${NAV_BAR_HEIGHT + FOOTER_HEIGHT + 45}px))`,
}));
export const Text = styled("div")(({ theme }) => ({
  fontSize: 14,
  lineHeight: 2,
  color: theme.palette.text.primary,
}));
export const CheckWrapper = styled("div")(() => ({
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
}));
export const Container = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
  justifyContent: "center",
}));
export const Wrapper = styled("div")(() => ({
  marginTop: "15px",
  width: "100%",
}));
export const Title = styled("div")(() => ({
  color: "white",
  fontSize: 18,
  margin: "20px 10px 20px 0",
  textAlign: "left",
  fontWeight: 700,
}));
export const ActionWrapper = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));
export const InputWrapper = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
}));
export const SpaceBetweenWrapper = styled("div")(() => ({
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
export const TitleWrapper = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  marginTop: 20,
}));
export const Content = styled("div")(() => ({
  margin: 20,
}));

type IState = {
  value: number;
  anonymous: string;
  rate: number;
  open: boolean;
  message: string;
  isModalOpen: boolean;
  isShowAllCreators: boolean;
  title: string;
  imgUrl: string;
  email: string;
  twitter: string;
  name: string;
};

export const TabsMain = () => {
  const [state, setState] = useState<IState>({
    value: 0,
    anonymous: "",
    rate: 0,
    open: false,
    message: "",
    isModalOpen: false,
    isShowAllCreators: false,
    title: "",
    imgUrl: "",
    email: "",
    twitter: "",
    name: "",
  });

  const {
    value,
    rate,
    message,
    open,
    isModalOpen,
    isShowAllCreators,
    title,
    imgUrl,
  } = state;

  const { signer, injector, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();
  const {
    rate: currentRate,
    getRate,
    isRegisterToPaymentSystem,
  } = useIdentity(signer, network);

  const { committedSupporters, getSupporters, uncommittedSupporters } =
    useSupporters(signer, currentRate, network);

  const { api } = useApi(network);

  const handleChange = (event: any, newValue: any) => {
    setState((prev) => ({
      ...prev,
      value: newValue,
    }));
  };

  const callback = async () => {
    await getSupporters();
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
      api,
      rate * 10 ** DECIMALS[network],
      signer,
      injector,
      getRate,
      setLoading
    );
  };

  const _pullPayment = async (
    real?: string,
    supporter?: string,
    balance?: number
  ) => {
    if (!real || !supporter || !balance) return;
    if (currentRate > balance) {
      setState((prev) => ({
        ...prev,
        title: "Insufficient Fund",
        isModalOpen: true,
      }));
      return;
    }
    setState((prev) => ({
      ...prev,
      message: "Pulling Payment...",
    }));
    await pullPayment(
      api,
      real,
      signer,
      injector,
      currentRate,
      DECIMALS[network]
    );
  };

  const _pullAll = async (isCommitted: boolean) => {
    setState((prev) => ({
      ...prev,
      message: "Pulling All Payment...",
    }));

    if (isCommitted) {
      const reals = committedSupporters.map((x) => x.supporter) as string[];

      await pullAllPayment(
        api,
        reals,
        signer,
        injector,
        currentRate,
        DECIMALS[network]
      );
    }
  };

  const handleRegisterClick = () => {
    checkSigner();
    if (!injector) return;
    toggleIsRegisterToPaymentSystem(
      api,
      signer,
      isRegisterToPaymentSystem ? !isRegisterToPaymentSystem : true,
      injector
    );
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

  const showAllCreators = () => {
    setState((prev) => ({
      ...prev,
      isShowAllCreators: true,
    }));
  };

  const handleImageUrlInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState((prev) => ({
      ...prev,
      imgUrl: event.target.value,
    }));
  };

  const handleIdentitiesInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    label: string
  ) => {
    let _label = label.toLowerCase();
    _label = _label === "display name" ? "name" : _label;

    setState((prev) => ({
      ...prev,
      [_label]: event.target.value,
    }));
  };

  const _setImgUrl = async () => {
    checkSigner();
    if (!injector) return;

    setState((prev) => ({
      ...prev,
      message: "Setting Image Url...",
    }));

    await setImageUrl(api, signer, imgUrl, injector);
  };

  const isSetRateDisabled = !rate || rate === 0;
  const isCreator = currentRate > 0;
  const isShowCommittedSupporters =
    committedSupporters && committedSupporters.length > 0 && isCreator;
  const isShowUncommittedSupporters =
    uncommittedSupporters && uncommittedSupporters.length > 0 && isCreator;
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
        title={title}
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
          {/* TODO: add disabled logic */}
          <Tab disabled label="Payment System" />
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
            &nbsp;<HintText>*coming soon</HintText>
          </TitleWrapper>

          <InputWrapper>
            <Text>
              Status:{" "}
              {isRegisterToPaymentSystem ? "Registered" : "Not Registered"}
            </Text>
            <br />
            <Button disabled onClick={handleRegisterClick} variant="contained">
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
          <InputWrapper>
            <TitleWrapper>
              <Title>Add Image</Title>
            </TitleWrapper>
            <TextField
              id="standard-basic"
              label="Image Url"
              variant="standard"
              placeholder={`Input image Url`}
              onChange={handleImageUrlInputChange}
            />
            &nbsp;
            <Button onClick={_setImgUrl} variant="contained">
              Set Image
            </Button>
          </InputWrapper>
          <InputWrapper>
            <TitleWrapper>
              <Title>On-chain Identity</Title>
            </TitleWrapper>
            {IDENTITY_LABELS.map((label) => (
              <TextField
                id="standard-basic"
                label={label}
                variant="standard"
                placeholder={label}
                onChange={(event) => handleIdentitiesInputChange(event, label)}
              />
            ))}
            &nbsp;
            <Button onClick={_setImgUrl} variant="contained">
              Set On-chain identity
            </Button>
          </InputWrapper>
          <TitleWrapper>
            <Title>Committed Supporters</Title>
            <Tooltip title="Supporters that are committed to transfer fund meets the rate. Creators can not pull payment manually once register to payment system">
              <img alt="question" src="/assets/icons/question.svg" />
            </Tooltip>
          </TitleWrapper>

          <Wrapper>
            {isShowCommittedSupporters ? (
              committedSupporters.map(
                (supporter, index) =>
                  supporter.pureBalance && (
                    <SpaceBetweenWrapper key={index}>
                      <Text>{toShortAddress(supporter?.supporter)}</Text>
                      {/* for testing */}
                      {/* <Text>{supporter?.pure}</Text> */}

                      <Text>
                        {`Balance: ${formatUnit(
                          Number(supporter?.pureBalance),
                          DECIMALS[network]
                        )} ${network}`}
                      </Text>

                      <Button
                        disabled={
                          isRegisterToPaymentSystem ||
                          supporter?.pureBalance < currentRate
                        }
                        onClick={() =>
                          _pullPayment(
                            supporter?.pure,
                            supporter?.supporter,
                            supporter?.pureBalance
                          )
                        }
                        variant="contained"
                      >
                        Pull Payment
                      </Button>
                    </SpaceBetweenWrapper>
                  )
              )
            ) : (
              <Content>
                <Text>N/A</Text>
              </Content>
            )}
          </Wrapper>
          {isShowCommittedSupporters && (
            <InputWrapper>
              <Button
                disabled={isRegisterToPaymentSystem}
                onClick={() => {
                  _pullAll(true);
                }}
                variant="contained"
              >
                Pull All
              </Button>
            </InputWrapper>
          )}

          <TitleWrapper>
            <Title>Uncommitted Supporters</Title>
            <Tooltip title="Supporters that are not committed to transfer fund meets the rate">
              <img alt="question" src="/assets/icons/question.svg" />
            </Tooltip>
          </TitleWrapper>

          <Wrapper>
            {isShowUncommittedSupporters ? (
              uncommittedSupporters.map(
                (supporter, index) =>
                  supporter?.supporter && (
                    <SpaceBetweenWrapper key={index}>
                      <Text>{toShortAddress(supporter?.supporter)}</Text>
                      {/* for testing */}
                      {/* <Text>{supporter?.pure}</Text> */}

                      <Text>
                        {`Balance: ${formatUnit(
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
                    </SpaceBetweenWrapper>
                  )
              )
            ) : (
              <Content>
                <Text>N/A</Text>
              </Content>
            )}
          </Wrapper>
          {/* TODO: comment out Uncommitted Pull All for now */}
          {/* {isShowUncommittedSupporters && (
            <InputWrapper>
              <Button
                disabled={isRegisterToPaymentSystem}
                onClick={() => {
                  _pullAll(false);
                }}
                variant="contained"
              >
                Pull All
              </Button>
            </InputWrapper>
          )} */}
        </>
      )}
      {value === 1 && <Supporter />}

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
