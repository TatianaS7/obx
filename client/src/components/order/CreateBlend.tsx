import { useState, useEffect, useMemo } from "react";
import { useApi } from "../../api/ApiContext";
import ProductSpecOverview from "../createBlend/ProductSpecOverview";
import BlendIdentitySection from "../createBlend/BlendIdentitySection";
import FullyCustomBlendSection from "../createBlend/FullyCustomBlendSection";
import { CUSTOM_SPECS } from "../createBlend/specs";
import {
  type BlendData,
  type NewBlendCard,
  type OilOption,
  type SelectedOil,
} from "../createBlend/types";
import type {
  QuizHairProfile,
  QuizOilSuggestions,
} from "../quiz/quizRecommendations";
import "../../styles/CreateBlend.css";

export type { BlendData };

interface CreateBlendProps {
  newBlendCard: NewBlendCard;
  onChange: (data: BlendData) => void;
  onValidationChange?: (isValid: boolean) => void;
  quizSuggestions?: QuizOilSuggestions;
  quizProfile?: QuizHairProfile;
}

export default function CreateBlend({
  newBlendCard,
  onChange,
  onValidationChange,
  quizSuggestions,
  quizProfile,
}: CreateBlendProps) {
  const { allOils, fetchOils } = useApi();

  const [blendName, setBlendName] = useState("");
  const [blendDesc, setBlendDesc] = useState("");
  const [baseSlots, setBaseSlots] = useState<(number | null)[]>([null]);
  const [secSlots, setSecSlots] = useState<(number | null)[]>([null]);
  const [essentialAddOnSlots, setEssentialAddOnSlots] = useState<
    (number | null)[]
  >([]);
  const [premiumAddOnSlots, setPremiumAddOnSlots] = useState<(number | null)[]>(
    [],
  );
  const [essentialDilution, setEssentialDilution] = useState<
    "STANDARD" | "INTENSE"
  >("STANDARD");
  const [didAutofillFromQuiz, setDidAutofillFromQuiz] = useState(false);

  useEffect(() => {
    if (allOils.length === 0) fetchOils();
  }, [allOils.length, fetchOils]);

  useEffect(() => {
    setBaseSlots([null]);
    setSecSlots([null]);
    setEssentialAddOnSlots([]);
    setPremiumAddOnSlots([]);
    setEssentialDilution("STANDARD");
    setBlendName("");
    setBlendDesc("");
    setDidAutofillFromQuiz(false);
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

  const essentialAddOnOptions = oilsByType.OTHER;
  const premiumAddOnOptions = oilsByType.PREMIUM;
  const allSelectedIds = [
    ...baseSlots,
    ...secSlots,
    ...essentialAddOnSlots,
    ...premiumAddOnSlots,
  ].filter((id): id is number => id !== null);

  const category = newBlendCard.category;
  const bottleSize = newBlendCard.bottle_size;
  const customSpec = CUSTOM_SPECS[bottleSize];
  const capacity = customSpec ? customSpec.baseVol + customSpec.secVol : 55;

  useEffect(() => {
    if (!quizSuggestions || didAutofillFromQuiz) return;
    if (allOils.length === 0) return;
    if (category !== "CUSTOM") return;

    const availableBase = new Set(oilsByType.BASE.map((o) => o.id));
    const availableSecondary = new Set(oilsByType.SECONDARY.map((o) => o.id));
    const availableEssentialAddOn = new Set(
      essentialAddOnOptions.map((o) => o.id),
    );
    const availablePremiumAddOn = new Set(premiumAddOnOptions.map((o) => o.id));

    const baseIds = quizSuggestions.baseOilIds.filter((id) =>
      availableBase.has(id),
    );
    const secondaryIds = quizSuggestions.secondaryOilIds.filter((id) =>
      availableSecondary.has(id),
    );
    const essentialAddOnIds = quizSuggestions.addOnOilIds.filter((id) =>
      availableEssentialAddOn.has(id),
    );
    const premiumAddOnIds = quizSuggestions.addOnOilIds.filter((id) =>
      availablePremiumAddOn.has(id),
    );

    if (category === "CUSTOM" && customSpec) {
      const maxSecondary = Math.max(1, Math.min(3, secondaryIds.length));
      const maxBase = Math.max(1, Math.min(2, baseIds.length));

      setBaseSlots(maxBase > 0 ? baseIds.slice(0, maxBase) : [null]);
      setSecSlots(
        maxSecondary > 0 ? secondaryIds.slice(0, maxSecondary) : [null],
      );

      const essentialSlice = essentialAddOnIds.slice(0, customSpec.maxAddOns);
      const remainingAddOnSlots = Math.max(
        customSpec.maxAddOns - essentialSlice.length,
        0,
      );
      const premiumSlice = premiumAddOnIds.slice(0, remainingAddOnSlots);

      setEssentialAddOnSlots(essentialSlice);
      setPremiumAddOnSlots(premiumSlice);
    }

    if (!blendName && quizSuggestions.blendNameSuggestion) {
      setBlendName(quizSuggestions.blendNameSuggestion);
    }
    if (!blendDesc && quizSuggestions.blendDescriptionSuggestion) {
      setBlendDesc(quizSuggestions.blendDescriptionSuggestion);
    } else if (!blendDesc && quizProfile?.summary) {
      setBlendDesc(quizProfile.summary);
    }

    setDidAutofillFromQuiz(true);
  }, [
    essentialAddOnOptions,
    allOils.length,
    blendDesc,
    blendName,
    category,
    customSpec,
    didAutofillFromQuiz,
    premiumAddOnOptions,
    oilsByType.BASE,
    oilsByType.SECONDARY,
    quizProfile,
    quizSuggestions,
  ]);

  useEffect(() => {
    const oils: SelectedOil[] = [
      ...baseSlots
        .filter((id): id is number => id !== null)
        .map((id) => ({ oil_id: id, oil_type: "BASE" })),
      ...secSlots
        .filter((id): id is number => id !== null)
        .map((id) => ({ oil_id: id, oil_type: "SECONDARY" })),
      ...essentialAddOnSlots
        .filter((id): id is number => id !== null)
        .map((id) => ({
          oil_id: id,
          oil_type: "OTHER",
          essential_dilution: essentialDilution,
        })),
      ...premiumAddOnSlots
        .filter((id): id is number => id !== null)
        .map((id) => ({ oil_id: id, oil_type: "PREMIUM" })),
    ];

    onChange({ name: blendName, description: blendDesc, oils });
  }, [
    blendName,
    blendDesc,
    baseSlots,
    secSlots,
    essentialAddOnSlots,
    premiumAddOnSlots,
    essentialDilution,
    onChange,
  ]);

  useEffect(() => {
    const selectedBaseCount = baseSlots.filter((id) => id !== null).length;
    const selectedSecondaryCount = secSlots.filter((id) => id !== null).length;
    const essentialAddOnCount = essentialAddOnSlots.filter(
      (id) => id !== null,
    ).length;
    const premiumAddOnCount = premiumAddOnSlots.filter(
      (id) => id !== null,
    ).length;
    const additionalOilCount =
      selectedSecondaryCount + essentialAddOnCount + premiumAddOnCount;

    const isValid = selectedBaseCount > 0 && additionalOilCount > 0;
    onValidationChange?.(isValid);
  }, [
    baseSlots,
    secSlots,
    essentialAddOnSlots,
    premiumAddOnSlots,
    onValidationChange,
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

  if (category === "CUSTOM" && customSpec) {
    return (
      <div className="create-blend">
        <ProductSpecOverview
          productType={newBlendCard.product_type}
          category={category}
          bottleType={newBlendCard.bottle_type}
          bottleSize={bottleSize}
          allowedRules={`Allowed: flexible base/secondary oils, up to ${customSpec.maxAddOns} add-on oils.`}
        />

        <BlendIdentitySection
          blendName={blendName}
          blendDesc={blendDesc}
          onNameChange={setBlendName}
          onDescChange={setBlendDesc}
        />

        <FullyCustomBlendSection
          fcSpec={customSpec}
          capacity={capacity}
          bottleType={newBlendCard.bottle_type}
          oilsByType={oilsByType}
          essentialAddOnOptions={essentialAddOnOptions}
          premiumAddOnOptions={premiumAddOnOptions}
          allSelectedIds={allSelectedIds}
          baseSlots={baseSlots}
          secSlots={secSlots}
          essentialAddOnSlots={essentialAddOnSlots}
          premiumAddOnSlots={premiumAddOnSlots}
          essentialDilution={essentialDilution}
          onUpdateSlot={updateSlot}
          onAddSlot={addSlot}
          onRemoveSlot={removeSlot}
          setBaseSlots={setBaseSlots}
          setSecSlots={setSecSlots}
          setEssentialAddOnSlots={setEssentialAddOnSlots}
          setPremiumAddOnSlots={setPremiumAddOnSlots}
          setEssentialDilution={setEssentialDilution}
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
