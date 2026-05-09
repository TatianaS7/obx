import OilSlotSelect from "./OilSlotSelect";
import VolumeBar from "./VolumeBar";
import { formatGrams, OIL_DENSITY_G_PER_ML } from "./utils";
import { type OilOption } from "./types";

const ESSENTIAL_DILUTION_OPTIONS = {
  STANDARD: { label: "1% - Standard", gramsPerOil: 0.5 },
  INTENSE: { label: "2% - Intense", gramsPerOil: 1 },
} as const;

interface FullyCustomSpec {
  maxAddOns: number;
  baseVol: number;
  secVol: number;
  addOnVol: number;
}

interface FullyCustomBlendSectionProps {
  fcSpec: FullyCustomSpec;
  capacity: number;
  bottleType: string;
  oilsByType: Record<string, OilOption[]>;
  essentialAddOnOptions: OilOption[];
  premiumAddOnOptions: OilOption[];
  allSelectedIds: number[];
  baseSlots: (number | null)[];
  secSlots: (number | null)[];
  essentialAddOnSlots: (number | null)[];
  premiumAddOnSlots: (number | null)[];
  essentialDilution: "STANDARD" | "INTENSE";
  onUpdateSlot: (
    slots: (number | null)[],
    setSlots: (s: (number | null)[]) => void,
    index: number,
    value: number | null,
  ) => void;
  onAddSlot: (
    slots: (number | null)[],
    setSlots: (s: (number | null)[]) => void,
  ) => void;
  onRemoveSlot: (
    slots: (number | null)[],
    setSlots: (s: (number | null)[]) => void,
    index: number,
  ) => void;
  setBaseSlots: (s: (number | null)[]) => void;
  setSecSlots: (s: (number | null)[]) => void;
  setEssentialAddOnSlots: (s: (number | null)[]) => void;
  setPremiumAddOnSlots: (s: (number | null)[]) => void;
  setEssentialDilution: (value: "STANDARD" | "INTENSE") => void;
}

