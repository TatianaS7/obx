import OilSchema from "../../../server/schemas";
import "../styles/OilCard.css";

interface OilCardProps {
  oil: OilSchema;
}

export default function OilCard({ oil }: OilCardProps) {
  return (
    <div className="oil-card">
      <div className="oil-card-header">
        <h3 className="oil-card-name">{oil.name}</h3>
        <span className="oil-card-type">
          {String(oil.oil_type).replace(/_/g, " ")}
        </span>
      </div>
      <p className="oil-card-desc">{oil.description}</p>
    </div>
  );
}
