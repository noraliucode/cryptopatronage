import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  styled,
  Box,
} from "@mui/material";

const Root = styled("div")(() => ({
  width: "100%",
}));
const BackButton = styled("div")(({ theme }) => ({
  marginRight: theme.spacing(1),
}));
const Instructions = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

function getSteps() {
  return ["Step 1", "Step 2", "Step 3"];
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return "Step 1: Add rate...";
    case 1:
      return "Step 2: Add image";
    case 2:
      return "Step 3: Add On-chain Identity";
    default:
      return "Unknown step";
  }
}

export default function Create() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
          <div>
            <Instructions>
              <Typography>{getStepContent(activeStep)}</Typography>
            </Instructions>
            <div>
              <BackButton>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
              </BackButton>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Box>
  );
}
