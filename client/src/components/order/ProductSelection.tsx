import React, { useState, useEffect } from "react";
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
  const INDIVIDUAL_HAIR_BOTTLE_SIZES: BottleSizeOption[] = [
    { value: "60mL", label: "2 oz" },
    { value: "120mL", label: "4 oz" },
    { value: "240mL", label: "8 oz" },
  ];
  const PROFESSIONAL_HAIR_BOTTLE_SIZES: BottleSizeOption[] = [
    ...INDIVIDUAL_HAIR_BOTTLE_SIZES,
    {
      value: "500mL",
      label: "500 mL (Bulk Placeholder)",
      isPlaceholderBulk: true,
    },
    {
      value: "1000mL",
      label: "1 L (Bulk Placeholder)",
      isPlaceholderBulk: true,
    },
  ];
  const INDIVIDUAL_CUTICLE_BOTTLE_SIZES: BottleSizeOption[] = [
    { value: "6mL", label: "6 mL Rollerball", bottleType: "ROLLERBALL" },
  ];
  const PROFESSIONAL_CUTICLE_BOTTLE_SIZES: BottleSizeOption[] = [
    {
      value: "6mL",
      label: "6 mL Rollerball",
      bottleType: "ROLLERBALL",
    },
    {
      value: "15mL",
      label: "0.5 oz Sample Dropper",
      bottleType: "DROPPER",
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

  useEffect(() => {
    setCustomerTier(newBlendCard.customer_tier || "INDIVIDUAL");
    setProductType(newBlendCard.product_type || "");
    setBottleType(newBlendCard.bottle_type || "DROPPER");
    setBottleSize(newBlendCard.bottle_size || "");
    setCategory(newBlendCard.category || "");
  }, [
    newBlendCard.customer_tier,
    newBlendCard.product_type,
    newBlendCard.bottle_type,
    newBlendCard.bottle_size,
    newBlendCard.category,
  ]);

  useEffect(() => {
    setNewBlendCard((prev) => ({
      ...prev,
      customer_tier,
      product_type,
      bottle_type,
      bottle_size,
      category,
    }));
  }, [
    customer_tier,
    product_type,
    bottle_type,
    bottle_size,
    category,
    setNewBlendCard,
  ]);

  const bottleSizeOptions: BottleSizeOption[] =
    product_type === "CUTICLE_OIL"
      ? customer_tier === "PROFESSIONAL"
        ? PROFESSIONAL_CUTICLE_BOTTLE_SIZES
        : INDIVIDUAL_CUTICLE_BOTTLE_SIZES
      : customer_tier === "PROFESSIONAL"
        ? PROFESSIONAL_HAIR_BOTTLE_SIZES
        : INDIVIDUAL_HAIR_BOTTLE_SIZES;

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
            ? "Business mode enabled: bulk placeholders are available for hair oils, and cuticle oils use dedicated pro bottle options."
            : "Individual mode: standard bottle sizes for personal orders."}
        </p>

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
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as string);
            }}
            sx={{ backgroundColor: "white" }}
          >
            <MenuItem value="PREMADE">Premade</MenuItem>
            <MenuItem value="CUSTOM">Custom</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
