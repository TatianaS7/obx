import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import apiURL from "../../api/api";
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

const PRICING_TABLE: Record<string, Record<string, number>> = {
  SMALL: { PREMADE: 9, BASE_CUSTOM: 11, FULLY_CUSTOM: 15 },
  MEDIUM: { PREMADE: 13, BASE_CUSTOM: 16, FULLY_CUSTOM: 20 },
  LARGE: { PREMADE: 18, BASE_CUSTOM: 20, FULLY_CUSTOM: 24 },
};

function getPrice(newBlendCard: NewBlendCard): number {
  const bySize = PRICING_TABLE[newBlendCard.bottle_size];
  if (!bySize) return 0;
  return bySize[newBlendCard.category] ?? 0;
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
        const res = await axios.get(`${apiURL}/discounts/all`);
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

  const subtotal = useMemo(() => getPrice(newBlendCard), [newBlendCard]);
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
              {formatSpecValue(newBlendCard.bottle_size)}
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
