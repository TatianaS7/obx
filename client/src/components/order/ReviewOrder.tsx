import { useMemo } from "react";
import { useApi } from "../../api/ApiContext";
import { type BlendData } from "./CreateBlend";
import "../../styles/ReviewOrder.css";

interface NewBlendCard {
  name: string;
  description: string;
  product_type: string;
  category: string;
  bottle_size: string;
  bottle_type: string;
}

interface ReviewOrderProps {
  newBlendCard: NewBlendCard;
  blendData: BlendData;
  onEditStep: (stepIndex: number) => void;
}

function formatSpecValue(value: string) {
  if (!value) return "Not selected";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ReviewOrder({
  newBlendCard,
  blendData,
  onEditStep,
}: ReviewOrderProps) {
  const { allOils } = useApi();

  const oilMap = useMemo(() => {
    const map = new Map<number, { name: string; oil_type: string }>();
    allOils.forEach((oil) => {
      const oilType =
        typeof oil.oil_type === "object"
          ? (oil.oil_type.value ?? String(oil.oil_type))
          : String(oil.oil_type);
      map.set(oil.id, { name: oil.name, oil_type: oilType });
    });
    return map;
  }, [allOils]);

  const grouped = useMemo(() => {
    const groups: Record<string, string[]> = {
      BASE: [],
      SECONDARY: [],
      OTHER: [],
      PREMIUM: [],
    };
    blendData.oils.forEach((o) => {
      const name = oilMap.get(o.oil_id)?.name ?? `Oil #${o.oil_id}`;
      if (!groups[o.oil_type]) groups[o.oil_type] = [];
      groups[o.oil_type].push(name);
    });
    return groups;
  }, [blendData, oilMap]);

  const fullAllowedVolume = parseInt(newBlendCard.bottle_size) || 60;

  return (
    <div className="review-order">
      <section className="review-card">
        <h3>Review Order</h3>
        <p>Confirm your selections before submitting your blend.</p>
      </section>

      <section className="review-card">
        <div className="review-card-header">
          <h4>Product Specifications</h4>
          <button className="review-edit-btn" onClick={() => onEditStep(1)}>
            Edit
          </button>
        </div>
        <div className="review-grid">
          <div>
            <span className="review-label">Product Type</span>
            <span className="review-value">
              {formatSpecValue(newBlendCard.product_type)}
            </span>
          </div>
          <div>
            <span className="review-label">Blend Category</span>
            <span className="review-value">
              {formatSpecValue(newBlendCard.category)}
            </span>
          </div>
          <div>
            <span className="review-label">Bottle Type</span>
            <span className="review-value">
              {formatSpecValue(newBlendCard.bottle_type)}
            </span>
          </div>
          <div>
            <span className="review-label">Bottle Size</span>
            <span className="review-value">
              {newBlendCard.bottle_size || "Not selected"}
            </span>
          </div>
        </div>
        <p className="review-capacity">
          Full Allowed Volume: <strong>{fullAllowedVolume} mL</strong>
        </p>
      </section>

      <section className="review-card">
        <div className="review-card-header">
          <h4>Blend Details</h4>
          <button className="review-edit-btn" onClick={() => onEditStep(2)}>
            Edit
          </button>
        </div>
        <div className="review-stack">
          <div>
            <span className="review-label">Blend Name</span>
            <span className="review-value">
              {blendData.name || "Untitled blend"}
            </span>
          </div>
          <div>
            <span className="review-label">Description</span>
            <span className="review-value">
              {blendData.description || "No description"}
            </span>
          </div>
        </div>
      </section>

      <section className="review-card">
        <div className="review-card-header">
          <h4>Selected Oils</h4>
          <button className="review-edit-btn" onClick={() => onEditStep(2)}>
            Edit
          </button>
        </div>
        <div className="review-oils-grid">
          <div className="review-oils-col">
            <span className="review-label">Base Oils</span>
            <ul>
              {grouped.BASE.length > 0 ? (
                grouped.BASE.map((name) => <li key={name}>{name}</li>)
              ) : (
                <li>None selected</li>
              )}
            </ul>
          </div>
          <div className="review-oils-col">
            <span className="review-label">Secondary Oils</span>
            <ul>
              {grouped.SECONDARY.length > 0 ? (
                grouped.SECONDARY.map((name) => <li key={name}>{name}</li>)
              ) : (
                <li>None selected</li>
              )}
            </ul>
          </div>
          <div className="review-oils-col">
            <span className="review-label">Add-On Oils</span>
            <ul>
              {[...grouped.OTHER, ...grouped.PREMIUM].length > 0 ? (
                [...grouped.OTHER, ...grouped.PREMIUM].map((name) => (
                  <li key={name}>{name}</li>
                ))
              ) : (
                <li>None selected</li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
