import React, { useState } from "react";
import { useApi } from "../../api/ApiContext";
import "../../styles/UserInformation.css";
import LoadingSpinner from "./LoadingSpinner";
import SignInForm from "../auth/SignInForm";
import RegisterForm from "../auth/RegisterForm";

export default function UserInformation() {
  const [isMember, setIsMember] = useState(false);
  const [authError, setAuthError] = useState("");
  const { loading, currentUser, registerUser, loginUser } = useApi();

  async function handleRegister(payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
  }) {
    setAuthError("");
    try {
      await registerUser(payload);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed.";
      setAuthError(message);
    }
  }

  async function handleLogin(payload: {
    email?: string;
    phone_number?: string;
    password: string;
  }) {
    setAuthError("");
    try {
      await loginUser(payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed.";
      setAuthError(message);
    }
  }

  return (
    <div className="user-information-container">
      <h1>OBX Rewards</h1>
      {loading ? (
        <LoadingSpinner />
      ) : currentUser ? (
        <div>
          <p>
            Signed in as <strong>{currentUser.first_name}</strong> (
            {currentUser.email})
          </p>
          <p>
            Your rewards and discount eligibility can now be applied at
            checkout.
          </p>
        </div>
      ) : isMember ? (
        <SignInForm
          onSubmit={handleLogin}
          onSwitchToRegister={() => {
            setAuthError("");
            setIsMember(false);
          }}
          isSubmitting={loading}
          errorMessage={authError}
        />
      ) : (
        <RegisterForm
          onSubmit={handleRegister}
          onSwitchToSignIn={() => {
            setAuthError("");
            setIsMember(true);
          }}
          isSubmitting={loading}
          errorMessage={authError}
        />
      )}
    </div>
  );
}
