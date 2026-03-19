export function secSpec(total: number, count: number) {
  return count > 0 ? total / count : total;
}

export function formatSpecValue(value: string) {
  if (!value) return "Not selected";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
