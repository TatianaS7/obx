import { useMemo, useState } from "react";
import "../styles/Profile.css";

type ProfileSectionKey =
  | "saved-oils"
  | "orders"
  | "account"
  | "rewards"
  | "addresses"
  | "notifications";

interface ProfileSection {
  key: ProfileSectionKey;
  label: string;
  title: string;
  subtitle: string;
}

const PROFILE_SECTIONS: ProfileSection[] = [
  {
    key: "saved-oils",
    label: "Saved Oils",
    title: "Saved Oils",
    subtitle: "Keep your favorite oils ready for future blends.",
  },
  {
    key: "orders",
    label: "Orders",
    title: "Recent Orders",
    subtitle: "Track recent activity and reorder quickly.",
  },
  {
    key: "account",
    label: "Account Information",
    title: "Account Information",
    subtitle: "Manage your profile and contact details.",
  },
  {
    key: "rewards",
    label: "Rewards",
    title: "Rewards",
    subtitle: "Monitor points and redeem available perks.",
  },
  {
    key: "addresses",
    label: "Addresses",
    title: "Shipping Addresses",
    subtitle: "Save delivery locations for faster checkout.",
  },
  {
    key: "notifications",
    label: "Notifications",
    title: "Notification Preferences",
    subtitle: "Choose how you want to hear from us.",
  },
];

function renderSectionDetails(section: ProfileSectionKey) {
  const emptyMessages: Record<ProfileSectionKey, string> = {
    "saved-oils": "No saved oils yet.",
    orders: "No orders yet.",
    account: "No account information yet.",
    rewards: "No rewards data yet.",
    addresses: "No addresses yet.",
    notifications: "No notification preferences yet.",
  };

  return (
    <div className="profile-detail-grid">
      <article className="profile-detail-card">
        <p>{emptyMessages[section] ?? "None yet."}</p>
      </article>
    </div>
  );
}

export default function Profile() {
  const [activeSection, setActiveSection] =
    useState<ProfileSectionKey>("saved-oils");

  const selectedSection = useMemo(
    () =>
      PROFILE_SECTIONS.find((section) => section.key === activeSection) ??
      PROFILE_SECTIONS[0],
    [activeSection],
  );

  return (
    <div className="profile-page">
      <header className="page-hero">
        <span className="page-hero-eyebrow">My Account</span>
        <h1 className="page-hero-title">Profile Center</h1>
        <p className="page-hero-sub">
          Manage your saved blends, account settings, and order activity in one
          place.
        </p>
      </header>

      <section className="profile-body" aria-label="Profile layout">
        <div className="profile-layout">
          <aside className="profile-sidebar">
            <h2>Options</h2>
            <nav aria-label="Profile sections">
              {PROFILE_SECTIONS.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  className={`profile-nav-btn${activeSection === section.key ? " is-active" : ""}`}
                  onClick={() => setActiveSection(section.key)}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </aside>

          <article className="profile-content-panel">
            <div className="profile-content-head">
              <h2>{selectedSection.title}</h2>
              <p>{selectedSection.subtitle}</p>
            </div>
            {renderSectionDetails(selectedSection.key)}
          </article>
        </div>
      </section>
    </div>
  );
}
