import React, { useState } from "react";
import { Box, Typography, Stepper, Step, StepLabel } from "@mui/material";
import UserInformation from "./UserInformation";
import ProductSelection from "./ProductSelection";
import CreateBlend, { type BlendData } from "./CreateBlend";
import ReviewOrder from "./ReviewOrder";
import CheckoutSubmit from "./CheckoutSubmit";

const steps = [
  "User Information",
  "Select Product",
  "Create Oil Blend",
  "Review Order",
  "Checkout",
];

interface NewBlendCard {
  name: string;
  description: string;
  product_type: string;
  category: string;
  bottle_size: string;
  bottle_type: string;
}

interface OrderStepperProps {
  newBlendCard: NewBlendCard;
  setNewBlendCard: React.Dispatch<React.SetStateAction<NewBlendCard>>;
}

export default function OrderStepper({
  newBlendCard,
  setNewBlendCard,
}: OrderStepperProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [blendData, setBlendData] = useState<BlendData>({
    name: "",
    description: "",
    oils: [],
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleStepRender = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return <UserInformation />;
      case 1:
        return (
          <ProductSelection
            newBlendCard={newBlendCard}
            setNewBlendCard={setNewBlendCard}
          />
        );
      case 2:
        return (
          <CreateBlend newBlendCard={newBlendCard} onChange={setBlendData} />
        );
      case 3:
        return (
          <ReviewOrder
            newBlendCard={newBlendCard}
            blendData={blendData}
            onEditStep={setActiveStep}
          />
        );
      case 4:
        return (
          <CheckoutSubmit newBlendCard={newBlendCard} blendData={blendData} />
        );
      default:
        return <UserInformation />;
    }
  };

  return (
    <Box sx={{ width: "100%", marginBottom: "2em" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed — you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <button className="btn-ghost-dark" onClick={handleReset}>
              Reset
            </button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <button
              className="btn-ghost-dark"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </button>
            <Box sx={{ flex: "1 1 auto" }} />
            <button className="btn-primary" onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Submit Order" : "Next"}
            </button>
          </Box>
        </React.Fragment>
      )}

      <Box sx={{ marginTop: "2em" }}>{handleStepRender(activeStep)}</Box>
    </Box>
  );
}