export default function FullyCustomBlendSection({
  fcSpec,
  capacity,
  bottleType,
  oilsByType,
  essentialAddOnOptions,
  premiumAddOnOptions,
  allSelectedIds,
  baseSlots,
  secSlots,
  essentialAddOnSlots,
  premiumAddOnSlots,
  essentialDilution,
  onUpdateSlot,
  onAddSlot,
  onRemoveSlot,
  setBaseSlots,
  setSecSlots,
  setEssentialAddOnSlots,
  setPremiumAddOnSlots,
  setEssentialDilution,
}: FullyCustomBlendSectionProps) {
  const essentialAddOnCount = essentialAddOnSlots.filter(
    (id) => id !== null,
  ).length;
  const premiumAddOnCount = premiumAddOnSlots.filter(
    (id) => id !== null,
  ).length;
  const addOnCount = essentialAddOnCount + premiumAddOnCount;
  const essentialGramsPerOil =
    ESSENTIAL_DILUTION_OPTIONS[essentialDilution].gramsPerOil;
  const essentialAddOnVolumeMl =
    (essentialAddOnCount * essentialGramsPerOil) / OIL_DENSITY_G_PER_ML;
  const premiumAddOnVolumeMl = premiumAddOnCount * fcSpec.addOnVol;
  const usedAddOnVolumeMl = essentialAddOnVolumeMl + premiumAddOnVolumeMl;
  const selectedBaseCount = baseSlots.filter((id) => id !== null).length;
  const selectedSecondaryCount = secSlots.filter((id) => id !== null).length;
  const basePoolMl =
    selectedSecondaryCount > 0
      ? fcSpec.baseVol
      : fcSpec.baseVol + fcSpec.secVol;
  const basePerOil =
    (basePoolMl - usedAddOnVolumeMl) / Math.max(selectedBaseCount, 1);
  const baseLabel = selectedBaseCount > 1 ? "each" : "total";
  const hasRequiredBase = selectedBaseCount > 0;
  const additionalOilCount = selectedSecondaryCount + addOnCount;
  const hasRequiredAdditionalOil = additionalOilCount > 0;
  const meetsMinimumSelection = hasRequiredBase && hasRequiredAdditionalOil;
  const secondaryPerOil =
    selectedSecondaryCount > 0
      ? fcSpec.secVol / Math.max(selectedSecondaryCount, 1)
      : 0;
  const secondaryLabel = selectedSecondaryCount > 1 ? "each" : "total";
  const canAddMoreAddOns = addOnCount < fcSpec.maxAddOns;

  return (
    <>
      <section className="blend-section">
        <div className="blend-section-header">
          <h3 className="blend-section-title">Base Oils</h3>
          <span className="blend-section-badge">
            {formatGrams(basePerOil)} {baseLabel}
          </span>
        </div>
        <p className="blend-section-sub">
          One or more carrier oils - volume split equally among selections.
        </p>
        {baseSlots.map((val, i) => (
          <div key={i} className="slot-row">
            <OilSlotSelect
              label={`Base Oil ${baseSlots.length > 1 ? i + 1 : ""}`}
              options={oilsByType.BASE}
              excludeIds={allSelectedIds.filter((id) => id !== val)}
              value={val}
              onSelect={(id) => onUpdateSlot(baseSlots, setBaseSlots, i, id)}
            />
            {baseSlots.length > 1 && (
              <button
                className="slot-remove-btn"
                onClick={() => onRemoveSlot(baseSlots, setBaseSlots, i)}
                aria-label="Remove slot"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          className="slot-add-btn"
          onClick={() => onAddSlot(baseSlots, setBaseSlots)}
        >
          + Add Base Oil
        </button>
      </section>

      <section className="blend-section">
        <div className="blend-section-header">
          <h3 className="blend-section-title">Secondary Oils</h3>
          <span className="blend-section-badge">
            {formatGrams(secondaryPerOil)} {secondaryLabel}
          </span>
        </div>
        <p className="blend-section-sub">
          Enhancing oils - {formatGrams(fcSpec.secVol)} total, split equally
          among selections.
        </p>
        {!meetsMinimumSelection && (
          <p className="blend-section-sub blend-requirement-note is-invalid">
            Minimum required: 1 base oil + at least 1 additional oil (secondary
            or add-on).
          </p>
        )}
        {secSlots.map((val, i) => (
          <div key={i} className="slot-row">
            <OilSlotSelect
              label={`Secondary Oil ${secSlots.length > 1 ? i + 1 : ""}`}
              options={oilsByType.SECONDARY}
              excludeIds={allSelectedIds.filter((id) => id !== val)}
              value={val}
              onSelect={(id) => onUpdateSlot(secSlots, setSecSlots, i, id)}
            />
            {val !== null && (
              <button
                className="slot-remove-btn"
                onClick={() => onRemoveSlot(secSlots, setSecSlots, i)}
                aria-label="Remove slot"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          className="slot-add-btn"
          onClick={() => onAddSlot(secSlots, setSecSlots)}
        >
          + Add Secondary Oil
        </button>
      </section>

      <section className="blend-section">
        <div className="blend-section-header">
          <h3 className="blend-section-title">Add-On Oils</h3>
          <span className="blend-section-badge">
            Max {fcSpec.maxAddOns} total slots
          </span>
        </div>
        <p className="blend-section-sub">
          Max {fcSpec.maxAddOns} total add-ons across essential and premium -
          displaces base volume.
        </p>
        {!meetsMinimumSelection && (
          <p className="blend-section-sub blend-requirement-note is-invalid">
            Minimum required: 1 base oil + at least 1 additional oil (secondary
            or add-on).
          </p>
        )}

        <h4 className="blend-section-title">Essential Oils</h4>
        <div className="dilution-select-wrap">
          <label className="oil-slot-label" htmlFor="essential-dilution-select">
            Essential Dilution
          </label>
          <select
            id="essential-dilution-select"
            className="oil-slot-select"
            value={essentialDilution}
            onChange={(e) =>
              setEssentialDilution(e.target.value as "STANDARD" | "INTENSE")
            }
          >
            <option value="STANDARD">1% - Standard (0.5 g, $1.50)</option>
            <option value="INTENSE">2% - Intense (1.0 g, $3.00)</option>
          </select>
        </div>
        <p className="blend-section-sub">
          Highly concentrated oils known for targeted benefits. Current setting:{" "}
          {ESSENTIAL_DILUTION_OPTIONS[essentialDilution].label} (
          {essentialGramsPerOil.toFixed(1)}g each).
        </p>
        {essentialAddOnSlots.map((val, i) => (
          <div key={`essential-${i}`} className="slot-row">
            <OilSlotSelect
              label={`Essential Add-On ${essentialAddOnSlots.length > 1 ? i + 1 : ""}`}
              options={essentialAddOnOptions}
              excludeIds={allSelectedIds.filter((id) => id !== val)}
              value={val}
              onSelect={(id) =>
                onUpdateSlot(essentialAddOnSlots, setEssentialAddOnSlots, i, id)
              }
              optional
            />
            <button
              className="slot-remove-btn"
              onClick={() =>
                onRemoveSlot(essentialAddOnSlots, setEssentialAddOnSlots, i)
              }
              aria-label="Remove essential add-on"
            >
              ✕
            </button>
          </div>
        ))}
        {canAddMoreAddOns && (
          <button
            className="slot-add-btn"
            onClick={() =>
              onAddSlot(essentialAddOnSlots, setEssentialAddOnSlots)
            }
          >
            + Add Essential Oil
          </button>
        )}

        <h4 className="blend-section-title add-on-subsection-title-premium">
          Premium Oils
        </h4>
        <p className="blend-section-sub">
          Rare or luxury oils with unique properties.
        </p>
        {premiumAddOnSlots.map((val, i) => (
          <div key={`premium-${i}`} className="slot-row">
            <OilSlotSelect
              label={`Premium Oil ${premiumAddOnSlots.length > 1 ? i + 1 : ""}`}
              options={premiumAddOnOptions}
              excludeIds={allSelectedIds.filter((id) => id !== val)}
              value={val}
              onSelect={(id) =>
                onUpdateSlot(premiumAddOnSlots, setPremiumAddOnSlots, i, id)
              }
              optional
            />
            <button
              className="slot-remove-btn"
              onClick={() =>
                onRemoveSlot(premiumAddOnSlots, setPremiumAddOnSlots, i)
              }
              aria-label="Remove premium add-on"
            >
              ✕
            </button>
          </div>
        ))}
        {canAddMoreAddOns && (
          <button
            className="slot-add-btn"
            onClick={() => onAddSlot(premiumAddOnSlots, setPremiumAddOnSlots)}
          >
            + Add Premium Oil
          </button>
        )}
      </section>

      <section className="blend-section blend-section-volume">
        <h3 className="blend-section-title">Volume Breakdown</h3>
        <p className="full-allowed-volume">
          Full Allowed Volume: <strong>{formatGrams(capacity)}</strong>
        </p>
        <VolumeBar
          baseVol={fcSpec.baseVol}
          secVol={fcSpec.secVol}
          premiumAddOnVol={fcSpec.addOnVol}
          essentialAddOnCount={essentialAddOnCount}
          premiumAddOnCount={premiumAddOnCount}
          essentialDilution={essentialDilution}
          totalCapacity={capacity}
          bottleType={bottleType}
          selectedSecondaryCount={selectedSecondaryCount}
        />
      </section>
    </>
  );
}
