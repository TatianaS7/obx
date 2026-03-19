import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

interface SignInFormProps {
  onSubmit: (payload: {
    email?: string;
    phone_number?: string;
    password: string;
  }) => Promise<void>;
  onSwitchToRegister: () => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}

export default function SignInForm({
  onSubmit,
  onSwitchToRegister,
  isSubmitting = false,
  errorMessage,
}: SignInFormProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const cleaned = identifier.trim();
    const isEmail = cleaned.includes("@");

    await onSubmit({
      email: isEmail ? cleaned : undefined,
      phone_number: isEmail ? undefined : cleaned,
      password,
    });
  };

  return (
    <>
      <p>Sign in to receive your rewards and discounts!</p>
      <TextField
        label="Email or Phone Number"
        variant="outlined"
        fullWidth
        margin="normal"
        style={{ backgroundColor: "white" }}
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        style={{ backgroundColor: "white" }}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errorMessage && (
        <p style={{ color: "#b91c1c", marginTop: "2px", marginBottom: "8px" }}>
          {errorMessage}
        </p>
      )}
      <div className="action-buttons">
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
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
