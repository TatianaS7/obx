import { useEffect, useMemo, useState } from "react";
import { useApi } from "../../api/ApiContext";
import type {
  BlendData,
  NewBlendCard,
  ProfessionalBlendAllocation,
  PremadeBlendOil,
  PremadeBlendSelection,
} from "../createBlend/types";

interface PremadeBlendSelectionProps {
  newBlendCard: NewBlendCard;
  onChange: (data: BlendData) => void;
  onValidationChange?: (isValid: boolean) => void;
}

interface PremadeBlendCard {
  id: number;
  name?: string;
  description?: string;
  product_type?: string;
  bottle_size?: string;
  is_premade?: boolean;
  is_deleted?: boolean;
  oils?: Array<{
    oil_id?: number;
    oil_type?: string;
    oil?: { name?: string } | null;
    name?: string;
  }>;
}

export default function PremadeBlendSelection({
  newBlendCard,
  onChange,
  onValidationChange,
}: PremadeBlendSelectionProps) {
  const { allBlendCards, fetchBlendCards, loading } = useApi();
  const [selectedBlendId, setSelectedBlendId] = useState<number | null>(null);
  const [allocations, setAllocations] = useState<ProfessionalBlendAllocation[]>(
    [],
  );

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
      if (blend.is_deleted) return false;

      const sameProductType =
        !normalizedProductType || blend.product_type === normalizedProductType;
      const sameBottleSize =
        !newBlendCard.bottle_size ||
        blend.bottle_size === newBlendCard.bottle_size;

      return sameProductType && sameBottleSize;
    });
  }, [allBlendCards, normalizedProductType, newBlendCard.bottle_size]);

  const isProfessional = newBlendCard.customer_tier === "PROFESSIONAL";
  const totalQuantity = newBlendCard.quantity || "1";
  const totalQuantityNumber = Number(totalQuantity) || 0;

  useEffect(() => {
    if (!isProfessional) {
      setAllocations([]);
      return;
    }

    setSelectedBlendId(null);
    setAllocations((prev) => {
      if (prev.length > 0) return prev;
      return [
        { blend_id: null, quantity: String(Math.min(6, totalQuantityNumber)) },
      ];
    });
  }, [isProfessional, totalQuantityNumber]);

  useEffect(() => {
    if (isProfessional && allocations.length === 0) {
      setAllocations([
        { blend_id: null, quantity: String(Math.min(6, totalQuantityNumber)) },
      ]);
    }
  }, [allocations.length, isProfessional, totalQuantityNumber]);

  const filledAllocations = useMemo(() => {
    return allocations.filter(
      (allocation) =>
        allocation.blend_id !== null && Boolean(allocation.quantity),
    );
  }, [allocations]);

  const allocatedQuantity = useMemo(() => {
    return filledAllocations.reduce((sum, allocation) => {
      const numericValue = Number(allocation.quantity);
      return Number.isFinite(numericValue) ? sum + numericValue : sum;
    }, 0);
  }, [filledAllocations]);

  const reservedQuantity = useMemo(() => {
    return allocations.reduce((sum, allocation) => {
      const numericValue = Number(allocation.quantity);
      return Number.isFinite(numericValue) ? sum + numericValue : sum;
    }, 0);
  }, [allocations]);

  const allocationMatchesTarget = useMemo(() => {
    if (!isProfessional) return false;
    return (
      reservedQuantity === totalQuantityNumber &&
      allocations.length > 0 &&
      allocations.every((allocation) => allocation.blend_id !== null)
    );
  }, [allocations, isProfessional, reservedQuantity, totalQuantityNumber]);

  const remainingQuantity = Math.max(totalQuantityNumber - reservedQuantity, 0);

  const isInitialSplitLocked =
    allocations.length === 1 && Number(allocations[0]?.quantity ?? 0) >= 6;

  const blendDetails = useMemo(() => {
    return premadeBlends.map((blend) => ({
      ...blend,
      ingredientNames:
        blend.oils
          ?.map((oilEntry) => oilEntry.oil?.name ?? oilEntry.name ?? "")
          .filter(Boolean) ?? [],
      ingredientDetails:
        blend.oils?.map((oilEntry) => ({
          oil_id: oilEntry.oil_id ?? 0,
          oil_type: oilEntry.oil_type ?? "OTHER",
          name: oilEntry.oil?.name ?? oilEntry.name ?? "",
        })) ?? [],
    }));
  }, [premadeBlends]);

  function getAllowedQuantitiesForAllocation(index: number) {
    const otherAllocated = allocations.reduce(
      (sum, allocation, allocationIndex) => {
        if (allocationIndex === index) return sum;
        const numericValue = Number(allocation.quantity);
        return Number.isFinite(numericValue) ? sum + numericValue : sum;
      },
      0,
    );

    const maxQuantity = Math.max(totalQuantityNumber - otherAllocated, 1);
    return Array.from({ length: maxQuantity }, (_, offset) =>
      String(offset + 1),
    );
  }

  useEffect(() => {
    if (isProfessional) {
      const normalizedAllocations = filledAllocations.map((allocation) => {
        const matchedBlend = premadeBlends.find(
          (blend) => blend.id === allocation.blend_id,
        );
        const matchedBlendOils: PremadeBlendOil[] =
          matchedBlend?.oils?.map((oilEntry) => ({
            oil_id: oilEntry.oil_id ?? 0,
            oil_type: oilEntry.oil_type ?? "OTHER",
            name: oilEntry.oil?.name ?? oilEntry.name ?? "",
          })) ?? [];
        return {
          ...allocation,
          blend_name: matchedBlend?.name,
          oils: matchedBlendOils,
        };
      });

      onChange({
        name:
          normalizedAllocations.length > 1
            ? "Professional Premade Split"
            : (normalizedAllocations[0]?.blend_name ?? ""),
        description:
          normalizedAllocations.length > 0
            ? normalizedAllocations
                .map(
                  (allocation) =>
                    `${allocation.quantity} x ${allocation.blend_name ?? "Unassigned blend"}`,
                )
                .join(", ")
            : "",
        oils: [],
        premade_blend_id: null,
        professional_allocations: normalizedAllocations,
        premade_blend_oils: normalizedAllocations,
      });
      onValidationChange?.(allocationMatchesTarget);
      return;
    }

    const selectedBlend = premadeBlends.find(
      (blend) => blend.id === selectedBlendId,
    );
    const selectedBlendOils: PremadeBlendOil[] =
      selectedBlend?.oils?.map((oilEntry) => ({
        oil_id: oilEntry.oil_id ?? 0,
        oil_type: oilEntry.oil_type ?? "OTHER",
        name: oilEntry.oil?.name ?? oilEntry.name ?? "",
      })) ?? [];
    onChange({
      name: selectedBlend?.name ?? "",
      description: selectedBlend?.description ?? "",
      oils: [],
      premade_blend_id: selectedBlend?.id ?? null,
      professional_allocations: [],
      premade_blend_oils: selectedBlend
        ? [
            {
              blend_id: selectedBlend.id,
              blend_name: selectedBlend.name,
              quantity: "1",
              oils: selectedBlendOils,
            },
          ]
        : [],
    });
    onValidationChange?.(selectedBlendId !== null);
  }, [
    allocationMatchesTarget,
    filledAllocations,
    isProfessional,
    onChange,
    onValidationChange,
    premadeBlends,
    selectedBlendId,
  ]);

  function updateAllocation(
    index: number,
    patch: Partial<ProfessionalBlendAllocation>,
  ) {
    setAllocations((prev) =>
      prev.map((allocation, allocationIndex) =>
        allocationIndex === index ? { ...allocation, ...patch } : allocation,
      ),
    );
  }

  function addAllocationRow() {
    if (remainingQuantity < 1) return;

    setAllocations((prev) => [...prev, { blend_id: null, quantity: "1" }]);
  }

  function removeAllocationRow(index: number) {
    setAllocations((prev) =>
      prev.filter((_, allocationIndex) => allocationIndex !== index),
    );
  }

  function stepAllocationQuantity(index: number, direction: -1 | 1) {
    setAllocations((prev) =>
      prev.map((allocation, allocationIndex) => {
        if (allocationIndex !== index) return allocation;

        if (allocationIndex === 0 && direction === 1 && isInitialSplitLocked) {
          return allocation;
        }

        const allowedQuantities = getAllowedQuantitiesForAllocation(index);
        if (allowedQuantities.length === 0) return allocation;

        const currentIndex = Math.max(
          allowedQuantities.indexOf(allocation.quantity),
          0,
        );
        const nextIndex = Math.min(
          Math.max(currentIndex + direction, 0),
          allowedQuantities.length - 1,
        );

        return {
          ...allocation,
          quantity: allowedQuantities[nextIndex] ?? allocation.quantity,
        };
      }),
    );
  }

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
        <>
          {!isProfessional && (
            <div className="premade-blend-grid">
              {blendDetails.map((blend) => (
                <button
                  key={blend.id}
                  type="button"
                  className={`premade-blend-button${selectedBlendId === blend.id ? " is-selected" : ""}`}
                  onClick={() => setSelectedBlendId(blend.id)}
                >
                  <span className="premade-blend-title">{blend.name}</span>
                  <span className="premade-blend-description">
                    {blend.description}
                  </span>
                  <span className="premade-blend-ingredients-label">
                    Ingredients
                  </span>
                  <span className="premade-blend-ingredients-text">
                    {blend.ingredientNames.length > 0
                      ? blend.ingredientNames.map((name) => (
                          <span
                            className="oil-card-tag"
                            style={{ marginRight: "0.35rem" }}
                            key={name}
                          >
                            {name}
                          </span>
                        ))
                      : "Ingredient details coming soon."}
                  </span>
                </button>
              ))}
            </div>
          )}

          {isProfessional && (
            <div className="premade-selection-layout">
              <aside className="premade-details-panel">
                <h4 className="premade-details-title">Blend Details</h4>
                <div className="premade-details-list">
                  {blendDetails.map((blend) => (
                    <article key={blend.id} className="premade-details-card">
                      <h5>{blend.name}</h5>
                      <p>{blend.description}</p>
                      <div className="premade-details-ingredients">
                        <span className="premade-details-label">
                          Ingredients
                        </span>
                        <p>
                          {blend.ingredientNames.length > 0
                            ? blend.ingredientNames.join(", ")
                            : "Ingredient details coming soon."}
                        </p>
                        {blend.ingredientDetails.length > 0 && (
                          <ul className="premade-details-ingredient-list">
                            {blend.ingredientDetails.map((ingredient) => (
                              <li key={`${blend.id}-${ingredient.oil_id}`}>
                                {ingredient.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </aside>

              <div className="premade-selection-main">
                <section className="blend-section premade-split-section">
                  <div className="blend-section-header">
                    <h4 className="blend-section-title">
                      Split Quantity By Blend
                    </h4>
                    <span className="blend-section-badge">
                      Total {totalQuantity}
                    </span>
                  </div>
                  <p className="blend-section-sub">
                    Allocate your professional production run across one or more
                    premade blends.
                  </p>
                  {allocations.map((allocation, index) => (
                    <div
                      key={index}
                      className="slot-row premade-allocation-row"
                    >
                      {(() => {
                        const allowedQuantities =
                          getAllowedQuantitiesForAllocation(index);
                        const currentQuantityIndex = Math.max(
                          allowedQuantities.indexOf(allocation.quantity),
                          0,
                        );

                        return (
                          <>
                            <div className="oil-slot">
                              <label className="oil-slot-label">
                                Blend {index + 1}
                              </label>
                              <select
                                className="oil-slot-select"
                                value={allocation.blend_id ?? ""}
                                onChange={(e) =>
                                  updateAllocation(index, {
                                    blend_id: e.target.value
                                      ? Number(e.target.value)
                                      : null,
                                  })
                                }
                              >
                                <option value="">Select a premade blend</option>
                                {premadeBlends.map((blend) => (
                                  <option key={blend.id} value={blend.id}>
                                    {blend.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="oil-slot premade-allocation-qty">
                              <label className="oil-slot-label">Quantity</label>
                              <div
                                className="premade-quantity-stepper"
                                aria-label="Allocation quantity"
                              >
                                <button
                                  type="button"
                                  className="premade-quantity-btn"
                                  onClick={() =>
                                    stepAllocationQuantity(index, -1)
                                  }
                                  disabled={currentQuantityIndex <= 0}
                                  aria-label="Decrease quantity"
                                >
                                  -
                                </button>
                                <span className="premade-quantity-value">
                                  {allocation.quantity}
                                </span>
                                <button
                                  type="button"
                                  className="premade-quantity-btn"
                                  onClick={() =>
                                    stepAllocationQuantity(index, 1)
                                  }
                                  disabled={
                                    (index === 0 && isInitialSplitLocked) ||
                                    currentQuantityIndex >=
                                      allowedQuantities.length - 1
                                  }
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            {allocations.length > 1 && (
                              <button
                                type="button"
                                className="slot-remove-btn"
                                onClick={() => removeAllocationRow(index)}
                                aria-label="Remove blend allocation"
                              >
                                ✕
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="slot-add-btn"
                    onClick={addAllocationRow}
                    disabled={remainingQuantity < 1 || isInitialSplitLocked}
                  >
                    + Add Blend Allocation
                  </button>
                  <p
                    className={`blend-section-sub premade-split-status${allocationMatchesTarget ? " is-valid" : " is-invalid"}`}
                  >
                    {`Allocated ${reservedQuantity} of ${totalQuantity} units.`}
                  </p>
                </section>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
