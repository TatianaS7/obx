import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Footer.css";
import HairQuizModal, { type QuizAnswers } from "../quiz/HairQuizModal";

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const [quizOpen, setQuizOpen] = useState(false);

  function handleQuizBuild(quizAnswers: QuizAnswers) {
    setQuizOpen(false);
    navigate("/start-order", { state: { quizAnswers } });
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">OBX</span>
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
              <a href="mailto:hello@obx.com">hello@obx.com</a>
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
