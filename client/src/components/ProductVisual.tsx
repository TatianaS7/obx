import React from "react";
import squeezeBottle from "../../assets/squeeze-bottle.png";
import dropperBottle from "../../assets/dropper-bottle.png";


export default function ProductVisual({ newBlendCard }: { newBlendCard: NewBlendCard }) {
  return (
    <div>
      {newBlendCard.bottle_type === "SQUEEZE" && (
        <img
          src={squeezeBottle}
          alt="Squeeze Bottle"
          className="product-image"
        />
      )}
      {newBlendCard.bottle_type === "DROPPER" && (
        <img
          src={dropperBottle}
          alt="Dropper Bottle"
          className="product-image"
        />
      )}
    </div>
  );
}
