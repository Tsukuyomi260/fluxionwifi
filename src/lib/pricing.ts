/**
 * Prix de référence en CDF (devise par défaut, plateforme développée en RDC).
 * Les autres devises sont des équivalents INDICATIFS arrondis : ajuster `RATES`
 * (unités de devise pour 1 CDF) ou remplacer par une grille tarifaire fixe.
 */
export const PRO_MONTHLY_CDF = 65000;
export const PRO_ANNUAL_MONTHS = 10; // 2 mois offerts

const RATES: Record<string, number> = {
  CDF: 1,
  XOF: 0.21,
  XAF: 0.21,
  GNF: 3.0,
  MGA: 1.6,
  KMF: 0.16,
  DJF: 0.062,
  RWF: 0.5,
  BIF: 1.03,
  MUR: 0.016,
  SCR: 0.0053,
  MAD: 0.0035,
  TND: 0.0011,
  DZD: 0.047,
};

function niceRound(value: number): number {
  if (value <= 0) return 0;
  const digits = Math.floor(Math.log10(value)) + 1;
  const step = Math.pow(10, Math.max(digits - 2, 0)); // 2 chiffres significatifs
  return Math.round(value / step) * step;
}

export function convertFromCDF(amountCdf: number, currencyCode: string): number {
  const rate = RATES[currencyCode] ?? 1;
  return currencyCode === "CDF" ? amountCdf : niceRound(amountCdf * rate);
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString("fr-FR");
}
