import { type OilOption } from "./types";

interface OilSlotSelectProps {
  label: string;
  options: OilOption[];
  excludeIds: number[];
  value: number | null;
  onSelect: (id: number | null) => void;
  optional?: boolean;
}

export default function OilSlotSelect({
  label,
  options,
  excludeIds,
  value,
  onSelect,
  optional,
}: OilSlotSelectProps) {
  const available = options.filter(
    (o) => o.id === value || !excludeIds.includes(o.id),
  );

  return (
    <div className="oil-slot">
      <label className="oil-slot-label">
        {label}
        {optional && <span className="oil-slot-optional"> (optional)</span>}
      </label>
      <select
        className="oil-slot-select"
        value={value ?? ""}
        onChange={(e) =>
          onSelect(e.target.value === "" ? null : Number(e.target.value))
        }
      >
        <option value="">- Select an oil -</option>
        {available.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
      {value && (
        <p className="oil-slot-desc">
          {options.find((o) => o.id === value)?.description}
        </p>
      )}
    </div>
  );
}
