import React from "react";
import dropperBottle from "../../assets/dropper-bottle.png";
import rollerballBottle from "../../assets/brush-bottle.jpg";

interface NewBlendCard {
  bottle_type: string;
}

export default function ProductVisual({
  newBlendCard,
}: {
  newBlendCard: NewBlendCard;
}) {
  const isDropperOrRollerball =
    newBlendCard.bottle_type === "DROPPER" ||
    newBlendCard.bottle_type === "ROLLERBALL";

  return (
    <div>
      {isDropperOrRollerball && (
        <img
          src={
            newBlendCard.bottle_type === "ROLLERBALL"
              ? rollerballBottle
              : dropperBottle
          }
          alt={
            newBlendCard.bottle_type === "ROLLERBALL"
              ? "Rollerball Bottle"
              : "Dropper Bottle"
          }
          className="product-image"
        />
      )}
    </div>
  );
}
