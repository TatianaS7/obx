import React, { useState } from "react";
import { useApi } from "../../api/ApiContext";
import "../../styles/UserInformation.css";
import LoadingSpinner from "./LoadingSpinner";
import SignInForm from "../auth/SignInForm";
import RegisterForm from "../auth/RegisterForm";

export default function UserInformation() {
  const [isMember, setIsMember] = useState(false);
  const { loading, setLoading } = useApi();

  function handleSubmit() {
    setLoading(true);
    // Perform submission logic here
    setLoading(false);
  }

  return (
    <div className="user-information-container">
      <h1>OBX Rewards</h1>
      {loading ? (
        <LoadingSpinner />
      ) : isMember ? (
        <SignInForm
          onSubmit={handleSubmit}
          onSwitchToRegister={() => setIsMember(false)}
        />
      ) : (
        <RegisterForm
          onSubmit={handleSubmit}
          onSwitchToSignIn={() => setIsMember(true)}
        />
      )}
    </div>
  );
}
