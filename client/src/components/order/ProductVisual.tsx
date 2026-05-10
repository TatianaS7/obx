import React from "react";
import dropperBottle from "../../assets/dropper-bottle.png";
import brushBottle from "../../assets/brush-bottle.jpg";

interface NewBlendCard {
  bottle_type: string;
}

export default function ProductVisual({
  newBlendCard,
}: {
  newBlendCard: NewBlendCard;
}) {
  const isDropperOrBrush =
    newBlendCard.bottle_type === "DROPPER" ||
    newBlendCard.bottle_type === "BRUSH";

  return (
    <div>
      {isDropperOrBrush && (
        <img
          src={
            newBlendCard.bottle_type === "BRUSH" ? brushBottle : dropperBottle
          }
          alt={
            newBlendCard.bottle_type === "BRUSH"
              ? "Brush Bottle"
              : "Dropper Bottle"
          }
          className="product-image"
        />
      )}
    </div>
  );
}
