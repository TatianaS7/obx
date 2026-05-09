import type { QuizAnswers } from "./HairQuizModal";

export interface QuizOilCatalogItem {
  id: number;
  name: string;
  description?: string;
  oil_type?: string;
  tags?: string[];
}

export interface QuizHairProfile {
  title: string;
  summary: string;
  priorities: string[];
  suggestedProductType: string;
  recommendedCategory: string;
  recommendedBottleSize: string;
}

export interface SuggestedOil {
  id: number;
  name: string;
  oil_type: string;
  score: number;
}

export interface QuizOilSuggestions {
  baseOilIds: number[];
  secondaryOilIds: number[];
  addOnOilIds: number[];
  baseRecommendations: SuggestedOil[];
  secondaryRecommendations: SuggestedOil[];
  addOnRecommendations: SuggestedOil[];
  topMatches: SuggestedOil[];
  blendNameSuggestion: string;
  blendDescriptionSuggestion: string;
}

export interface QuizRecommendationResult {
  profile: QuizHairProfile;
  suggestions: QuizOilSuggestions;
}

const TAG_LABELS: Record<string, string> = {
  GROWTH: "Growth Support",
  MOISTURE: "Moisture",
  DEEP_MOISTURE: "Deep Moisture",
  STRENGTH: "Strength",
  SCALP_CARE: "Scalp Care",
  SHINE: "Shine",
  ITCH_RELIEF: "Itch Relief",
  SCALP_BALANCE: "Scalp Balance",
  REPAIR: "Repair",
  ELASTICITY: "Elasticity",
  LIGHTWEIGHT: "Lightweight Feel",
  BARRIER_SUPPORT: "Barrier Support",
};

const GOAL_TAG_WEIGHTS: Record<string, Record<string, number>> = {
  growth: { GROWTH: 5, STRENGTH: 3, BREAKAGE_SUPPORT: 2, SCALP_STIMULATING: 2 },
  moisture: {
    MOISTURE: 5,
    DEEP_MOISTURE: 3,
    BARRIER_SUPPORT: 2,
    CONDITIONING: 2,
  },
  scalp: {
    SCALP_CARE: 5,
    ITCH_RELIEF: 4,
    SCALP_BALANCE: 3,
    DANDRUFF_SUPPORT: 2,
  },
  shine: { SHINE: 5, FRIZZ_CONTROL: 3, CONDITIONING: 2, ANTIOXIDANT: 1 },
  "length-retention": {
    BREAKAGE_SUPPORT: 3,
    STRENGTH: 3,
    MOISTURE: 2,
    ELASTICITY: 2,
  },
};

const POROSITY_TAG_WEIGHTS: Record<string, Record<string, number>> = {
  low: { LIGHTWEIGHT: 2, MOISTURE: 2, SHINE: 1 },
  medium: { MOISTURE: 1, ELASTICITY: 1 },
  high: { DEEP_MOISTURE: 3, REPAIR: 2, BARRIER_SUPPORT: 2, ELASTICITY: 2 },
};

const SCALP_TAG_WEIGHTS: Record<string, Record<string, number>> = {
  normal: { SCALP_CARE: 1, MOISTURE: 1 },
  dry: { DRY_SCALP: 4, MOISTURE: 3, SCALP_CARE: 2, BARRIER_SUPPORT: 2 },
  oily: { SCALP_BALANCE: 4, LIGHTWEIGHT: 2, CLARIFYING: 2 },
  sensitive: { SENSITIVE_SCALP: 4, CALMING: 3, BARRIER_SUPPORT: 2 },
  itchy: { ITCH_RELIEF: 5, CALMING: 2, SCALP_CARE: 2, DANDRUFF_SUPPORT: 2 },
};

const HAIR_TYPE_TAG_WEIGHTS: Record<string, Record<string, number>> = {
  straight: { LIGHTWEIGHT: 2, SHINE: 1 },
  wavy: { FRIZZ_CONTROL: 2, MOISTURE: 2, LIGHTWEIGHT: 1 },
  curly: { MOISTURE: 3, ELASTICITY: 2, FRIZZ_CONTROL: 2 },
  coily: { DEEP_MOISTURE: 4, STRENGTH: 2, ELASTICITY: 2, REPAIR: 1 },
};

const DESCRIPTION_KEYWORDS: Record<string, string[]> = {
  growth: ["growth", "stimulat", "follic", "breakage"],
  moisture: ["moist", "hydrat", "barrier", "nourish"],
  scalp: ["scalp", "itch", "dandruff", "clarify", "balanc"],
  shine: ["shine", "frizz", "smooth"],
  repair: ["repair", "strength", "elastic"],
};

function normalizeText(value: string | undefined | null): string {
  return String(value ?? "").toLowerCase();
}

function mergeWeights(
  target: Record<string, number>,
  extra: Record<string, number> | undefined,
) {
  if (!extra) return;
  for (const tag in extra) {
    const weight = extra[tag];
    target[tag] = (target[tag] ?? 0) + weight;
  }
}

function keywordHintsFromAnswers(answers: QuizAnswers): string[] {
  const hints: string[] = [];
  if (answers.goal) hints.push(answers.goal);
  if (answers.scalpCondition) hints.push("scalp");
  if (answers.porosity === "high") hints.push("repair", "moisture");
  if (answers.hairType === "coily" || answers.hairType === "curly") {
    hints.push("moisture", "repair");
  }
  return [...new Set(hints)];
}

