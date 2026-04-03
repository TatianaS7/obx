from enum import Enum
from marshmallow import Schema, fields


class OilType(Enum):
    BASE = "BASE"
    SECONDARY = "SECONDARY"
    OTHER = "OTHER"
    PREMIUM = "PREMIUM"


class OilTag(Enum):
    # ── Hydration ──────────────────────────────────────────────────────────
    MOISTURE        = "MOISTURE"        # general hydration (replaces: moisture, hydration)
    DEEP_MOISTURE   = "DEEP_MOISTURE"   # intensive/heavy hydration (replaces: deep-moisture)

    # ── Hair Growth & Structure ────────────────────────────────────────────
    GROWTH          = "GROWTH"          # stimulates growth
    STRENGTH        = "STRENGTH"        # strengthens strands
    BREAKAGE_SUPPORT = "BREAKAGE_SUPPORT" # reduces breakage (replaces: breakage-support)
    ELASTICITY      = "ELASTICITY"      # improves stretch and resilience

    # ── Hair Appearance ────────────────────────────────────────────────────
    SHINE           = "SHINE"           # adds gloss
    FRIZZ_CONTROL   = "FRIZZ_CONTROL"  # tames frizz (replaces: frizz-control)
    CONDITIONING    = "CONDITIONING"    # softens and smooths (replaces: softness, conditioning)

    # ── Scalp Health ───────────────────────────────────────────────────────
    SCALP_CARE      = "SCALP_CARE"      # general scalp nourishment (replaces: scalp-care, scalp-health, scalp-soothing)
    SCALP_BALANCE   = "SCALP_BALANCE"   # regulates sebum/oil production (replaces: scalp-balance)
    SCALP_STIMULATING = "SCALP_STIMULATING" # promotes circulation (replaces: scalp-stimulating)
    ITCH_RELIEF     = "ITCH_RELIEF"     # soothes itchy scalp (replaces: itch-relief)
    DRY_SCALP       = "DRY_SCALP"       # targets scalp dryness (replaces: dry-scalp)
    SENSITIVE_SCALP = "SENSITIVE_SCALP" # for sensitive scalps (replaces: sensitive-scalp)
    DANDRUFF_SUPPORT = "DANDRUFF_SUPPORT" # anti-dandruff (replaces: dandruff-support)

    # ── Repair & Protection ────────────────────────────────────────────────
    REPAIR          = "REPAIR"          # repairs damaged hair/skin
    ANTIOXIDANT     = "ANTIOXIDANT"     # antioxidant properties
    BARRIER_SUPPORT = "BARRIER_SUPPORT" # strengthens protective barrier (replaces: barrier-support, protective-barrier)
    NOURISHING      = "NOURISHING"      # delivers vitamins/nutrients

    # ── Sensory & Cleansing ────────────────────────────────────────────────
    LIGHTWEIGHT     = "LIGHTWEIGHT"     # fast-absorbing, non-greasy
    COOLING         = "COOLING"         # cooling sensation (replaces: cooling, refreshing)
    CALMING         = "CALMING"         # reduces irritation and inflammation
    CLARIFYING      = "CLARIFYING"      # cleanses/purifies scalp