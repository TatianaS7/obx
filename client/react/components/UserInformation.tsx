import React, { useState } from "react";
import { Box, TextField, Button, Divider } from "@mui/material";
import { useApi } from "../api/ApiContext";
import "../styles/UserInformation.css";
import LoadingSpinner from "./LoadingSpinner";

export default function UserInformation() {
  const [isMember, setIsMember] = useState(false);
  const { loading, setLoading } = useApi();

  function handleSubmit() {
    setLoading(true);
    // Perform submission logic here
    // After submission, you can reset the loading state
    setLoading(false);
  }

  return (
    <div className="user-information-container">
      <h1>OBX Rewards</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        isMember ? (
        <>
          <p> Sign in to receive your rewards and discounts!</p>
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            margin="normal"
            style={{ backgroundColor: "white" }}
            type="tel"
            // value={phoneNumber}
            // onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <div className="action-buttons">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => handleSubmit()}
            >
              Sign In
            </Button>
            <Button
              variant="text"
              color="secondary"
              onClick={() => setIsMember(false)}
              style={{ marginTop: "16px" }}
            >
              Not a member? Sign up here
            </Button>
          </div>
        </>
      ) : (
        <>
          <p>
            OBX Rewards Members get exclusive perks and points that can be used
            torwards purchases. Sign up today and get 15% off your NEXT
            purchase.{" "}
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
            <div
              className="flex-row"
              style={{ display: "flex", gap: "16px", width: "100%" }}
            >
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                margin="normal"
                style={{ backgroundColor: "white" }}
                // value={firstName}
                // onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                margin="normal"
                style={{ backgroundColor: "white" }}
                // value={lastName}
                // onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              style={{ backgroundColor: "white" }}
              type="email"
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              style={{ backgroundColor: "white" }}
              type="tel"
              // value={phoneNumber}
              // onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <hr />

            <TextField
              label="Birthday (Optional)"
              variant="outlined"
              fullWidth
              margin="normal"
              style={{ backgroundColor: "white" }}
              type="date"
              required={false}
              // value={birthday}
              // onChange={(e) => setBirthday(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>

          <div className="action-buttons">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => handleSubmit()}
            >
              Sign Up
            </Button>

            <Button
              variant="text"
              color="secondary"
              onClick={() => setIsMember(true)}
              style={{ marginTop: "16px" }}
            >
              Already a member? Sign in here
            </Button>
          </div>
        </>
      ))}
    </div>
)
}
