import { useEffect, useMemo } from "react";
import { useApi } from "../../api/ApiContext";
import type { NewBlendCard } from "../createBlend/types";

interface PremadeBlendSelectionProps {
  newBlendCard: NewBlendCard;
}

interface PremadeBlendCard {
  id: number;
  name?: string;
  description?: string;
  product_type?: string;
  bottle_size?: string;
  is_premade?: boolean;
}

export default function PremadeBlendSelection({
  newBlendCard,
}: PremadeBlendSelectionProps) {
  const { allBlendCards, fetchBlendCards, loading } = useApi();

  useEffect(() => {
    if (allBlendCards.length === 0) {
      fetchBlendCards();
    }
  }, [allBlendCards.length, fetchBlendCards]);

  const normalizedProductType =
    newBlendCard.product_type === "HAIR_OIL"
      ? "HAIR"
      : newBlendCard.product_type === "CUTICLE_OIL"
        ? "CUTICLE"
        : newBlendCard.product_type;

  const premadeBlends = useMemo(() => {
    return (allBlendCards as PremadeBlendCard[]).filter((blend) => {
      if (!blend.is_premade) return false;

      const sameProductType =
        !normalizedProductType || blend.product_type === normalizedProductType;
      const sameBottleSize =
        !newBlendCard.bottle_size ||
        blend.bottle_size === newBlendCard.bottle_size;

      return sameProductType && sameBottleSize;
    });
  }, [allBlendCards, normalizedProductType, newBlendCard.bottle_size]);

  return (
    <div className="create-blend-placeholder">
      <h3>Premade Blends</h3>

      {loading && allBlendCards.length === 0 && (
        <p>Loading premade blends...</p>
      )}

      {!loading && premadeBlends.length === 0 && (
        <p>No premade blends currently match this product and bottle size.</p>
      )}

      {premadeBlends.length > 0 && (
        <div className="premade-blend-grid">
          {premadeBlends.map((blend) => (
            <button
              key={blend.id}
              type="button"
              className="premade-blend-button"
            >
              <span className="premade-blend-title">{blend.name}</span>
              <span className="premade-blend-description">
                {blend.description}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
