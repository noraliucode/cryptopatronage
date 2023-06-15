import { Box, Tooltip, CircularProgress, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  clearIdentity,
  pullPayment,
  toggleIsRegisterToPaymentSystem,
  unregister,
  updateInfo,
} from "../../utils/main";
import {
  Clear_Identity,
  DECIMALS,
  FOOTER_HEIGHT,
  MANAGE_SECTIONS,
  My_Supporters,
  NAV_BAR_HEIGHT,
  Payment_System,
  Personal_Info,
  Unregister,
} from "../../utils/constants";
import { convertToCSV, formatUnit, validateUrls } from "../../utils/helpers";
import Snackbar from "@mui/material/Snackbar";
import { ISupporter, IWeb3ConnectedContextState } from "../../utils/types";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { useIdentity } from "../../hooks/useIdentity";
import { useSupporters } from "../../hooks/useSupporters";
import { PaymentSystem } from "../../components/PaymentSystem";
import { Modal } from "../../components/Modal";
import { Supporter } from "../../components/Supporter";
import { useApi } from "../../hooks/useApi";
import { HintText } from "../../components/SubscribeModal";
import RateForm from "../../components/CreatorInfoForms/RateForm";
import ImageForm from "../../components/CreatorInfoForms/ImageForm";
import IdentityForm from "../../components/CreatorInfoForms/IdentityForm";
import BasicTable from "../../components/Table";
import { useTranslation } from "react-i18next";
import ConnectButton from "../../components/ConnectButton";
import { usePullPaymentHistory } from "../../hooks/usePullPaymentHistory";

