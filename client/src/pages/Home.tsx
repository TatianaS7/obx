import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HairQuizModal, {
  type QuizAnswers,
} from "../components/quiz/HairQuizModal";
import "../styles/Home.css";

const FEATURES = [
  {
    icon: "✦",
    title: "Fully Customized",
    body: "Every blend is built around your hair type, texture, and goals — no two formulas are the same.",
  },
  {
    icon: "⬡",
    title: "Premium Ingredients",
    body: "We source only cold-pressed, unrefined oils carefully chosen for potency and purity.",
  },
  {
    icon: "◈",
    title: "Expert Blending",
    body: "Our formulators combine science and tradition to create oils that actually work for you.",
  },
];

const STEPS = [
  {
    number: "01",
    label: "Choose Your Base",
    desc: "Select from our curated base oils matched to your hair porosity.",
  },
  {
    number: "02",
    label: "Add Your Blend",
    desc: "Pick secondary oils targeting your specific concerns — growth, moisture, or scalp health.",
  },
  {
    number: "03",
    label: "We Mix & Ship",
    desc: "Your custom formula is hand-blended and delivered straight to your door.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [quizOpen, setQuizOpen] = useState(false);

  function handleQuizBuild(quizAnswers: QuizAnswers) {
    setQuizOpen(false);
    navigate("/start-order", { state: { quizAnswers } });
  }

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-hero-eyebrow">Custom Hair Oils</p>
          <h1 className="home-hero-title">
            Oils Crafted <span className="accent">For You.</span>
          </h1>
          <p className="home-hero-sub">
            No fillers. No guesswork. Just a precision-blended oil crafted
            around your hair's unique needs.
          </p>
          <div className="home-hero-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/start-order")}
            >
              Create My Blend Card
            </button>
            <button
              className="btn-ghost"
              onClick={() => navigate("/browse-oils")}
            >
              Browse Oils
            </button>
          </div>
          <p className="home-hero-quiz">
            Not sure where to start?
            <button
              className="home-hero-quiz-link"
              type="button"
              onClick={() => setQuizOpen(true)}
            >
              Take our hair quiz
            </button>
          </p>
        </div>
        <div className="home-hero-visual">
          <div className="home-hero-blob" />
          <div className="home-hero-bottle" aria-hidden="true">
            <svg
              viewBox="0 0 80 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="28" y="4" width="24" height="12" rx="4" fill="#9c27b0" />
              <rect x="24" y="14" width="32" height="6" rx="2" fill="#7b1fa2" />
              <rect
                x="10"
                y="20"
                width="60"
                height="130"
                rx="16"
                fill="white"
              />
              <rect
                x="10"
                y="20"
                width="60"
                height="130"
                rx="16"
                fill="white"
                stroke="#e0e0e0"
                strokeWidth="1.5"
              />
              <ellipse
                cx="40"
                cy="85"
                rx="18"
                ry="28"
                fill="#f3e5f5"
                opacity="0.6"
              />
              <text
                x="40"
                y="90"
                textAnchor="middle"
                fontSize="10"
                fill="#9c27b0"
                fontWeight="bold"
              >
                OBX
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="home-features">
        <h2 className="home-section-title">Why OBX?</h2>
        <div className="home-features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="home-feature-card">
              <span className="home-feature-icon accent">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="home-how">
        <h2 className="home-section-title">How It Works</h2>
        <div className="home-steps">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.number}>
              <div className="home-step">
                <span className="home-step-number accent">{s.number}</span>
                <h3>{s.label}</h3>
                <p>{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && <div className="home-step-divider" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="home-cta">
        <h2>Ready for your perfect blend?</h2>
        <p>Answer a few questions and we'll craft an oil just for you.</p>
        <button
          className="btn-primary"
          onClick={() => navigate("/start-order")}
        >
          Start Your Order
        </button>
      </section>

      <HairQuizModal
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onBuild={handleQuizBuild}
      />
    </div>
  );
}
