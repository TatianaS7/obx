import { useMemo, useState } from "react";
import { useApi } from "../../api/ApiContext";
import { BASE_CUSTOM_SPECS, FULLY_CUSTOM_SPECS } from "../createBlend/specs";
import { type BlendData } from "./CreateBlend";
import "../../styles/BlendCardResult.css";

interface NewBlendCard {
  name: string;
  description: string;
  product_type: string;
  category: string;
  bottle_size: string;
  bottle_type: string;
}

interface BlendCardResultProps {
  newBlendCard: NewBlendCard;
  blendData: BlendData;
}

interface BlendCardOilRow {
  oil_id: number;
  oil_type: string;
  amount_ml: number;
  name: string;
  description: string;
}

function normalizeOilType(oilType: unknown) {
  if (typeof oilType === "object" && oilType !== null) {
    const candidate =
      (oilType as { value?: unknown; name?: unknown }).value ??
      (oilType as { value?: unknown; name?: unknown }).name;
    return String(candidate ?? "").toUpperCase();
  }

  const normalized = String(oilType ?? "").toUpperCase();
  return normalized.includes(".")
    ? (normalized.split(".").pop() ?? normalized)
    : normalized;
}

function rounded(value: number) {
  return Number(value.toFixed(2));
}

function formatRole(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function BlendCardResult({
  newBlendCard,
  blendData,
}: BlendCardResultProps) {
  const { allOils } = useApi();
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const oilsById = useMemo(() => {
    const map = new Map<number, { name: string; description: string }>();
    allOils.forEach((oil) => {
      map.set(oil.id, {
        name: oil.name,
        description: oil.description ?? "",
      });
    });
    return map;
  }, [allOils]);

  const blendRows = useMemo(() => {
    const grouped = {
      BASE: blendData.oils.filter(
        (oil) => normalizeOilType(oil.oil_type) === "BASE",
      ),
      SECONDARY: blendData.oils.filter(
        (oil) => normalizeOilType(oil.oil_type) === "SECONDARY",
      ),
      ADD_ON: blendData.oils.filter((oil) => {
        const kind = normalizeOilType(oil.oil_type);
        return kind === "OTHER" || kind === "PREMIUM" || kind === "ADD_ON";
      }),
    };

    const size = newBlendCard.bottle_size;
    const category = newBlendCard.category;

    let basePer = 0;
    let secondaryPer = 0;
    let addOnPer = 0;

    if (category === "BASE_CUSTOM") {
      const spec = BASE_CUSTOM_SPECS[size];
      if (spec) {
        const adjustedBaseTotal = Math.max(
          spec.baseVol - grouped.ADD_ON.length * spec.addOnVol,
          0,
        );
        basePer =
          grouped.BASE.length > 0 ? adjustedBaseTotal / grouped.BASE.length : 0;
        secondaryPer =
          grouped.SECONDARY.length > 0
            ? spec.secVol / grouped.SECONDARY.length
            : 0;
        addOnPer = spec.addOnVol;
      }
    }

    if (category === "FULLY_CUSTOM") {
      const spec = FULLY_CUSTOM_SPECS[size];
      if (spec) {
        const adjustedBaseTotal = Math.max(
          spec.baseVol - grouped.ADD_ON.length * spec.addOnVol,
          0,
        );
        basePer =
          grouped.BASE.length > 0 ? adjustedBaseTotal / grouped.BASE.length : 0;
        secondaryPer =
          grouped.SECONDARY.length > 0
            ? spec.secVol / grouped.SECONDARY.length
            : 0;
        addOnPer = spec.addOnVol;
      }
    }

    const rows: BlendCardOilRow[] = [
      ...grouped.BASE.map((oil) => ({
        ...oil,
        oil_type: "BASE",
        amount_ml: rounded(basePer),
        name: oilsById.get(oil.oil_id)?.name ?? `Oil #${oil.oil_id}`,
        description: oilsById.get(oil.oil_id)?.description ?? "",
      })),
      ...grouped.SECONDARY.map((oil) => ({
        ...oil,
        oil_type: "SECONDARY",
        amount_ml: rounded(secondaryPer),
        name: oilsById.get(oil.oil_id)?.name ?? `Oil #${oil.oil_id}`,
        description: oilsById.get(oil.oil_id)?.description ?? "",
      })),
      ...grouped.ADD_ON.map((oil) => ({
        ...oil,
        oil_type: "ADD_ON",
        amount_ml: rounded(addOnPer),
        name: oilsById.get(oil.oil_id)?.name ?? `Oil #${oil.oil_id}`,
        description: oilsById.get(oil.oil_id)?.description ?? "",
      })),
    ];

    return rows;
  }, [
    blendData.oils,
    newBlendCard.bottle_size,
    newBlendCard.category,
    oilsById,
  ]);

  async function handleSaveBlendCard() {
    setSaveState("saving");

    try {
      const cardPayload = {
        saved_at: new Date().toISOString(),
        blend_name: blendData.name || "Untitled blend",
        blend_description: blendData.description || "",
        bottle_size: newBlendCard.bottle_size,
        bottle_type: newBlendCard.bottle_type,
        category: newBlendCard.category,
        oils: blendRows,
      };

      const existing = JSON.parse(
        localStorage.getItem("savedBlendCards") ?? "[]",
      );
      const next = Array.isArray(existing)
        ? [cardPayload, ...existing]
        : [cardPayload];
      localStorage.setItem("savedBlendCards", JSON.stringify(next));

      // Skeleton for backend persistence: replace with API call when endpoint is ready.
      // await apiClient.post("/blend-cards/save", cardPayload);

      setSaveState("saved");
    } catch (_error) {
      setSaveState("error");
    }
  }

  return (
    <section className="blend-card-result">
      {/* <header className="blend-card-result-header"> */}
      <p className="blend-card-result-eyebrow">Order Submitted</p>
      {/* </header> */}
      <div>
        {" "}
        <h3>Your Blend Card</h3>
        <p>
          This card captures your custom formula with each selected oil and its
          amount.
        </p>
      </div>

      <article className="blend-card-graphic">
        <div className="blend-card-meta-item name">
          <span className="blend-card-label">Blend Name</span>
          <strong>{blendData.name || "Untitled blend"}</strong>
        </div>

        <div className="blend-card-graphic-top">
          <div className="blend-card-meta-item">
            <span className="blend-card-label">Product</span>
            <strong>
              {formatRole(newBlendCard.product_type || "") || "Not set"}
            </strong>
          </div>
          <div className="blend-card-meta-item">
            <span className="blend-card-label">Bottle</span>
            <strong>
              {newBlendCard.bottle_size || "Not set"}{" "}
              {newBlendCard.bottle_type || ""}
            </strong>
          </div>
          <div className="blend-card-meta-item">
            <span className="blend-card-label">Category</span>
            <strong>
              {formatRole(newBlendCard.category || "") || "Not set"}
            </strong>
          </div>
        </div>

        <div className="blend-card-description">
          <span className="blend-card-label">Description</span>
          <p>{blendData.description || "No description provided."}</p>
        </div>

        <div className="blend-card-oils">
          <span className="blend-card-label">Oil Formula</span>

          {["BASE", "SECONDARY", "ADD_ON"].map((group) => {
            const sectionOils = blendRows.filter((o) => o.oil_type === group);
            const sectionLabel =
              group === "BASE"
                ? "Base Oils"
                : group === "SECONDARY"
                  ? "Secondary Oils"
                  : "Add-Ons";
            return (
              <div key={group} className="blend-card-oils-section">
                <h5 className="blend-card-oils-section-title">
                  {sectionLabel}
                </h5>
                {sectionOils.length > 0 ? (
                  <ul>
                    {sectionOils.map((oil) => (
                      <li key={`${oil.oil_type}-${oil.oil_id}`}>
                        <div className="blend-card-oil-head">
                          <strong>{oil.name}</strong>
                          <span>{oil.amount_ml} mL</span>
                        </div>
                        <div className="blend-card-oil-meta">
                          <p>
                            {oil.description || "No description available."}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="blend-card-empty blend-card-empty-section">
                    None selected.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <footer className="blend-card-flyer-footer">
          <span>Custom Formula Profile</span>
          <span>Keep this card for refill requests</span>
        </footer>
      </article>

      <div className="blend-card-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={handleSaveBlendCard}
          disabled={saveState === "saving"}
        >
          {saveState === "saving" ? "Saving..." : "Save Blend Card"}
        </button>
        {saveState === "saved" && (
          <p className="blend-card-status success">
            Blend card saved for this user session.
          </p>
        )}
        {saveState === "error" && (
          <p className="blend-card-status error">
            Could not save blend card. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
