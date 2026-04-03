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
  // if (bottleType === "SQUEEZE") {
  //   return (
  //     <svg
  //       className="volume-bottle-svg"
  //       viewBox="0 0 160 270"
  //       role="img"
  //       aria-label="Squeeze bottle volume breakdown"
  //     >
  //       <defs>
  //         <clipPath id="squeeze-fill-clip">
  //           <path d="M74 16h12l4 16h10v18l14 18v12h8c10 0 18 8 18 18v136c0 11-8 19-19 19H39c-11 0-19-8-19-19V98c0-10 8-18 18-18h8V68l14-18V32h10z" />
  //         </clipPath>
  //       </defs>
  //
  //       <path
  //         d="M74 16h12l4 16h10v18l14 18v12h8c10 0 18 8 18 18v136c0 11-8 19-19 19H39c-11 0-19-8-19-19V98c0-10 8-18 18-18h8V68l14-18V32h10z"
  //         fill="#ffffff"
  //         stroke="#cfcfcf"
  //         strokeWidth="4"
  //       />
  //
  //       <g clipPath="url(#squeeze-fill-clip)">
  //         {segments.map((s) => (
  //           <rect
  //             key={s.label}
  //             x="18"
  //             y={252 - (s.bottom + s.heightPercent) * 1.75}
  //             width="124"
  //             height={Math.max(0, s.heightPercent * 1.75)}
  //             fill={s.color}
  //           />
  //         ))}
  //       </g>
  //
  //       <path d="M78 2h4v14h-4z" fill="#111" />
  //       <circle cx="80" cy="2" r="3" fill="#111" />
  //     </svg>
  //   );
  // }

  return (
    <svg
      className="volume-bottle-svg"
      viewBox="0 0 160 270"
      role="img"
      aria-label="Dropper bottle volume breakdown"
    >
      <defs>
        <clipPath id="dropper-fill-clip">
          <path d="M52 70h56v20h14c10 0 18 8 18 18v126c0 11-8 19-19 19H39c-11 0-19-8-19-19V108c0-10 8-18 18-18h14z" />
        </clipPath>
      </defs>

      <rect x="58" y="4" width="44" height="30" rx="12" fill="#111" />
      <rect x="66" y="30" width="28" height="20" rx="8" fill="#2a2a2a" />
      <path
        d="M80 50c5 7 8 16 8 22 0 6-4 10-8 10s-8-4-8-10c0-6 3-15 8-22z"
        fill="#bdbdbd"
      />
      <path
        d="M52 70h56v20h14c10 0 18 8 18 18v126c0 11-8 19-19 19H39c-11 0-19-8-19-19V108c0-10 8-18 18-18h14z"
        fill="#ffffff"
        stroke="#cfcfcf"
        strokeWidth="4"
      />

      <g clipPath="url(#dropper-fill-clip)">
        {segments.map((s) => (
          <rect
            key={s.label}
            x="18"
            y={252 - (s.bottom + s.heightPercent) * 1.75}
            width="124"
            height={Math.max(0, s.heightPercent * 1.75)}
            fill={s.color}
          />
        ))}
      </g>
    </svg>
  );
}

interface VolumeBarProps {
  baseVol: number;
  secVol: number;
  addOnVol: number;
  addOnCount: number;
  totalCapacity: number;
  bottleType: string;
}

export default function VolumeBar({
  baseVol,
  secVol,
  addOnVol,
  addOnCount,
  totalCapacity,
  bottleType,
}: VolumeBarProps) {
  const usedAddOn = addOnVol * addOnCount;
  const adjustedBase = baseVol - usedAddOn;
  const segments = [
    {
      label: "Base",
      ml: adjustedBase > 0 ? adjustedBase : 0,
      color: "#9c27b0",
    },
    { label: "Secondary", ml: secVol, color: "#ce93d8" },
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
            {s.label} - {s.ml.toFixed(1)} mL
          </span>
        ))}
      </div>
    </div>
  );
}
