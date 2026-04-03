/**
 * Canonical tag enum for oils.
 * Values must match `OilTag` in server/_types/oils.py exactly.
 * Use these constants anywhere tags are referenced (filtering, blend logic, display).
 */
export enum OilTag {
  // ── Hydration ────────────────────────────────────────────────────────────
  /** General hydration. Replaces: moisture, hydration */
  MOISTURE = "MOISTURE",
  /** Intensive / heavy hydration. Replaces: deep-moisture */
  DEEP_MOISTURE = "DEEP_MOISTURE",

  // ── Hair Growth & Structure ───────────────────────────────────────────────
  GROWTH = "GROWTH",
  STRENGTH = "STRENGTH",
  /** Reduces breakage. Replaces: breakage-support */
  BREAKAGE_SUPPORT = "BREAKAGE_SUPPORT",
  /** Improves stretch and resilience */
  ELASTICITY = "ELASTICITY",

  // ── Hair Appearance ───────────────────────────────────────────────────────
  SHINE = "SHINE",
  /** Tames frizz. Replaces: frizz-control */
  FRIZZ_CONTROL = "FRIZZ_CONTROL",
  /** Softens and smooths. Replaces: softness, conditioning */
  CONDITIONING = "CONDITIONING",

  // ── Scalp Health ─────────────────────────────────────────────────────────
  /** General scalp nourishment. Replaces: scalp-care, scalp-health, scalp-soothing */
  SCALP_CARE = "SCALP_CARE",
  /** Regulates sebum / oil production. Replaces: scalp-balance */
  SCALP_BALANCE = "SCALP_BALANCE",
  /** Promotes blood circulation. Replaces: scalp-stimulating */
  SCALP_STIMULATING = "SCALP_STIMULATING",
  /** Soothes itchy scalp. Replaces: itch-relief */
  ITCH_RELIEF = "ITCH_RELIEF",
  /** Targets scalp dryness. Replaces: dry-scalp */
  DRY_SCALP = "DRY_SCALP",
  /** For sensitive scalps. Replaces: sensitive-scalp */
  SENSITIVE_SCALP = "SENSITIVE_SCALP",
  /** Anti-dandruff. Replaces: dandruff-support */
  DANDRUFF_SUPPORT = "DANDRUFF_SUPPORT",

  // ── Repair & Protection ───────────────────────────────────────────────────
  REPAIR = "REPAIR",
  ANTIOXIDANT = "ANTIOXIDANT",
  /** Strengthens protective barrier. Replaces: barrier-support, protective-barrier */
  BARRIER_SUPPORT = "BARRIER_SUPPORT",
  /** Delivers vitamins / nutrients */
  NOURISHING = "NOURISHING",

  // ── Sensory & Cleansing ───────────────────────────────────────────────────
  /** Fast-absorbing, non-greasy */
  LIGHTWEIGHT = "LIGHTWEIGHT",
  /** Cooling sensation. Replaces: cooling, refreshing */
  COOLING = "COOLING",
  /** Reduces irritation and inflammation */
  CALMING = "CALMING",
  /** Cleanses / purifies scalp */
  CLARIFYING = "CLARIFYING",
}

/** Human-readable label for each tag, grouped by category for display purposes. */
export const OIL_TAG_LABELS: Record<OilTag, string> = {
  [OilTag.MOISTURE]: "Moisture",
  [OilTag.DEEP_MOISTURE]: "Deep Moisture",
  [OilTag.GROWTH]: "Growth",
  [OilTag.STRENGTH]: "Strength",
  [OilTag.BREAKAGE_SUPPORT]: "Breakage Support",
  [OilTag.ELASTICITY]: "Elasticity",
  [OilTag.SHINE]: "Shine",
  [OilTag.FRIZZ_CONTROL]: "Frizz Control",
  [OilTag.CONDITIONING]: "Conditioning",
  [OilTag.SCALP_CARE]: "Scalp Care",
  [OilTag.SCALP_BALANCE]: "Scalp Balance",
  [OilTag.SCALP_STIMULATING]: "Scalp Stimulating",
  [OilTag.ITCH_RELIEF]: "Itch Relief",
  [OilTag.DRY_SCALP]: "Dry Scalp",
  [OilTag.SENSITIVE_SCALP]: "Sensitive Scalp",
  [OilTag.DANDRUFF_SUPPORT]: "Dandruff Support",
  [OilTag.REPAIR]: "Repair",
  [OilTag.ANTIOXIDANT]: "Antioxidant",
  [OilTag.BARRIER_SUPPORT]: "Barrier Support",
  [OilTag.NOURISHING]: "Nourishing",
  [OilTag.LIGHTWEIGHT]: "Lightweight",
  [OilTag.COOLING]: "Cooling",
  [OilTag.CALMING]: "Calming",
  [OilTag.CLARIFYING]: "Clarifying",
};

/** Ordered tag groups for category-aware UI (e.g. filter panels, blend logic). */
export const OIL_TAG_GROUPS: { label: string; tags: OilTag[] }[] = [
  {
    label: "Hydration",
    tags: [OilTag.MOISTURE, OilTag.DEEP_MOISTURE],
  },
  {
    label: "Growth & Structure",
    tags: [
      OilTag.GROWTH,
      OilTag.STRENGTH,
      OilTag.BREAKAGE_SUPPORT,
      OilTag.ELASTICITY,
    ],
  },
  {
    label: "Appearance",
    tags: [OilTag.SHINE, OilTag.FRIZZ_CONTROL, OilTag.CONDITIONING],
  },
  {
    label: "Scalp Health",
    tags: [
      OilTag.SCALP_CARE,
      OilTag.SCALP_BALANCE,
      OilTag.SCALP_STIMULATING,
      OilTag.ITCH_RELIEF,
      OilTag.DRY_SCALP,
      OilTag.SENSITIVE_SCALP,
      OilTag.DANDRUFF_SUPPORT,
    ],
  },
  {
    label: "Repair & Protection",
    tags: [
      OilTag.REPAIR,
      OilTag.ANTIOXIDANT,
      OilTag.BARRIER_SUPPORT,
      OilTag.NOURISHING,
    ],
  },
  {
    label: "Sensory & Cleansing",
    tags: [
      OilTag.LIGHTWEIGHT,
      OilTag.COOLING,
      OilTag.CALMING,
      OilTag.CLARIFYING,
    ],
  },
];
