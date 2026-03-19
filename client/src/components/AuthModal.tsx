import { useState } from "react";
import SignInForm from "./SignInForm";
import RegisterForm from "./RegisterForm";
import "../styles/AuthModal.css";

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

  function handleSubmit() {
    // TODO: wire to auth backend
    onClose();
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
            onSubmit={handleSubmit}
            onSwitchToRegister={() => setView("register")}
          />
        ) : (
          <RegisterForm
            onSubmit={handleSubmit}
            onSwitchToSignIn={() => setView("signin")}
          />
        )}
      </div>
    </div>
  );
}
