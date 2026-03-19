import React from "react";
import { Box, TextField, Button } from "@mui/material";

interface RegisterFormProps {
  onSubmit: () => void;
  onSwitchToSignIn: () => void;
}

export default function RegisterForm({
  onSubmit,
  onSwitchToSignIn,
}: RegisterFormProps) {
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
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            margin="normal"
            style={{ backgroundColor: "white" }}
          />
        </div>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          style={{ backgroundColor: "white" }}
          type="email"
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          style={{ backgroundColor: "white" }}
          type="tel"
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
        />
      </Box>

      <div className="action-buttons">
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={onSubmit}
        >
          Sign Up
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
