import OilSlotSelect from "./OilSlotSelect";
import VolumeBar from "./VolumeBar";
import { type OilOption } from "./types";

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

export default function FullyCustomBlendSection({
  fcSpec,
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
}: FullyCustomBlendSectionProps) {
  const addOnCount = addOnSlots.filter((id) => id !== null).length;

  return (
    <>
      <section className="blend-section">
        <div className="blend-section-header">
          <h3 className="blend-section-title">Base Oils</h3>
          <span className="blend-section-badge">
            {(fcSpec.baseVol - addOnCount * fcSpec.addOnVol).toFixed(1)} mL
            total
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
            {(
              fcSpec.secVol /
              Math.max(secSlots.filter((id) => id !== null).length, 1)
            ).toFixed(1)}{" "}
            mL each
          </span>
        </div>
        <p className="blend-section-sub">
          Enhancing oils - {fcSpec.secVol} mL total, split equally among
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
          <span className="blend-section-badge">{fcSpec.addOnVol} mL each</span>
        </div>
        <p className="blend-section-sub">
          Premium or specialty oils. Max {fcSpec.maxAddOns} - displaces base
          volume.
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
        {addOnSlots.length < fcSpec.maxAddOns && (
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
          Full Allowed Volume: <strong>{capacity} mL</strong>
        </p>
        <VolumeBar
          baseVol={fcSpec.baseVol}
          secVol={fcSpec.secVol}
          addOnVol={fcSpec.addOnVol}
          addOnCount={addOnCount}
          totalCapacity={capacity}
          bottleType={bottleType}
        />
      </section>
    </>
  );
}
