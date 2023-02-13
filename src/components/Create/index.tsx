import React, { ChangeEvent, useMemo, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  styled,
  Box,
  Tooltip,
  TextField,
} from "@mui/material";
import { InputWrapper, Title, TitleWrapper } from "../Tabs";
import { FOOTER_HEIGHT, NAV_BAR_HEIGHT, SYMBOL } from "../../utils/constants";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";

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
  marginBottom: 30,
}));
const BackButton = styled("div")(({ theme }) => ({
  marginRight: theme.spacing(1),
}));
const Instructions = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

type IState = {
  rate: string;
};

export default function Create() {
  const [activeStep, setActiveStep] = useState(0);

  const [state, setState] = useState<IState>({
    rate: "",
  });

  const { signer, injector, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();

  const { rate } = state;

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
    console.log("event.target.value", event.target.value);

    setState((prev) => ({
      ...prev,
      rate: event.target.value,
    }));
  };

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return renderStep1();
      case 1:
        return "Step 2: Add image";
      case 2:
        return "Step 3: Add On-chain Identity";
      default:
        return "Unknown step";
    }
  }

  const renderStep1 = () => {
    return (
      <>
        <TitleWrapper>
          <Title>Add Monthly Rate</Title>
          <Tooltip title="Add rate for current selected creator(signer)">
            <img alt="question" src="/assets/icons/question.svg" />
          </Tooltip>
        </TitleWrapper>
        <TextField
          fullWidth
          value={rate}
          id="standard-basic"
          label="Rate"
          variant="standard"
          placeholder={`Input the amount of ${SYMBOL[network]}`}
          onChange={handleInputChange}
          defaultValue={""}
        />
      </>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <Instructions>
            <Typography>All steps completed</Typography>
          </Instructions>
        ) : (
          <Root>
            <BackgroundBox>
              <Instructions>
                <Typography>{getStepContent(activeStep)}</Typography>
              </Instructions>
            </BackgroundBox>
            <InputWrapper>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
              <BackButton>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
              </BackButton>
            </InputWrapper>
          </Root>
        )}
      </div>
    </Box>
  );
}
