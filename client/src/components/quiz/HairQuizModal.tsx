import { useState } from "react";
import "../../styles/HairQuizModal.css";

const HAIR_TYPES = [
  {
    value: "straight",
    label: "Straight",
    icon: (
      <svg width="52" height="60" viewBox="0 0 60 70" fill="none">
        <path
          d="M15 5L15 65"
          stroke="#666"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M30 5L30 65"
          stroke="#666"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M45 5L45 65"
          stroke="#666"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    value: "wavy",
    label: "Wavy",
    icon: (
      <svg width="52" height="60" viewBox="0 0 60 70" fill="none">
        <path
          d="M15 5 C5 20 25 35 15 50 C5 65 25 80 15 65"
          stroke="#666"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M30 5 C20 20 40 35 30 50 C20 65 40 80 30 65"
          stroke="#666"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M45 5 C35 20 55 35 45 50 C35 65 55 80 45 65"
          stroke="#666"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    value: "curly",
    label: "Curly",
    icon: (
      <svg width="52" height="60" viewBox="0 0 60 70" fill="none">
        <path
          d="M15 5 C30 5 30 25 15 25 C0 25 0 45 15 45 C30 45 30 65 15 65"
          stroke="#666"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M42 5 C57 5 57 25 42 25 C27 25 27 45 42 45 C57 45 57 65 42 65"
          stroke="#666"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    value: "coily",
    label: "Coily",
    icon: (
      <svg width="52" height="60" viewBox="0 0 60 70" fill="none">
        <path
          d="M15 5 C22 5 22 13 15 13 C8 13 8 21 15 21 C22 21 22 29 15 29 C8 29 8 37 15 37 C22 37 22 45 15 45 C8 45 8 53 15 53 C22 53 22 61 15 61"
          stroke="#666"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M40 5 C47 5 47 13 40 13 C33 13 33 21 40 21 C47 21 47 29 40 29 C33 29 33 37 40 37 C47 37 47 45 40 45 C33 45 33 53 40 53 C47 53 47 61 40 61"
          stroke="#666"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export type QuizAnswers = {
  name: string;
  email?: string;
  hairType: string;
  goal: string;
  porosity: string;
  scalpCondition: string;
  scentPreference: string;
  ingredientNotes: string;
};

type HairQuizModalProps = {
  open: boolean;
  onClose: () => void;
  onBuild: (answers: QuizAnswers) => void;
};

export default function HairQuizModal({
  open,
  onClose,
  onBuild,
}: HairQuizModalProps) {
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({
    name: "",
    email: "",
    hairType: "",
    goal: "",
    porosity: "",
    scalpCondition: "",
    scentPreference: "",
    ingredientNotes: "",
  });

  const [porosityInfoOpen, setPorosityInfoOpen] = useState(false);

  function updateQuizAnswer(field: keyof QuizAnswers, value: string) {
    setQuizAnswers((prev) => ({ ...prev, [field]: value }));
  }

  if (!open) return null;

  return (
    <div className="quiz-modal-overlay" onClick={onClose}>
      <div
        className="quiz-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Hair quiz"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Hair Quiz</h3>
        <p>Answer these questions to help us learn about your hair goals.</p>

        <label htmlFor="quiz-name">1. What is your name?</label>
        <input
          id="quiz-name"
          type="text"
          placeholder="Enter your name"
          value={quizAnswers.name}
          onChange={(e) => updateQuizAnswer("name", e.target.value)}
        />

        <label htmlFor="quiz-email">2. What is your email?</label>
        <input
          id="quiz-email"
          type="email"
          placeholder="Enter your email"
          value={quizAnswers.email}
          onChange={(e) => updateQuizAnswer("email", e.target.value)}
        />

        <label>3. How would you describe your hair type?</label>
        <div className="hair-type-grid">
          {HAIR_TYPES.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={quizAnswers.hairType === value}
              className={`hair-type-card${quizAnswers.hairType === value ? " selected" : ""}`}
              onClick={() => updateQuizAnswer("hairType", value)}
            >
              <div className="hair-type-icon">{icon}</div>
              <span>{label}</span>
            </button>
          ))}
        </div>

        <label htmlFor="hair-goal">4. What is your main hair goal?</label>
        <select
          id="hair-goal"
          value={quizAnswers.goal}
          onChange={(e) => updateQuizAnswer("goal", e.target.value)}
        >
          <option value="" disabled>
            Select one
          </option>
          <option value="growth">Growth</option>
          <option value="moisture">Moisture</option>
          <option value="scalp">Scalp Care</option>
          <option value="shine">Shine</option>
          <option value="length-retention">Length Retention</option>
        </select>

        <div className="quiz-label-row">
          <label htmlFor="hair-porosity">5. What is your hair porosity?</label>
          <button
            type="button"
            className="info-btn"
            onClick={() => setPorosityInfoOpen((v) => !v)}
            aria-label="Learn how to check your hair porosity"
          >
            i
          </button>
        </div>
        {porosityInfoOpen && (
          <div className="porosity-info-popup">
            <strong>How to check your porosity</strong>
            <p>
              <strong>Float Test:</strong> Drop a clean strand into a glass of
              room-temperature water and wait 2–4 min. Floats = low porosity.
              Sinks slowly = medium. Sinks quickly = high.
            </p>
            <p>
              <strong>Slip &amp; Squeak Test:</strong> Slide fingers up a strand
              from tip to root. Smooth = low. Slightly rough = medium. Very
              rough or tangles = high.
            </p>
          </div>
        )}
        <select
          id="hair-porosity"
          value={quizAnswers.porosity}
          onChange={(e) => updateQuizAnswer("porosity", e.target.value)}
        >
          <option value="" disabled>
            Select one
          </option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="unknown">I am not sure</option>
        </select>

        <label htmlFor="scalp-condition">
          6. What best describes your scalp?
        </label>
        <select
          id="scalp-condition"
          value={quizAnswers.scalpCondition}
          onChange={(e) => updateQuizAnswer("scalpCondition", e.target.value)}
        >
          <option value="" disabled>
            Select one
          </option>
          <option value="normal">Normal</option>
          <option value="dry">Dry</option>
          <option value="oily">Oily</option>
          <option value="sensitive">Sensitive</option>
          <option value="itchy">Itchy</option>
        </select>

        <label htmlFor="scent-pref">7. Scent preference (optional)</label>
        <input
          id="scent-pref"
          type="text"
          placeholder="e.g. Unscented, Floral, Citrus"
          value={quizAnswers.scentPreference}
          onChange={(e) => updateQuizAnswer("scentPreference", e.target.value)}
        />

        <label htmlFor="ingredient-notes">
          8. Ingredient notes / allergies (optional)
        </label>
        <textarea
          id="ingredient-notes"
          rows={3}
          placeholder="List any ingredients to avoid"
          value={quizAnswers.ingredientNotes}
          onChange={(e) => updateQuizAnswer("ingredientNotes", e.target.value)}
        />

        <p className="quiz-placeholder-note">
          Recommendation results are temporarily disabled until backend oil
          benefit tags are ready.
        </p>

        <div className="quiz-modal-actions">
          <button className="btn-ghost-dark" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary" onClick={() => onBuild(quizAnswers)}>
            Build My Blend
          </button>
        </div>
      </div>
    </div>
  );
}
