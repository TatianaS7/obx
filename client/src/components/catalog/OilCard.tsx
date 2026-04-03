import { OilTag, OIL_TAG_LABELS } from "../../types/OilTag";
import "../../styles/OilCard.css";

interface Oil {
  id: number;
  name: string;
  description: string;
  oil_type: string | { value?: string };
  origin_country?: string | null;
  source?: string | null;
  extraction_method?: string | null;
  tags?: string[];
  is_active?: boolean;
}

interface OilCardProps {
  oil: Oil;
}

export default function OilCard({ oil }: OilCardProps) {
  const oilTypeLabel = (
    typeof oil.oil_type === "object"
      ? (oil.oil_type.value ?? "")
      : String(oil.oil_type)
  ).replace(/_/g, " ");

  const details: { label: string; value: string }[] = [];
  if (oil.origin_country)
    details.push({ label: "Origin", value: oil.origin_country });
  if (oil.source) details.push({ label: "Source", value: oil.source });
  if (oil.extraction_method)
    details.push({ label: "Method", value: oil.extraction_method });

  return (
    <div className="oil-card">
      <div className="oil-card-header">
        <h3 className="oil-card-name">{oil.name}</h3>
        <span className="oil-card-type">{oilTypeLabel}</span>
      </div>
      <p className="oil-card-desc">{oil.description}</p>
      <hr />
      {details.length > 0 && (
        <dl className="oil-card-details">
          {details.map(({ label, value }) => (
            <div key={label} className="oil-card-detail-row">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <hr />
      {oil.tags && oil.tags.length > 0 && (
        <div className="oil-card-tags">
          {oil.tags.map((tag) => (
            <span key={tag} className="oil-card-tag">
              {OIL_TAG_LABELS[tag as OilTag] ?? tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
