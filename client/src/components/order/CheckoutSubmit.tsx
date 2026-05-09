import { useEffect, useMemo, useState } from "react";
import apiClient from "../../api/httpClient";
import { formatBottleSizeOz } from "../createBlend/utils";
import { type BlendData } from "./CreateBlend";
import "../../styles/CheckoutSubmit.css";

interface NewBlendCard {
  name: string;
  description: string;
  product_type: string;
  category: string;
  bottle_size: string;
  bottle_type: string;
}

interface CheckoutSubmitProps {
  newBlendCard: NewBlendCard;
  blendData: BlendData;
}

interface BackendDiscount {
  id: number;
  name: string;
  code: string;
  percentage_off: number;
  is_active: boolean;
  expires_at: string | null;
}

interface PricingBreakdown {
  baseCount: number;
  secondaryCount: number;
  essentialStandardCount: number;
  essentialIntenseCount: number;
  essentialAddOnCount: number;
  premiumAddOnCount: number;
  basePrice: number;
  additionalBlendOils: number;
  additionalBlendOilPrice: number;
  essentialStandardPrice: number;
  essentialIntensePrice: number;
  essentialAddOnPrice: number;
  premiumAddOnPrice: number;
  subtotal: number;
}

function getPricingBreakdown(
  newBlendCard: NewBlendCard,
  blendData: BlendData,
): PricingBreakdown {
  const categoryKey = newBlendCard.category.trim().toUpperCase();
  const basePrice = 9;

  const baseCount = blendData.oils.filter((o) => o.oil_type === "BASE").length;
  const secondaryCount = blendData.oils.filter(
    (o) => o.oil_type === "SECONDARY",
  ).length;
  const essentialAddOnCount = blendData.oils.filter(
    (o) => o.oil_type === "OTHER",
  ).length;
  const essentialStandardCount = blendData.oils.filter(
    (o) => o.oil_type === "OTHER" && o.essential_dilution !== "INTENSE",
  ).length;
  const essentialIntenseCount = blendData.oils.filter(
    (o) => o.oil_type === "OTHER" && o.essential_dilution === "INTENSE",
  ).length;
  const premiumAddOnCount = blendData.oils.filter(
    (o) => o.oil_type === "PREMIUM",
  ).length;

  if (categoryKey === "PREMADE") {
    return {
      baseCount,
      secondaryCount,
      essentialStandardCount,
      essentialIntenseCount,
      essentialAddOnCount,
      premiumAddOnCount,
      basePrice,
      additionalBlendOils: 0,
      additionalBlendOilPrice: 0,
      essentialStandardPrice: 0,
      essentialIntensePrice: 0,
      essentialAddOnPrice: 0,
      premiumAddOnPrice: 0,
      subtotal: basePrice,
    };
  }

  if (categoryKey !== "CUSTOM") {
    return {
      baseCount,
      secondaryCount,
      essentialStandardCount,
      essentialIntenseCount,
      essentialAddOnCount,
      premiumAddOnCount,
      basePrice: 0,
      additionalBlendOils: 0,
      additionalBlendOilPrice: 0,
      essentialStandardPrice: 0,
      essentialIntensePrice: 0,
      essentialAddOnPrice: 0,
      premiumAddOnPrice: 0,
      subtotal: 0,
    };
  }

  const additionalBlendOils = Math.max(baseCount - 1, 0) + secondaryCount;
  const additionalBlendOilPrice = +(additionalBlendOils * 1.5).toFixed(2);
  const essentialStandardPrice = +(essentialStandardCount * 1.5).toFixed(2);
  const essentialIntensePrice = +(essentialIntenseCount * 3).toFixed(2);
  const essentialAddOnPrice = +(
    essentialStandardPrice + essentialIntensePrice
  ).toFixed(2);
  const premiumAddOnPrice = +(premiumAddOnCount * 3).toFixed(2);
  const subtotal = +(
    basePrice +
    additionalBlendOilPrice +
    essentialAddOnPrice +
    premiumAddOnPrice
  ).toFixed(2);

  return {
    baseCount,
    secondaryCount,
    essentialStandardCount,
    essentialIntenseCount,
    essentialAddOnCount,
    premiumAddOnCount,
    basePrice,
    additionalBlendOils,
    additionalBlendOilPrice,
    essentialStandardPrice,
    essentialIntensePrice,
    essentialAddOnPrice,
    premiumAddOnPrice,
    subtotal,
  };
}

