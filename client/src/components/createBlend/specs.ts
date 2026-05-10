export const CUSTOM_SPECS: Record<
  string,
  { maxAddOns: number; baseVol: number; secVol: number; addOnVol: number }
> = {
  "5mL": { maxAddOns: 1, baseVol: 4, secVol: 1, addOnVol: 0.5 },
  "60mL": { maxAddOns: 2, baseVol: 43, secVol: 12, addOnVol: 3 },
  "120mL": { maxAddOns: 3, baseVol: 85, secVol: 30, addOnVol: 3 },
  "240mL": { maxAddOns: 4, baseVol: 163, secVol: 72, addOnVol: 3 },
};
