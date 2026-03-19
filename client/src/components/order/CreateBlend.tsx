import { useState, useEffect, useMemo } from "react";
import { useApi } from "../../api/ApiContext";
import ProductSpecOverview from "../createBlend/ProductSpecOverview";
import BlendIdentitySection from "../createBlend/BlendIdentitySection";
import BaseCustomBlendSection from "../createBlend/BaseCustomBlendSection";
import FullyCustomBlendSection from "../createBlend/FullyCustomBlendSection";
import { BASE_CUSTOM_SPECS, FULLY_CUSTOM_SPECS } from "../createBlend/specs";
import {
  type BlendData,
  type OilOption,
  type SelectedOil,
  type CreateBlendProps,
} from "../createBlend/types";
import "../../styles/CreateBlend.css";

export type { BlendData };

export default function CreateBlend({
  newBlendCard,
  onChange,
}: CreateBlendProps) {
  const { allOils, fetchOils } = useApi();

  const [blendName, setBlendName] = useState("");
  const [blendDesc, setBlendDesc] = useState("");
  const [baseSlots, setBaseSlots] = useState<(number | null)[]>([null]);
  const [secSlots, setSecSlots] = useState<(number | null)[]>([null]);
  const [addOnSlots, setAddOnSlots] = useState<(number | null)[]>([]);

  useEffect(() => {
    if (allOils.length === 0) fetchOils();
  }, [allOils.length, fetchOils]);

  useEffect(() => {
    setBaseSlots([null]);
    setSecSlots([null]);
    setAddOnSlots([]);
    setBlendName("");
    setBlendDesc("");
  }, [newBlendCard.category, newBlendCard.bottle_size]);

  const oilsByType = useMemo(() => {
    const groups: Record<string, OilOption[]> = {
      BASE: [],
      SECONDARY: [],
      OTHER: [],
      PREMIUM: [],
    };

    allOils.forEach((o) => {
      const oilType =
        typeof o.oil_type === "object"
          ? ((o.oil_type as any).value ?? String(o.oil_type))
          : String(o.oil_type);

      if (groups[oilType]) {
        groups[oilType].push({
          id: o.id,
          name: o.name,
          description: o.description ?? "",
          oil_type: oilType,
        });
      }
    });

    return groups;
  }, [allOils]);

  const addOnOptions = [...oilsByType.OTHER, ...oilsByType.PREMIUM];
  const allSelectedIds = [...baseSlots, ...secSlots, ...addOnSlots].filter(
    (id): id is number => id !== null,
  );

  const capacity = parseInt(newBlendCard.bottle_size) || 60;
  const category = newBlendCard.category;
  const bottleSize = newBlendCard.bottle_size;
  const baseSpec = BASE_CUSTOM_SPECS[bottleSize];
  const fcSpec = FULLY_CUSTOM_SPECS[bottleSize];

  useEffect(() => {
    const oils: SelectedOil[] = [
      ...baseSlots
        .filter((id): id is number => id !== null)
        .map((id) => ({ oil_id: id, oil_type: "BASE" })),
      ...secSlots
        .filter((id): id is number => id !== null)
        .map((id) => ({ oil_id: id, oil_type: "SECONDARY" })),
      ...addOnSlots
        .filter((id): id is number => id !== null)
        .map((id) => {
          const match = addOnOptions.find((o) => o.id === id);
          return { oil_id: id, oil_type: match?.oil_type ?? "OTHER" };
        }),
    ];

    onChange({ name: blendName, description: blendDesc, oils });
  }, [
    blendName,
    blendDesc,
    baseSlots,
    secSlots,
    addOnSlots,
    addOnOptions,
    onChange,
  ]);

  function updateSlot(
    slots: (number | null)[],
    setSlots: (s: (number | null)[]) => void,
    index: number,
    value: number | null,
  ) {
    const next = [...slots];
    next[index] = value;
    setSlots(next);
  }

  function addSlot(
    slots: (number | null)[],
    setSlots: (s: (number | null)[]) => void,
  ) {
    setSlots([...slots, null]);
  }

  function removeSlot(
    slots: (number | null)[],
    setSlots: (s: (number | null)[]) => void,
    index: number,
  ) {
    setSlots(slots.filter((_, i) => i !== index));
  }

  if (category === "PREMADE") {
    return (
      <div className="create-blend-placeholder">
        <span className="create-blend-placeholder-icon">🧴</span>
        <h3>Premade Blends</h3>
        <p>
          Our team will select a curated blend for you based on your product
          selections. This option will be fully available soon.
        </p>
      </div>
    );
  }

  if (category === "BASE_CUSTOM" && baseSpec) {
    return (
      <div className="create-blend">
        <ProductSpecOverview
          productType={newBlendCard.product_type}
          category={category}
          bottleType={newBlendCard.bottle_type}
          bottleSize={bottleSize}
          allowedRules={`Allowed: 1 base oil, up to ${baseSpec.maxSecondary} secondary oil${baseSpec.maxSecondary > 1 ? "s" : ""}, up to ${baseSpec.maxAddOns} add-on.`}
        />

        <BlendIdentitySection
          blendName={blendName}
          blendDesc={blendDesc}
          onNameChange={setBlendName}
          onDescChange={setBlendDesc}
        />

        <BaseCustomBlendSection
          baseSpec={baseSpec}
          capacity={capacity}
          bottleType={newBlendCard.bottle_type}
          oilsByType={oilsByType}
          addOnOptions={addOnOptions}
          allSelectedIds={allSelectedIds}
          baseSlots={baseSlots}
          secSlots={secSlots}
          addOnSlots={addOnSlots}
          onUpdateSlot={updateSlot}
          onAddSlot={addSlot}
          onRemoveSlot={removeSlot}
          setBaseSlots={setBaseSlots}
          setSecSlots={setSecSlots}
          setAddOnSlots={setAddOnSlots}
        />
      </div>
    );
  }

  if (category === "FULLY_CUSTOM" && fcSpec) {
    return (
      <div className="create-blend">
        <ProductSpecOverview
          productType={newBlendCard.product_type}
          category={category}
          bottleType={newBlendCard.bottle_type}
          bottleSize={bottleSize}
          allowedRules={`Allowed: flexible base/secondary oils, up to ${fcSpec.maxAddOns} add-on oils.`}
        />

        <BlendIdentitySection
          blendName={blendName}
          blendDesc={blendDesc}
          onNameChange={setBlendName}
          onDescChange={setBlendDesc}
        />

        <FullyCustomBlendSection
          fcSpec={fcSpec}
          capacity={capacity}
          bottleType={newBlendCard.bottle_type}
          oilsByType={oilsByType}
          addOnOptions={addOnOptions}
          allSelectedIds={allSelectedIds}
          baseSlots={baseSlots}
          secSlots={secSlots}
          addOnSlots={addOnSlots}
          onUpdateSlot={updateSlot}
          onAddSlot={addSlot}
          onRemoveSlot={removeSlot}
          setBaseSlots={setBaseSlots}
          setSecSlots={setSecSlots}
          setAddOnSlots={setAddOnSlots}
        />
      </div>
    );
  }

  return (
    <div className="create-blend-placeholder">
      <p>Please complete product selection before building your blend.</p>
    </div>
  );
}
