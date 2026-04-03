import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ProductGuide from "./ProductGuide";
import "../../styles/ProductSelection.css";

interface NewBlendCard {
  name: string;
  description: string;
  product_type: string;
  category: string;
  bottle_size: string;
  bottle_type: string;
}

export default function ProductSelection({
  newBlendCard,
  setNewBlendCard,
}: {
  newBlendCard: NewBlendCard;
  setNewBlendCard: React.Dispatch<React.SetStateAction<NewBlendCard>>;
}) {
  const [product_type, setProductType] = useState("");
  const [bottle_type, setBottleType] = useState("DROPPER");
  const [bottle_size, setBottleSize] = useState("");

  useEffect(() => {
    setNewBlendCard({
      ...newBlendCard,
      product_type,
      bottle_type,
      bottle_size,
    });
  }, [product_type, bottle_type, bottle_size]);

  return (
    <div className="product-selection-layout">
      <ProductGuide />

      {/* Form Section */}
      <div className="product-selection-form">
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
              }
            }}
            sx={{ backgroundColor: "white" }}
          >
            <MenuItem value="HAIR_OIL">Hair Oil</MenuItem>
            <MenuItem value="FRAGRANCE_OIL">Fragrance Oil</MenuItem>
          </Select>
        </FormControl>

        {product_type === "HAIR_OIL" && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Bottle Type</InputLabel>
            <Select
              label="Bottle Type"
              value={bottle_type}
              disabled
              sx={{ backgroundColor: "white" }}
            >
              {/* <MenuItem value="SQUEEZE">Squeeze</MenuItem> */}
              <MenuItem value="DROPPER">Dropper</MenuItem>
            </Select>
          </FormControl>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel>Bottle Size</InputLabel>
          <Select
            label="Bottle Size"
            onChange={(e) => {
              setBottleSize(e.target.value as string);
            }}
            sx={{ backgroundColor: "white" }}
          >
            <MenuItem value="60mL">2 oz</MenuItem>
            <MenuItem value="120mL">4 oz</MenuItem>
            <MenuItem value="240mL">8 oz</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Blend Category</InputLabel>
          <Select
            label="Blend Category"
            onChange={(e) => {
              setNewBlendCard({
                ...newBlendCard,
                category: e.target.value as string,
              });
            }}
            sx={{ backgroundColor: "white" }}
          >
            <MenuItem value="PREMADE">Premade</MenuItem>
            <MenuItem value="BASE_CUSTOM">Base Custom</MenuItem>
            <MenuItem value="FULLY_CUSTOM">Fully Custom</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
