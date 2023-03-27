import { Box, Tabs, Tab, Tooltip, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChangeEvent, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  clearIdentity,
  pullAllPayment,
  pullPayment,
  toggleIsRegisterToPaymentSystem,
  unregister,
  updateInfo,
} from "../../utils/main";
import {
  DECIMALS,
  FOOTER_HEIGHT,
  NAV_BAR_HEIGHT,
  ZERO_BAL,
} from "../../utils/constants";
import { formatUnit, toShortAddress, validateUrls } from "../../utils/helpers";
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
import RateForm from "../CreatorInfoForms/RateForm";
import ImageForm from "../CreatorInfoForms/ImageForm";
import IdentityForm from "../CreatorInfoForms/IdentityForm";

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
export const CreatorInfo = styled("div")(() => ({
  background: "#42336d",
  borderRadius: 15,
  padding: 20,
  boxSizing: "border-box",
  margin: "31px 0",
}));
export const LoadingContainer = styled("div")(() => ({
  height: 200,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));
export const ErrorMessage = styled("div")(({ theme }) => ({
  fontSize: 14,
  lineHeight: 2,
  color: "#eb0116",
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
  display: string;
  web: string;
  checked: boolean;
  errorMessage: string;
};

export const TabsMain = () => {
  const defaultState = {
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
    display: "",
    web: "",
    checked: false,
    errorMessage: "",
  };
  const [state, setState] = useState<IState>(defaultState);

  const {
    value,
    rate,
    message,
    open,
    isModalOpen,
    isShowAllCreators,
    title,
    imgUrl,
    email,
    twitter,
    display,
    web,
    checked,
    errorMessage,
  } = state;

  const { signer, injector, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();
  const {
    rate: currentRate,
    getRate,
    isRegisterToPaymentSystem,
    additionalInfo,
    identity,
    loading: isInfoLoading,
  } = useIdentity(signer?.address, network);

  const { committedSupporters, getSupporters, uncommittedSupporters } =
    useSupporters(signer?.address, currentRate, network);

  const { api } = useApi(network);

  useEffect(() => {
    if (identity) {
      const { email, twitter, display, web } = identity;
      setState((prev) => ({ ...prev, email, twitter, display, web }));
    }
    if (additionalInfo) {
      const { rate, imgUrl, isSensitive } = additionalInfo;
      setState((prev) => ({
        ...prev,
        rate: rate ? formatUnit(rate, DECIMALS[network]) : 0,
        imgUrl: imgUrl,
        isSensitive,
      }));
    }
  }, [additionalInfo, identity, network, signer, isInfoLoading]);

  const handleCheck = () => {
    setState((prev) => ({
      ...prev,
      checked: !checked,
    }));
  };

  const handleChange = (event: any, newValue: any) => {
    setState((prev) => ({
      ...prev,
      value: newValue,
    }));
  };

  const callback = async () => {
    await getSupporters();
    await getRate();
    setLoading(false);
  };

  const setLoading = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      open: value,
    }));
  };

  const _pullPayment = async (
    real?: string,
    supporter?: string,
    balance?: number,
    isCommitted?: boolean
  ) => {
    if (!real || !supporter || !balance || !signer) return;
    if (balance === ZERO_BAL) {
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
      open: true,
    }));
    await pullPayment(
      api,
      real,
      signer.address,
      injector,
      currentRate,
      DECIMALS[network],
      (isCommitted = false)
    );
  };

  const _pullAll = async (isCommitted: boolean) => {
    if (!signer) return;
    setState((prev) => ({
      ...prev,
      message: "Pulling All Payment...",
    }));

    if (isCommitted) {
      const reals = committedSupporters.map((x) => x.supporter) as string[];

      await pullAllPayment(
        api,
        reals,
        signer.address,
        injector,
        currentRate,
        DECIMALS[network]
      );
    }
  };

  const handleRegisterClick = () => {
    checkSigner();
    if (!injector || !signer) return;
    toggleIsRegisterToPaymentSystem(
      api,
      signer.address,
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

  const handleIdentityInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    label: string
  ) => {
    let _label = label.toLowerCase();
    _label = _label === "display name" ? "display" : _label;

    setState((prev) => ({
      ...prev,
      [_label]: event.target.value,
    }));
  };

  const _updateInfo = async () => {
    checkSigner();
    if (!injector || !signer) return;
    const result = validateUrls({
      web,
      img: imgUrl,
      twitter,
    });
    if (result) {
      //set errormessage
      setState((prev) => ({
        ...prev,
        errorMessage: result,
      }));

      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          errorMessage: "",
        }));
      }, 3000);
      return;
    }

    setState((prev) => ({
      ...prev,
      message: "Update Info...",
    }));

    const identity = {
      email,
      twitter,
      display,
      web,
    };

    const additionalInfo = {
      imgUrl,
      rate: rate * 10 ** DECIMALS[network],
      isSensitive: checked,
    };

    await updateInfo(
      api,
      identity,
      additionalInfo,
      signer.address,
      injector,
      () => {},
      setLoading
    );
  };

  const _clearIdentity = async () => {
    if (!signer) return;
    setState((prev) => ({
      ...prev,
      message: "Clear Identity...",
      open: true,
    }));

    clearIdentity(api, signer.address, injector, callback, setLoading);
  };

  const _unregister = async () => {
    if (!signer) return;
    setState((prev) => ({
      ...prev,
      message: "Unregister...",
      open: true,
    }));

    unregister(api, signer.address, injector, callback, setLoading);
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
          <CreatorInfo>
            <>
              <Title>Personal Info</Title>
              {isInfoLoading ? (
                <LoadingContainer>
                  <CircularProgress size={30} thickness={5} />
                </LoadingContainer>
              ) : (
                <>
                  <RateForm
                    rate={rate}
                    network={network}
                    handleInputChange={handleInputChange}
                  />
                  <ImageForm
                    imgUrl={imgUrl}
                    checked={checked}
                    handleChange={handleCheck}
                    handleInputChange={handleImageUrlInputChange}
                  />
                  <IdentityForm
                    display={display}
                    email={email}
                    twitter={twitter}
                    web={web}
                    handleInputChange={handleIdentityInputChange}
                  />
                  <Wrapper>
                    <ErrorMessage>{errorMessage}</ErrorMessage>
                    <InputWrapper>
                      <Button onClick={_updateInfo} variant="contained">
                        Update Creator Info
                      </Button>
                    </InputWrapper>
                  </Wrapper>
                </>
              )}
            </>
          </CreatorInfo>
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
                          supporter?.pureBalance === ZERO_BAL
                        }
                        onClick={() =>
                          _pullPayment(
                            supporter?.pure,
                            supporter?.supporter,
                            supporter?.pureBalance,
                            true
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
                            supporter?.supporter as string,
                            0,
                            false
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
          <TitleWrapper>
            <Title>Clear Identity</Title>
            <Tooltip title="Remove on-chain identity and get the refund">
              <img alt="question" src="/assets/icons/question.svg" />
            </Tooltip>
          </TitleWrapper>
          <InputWrapper>
            <Button onClick={_clearIdentity} variant="contained">
              Clear Identity
            </Button>
          </InputWrapper>
          <TitleWrapper>
            <Title>Unregister</Title>
            <Tooltip title="Remove on-chain identity and get the refund">
              <img alt="question" src="/assets/icons/question.svg" />
            </Tooltip>
          </TitleWrapper>
          <InputWrapper>
            <Button onClick={_unregister} variant="contained">
              Unregister
            </Button>
          </InputWrapper>
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
