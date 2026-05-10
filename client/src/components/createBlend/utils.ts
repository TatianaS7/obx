export function secSpec(total: number, count: number) {
  return count > 0 ? total / count : total;
}

export const OIL_DENSITY_G_PER_ML = 0.92;

export function mlToGrams(valueMl: number) {
  return valueMl * OIL_DENSITY_G_PER_ML;
}

export function formatGrams(valueMl: number, decimals = 1) {
  return `${mlToGrams(valueMl).toFixed(decimals)} g`;
}

export function formatBottleSizeOz(value: string) {
  if (!value) return "Not selected";

  const normalized = value.trim().toUpperCase().replace(/\s+/g, "");

  if (normalized === "5ML" || normalized === "MINI") return "5 mL";
  if (normalized === "60ML" || normalized === "SMALL") return "2 oz";
  if (normalized === "120ML" || normalized === "MEDIUM") return "4 oz";
  if (normalized === "240ML" || normalized === "LARGE") return "8 oz";

  return value;
}

export function formatSpecValue(value: string) {
  if (!value) return "Not selected";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
