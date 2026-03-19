import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

interface RegisterFormProps {
  onSubmit: (payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
  }) => Promise<void>;
  onSwitchToSignIn: () => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}

export default function RegisterForm({
  onSubmit,
  onSwitchToSignIn,
  isSubmitting = false,
  errorMessage,
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    birthday: "",
    password: "",
  });

  const updateField = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    await onSubmit({
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      phone_number: formData.phone_number.trim(),
      password: formData.password,
    });
  };

  return (
    <>
      <p>
        OBX Rewards Members get exclusive perks and points that can be used
        towards purchases. Sign up today and get 15% off your NEXT purchase.
      </p>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 2,
          marginBottom: 3,
        }}
        noValidate
        autoComplete="off"
      >
        <div style={{ display: "flex", gap: "16px", width: "100%" }}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            style={{ backgroundColor: "white" }}
            value={formData.first_name}
            onChange={(e) => updateField("first_name", e.target.value)}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            margin="normal"
            style={{ backgroundColor: "white" }}
            value={formData.last_name}
            onChange={(e) => updateField("last_name", e.target.value)}
          />
        </div>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          style={{ backgroundColor: "white" }}
          type="email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          style={{ backgroundColor: "white" }}
          type="tel"
          value={formData.phone_number}
          onChange={(e) => updateField("phone_number", e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          style={{ backgroundColor: "white" }}
          type="password"
          value={formData.password}
          onChange={(e) => updateField("password", e.target.value)}
        />

        <hr style={{ width: "100%", margin: "8px 0" }} />

        <TextField
          label="Birthday (Optional)"
          variant="outlined"
          fullWidth
          margin="normal"
          style={{ backgroundColor: "white" }}
          type="date"
          required={false}
          InputLabelProps={{ shrink: true }}
          value={formData.birthday}
          onChange={(e) => updateField("birthday", e.target.value)}
        />
      </Box>

      {errorMessage && (
        <p style={{ color: "#b91c1c", marginTop: 0, marginBottom: "8px" }}>
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
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </Button>
        <Button
          variant="text"
          color="secondary"
          onClick={onSwitchToSignIn}
          style={{ marginTop: "16px" }}
        >
          Already a member? Sign in here
        </Button>
      </div>
    </>
  );
}