function parseAvoidTerms(raw: string): string[] {
  return raw
    .toLowerCase()
    .split(/[;,/\n]+/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 3);
}

function formatTagTitle(tag: string): string {
  return tag
    .split("_")
    .map((part) => {
      const lower = part.toLowerCase();
      return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
    })
    .join(" ");
}

function inferPriorities(tagWeights: Record<string, number>): string[] {
  return Object.keys(tagWeights)
    .sort((a, b) => (tagWeights[b] ?? 0) - (tagWeights[a] ?? 0))
    .slice(0, 4)
    .map((tag) => TAG_LABELS[tag] ?? formatTagTitle(tag));
}

function profileTitle(answers: QuizAnswers): string {
  const hairTypeLabel = answers.hairType
    ? `${answers.hairType.charAt(0).toUpperCase()}${answers.hairType.slice(1)}`
    : "Personalized";
  const goalLabel = answers.goal ? answers.goal.replace("-", " ") : "care";
  return `${hairTypeLabel} Hair ${goalLabel.charAt(0).toUpperCase()}${goalLabel.slice(1)} Profile`;
}

function profileSummary(answers: QuizAnswers, priorities: string[]): string {
  const porosityText =
    answers.porosity && answers.porosity !== "unknown"
      ? `${answers.porosity} porosity`
      : "mixed porosity";
  const scalpText = answers.scalpCondition || "balanced scalp";
  const topFocus = priorities.slice(0, 2).join(" + ") || "daily nourishment";

  return `Optimized for ${porosityText}, ${scalpText} needs, with emphasis on ${topFocus.toLowerCase()}.`;
}

export function buildQuizRecommendation(
  answers: QuizAnswers,
  oils: QuizOilCatalogItem[],
): QuizRecommendationResult {
  const tagWeights: Record<string, number> = {};
  mergeWeights(tagWeights, GOAL_TAG_WEIGHTS[answers.goal]);
  mergeWeights(tagWeights, POROSITY_TAG_WEIGHTS[answers.porosity]);
  mergeWeights(tagWeights, SCALP_TAG_WEIGHTS[answers.scalpCondition]);
  mergeWeights(tagWeights, HAIR_TYPE_TAG_WEIGHTS[answers.hairType]);

  const keywordHints = keywordHintsFromAnswers(answers);
  const avoidTerms = parseAvoidTerms(answers.ingredientNotes);

  const scored = oils
    .map((oil) => {
      const oilType = String(oil.oil_type ?? "").toUpperCase();
      const tags = (oil.tags ?? []).map((tag) => tag.toUpperCase());
      const text = normalizeText(`${oil.name} ${oil.description}`);

      const blocked = avoidTerms.some((term) => text.includes(term));
      if (blocked) {
        return { ...oil, oil_type: oilType, score: -999 };
      }

      const tagScore = tags.reduce(
        (sum, tag) => sum + (tagWeights[tag] ?? 0),
        0,
      );

      const keywordScore = keywordHints.reduce((sum, hint) => {
        const stems = DESCRIPTION_KEYWORDS[hint] ?? [];
        const stemHits = stems.reduce(
          (hits, stem) => hits + (text.includes(stem) ? 1 : 0),
          0,
        );
        return sum + stemHits;
      }, 0);

      const descriptionBonus =
        text.includes("hair") || text.includes("scalp") ? 0.5 : 0;

      const score = tagScore + keywordScore + descriptionBonus;
      return {
        id: oil.id,
        name: oil.name,
        oil_type: oilType,
        score,
      };
    })
    .filter((oil) => oil.score > -500)
    .sort((a, b) => b.score - a.score);

  const byType = {
    base: scored.filter((oil) => oil.oil_type === "BASE"),
    secondary: scored.filter((oil) => oil.oil_type === "SECONDARY"),
    addOn: scored.filter(
      (oil) => oil.oil_type === "OTHER" || oil.oil_type === "PREMIUM",
    ),
  };

  const baseOilIds = byType.base.slice(0, 2).map((oil) => oil.id);
  const secondaryOilIds = byType.secondary.slice(0, 3).map((oil) => oil.id);
  const addOnOilIds = byType.addOn.slice(0, 2).map((oil) => oil.id);

  const priorities = inferPriorities(tagWeights);
  const title = profileTitle(answers);
  const summary = profileSummary(answers, priorities);

  const blendNameSuggestion =
    `${answers.goal ? answers.goal.replace("-", " ") : "custom"} focus blend`.replace(
      /\b\w/g,
      (char) => char.toUpperCase(),
    );

  const blendDescriptionSuggestion = `Quiz-guided blend for ${answers.hairType || "personalized"} hair with ${answers.porosity || "balanced"} porosity, focused on ${
    priorities.slice(0, 2).join(" and ") || "nourishment"
  }.`;

  return {
    profile: {
      title,
      summary,
      priorities,
      suggestedProductType: "HAIR_OIL",
      recommendedCategory: "CUSTOM",
      recommendedBottleSize: "120mL",
    },
    suggestions: {
      baseOilIds,
      secondaryOilIds,
      addOnOilIds,
      baseRecommendations: byType.base.slice(0, 2),
      secondaryRecommendations: byType.secondary.slice(0, 3),
      addOnRecommendations: byType.addOn.slice(0, 2),
      topMatches: scored.slice(0, 6),
      blendNameSuggestion,
      blendDescriptionSuggestion,
    },
  };
}