const Root = styled("div")(({ theme }) => ({
  maxWidth: 1920,
  width: "80%",
  [theme.breakpoints.down("md")]: {
    width: "100%",
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
export const SectionTitle = styled("div")(() => ({
  color: "white",
  fontSize: 20,
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
export const SectionText = styled("div")(
  ({ isCicked }: { isCicked: boolean }) => ({
    fontSize: 14,
    lineHeight: 2,
    color: "white",
    textAlign: "left",
    // background: isCicked ? "rgb(0,0,0,0.3)" : "none",
    borderRadius: "10px",
    padding: "5px 20px",
    width: "80%",
  })
);

export const ConnectButtonText = styled("div")(({ theme }) => ({
  margin: 20,
  marginTop: 50,
  fontSize: 20,
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
  isCicked: boolean;
  isClearIdentityModalOpen: boolean;
  isUsd: boolean;
};

export const Manage = () => {
  const defaultState = {
    value: 0,
    anonymous: "",
    rate: 1,
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
    isCicked: false,
    isClearIdentityModalOpen: false,
    isUsd: false,
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
    isCicked,
    isClearIdentityModalOpen,
    isUsd,
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

  const {
    committedSupporters,
    getSupporters,
    uncommittedSupporters,
    loading: isSupportersLoading,
  } = useSupporters(signer?.address, network);

  const { api } = useApi(network);
  const { t } = useTranslation();
  const { pullPaymentHistory, loading: isHistoryLoading } =
    usePullPaymentHistory(signer?.address, network);

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

  const _pullPayment = async (isCommitted: boolean, supporter?: ISupporter) => {
    if (!signer) return;
    let supporters: any = [];
    if (!supporter) {
      supporters = isCommitted ? committedSupporters : uncommittedSupporters;
    } else {
      supporters = [supporter];
    }
    // TODO: calcilate if signer's balance is sufficient for fee
    // if (signerBalance === ZERO_BAL) {
    //   setState((prev) => ({
    //     ...prev,
    //     title: "Insufficient Fund",
    //     isModalOpen: true,
    //   }));
    //   return;
    // }
    const setLoading = (value: boolean) => {
      setState((prev) => ({
        ...prev,
        message: "Pulling Payment...",
        open: value,
      }));
    };

    const _supporters = supporters.filter(
      (supporter: any) => supporter.address
    );
    await pullPayment(
      api,
      _supporters,
      signer.address,
      injector,
      currentRate,
      DECIMALS[network],
      isCommitted,
      setLoading
    );
  };

  const handleRegisterClick = () => {
    checkSigner();
    if (!injector || !signer) return;
    setState((prev) => ({
      ...prev,
      message: isRegisterToPaymentSystem
        ? "Unregistering..."
        : "Registering...",
      open: true,
    }));
    const callback = async (value: boolean) => {
      await getRate();
      setState((prev) => ({
        ...prev,
        open: value,
      }));
    };

    toggleIsRegisterToPaymentSystem(
      api,
      signer.address,
      isRegisterToPaymentSystem ? !isRegisterToPaymentSystem : true,
      injector,
      callback
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
    const reset = () => {
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          errorMessage: "",
        }));
      }, 3000);
    };
    if (!display) {
      setState((prev) => ({
        ...prev,
        errorMessage: "Disaply Name is required.",
      }));
      reset();
      return;
    }
    if (result) {
      setState((prev) => ({
        ...prev,
        errorMessage: result,
      }));
      reset();
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
      isUsd,
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
    setState((prev) => ({
      ...prev,
      isClearIdentityModalOpen: false,
    }));
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

  const handleClearIdentityClick = () => {
    setState((prev) => ({
      ...prev,
      isClearIdentityModalOpen: true,
    }));
  };

  const setIsUsd = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      isUsd: value,
    }));
  };

  const _convertToCSV = () => {
    convertToCSV(pullPaymentHistory);
  };

  const isSetRateDisabled = !rate || rate === 0;
  const isCreator = currentRate > 0;
  const isShowCommittedSupporters =
    committedSupporters && committedSupporters.length > 0 && isCreator;
  const isShowUncommittedSupporters =
    uncommittedSupporters && uncommittedSupporters.length > 0 && isCreator;

  if (!signer)
    return (
      <Root>
        <ConnectButtonText>
          Connect to view your manage details
        </ConnectButtonText>
        <ConnectButton />
      </Root>
    );

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
      <Modal
        title={t("manage sections.Clear Identity") || ""}
        content={t("manage.Clear Identity Content") || ""}
        open={isClearIdentityModalOpen}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            isModalOpen: false,
          }))
        }
        action={() => _clearIdentity()}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            {MANAGE_SECTIONS.map((x, index) => (
              <div key={`${x}_${index}`}>
                <a href={x.id}>
                  <SectionText isCicked={isCicked}>
                    {t(`manage sections.${x.title}`)}
                  </SectionText>
                </a>
              </div>
            ))}
          </Grid>
          <Grid item xs={12} md={8}>
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
                <Title id={Payment_System.split(" ").join("")}>
                  {t("manage.Register to payment system")}
                </Title>
                <Tooltip title="Register to Cryptopatronage payment system. Payment will automically transfer to your recipient account. (1% fee required)">
                  <img alt="question" src="/assets/icons/question.svg" />
                </Tooltip>
                &nbsp;
              </TitleWrapper>

              <InputWrapper>
                <Text>
                  Status:{" "}
                  {isRegisterToPaymentSystem ? "Registered" : "Not Registered"}
                </Text>
                <br />
                <Button onClick={handleRegisterClick} variant="contained">
                  {isRegisterToPaymentSystem ? "Unregister" : "Register"}
                </Button>
              </InputWrapper>
              <CreatorInfo>
                <>
                  <Title id={Personal_Info.split(" ").join("")}>
                    {t("manage sections.Personal Info")}
                  </Title>
                  {isInfoLoading ? (
                    <LoadingContainer>
                      <CircularProgress size={30} thickness={5} />
                    </LoadingContainer>
                  ) : (
                    <>
                      <RateForm
                        isUsd={isUsd}
                        setIsUsd={setIsUsd}
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
              <SectionTitle id={My_Supporters.split(" ").join("")}>
                {t("manage sections.My Supporters")}
              </SectionTitle>
              <TitleWrapper>
                <Title>{t("manage.Committed Supporters")}</Title>
                <Tooltip title="Supporters that are committed to transfer fund meets the rate. Creators can not pull payment manually once register to payment system">
                  <img alt="question" src="/assets/icons/question.svg" />
                </Tooltip>
              </TitleWrapper>

              <Wrapper>
                {isSupportersLoading ? (
                  <LoadingContainer>
                    <CircularProgress size={30} thickness={5} />
                  </LoadingContainer>
                ) : isShowCommittedSupporters ? (
                  <BasicTable
                    pull={_pullPayment}
                    network={network}
                    committedSupporters={committedSupporters}
                  />
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
                      _pullPayment(true);
                    }}
                    variant="contained"
                  >
                    Pull All
                  </Button>
                </InputWrapper>
              )}

              <TitleWrapper>
                <Title>Pull Payment History</Title>
              </TitleWrapper>
              <Wrapper>
                {isHistoryLoading ? (
                  <LoadingContainer>
                    <CircularProgress size={30} thickness={5} />
                  </LoadingContainer>
                ) : isShowCommittedSupporters ? (
                  <BasicTable
                    network={network}
                    pullPaymentHistory={pullPaymentHistory}
                  />
                ) : (
                  <Content>
                    <Text>N/A</Text>
                  </Content>
                )}
              </Wrapper>
              {isShowCommittedSupporters && (
                <InputWrapper>
                  <Button onClick={_convertToCSV} variant="contained">
                    Downloadn CSV
                  </Button>
                </InputWrapper>
              )}

              <TitleWrapper>
                <Title>{t("manage.Uncommitted Supporters")}</Title>
                <Tooltip title="Supporters that are not committed to transfer fund meets the rate">
                  <img alt="question" src="/assets/icons/question.svg" />
                </Tooltip>
              </TitleWrapper>

              <Wrapper>
                {isSupportersLoading ? (
                  <LoadingContainer>
                    <CircularProgress size={30} thickness={5} />
                  </LoadingContainer>
                ) : isShowUncommittedSupporters ? (
                  <BasicTable
                    pull={_pullPayment}
                    network={network}
                    uncommittedSupporters={uncommittedSupporters}
                  />
                ) : (
                  <Content>
                    <Text>N/A</Text>
                  </Content>
                )}
              </Wrapper>
              {isShowUncommittedSupporters && (
                <InputWrapper>
                  <Button
                    disabled={isRegisterToPaymentSystem}
                    onClick={() => {
                      _pullPayment(false);
                    }}
                    variant="contained"
                  >
                    Pull All
                  </Button>
                </InputWrapper>
              )}
              <TitleWrapper>
                <Title id={Clear_Identity.split(" ").join("")}>
                  {t("manage sections.Clear Identity")}
                </Title>
                <Tooltip title="Remove on-chain identity and get the refund">
                  <img alt="question" src="/assets/icons/question.svg" />
                </Tooltip>
              </TitleWrapper>
              <InputWrapper>
                <Button onClick={handleClearIdentityClick} variant="contained">
                  {t("manage sections.Clear Identity")}
                </Button>
              </InputWrapper>
              <TitleWrapper>
                <Title id={Unregister.split(" ").join("")}>
                  {t("manage sections.Unregister")}
                </Title>
                <Tooltip title="Remove on-chain identity and get the refund">
                  <img alt="question" src="/assets/icons/question.svg" />
                </Tooltip>
              </TitleWrapper>
              <InputWrapper>
                <Button onClick={_unregister} variant="contained">
                  {t("manage sections.Unregister")}
                </Button>
              </InputWrapper>
            </>
            <Supporter />
            {/* TODO: add payment system */}
            {/* <>
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
              </> */}
          </Grid>
        </Grid>
      </Box>
    </Root>
  );
};
