import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Footer.css";
import HairQuizModal, { type QuizAnswers } from "../quiz/HairQuizModal";
import type { QuizRecommendationResult } from "../quiz/quizRecommendations";

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const [quizOpen, setQuizOpen] = useState(false);

  function handleQuizBuild(
    quizAnswers: QuizAnswers,
    quizResult: QuizRecommendationResult,
  ) {
    setQuizOpen(false);
    navigate("/start-order", { state: { quizAnswers, quizResult } });
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <button
            type="button"
            className="footer-logo-button"
            onClick={() => navigate("/")}
            aria-label="Go to home"
          >
            <img src="/logo.svg" alt="OBX Logo" className="footer-logo" />
          </button>
          <p>Custom hair oils crafted precisely for you.</p>
        </div>

        <nav className="footer-nav">
          <h4>Explore</h4>
          <ul>
            <li>
              <button onClick={() => navigate("/")}>Home</button>
            </li>
            <li>
              <button onClick={() => navigate("/browse-oils")}>
                Browse Oils
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/start-order")}>
                Start Order
              </button>
            </li>
            <li>
              <button onClick={() => setQuizOpen(true)}>Take Hair Quiz</button>
            </li>
          </ul>
        </nav>

        <div className="footer-contact">
          <h4>Contact</h4>
          <ul>
            <li>
              <a href="mailto:oilbarexperience@gmail.com">
                oilbarexperience@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {year} OBX. All rights reserved.</span>
      </div>

      <HairQuizModal
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onBuild={handleQuizBuild}
      />
    </footer>
  );
}
