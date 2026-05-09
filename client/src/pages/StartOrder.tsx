import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/StartOrder.css";

import OrderStepper from "../components/order/OrderStepper";
import type { QuizAnswers } from "../components/quiz/HairQuizModal";
import type { QuizRecommendationResult } from "../components/quiz/quizRecommendations";

interface NewBlendCard {
  name: string;
  description: string;
  product_type: string;
  category: string;
  bottle_size: string;
  bottle_type: string;
}

export default function StartOrder() {
  const location = useLocation();
  const routeState = (location.state as {
    quizAnswers?: QuizAnswers;
    quizResult?: QuizRecommendationResult;
  }) ?? {
    quizAnswers: undefined,
    quizResult: undefined,
  };

  const navEntry =
    typeof window !== "undefined"
      ? (window.performance.getEntriesByType("navigation").at(0) as
          | PerformanceNavigationTiming
          | undefined)
      : undefined;
  const isPageReload = navEntry?.type === "reload";

  const state = isPageReload
    ? { quizAnswers: undefined, quizResult: undefined }
    : routeState;

  const quizResult = state.quizResult;

  const [newBlendCard, setNewBlendCard] = useState<NewBlendCard>(() => ({
    name: "",
    description: "",
    product_type: quizResult?.profile.suggestedProductType ?? "",
    category: quizResult?.profile.recommendedCategory ?? "",
    bottle_size: quizResult?.profile.recommendedBottleSize ?? "",
    bottle_type: "DROPPER",
  }));

  return (
    <div className="start-order-page">
      <header className="page-hero">
        <span className="page-hero-eyebrow">Custom Blends</span>
        <h1 className="page-hero-title">Start Your Order</h1>
        <p className="page-hero-sub">
          Build a blend tailored to your hair goals — every drop crafted just
          for you.
        </p>
      </header>

      {quizResult && (
        <section className="quiz-profile-card" aria-label="Quiz profile">
          <h2>{quizResult.profile.title}</h2>
          <p>{quizResult.profile.summary}</p>
          {quizResult.profile.priorities.length > 0 && (
            <p>
              <strong>Focus Areas:</strong>{" "}
              {quizResult.profile.priorities.slice(0, 4).join(" • ")}
            </p>
          )}
          {[
            ...quizResult.suggestions.baseRecommendations,
            ...quizResult.suggestions.secondaryRecommendations,
            ...quizResult.suggestions.addOnRecommendations,
          ].length > 0 && (
            <p>
              <strong>Suggested Oils:</strong>{" "}
              {[
                ...quizResult.suggestions.baseRecommendations,
                ...quizResult.suggestions.secondaryRecommendations,
                ...quizResult.suggestions.addOnRecommendations,
              ]
                .map((oil) => oil.name)
                .join(", ")}
            </p>
          )}
        </section>
      )}

      <section className="start-order-body">
        <OrderStepper
          newBlendCard={newBlendCard}
          setNewBlendCard={setNewBlendCard}
          quizResult={quizResult}
        />
      </section>
    </div>
  );
}
