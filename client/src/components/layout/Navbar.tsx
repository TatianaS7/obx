import { useState, useRef } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/dropper-bottle.png";
import "../../styles/Navbar.css";
import AuthModal from "../auth/AuthModal";

type AuthView = "signin" | "register" | null;

export default function Navbar() {
  const navigate = useNavigate();
  const [value, setValue] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<AuthView>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(value: string) {
    setValue(value);
    if (value === "browse-oils") {
      navigate("/browse-oils");
    } else if (value === "start-order") {
      navigate("/start-order");
    } else if (value === "home") {
      navigate("/");
    }
  }

  function openMenu() {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setMenuOpen(true);
  }

  function closeMenu() {
    hideTimeout.current = setTimeout(() => setMenuOpen(false), 150);
  }

  return (
    <div className="navbar-wrapper background">
      <h1 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        OBX
      </h1>
      <Tabs
        value={value}
        onChange={(event, newValue) => handleChange(newValue)}
        textColor="secondary"
        indicatorColor="secondary"
        centered
        className="navbar-tabs"
      >
        <Tab value="home" label="Home" />
        <Tab value="browse-oils" label="Browse Oils" />
        <Tab value="start-order" label="Start Order" />
      </Tabs>

      <div
        className="navbar-avatar-wrapper"
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
      >
        <button
          className="navbar-avatar-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Account menu"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </button>

        {menuOpen && (
          <div
            className="navbar-dropdown"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
          >
            <button
              className="navbar-dropdown-item"
              onClick={() => {
                setMenuOpen(false);
                setAuthModal("signin");
              }}
            >
              Sign In
            </button>
            <button
              className="navbar-dropdown-item"
              onClick={() => {
                setMenuOpen(false);
                setAuthModal("register");
              }}
            >
              Register
            </button>
          </div>
        )}
      </div>

      {authModal && (
        <AuthModal initialView={authModal} onClose={() => setAuthModal(null)} />
      )}
    </div>
  );
}
