import { useState } from "react";
import SignInForm from "./SignInForm";
import RegisterForm from "./RegisterForm";
import { useApi } from "../../api/ApiContext";
import "../../styles/AuthModal.css";

type AuthView = "signin" | "register";

interface AuthModalProps {
  initialView?: AuthView;
  onClose: () => void;
}

export default function AuthModal({
  initialView = "signin",
  onClose,
}: AuthModalProps) {
  const [view, setView] = useState<AuthView>(initialView);
  const [authError, setAuthError] = useState("");
  const { loading, registerUser, loginUser } = useApi();

  async function handleSignInSubmit(payload: {
    email?: string;
    phone_number?: string;
    password: string;
  }) {
    setAuthError("");
    try {
      await loginUser(payload);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed.";
      setAuthError(message);
    }
  }

  async function handleRegisterSubmit(payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
  }) {
    setAuthError("");
    try {
      await registerUser(payload);
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed.";
      setAuthError(message);
    }
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label={view === "signin" ? "Sign in" : "Register"}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="auth-modal-title">
          {view === "signin" ? "Sign In" : "Create Account"}
        </h2>

        {view === "signin" ? (
          <SignInForm
            onSubmit={handleSignInSubmit}
            onSwitchToRegister={() => {
              setAuthError("");
              setView("register");
            }}
            isSubmitting={loading}
            errorMessage={authError}
          />
        ) : (
          <RegisterForm
            onSubmit={handleRegisterSubmit}
            onSwitchToSignIn={() => {
              setAuthError("");
              setView("signin");
            }}
            isSubmitting={loading}
            errorMessage={authError}
          />
        )}
      </div>
    </div>
  );
}
