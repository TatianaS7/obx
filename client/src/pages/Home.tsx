import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HairQuizModal, {
  type QuizAnswers,
} from "../components/quiz/HairQuizModal";
import type { QuizRecommendationResult } from "../components/quiz/quizRecommendations";
import "../styles/Home.css";

const FEATURES = [
  {
    icon: "✦",
    title: "Fully Customized",
    body: "Every blend is built around your unique hair or skin type, texture, and goals — no two formulas are the same.",
  },
  {
    icon: "⬡",
    title: "Diverse Selection",
    body: "From lightweight seed oils to rich buttery extracts, our selection spans a wide range of origins so you can find the perfect match for your routine.",
  },
  {
    icon: "◈",
    title: "Sustainably Minded",
    body: "We're committed to reducing plastic waste — our packaging is designed to minimize single-use plastic at every step.",
  },
];

const STEPS = [
  {
    number: "01",
    label: "Select Your Product Type",
    desc: "Choose whether you're creating a hair oil or a skin oil — we'll tailor your options from there.",
  },
  {
    number: "02",
    label: "Build Your Blend",
    desc: "Choose your base and add secondary oils matched to your hair porosity, skin type, or specific concerns like moisture, growth, or nourishment.",
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

  function handleQuizBuild(
    quizAnswers: QuizAnswers,
    quizResult: QuizRecommendationResult,
  ) {
    setQuizOpen(false);
    navigate("/start-order", { state: { quizAnswers, quizResult } });
  }

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-hero-eyebrow">Custom Hair & Skin Oils</p>
          <h1 className="home-hero-title">
            Oils Crafted <span className="accent">For You.</span>
          </h1>
          <p className="home-hero-sub">
            No fillers. No guesswork. Just a precision-blended oil crafted
            around your hair and skin's unique needs.
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
              Take our quiz
            </button>
          </p>
        </div>
        <div className="home-hero-visual">
          <div className="home-hero-blob" />
          <div className="home-hero-bottle" aria-hidden="true"></div>
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
