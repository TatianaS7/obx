import React, { useState, useEffect, useMemo } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import ProductGuide from "./ProductGuide";
import "../../styles/ProductSelection.css";

interface NewBlendCard {
  name: string;
  description: string;
  customer_tier: string;
  quantity: string;
  product_type: string;
  category: string;
  bottle_size: string;
  bottle_type: string;
}

type BottleSizeOption = {
  value: string;
  label: string;
  bottleType?: "ROLLERBALL" | "DROPPER";
  isPlaceholderBulk?: boolean;
};

export default function ProductSelection({
  newBlendCard,
  setNewBlendCard,
}: {
  newBlendCard: NewBlendCard;
  setNewBlendCard: React.Dispatch<React.SetStateAction<NewBlendCard>>;
}) {
  const HAIR_ALLOWED_CATEGORY = "CUSTOM";
  const CUTICLE_ALLOWED_CATEGORY = "PREMADE";

  const PROFESSIONAL_QUANTITY_OPTIONS = ["6", "12", "24", "48"];
  const INDIVIDUAL_HAIR_BOTTLE_SIZES: BottleSizeOption[] = [
    { value: "60mL", label: "2 oz" },
  ];
  const [quantity, setQuantity] = useState(newBlendCard.quantity || "1");
  const PROFESSIONAL_HAIR_BOTTLE_SIZES: BottleSizeOption[] = [
    ...INDIVIDUAL_HAIR_BOTTLE_SIZES,
  ];
  const INDIVIDUAL_CUTICLE_BOTTLE_SIZES: BottleSizeOption[] = [
    { value: "6mL", label: "6 mL Rollerball", bottleType: "ROLLERBALL" },
  ];
  const INACTIVE_PROFESSIONAL_CUTICLE_BOTTLE_SIZES: BottleSizeOption[] = [
    {
      value: "60mL",
      label: "2 oz Professional Bottle",
      bottleType: "DROPPER",
      isPlaceholderBulk: true,
    },
  ];
  const PROFESSIONAL_CUTICLE_BOTTLE_SIZES: BottleSizeOption[] = [
    {
      value: "6mL",
      label: "6 mL Rollerball",
      bottleType: "ROLLERBALL",
    },
  ];

  const [customer_tier, setCustomerTier] = useState(
    newBlendCard.customer_tier || "INDIVIDUAL",
  );
  const [product_type, setProductType] = useState(
    newBlendCard.product_type || "",
  );
  const [bottle_type, setBottleType] = useState(
    newBlendCard.bottle_type || "DROPPER",
  );
  const [bottle_size, setBottleSize] = useState(newBlendCard.bottle_size || "");
  const [category, setCategory] = useState(newBlendCard.category || "");

  const allowedCategory =
    product_type === "CUTICLE_OIL"
      ? CUTICLE_ALLOWED_CATEGORY
      : product_type === "HAIR_OIL"
        ? HAIR_ALLOWED_CATEGORY
        : "";

  const effectiveCategory = allowedCategory || category;

  useEffect(() => {
    if (customer_tier === "PROFESSIONAL") {
      if (!PROFESSIONAL_QUANTITY_OPTIONS.includes(quantity)) {
        setQuantity("6");
      }
      return;
    }

    if (quantity !== "1") {
      setQuantity("1");
    }
  }, [customer_tier, quantity]);

  useEffect(() => {
    setNewBlendCard((prev) => {
      const next = {
        ...prev,
        customer_tier,
        quantity,
        product_type,
        bottle_type,
        bottle_size,
        category: effectiveCategory,
      };

      if (
        prev.customer_tier === next.customer_tier &&
        prev.quantity === next.quantity &&
        prev.product_type === next.product_type &&
        prev.bottle_type === next.bottle_type &&
        prev.bottle_size === next.bottle_size &&
        prev.category === next.category
      ) {
        return prev;
      }

      return next;
    });
  }, [
    customer_tier,
    quantity,
    product_type,
    bottle_type,
    bottle_size,
    effectiveCategory,
    setNewBlendCard,
  ]);

  const bottleSizeOptions: BottleSizeOption[] = useMemo(() => {
    if (product_type === "CUTICLE_OIL") {
      return customer_tier === "PROFESSIONAL"
        ? PROFESSIONAL_CUTICLE_BOTTLE_SIZES
        : INDIVIDUAL_CUTICLE_BOTTLE_SIZES;
    }

    return customer_tier === "PROFESSIONAL"
      ? PROFESSIONAL_HAIR_BOTTLE_SIZES
      : INDIVIDUAL_HAIR_BOTTLE_SIZES;
  }, [product_type, customer_tier]);

  useEffect(() => {
    const allowedBottleSizes = bottleSizeOptions.map((option) => option.value);

    if (allowedBottleSizes.length === 0) return;

    if (!bottle_size || !allowedBottleSizes.includes(bottle_size)) {
      setBottleSize(allowedBottleSizes[0]);
    }
  }, [bottleSizeOptions, bottle_size]);

  useEffect(() => {
    if (product_type === "CUTICLE_OIL") {
      const matchedCuticleOption = bottleSizeOptions.find(
        (option) => option.value === bottle_size,
      );
      const requiredBottleType =
        matchedCuticleOption?.bottleType ?? "ROLLERBALL";

      if (bottle_type !== requiredBottleType) {
        setBottleType(requiredBottleType);
      }
      return;
    }

    if (product_type === "HAIR_OIL" && bottle_type !== "DROPPER") {
      setBottleType("DROPPER");
    }
  }, [product_type, bottle_type, bottleSizeOptions, bottle_size]);

  const selectedBottleSizeOption = bottleSizeOptions.find(
    (option) => option.value === bottle_size,
  );
  const showsBulkPlaceholderMessage =
    customer_tier === "PROFESSIONAL" &&
    Boolean(selectedBottleSizeOption?.isPlaceholderBulk);

  return (
    <div className="product-selection-layout">
      <ProductGuide />

      {/* Form Section */}
      <div className="product-selection-form">
        <div
          className="customer-tier-toggle"
          role="group"
          aria-label="Customer type"
        >
          <span className="customer-tier-label">Individuals</span>
          <Switch
            checked={customer_tier === "PROFESSIONAL"}
            onChange={(e) =>
              setCustomerTier(e.target.checked ? "PROFESSIONAL" : "INDIVIDUAL")
            }
            color="secondary"
            inputProps={{ "aria-label": "Toggle professional purchasing mode" }}
          />
          <span className="customer-tier-label">Professionals</span>
        </div>
        <p className="customer-tier-note">
          {customer_tier === "PROFESSIONAL"
            ? "Business mode enabled: 6 bottles minimum for professional orders."
            : "Individual mode: standard bottle sizes for personal orders."}
        </p>

        {customer_tier === "PROFESSIONAL" && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="professional-quantity-label">Quantity</InputLabel>
            <Select
              label="Quantity"
              labelId="professional-quantity-label"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value as string)}
              sx={{ backgroundColor: "white" }}
            >
              {PROFESSIONAL_QUANTITY_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Professional orders can be planned in runs of 6, 12, 24, or 48.
            </FormHelperText>
          </FormControl>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel id="product-type-label">Product Type</InputLabel>
          <Select
            label="Product Type"
            value={product_type}
            onChange={(e) => {
              const selectedProductType = e.target.value as string;
              setProductType(selectedProductType);
              if (selectedProductType === "HAIR_OIL") {
                setBottleType("DROPPER");
                setBottleSize("60mL");
              }
              if (selectedProductType === "CUTICLE_OIL") {
                const cuticleOptions =
                  customer_tier === "PROFESSIONAL"
                    ? PROFESSIONAL_CUTICLE_BOTTLE_SIZES
                    : INDIVIDUAL_CUTICLE_BOTTLE_SIZES;
                const nextCuticleOption = cuticleOptions[0];
                setBottleType(nextCuticleOption?.bottleType ?? "ROLLERBALL");
                setBottleSize(nextCuticleOption?.value ?? "6mL");
              }
            }}
            sx={{ backgroundColor: "white" }}
          >
            <MenuItem value="HAIR_OIL">Hair Oil</MenuItem>
            <MenuItem value="CUTICLE_OIL">Cuticle Oil</MenuItem>
          </Select>
        </FormControl>

        {(product_type === "HAIR_OIL" || product_type === "CUTICLE_OIL") && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Bottle Type</InputLabel>
            <Select
              label="Bottle Type"
              value={bottle_type}
              disabled
              sx={{ backgroundColor: "white" }}
            >
              {/* <MenuItem value="SQUEEZE">Squeeze</MenuItem> */}
              {product_type === "CUTICLE_OIL" ? (
                <MenuItem value={bottle_type}>
                  {bottle_type === "DROPPER" ? "Dropper" : "Rollerball"}
                </MenuItem>
              ) : (
                <MenuItem value="DROPPER">Dropper</MenuItem>
              )}
            </Select>
          </FormControl>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel>Bottle Size</InputLabel>
          <Select
            label="Bottle Size"
            value={bottle_size}
            onChange={(e) => {
              setBottleSize(e.target.value as string);
            }}
            sx={{ backgroundColor: "white" }}
          >
            {bottleSizeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {showsBulkPlaceholderMessage && (
            <FormHelperText>
              Bulk size is currently a placeholder while backend catalog and
              pricing data are being finalized.
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Blend Category</InputLabel>
          <Select
            label="Blend Category"
            value={effectiveCategory}
            disabled={Boolean(allowedCategory)}
            onChange={(e) => {
              setCategory(e.target.value as string);
            }}
            sx={{ backgroundColor: "white" }}
          >
            {product_type !== "CUTICLE_OIL" && (
              <MenuItem value="CUSTOM">Custom</MenuItem>
            )}
            {product_type !== "HAIR_OIL" && (
              <MenuItem value="PREMADE">Premade</MenuItem>
            )}
          </Select>
          {product_type === "HAIR_OIL" && (
            <FormHelperText>
              Hair oils are currently available as custom blends only.
            </FormHelperText>
          )}
          {product_type === "CUTICLE_OIL" && (
            <FormHelperText>
              Cuticle oils are currently available as premade blends only.
            </FormHelperText>
          )}
        </FormControl>
      </div>
    </div>
  );
}
