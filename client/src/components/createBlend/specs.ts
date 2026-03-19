export const BASE_CUSTOM_SPECS: Record<
  string,
  {
    maxSecondary: number;
    maxAddOns: number;
    baseVol: number;
    secVol: number;
    addOnVol: number;
  }
> = {
  "60mL": {
    maxSecondary: 1,
    maxAddOns: 1,
    baseVol: 48,
    secVol: 12,
    addOnVol: 1,
  },
  "120mL": {
    maxSecondary: 2,
    maxAddOns: 1,
    baseVol: 90,
    secVol: 30,
    addOnVol: 1,
  },
  "240mL": {
    maxSecondary: 3,
    maxAddOns: 1,
    baseVol: 168,
    secVol: 72,
    addOnVol: 1,
  },
};

export const FULLY_CUSTOM_SPECS: Record<
  string,
  { maxAddOns: number; baseVol: number; secVol: number; addOnVol: number }
> = {
  "60mL": { maxAddOns: 2, baseVol: 48, secVol: 12, addOnVol: 3 },
  "120mL": { maxAddOns: 3, baseVol: 90, secVol: 30, addOnVol: 3 },
  "240mL": { maxAddOns: 4, baseVol: 168, secVol: 72, addOnVol: 3 },
};
