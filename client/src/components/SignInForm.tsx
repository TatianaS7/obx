import React from "react";
import { TextField, Button } from "@mui/material";

interface SignInFormProps {
  onSubmit: () => void;
  onSwitchToRegister: () => void;
}

export default function SignInForm({
  onSubmit,
  onSwitchToRegister,
}: SignInFormProps) {
  return (
    <>
      <p>Sign in to receive your rewards and discounts!</p>
      <TextField
        label="Phone Number"
        variant="outlined"
        fullWidth
        margin="normal"
        style={{ backgroundColor: "white" }}
        type="tel"
      />
      <div className="action-buttons">
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={onSubmit}
        >
          Sign In
        </Button>
        <Button
          variant="text"
          color="secondary"
          onClick={onSwitchToRegister}
          style={{ marginTop: "16px" }}
        >
          Not a member? Sign up here
        </Button>
      </div>
    </>
  );
}
