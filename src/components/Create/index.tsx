import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  styled,
  Box,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { InputWrapper } from "../../page/ManagePage";
import { DECIMALS, FOOTER_HEIGHT, NAV_BAR_HEIGHT } from "../../utils/constants";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { create } from "../../utils/main";
import { useApi } from "../../hooks/useApi";
import RateForm from "../CreatorInfoForms/RateForm";
import IdentityForm from "../CreatorInfoForms/IdentityForm";
import ImageForm from "../CreatorInfoForms/ImageForm";
import CreatorInfoUpdateBtn from "../CreatorInfoUpdateBtn";
import { useIdentity } from "../../hooks/useIdentity";
import { Link as StyledLink } from "../Link";

const Root = styled("div")(({ theme }) => ({
  width: 600,
  [theme.breakpoints.down("md")]: {
    width: "90%",
  },
  margin: "auto",
  minHeight: `calc(100vh - (${NAV_BAR_HEIGHT + FOOTER_HEIGHT + 45}px))`,
  marginTop: 30,
}));

const BackgroundBox = styled("div")(({ theme }) => ({
  borderRadius: "5px",
  padding: "20px",
  background: "#300f78",
  margin: "30px 0",
}));
const BackButton = styled("div")(({ theme }) => ({
  marginRight: theme.spacing(1),
}));
const Instructions = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));
export const MainTitle = styled("div")(() => ({
  color: "white",
  fontSize: 28,
  fontWeight: 500,
  marginBottom: 20,
  textAlign: "left",
}));
export const Title = styled("div")(() => ({
  color: "white",
  fontSize: 18,
  textAlign: "left",
  fontWeight: 700,
  marginRight: 10,
}));
export const Wrapper = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
}));

type IState = {
  rate: number;
  imgUrl: string;
  email: string;
  twitter: string;
  display: string;
  web: string;
  open: boolean;
  isUsd: boolean;
};

export default function Create() {
  const defaultState = {
    rate: 1,
    imgUrl: "",
    email: "",
    twitter: "",
    display: "",
    web: "",
    open: false,
    isUsd: false,
  };

  const [activeStep, setActiveStep] = useState(0);
  const [checked, setChecked] = useState(false);
  const [state, setState] = useState<IState>(defaultState);

  const { signer, injector, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();
  const { api } = useApi(network);
  const { additionalInfo, isOnchained } = useIdentity(signer?.address, network);
  const isCreatorRegistered = !!additionalInfo?.rate;

  const { rate, imgUrl, email, twitter, display, web, open, isUsd } = state;

  const steps = getSteps();

  useEffect(() => {
    return () => {
      setState(defaultState);
      setActiveStep(0);
    };
  }, []);

  const handleChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setChecked(event.target.checked);
  };

  const handleNext = () => {
    if (activeStep < 2) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function getSteps() {
    return ["Step 1", "Step 2", "Step 3"];
  }

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState((prev) => ({
      ...prev,
      rate: Number(event.target.value),
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

  const setImageUrl = (imgUrl: string) => {
    setState((prev) => ({
      ...prev,
      imgUrl,
    }));
  };

  const setLoading = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      open: value,
    }));
  };

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      default:
        return "Unknown step";
    }
  }

  const setIsUsd = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      isUsd: value,
    }));
  };

  const renderStep1 = () => {
    return (
      <RateForm
        isUsd={isUsd}
        setIsUsd={setIsUsd}
        rate={rate}
        network={network}
        handleInputChange={handleInputChange}
      />
    );
  };

  const renderStep2 = () => {
    return (
      <IdentityForm
        display={display}
        email={email}
        twitter={twitter}
        web={web}
        handleInputChange={handleIdentityInputChange}
      />
    );
  };

  const renderStep3 = () => {
    return (
      <ImageForm
        imgUrl={imgUrl}
        checked={checked}
        handleChange={handleChange}
        setImageUrl={setImageUrl}
      />
    );
  };

  if (open)
    return (
      <Root>
        <Box sx={{ width: "100%" }}>
          <MainTitle>Register as a creator</MainTitle>
          <CircularProgress size={30} thickness={5} />
        </Box>
      </Root>
    );

  if (activeStep === steps.length) {
    return (
      <Root>
        <Box sx={{ width: "100%" }}>
          <MainTitle>Register as a creator</MainTitle>
          Registeration Success! explore creators here!
          <br />
          <br />
          <StyledLink to={"/"}>
            <Button
              color="primary"
              aria-label={"explore"}
              variant={"contained"}
            >
              Explore
            </Button>
          </StyledLink>
        </Box>
      </Root>
    );
  }

  return (
    <Root>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        message={"creating..."}
      />
      <Box sx={{ width: "100%" }}>
        <MainTitle>Register as a creator</MainTitle>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          <BackgroundBox>
            <Instructions>
              <Typography>{getStepContent(activeStep)}</Typography>
            </Instructions>
          </BackgroundBox>
          <InputWrapper>
            {activeStep === steps.length - 1 ? (
              <CreatorInfoUpdateBtn
                isCreatorRegistered={isCreatorRegistered}
                isOnchained={isOnchained}
                email={email}
                twitter={twitter}
                display={display}
                web={web}
                imgUrl={imgUrl}
                rate={rate}
                checked={checked}
                isUsd={isUsd}
                setLoading={setLoading}
                setMessage={() => {}}
                text={"Create"}
                callback={() => setActiveStep(3)}
              />
            ) : (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            )}
            <BackButton>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
            </BackButton>
          </InputWrapper>
        </div>
      </Box>
    </Root>
  );
}
