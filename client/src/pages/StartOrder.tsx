import React, { useState } from "react";
import "../styles/StartOrder.css";

import OrderStepper from "../components/order/OrderStepper";

interface NewBlendCard {
  name: string;
  description: string;
  product_type: string;
  category: string;
  bottle_size: string;
  bottle_type: string;
}

export default function StartOrder() {
  const [newBlendCard, setNewBlendCard] = useState<NewBlendCard>({
    name: "",
    description: "",
    product_type: "",
    category: "",
    bottle_size: "",
    bottle_type: "DROPPER",
  });

  return (
    <div className="start-order-page">
      <header className="page-hero">
        <span className="page-hero-eyebrow">Custom Blends</span>
        <h1 className="page-hero-title">Start Your Order</h1>
        <p className="page-hero-sub">
          Build a blend tailored to your hair goals — every drop crafted just
          for you.
        </p>
      </header>

      <section className="start-order-body">
        <OrderStepper
          newBlendCard={newBlendCard}
          setNewBlendCard={setNewBlendCard}
        />
      </section>
    </div>
  );
}
