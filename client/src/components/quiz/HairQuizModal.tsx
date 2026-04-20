import { useEffect, useState } from "react";
import { useApi } from "../../api/ApiContext";
import {
  buildQuizRecommendation,
  type QuizRecommendationResult,
} from "./quizRecommendations";
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
  {
    value: "coily",
    label: "Coily",
    icon: (
      <svg width="52" height="60" viewBox="0 0 60 70" fill="none">
        <path
          d="M15 5 C19 5 19 10 15 10 C11 10 11 15 15 15 C19 15 19 20 15 20 C11 20 11 25 15 25 C19 25 19 30 15 30 C11 30 11 35 15 35 C19 35 19 40 15 40 C11 40 11 45 15 45 C19 45 19 50 15 50 C11 50 11 55 15 55 C19 55 19 60 15 60 C11 60 11 65 15 65"
          stroke="#666"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M40 5 C44 5 44 10 40 10 C36 10 36 15 40 15 C44 15 44 20 40 20 C36 20 36 25 40 25 C44 25 44 30 40 30 C36 30 36 35 40 35 C44 35 44 40 40 40 C36 40 36 45 40 45 C44 45 44 50 40 50 C36 50 36 55 40 55 C44 55 44 60 40 60 C36 60 36 65 40 65"
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
  onBuild: (
    answers: QuizAnswers,
    quizResult: QuizRecommendationResult,
  ) => void | Promise<void>;
};

export default function HairQuizModal({
  open,
  onClose,
  onBuild,
}: HairQuizModalProps) {
  const { allOils, fetchOils, currentUser } = useApi();
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
  const [screen, setScreen] = useState<"quiz" | "results">("quiz");
  const [isBuilding, setIsBuilding] = useState(false);
  const [isAddingToOrder, setIsAddingToOrder] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizRecommendationResult | null>(
    null,
  );

  useEffect(() => {
    if (open) {
      setScreen("quiz");
      setQuizResult(null);
      setSaveMessage(null);
      setIsBuilding(false);
      setIsAddingToOrder(false);
    }
  }, [open]);

  function updateQuizAnswer(field: keyof QuizAnswers, value: string) {
    setQuizAnswers((prev) => ({ ...prev, [field]: value }));
  }

  async function handleBuildRecommendations() {
    setIsBuilding(true);
    setSaveMessage(null);
    try {
      const oils = allOils.length > 0 ? allOils : await fetchOils();
      const result = buildQuizRecommendation(quizAnswers, oils);
      setQuizResult(result);
      setScreen("results");
    } finally {
      setIsBuilding(false);
    }
  }

  function handleSaveBlendToProfile() {
    if (!quizResult) return;

    const storageKey = "obxSavedQuizBlends";
    const existing = localStorage.getItem(storageKey);
    const saved = existing ? JSON.parse(existing) : [];

    saved.push({
      id: `${Date.now()}`,
      created_at: new Date().toISOString(),
      user_id: currentUser?.id ?? null,
      user_email: currentUser?.email ?? quizAnswers.email ?? null,
      profile: quizResult.profile,
      suggestions: quizResult.suggestions,
      quiz_answers: quizAnswers,
    });

    localStorage.setItem(storageKey, JSON.stringify(saved));
    setSaveMessage("Blend recommendations saved to your profile.");
  }

  async function handleAddToOrder() {
    if (!quizResult) return;

    setIsAddingToOrder(true);
    try {
      await onBuild(quizAnswers, quizResult);
    } finally {
      setIsAddingToOrder(false);
    }
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
        {screen === "quiz" && (
          <>
            <h3>Hair Quiz</h3>
            <p>
              Answer these questions to help us learn about your hair goals.
            </p>

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
              <label htmlFor="hair-porosity">
                5. What is your hair porosity?
              </label>
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
                  <strong>Float Test:</strong> Drop a clean strand into a glass
                  of room-temperature water and wait 2–4 min. Floats = low
                  porosity. Sinks slowly = medium. Sinks quickly = high.
                </p>
                <p>
                  <strong>Slip &amp; Squeak Test:</strong> Slide fingers up a
                  strand from tip to root. Smooth = low. Slightly rough =
                  medium. Very rough or tangles = high.
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
              onChange={(e) =>
                updateQuizAnswer("scalpCondition", e.target.value)
              }
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
              onChange={(e) =>
                updateQuizAnswer("scentPreference", e.target.value)
              }
            />

            <label htmlFor="ingredient-notes">
              8. Ingredient notes / allergies (optional)
            </label>
            <textarea
              id="ingredient-notes"
              rows={3}
              placeholder="List any ingredients to avoid"
              value={quizAnswers.ingredientNotes}
              onChange={(e) =>
                updateQuizAnswer("ingredientNotes", e.target.value)
              }
            />

            <p className="quiz-placeholder-note">
              We will generate recommendations inside this modal before you add
              them to an order.
            </p>

            <div className="quiz-modal-actions">
              <button className="btn-ghost-dark" onClick={onClose}>
                Close
              </button>
              <button
                className="btn-primary"
                onClick={handleBuildRecommendations}
                disabled={isBuilding}
              >
                {isBuilding ? "Building..." : "See Recommendations"}
              </button>
            </div>
          </>
        )}

        {screen === "results" && quizResult && (
          <>
            <h3>Recommended Oils</h3>
            <p className="quiz-results-subtitle">
              Based on your answers, here are the oils we recommend.
            </p>

            <div className="quiz-result-group">
              <h4>Base Oils</h4>
              <ul className="quiz-result-list">
                {quizResult.suggestions.baseRecommendations.map((oil) => (
                  <li key={oil.id}>{oil.name}</li>
                ))}
              </ul>
            </div>

            <div className="quiz-result-group">
              <h4>Secondary Oils</h4>
              <ul className="quiz-result-list">
                {quizResult.suggestions.secondaryRecommendations.map((oil) => (
                  <li key={oil.id}>{oil.name}</li>
                ))}
              </ul>
            </div>

            <div className="quiz-result-group">
              <h4>Add-On Oils</h4>
              <ul className="quiz-result-list">
                {quizResult.suggestions.addOnRecommendations.map((oil) => (
                  <li key={oil.id}>{oil.name}</li>
                ))}
              </ul>
            </div>

            {saveMessage && <p className="quiz-save-message">{saveMessage}</p>}

            <div className="quiz-modal-actions">
              <button
                className="btn-ghost-dark"
                onClick={() => setScreen("quiz")}
              >
                Retake Quiz
              </button>
              <button
                className="btn-ghost-dark"
                onClick={handleSaveBlendToProfile}
              >
                Save To Profile
              </button>
              <button
                className="btn-primary"
                onClick={handleAddToOrder}
                disabled={isAddingToOrder}
              >
                {isAddingToOrder ? "Adding..." : "Add To Order"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