function formatSpecValue(value: string) {
  if (!value) return "Not selected";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function CheckoutSubmit({
  newBlendCard,
  blendData,
}: CheckoutSubmitProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discounts, setDiscounts] = useState<BackendDiscount[]>([]);
  const [discountsLoading, setDiscountsLoading] = useState(false);
  const [appliedDiscount, setAppliedDiscount] =
    useState<BackendDiscount | null>(null);
  const [promoMessage, setPromoMessage] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function fetchDiscounts() {
      setDiscountsLoading(true);
      try {
        const res = await apiClient.get("/discounts/all");
        if (!isMounted) return;
        setDiscounts(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        if (!isMounted) return;
        setDiscounts([]);
        setPromoMessage("Could not load discount codes from server.");
      } finally {
        if (isMounted) {
          setDiscountsLoading(false);
        }
      }
    }

    fetchDiscounts();

    return () => {
      isMounted = false;
    };
  }, []);

  const pricing = useMemo(
    () => getPricingBreakdown(newBlendCard, blendData),
    [newBlendCard, blendData],
  );
  const subtotal = pricing.subtotal;
  const discountRate = appliedDiscount?.percentage_off ?? 0;
  const discountAmount = +(subtotal * discountRate).toFixed(2);
  const total = +(subtotal - discountAmount).toFixed(2);

  function isExpired(expiresAt: string | null) {
    if (!expiresAt) return false;
    return new Date(expiresAt).getTime() < Date.now();
  }

  function handleApplyPromo() {
    const normalized = promoCode.trim().toUpperCase();

    if (!normalized) {
      setAppliedDiscount(null);
      setPromoMessage("Enter a promo code before applying.");
      return;
    }

    if (discountsLoading) {
      setPromoMessage("Discounts are still loading. Try again in a moment.");
      return;
    }

    const matchingDiscount = discounts.find(
      (d) => d.code.toUpperCase() === normalized,
    );

    if (!matchingDiscount) {
      setAppliedDiscount(null);
      setPromoMessage("That code is not recognized.");
      return;
    }

    if (!matchingDiscount.is_active || isExpired(matchingDiscount.expires_at)) {
      setAppliedDiscount(null);
      setPromoMessage("That code is inactive or expired.");
      return;
    }

    setAppliedDiscount(matchingDiscount);
    setPromoMessage(
      `Promo code ${normalized} applied (${Math.round(matchingDiscount.percentage_off * 100)}% off).`,
    );
  }

  return (
    <div className="checkout-submit">
      <section className="checkout-card">
        <h3>Checkout & Submit</h3>
        <p>
          Finalize your order, apply promo codes, and complete payment. Payment
          provider wiring can plug directly into the marked payment section.
        </p>
      </section>

      <section className="checkout-card">
        <h4>Order Summary</h4>
        <div className="checkout-grid">
          <div>
            <span className="checkout-label">Blend Name</span>
            <span className="checkout-value">
              {blendData.name || "Untitled blend"}
            </span>
          </div>
          <div>
            <span className="checkout-label">Bottle Size</span>
            <span className="checkout-value">
              {formatBottleSizeOz(newBlendCard.bottle_size)}
            </span>
          </div>
          <div>
            <span className="checkout-label">Blend Category</span>
            <span className="checkout-value">
              {formatSpecValue(newBlendCard.category)}
            </span>
          </div>
          <div>
            <span className="checkout-label">Selected Oils</span>
            <span className="checkout-value">{blendData.oils.length}</span>
          </div>
        </div>
      </section>

      <section className="checkout-card">
        <h4>Promo / Discount Code</h4>
        <div className="promo-row">
          <input
            className="promo-input"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            aria-label="Promo code"
          />
          <button
            className="btn-ghost-dark"
            type="button"
            onClick={handleApplyPromo}
          >
            Apply
          </button>
        </div>
        {promoMessage && <p className="promo-message">{promoMessage}</p>}
      </section>

      <section className="checkout-card">
        <h4>Payment</h4>
        <div className="payment-placeholder">
          <p>Payment Integration Placeholder</p>
          <p>
            Add Stripe, Square, or another provider checkout element here. This
            section is intentionally separated for direct payment SDK mounting.
          </p>
        </div>
      </section>

      <section className="checkout-card total-card">
        <h4>Pricing Breakdown</h4>
        <div className="pricing-breakdown-list" aria-label="Pricing breakdown">
          <div className="total-row total-row-sub">
            <span>
              Base Blend Price
              {newBlendCard.category.trim().toUpperCase() === "CUSTOM"
                ? " (includes first base oil)"
                : ""}
            </span>
            <strong>${pricing.basePrice.toFixed(2)}</strong>
          </div>
          {newBlendCard.category.trim().toUpperCase() === "CUSTOM" && (
            <>
              <div className="total-row total-row-sub">
                <span>
                  Additional Base/Secondary Oils ({pricing.additionalBlendOils}{" "}
                  x $1.50)
                </span>
                <strong>${pricing.additionalBlendOilPrice.toFixed(2)}</strong>
              </div>
              <div className="total-row total-row-sub">
                <span>
                  Essential Add-Ons Standard ({pricing.essentialStandardCount} x
                  $1.50, 0.5g each)
                </span>
                <strong>${pricing.essentialStandardPrice.toFixed(2)}</strong>
              </div>
              <div className="total-row total-row-sub">
                <span>
                  Essential Add-Ons Intense ({pricing.essentialIntenseCount} x
                  $3.00, 1.0g each)
                </span>
                <strong>${pricing.essentialIntensePrice.toFixed(2)}</strong>
              </div>
              <div className="total-row total-row-sub">
                <span>
                  Premium Add-Ons ({pricing.premiumAddOnCount} x $3.00)
                </span>
                <strong>${pricing.premiumAddOnPrice.toFixed(2)}</strong>
              </div>
            </>
          )}
        </div>
        <div className="total-row">
          <span>Subtotal</span>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>
        <div className="total-row">
          <span>Discount</span>
          <strong>-${discountAmount.toFixed(2)}</strong>
        </div>
        <div className="total-row total-row-final">
          <span>Total</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </section>
    </div>
  );
}
