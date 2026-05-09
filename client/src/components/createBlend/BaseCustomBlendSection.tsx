import OilSlotSelect from "./OilSlotSelect";
import VolumeBar from "./VolumeBar";
import { formatGrams, secSpec } from "./utils";
import { type OilOption } from "./types";

interface BaseCustomSpec {
  maxSecondary: number;
  maxAddOns: number;
  baseVol: number;
  secVol: number;
  addOnVol: number;
}

interface BaseCustomBlendSectionProps {
  baseSpec: BaseCustomSpec;
  capacity: number;
  bottleType: string;
  oilsByType: Record<string, OilOption[]>;
  addOnOptions: OilOption[];
  allSelectedIds: number[];
  baseSlots: (number | null)[];
  secSlots: (number | null)[];
  addOnSlots: (number | null)[];
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
  setAddOnSlots: (s: (number | null)[]) => void;
}

export default function BaseCustomBlendSection({
  baseSpec,
  capacity,
  bottleType,
  oilsByType,
  addOnOptions,
  allSelectedIds,
  baseSlots,
  secSlots,
  addOnSlots,
  onUpdateSlot,
  onAddSlot,
  onRemoveSlot,
  setBaseSlots,
  setSecSlots,
  setAddOnSlots,
}: BaseCustomBlendSectionProps) {
  const addOnCount = addOnSlots.filter((id) => id !== null).length;
  const selectedSecondaryCount = secSlots.filter((id) => id !== null).length;
  const secondaryAmount =
    selectedSecondaryCount > 0
      ? secSpec(baseSpec.secVol, selectedSecondaryCount)
      : baseSpec.secVol;
  const secondaryLabel = selectedSecondaryCount > 1 ? "each" : "total";

  return (
    <>
      <section className="blend-section">
        <div className="blend-section-header">
          <h3 className="blend-section-title">Base Oil</h3>
          <span className="blend-section-badge">
            {formatGrams(baseSpec.baseVol - addOnCount * baseSpec.addOnVol)}
          </span>
        </div>
        <p className="blend-section-sub">
          Your primary carrier oil. Forms the foundation of your blend.
        </p>
        <OilSlotSelect
          label="Base Oil"
          options={oilsByType.BASE}
          excludeIds={allSelectedIds.filter((id) => id !== baseSlots[0])}
          value={baseSlots[0]}
          onSelect={(id) => onUpdateSlot(baseSlots, setBaseSlots, 0, id)}
        />
      </section>

      <section className="blend-section">
        <div className="blend-section-header">
          <h3 className="blend-section-title">Secondary Oils</h3>
          <span className="blend-section-badge">
            {formatGrams(secondaryAmount)} {secondaryLabel}
          </span>
        </div>
        <p className="blend-section-sub">
          Up to {baseSpec.maxSecondary} oil
          {baseSpec.maxSecondary > 1 ? "s" : ""} - volume split equally between
          selections.
        </p>
        {secSlots.map((val, i) => (
          <div key={i} className="slot-row">
            <OilSlotSelect
              label={`Secondary Oil ${secSlots.length > 1 ? i + 1 : ""}`}
              options={oilsByType.SECONDARY}
              excludeIds={allSelectedIds.filter((id) => id !== val)}
              value={val}
              onSelect={(id) => onUpdateSlot(secSlots, setSecSlots, i, id)}
            />
            {secSlots.length > 1 && (
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
        {secSlots.length < baseSpec.maxSecondary && (
          <button
            className="slot-add-btn"
            onClick={() => onAddSlot(secSlots, setSecSlots)}
          >
            + Add Secondary Oil
          </button>
        )}
      </section>

      <section className="blend-section">
        <div className="blend-section-header">
          <h3 className="blend-section-title">Add-On</h3>
          <span className="blend-section-badge">
            {formatGrams(baseSpec.addOnVol)} each
          </span>
        </div>
        <p className="blend-section-sub">
          Optional enhancement oil. Max {baseSpec.maxAddOns} - displaces base
          oil volume.
        </p>
        {addOnSlots.map((val, i) => (
          <div key={i} className="slot-row">
            <OilSlotSelect
              label={`Add-On ${addOnSlots.length > 1 ? i + 1 : ""}`}
              options={addOnOptions}
              excludeIds={allSelectedIds.filter((id) => id !== val)}
              value={val}
              onSelect={(id) => onUpdateSlot(addOnSlots, setAddOnSlots, i, id)}
              optional
            />
            <button
              className="slot-remove-btn"
              onClick={() => onRemoveSlot(addOnSlots, setAddOnSlots, i)}
              aria-label="Remove add-on"
            >
              ✕
            </button>
          </div>
        ))}
        {addOnSlots.length < baseSpec.maxAddOns && (
          <button
            className="slot-add-btn"
            onClick={() => onAddSlot(addOnSlots, setAddOnSlots)}
          >
            + Add Add-On Oil
          </button>
        )}
      </section>

      <section className="blend-section blend-section-volume">
        <h3 className="blend-section-title">Volume Breakdown</h3>
        <p className="full-allowed-volume">
          Full Allowed Volume: <strong>{formatGrams(capacity)}</strong>
        </p>
        <VolumeBar
          baseVol={baseSpec.baseVol}
          secVol={baseSpec.secVol}
          premiumAddOnVol={baseSpec.addOnVol}
          essentialAddOnCount={0}
          premiumAddOnCount={addOnCount}
          essentialDilution="STANDARD"
          totalCapacity={capacity}
          bottleType={bottleType}
          selectedSecondaryCount={0}
        />
      </section>
    </>
  );
}
