import { formatGrams, OIL_DENSITY_G_PER_ML } from "./utils";
import dropperBottleImage from "../../assets/dropper-bottle.png";
import brushBottleImage from "../../assets/brush-bottle.jpg";

const ESSENTIAL_DILUTION_GRAMS = {
  STANDARD: 0.5,
  INTENSE: 1,
} as const;

function getStackedSegments(
  segments: Array<{ label: string; ml: number; color: string }>,
  capacity: number,
) {
  let runningBottom = 0;
  return segments.map((segment) => {
    const percent = Math.max(segment.ml, 0) / capacity;
    const heightPercent = percent * 100;
    const bottom = runningBottom;
    runningBottom += heightPercent;
    return {
      ...segment,
      bottom,
      heightPercent,
    };
  });
}

function BottleFillVisual({
  bottleType,
  segments,
}: {
  bottleType: string;
  segments: Array<{
    label: string;
    color: string;
    bottom: number;
    heightPercent: number;
  }>;
}) {
  const bottleClassName =
    bottleType === "BRUSH"
      ? "volume-bottle-visual volume-bottle-visual--brush"
      : "volume-bottle-visual volume-bottle-visual--dropper";

  return (
    <div
      className={bottleClassName}
      role="img"
      aria-label={
        bottleType === "DROPPER"
          ? "Dropper bottle volume overlay"
          : "Brush bottle volume overlay"
      }
    >
      <img
        className="volume-bottle-image"
        src={bottleType === "BRUSH" ? brushBottleImage : dropperBottleImage}
        alt=""
        aria-hidden="true"
      />
      <div className="volume-overlay-window" aria-hidden="true">
        {segments.map((s) => (
          <div
            key={s.label}
            className="volume-overlay-segment"
            style={{
              bottom: `${s.bottom}%`,
              height: `${Math.max(0, s.heightPercent)}%`,
              background: s.color,
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface VolumeBarProps {
  baseVol: number;
  secVol: number;
  premiumAddOnVol: number;
  essentialAddOnCount: number;
  premiumAddOnCount: number;
  essentialDilution: "STANDARD" | "INTENSE";
  totalCapacity: number;
  bottleType: string;
  selectedSecondaryCount: number;
}

export default function VolumeBar({
  baseVol,
  secVol,
  premiumAddOnVol,
  essentialAddOnCount,
  premiumAddOnCount,
  essentialDilution,
  totalCapacity,
  bottleType,
  selectedSecondaryCount,
}: VolumeBarProps) {
  const essentialGramsPerOil = ESSENTIAL_DILUTION_GRAMS[essentialDilution];
  const essentialTotalGrams = essentialAddOnCount * essentialGramsPerOil;
  const essentialTotalMl = essentialTotalGrams / OIL_DENSITY_G_PER_ML;

  const premiumTotalMl = premiumAddOnCount * premiumAddOnVol;
  const premiumTotalGrams = premiumTotalMl * OIL_DENSITY_G_PER_ML;

  const usedAddOn = essentialTotalMl + premiumTotalMl;
  const secondaryMl = selectedSecondaryCount > 0 ? secVol : 0;
  const basePoolMl = selectedSecondaryCount > 0 ? baseVol : totalCapacity;
  const adjustedBase = basePoolMl - usedAddOn;
  const baseMl = adjustedBase > 0 ? adjustedBase : 0;

  const segments = [
    {
      label: "Base",
      ml: baseMl,
      color: "#9c27b0",
    },
    { label: "Secondary", ml: secondaryMl, color: "#ce93d8" },
    ...(usedAddOn > 0
      ? [{ label: "Add-Ons", ml: usedAddOn, color: "#f3e5f5" }]
      : []),
  ];

  const fillSegments = getStackedSegments(segments, totalCapacity);

  return (
    <div className="volume-bar-wrap">
      <div className="volume-visual-wrap">
        <BottleFillVisual bottleType={bottleType} segments={fillSegments} />
      </div>
      <div className="volume-bar-legend">
        {segments.map((s) => (
          <span key={s.label} className="volume-legend-item">
            <span
              className="volume-legend-dot"
              style={{ background: s.color }}
            />
            {s.label === "Add-Ons"
              ? `${s.label} - ${essentialTotalGrams > 0 ? `${essentialTotalGrams.toFixed(1)} g essential` : ""}${essentialTotalGrams > 0 && premiumTotalGrams > 0 ? " + " : ""}${premiumTotalGrams > 0 ? `${premiumTotalGrams.toFixed(1)} g premium` : ""}`
              : `${s.label} - ${formatGrams(s.ml)}`}
          </span>
        ))}
      </div>
    </div>
  );
}
