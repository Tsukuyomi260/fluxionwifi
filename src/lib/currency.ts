export interface CountryCurrency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export interface Country {
  code: string;
  name: string;
  phonePrefix: string;
  currency: CountryCurrency;
}

const countries: Country[] = [
  { code: "CD", name: "RD Congo", phonePrefix: "+243", currency: { code: "CDF", symbol: "FC", name: "Franc congolais", locale: "fr-CD" } },
  { code: "CG", name: "Congo-Brazzaville", phonePrefix: "+242", currency: { code: "XAF", symbol: "FCFA", name: "Franc CFA (CEMAC)", locale: "fr-CG" } },
  { code: "BJ", name: "Bénin", phonePrefix: "+229", currency: { code: "XOF", symbol: "FCFA", name: "Franc CFA (UEMOA)", locale: "fr-BJ" } },
  { code: "CI", name: "Côte d'Ivoire", phonePrefix: "+225", currency: { code: "XOF", symbol: "FCFA", name: "Franc CFA (UEMOA)", locale: "fr-CI" } },
  { code: "SN", name: "Sénégal", phonePrefix: "+221", currency: { code: "XOF", symbol: "FCFA", name: "Franc CFA (UEMOA)", locale: "fr-SN" } },
  { code: "ML", name: "Mali", phonePrefix: "+223", currency: { code: "XOF", symbol: "FCFA", name: "Franc CFA (UEMOA)", locale: "fr-ML" } },
  { code: "BF", name: "Burkina Faso", phonePrefix: "+226", currency: { code: "XOF", symbol: "FCFA", name: "Franc CFA (UEMOA)", locale: "fr-BF" } },
  { code: "TG", name: "Togo", phonePrefix: "+228", currency: { code: "XOF", symbol: "FCFA", name: "Franc CFA (UEMOA)", locale: "fr-TG" } },
  { code: "NE", name: "Niger", phonePrefix: "+227", currency: { code: "XOF", symbol: "FCFA", name: "Franc CFA (UEMOA)", locale: "fr-NE" } },
  { code: "GW", name: "Guinée-Bissau", phonePrefix: "+245", currency: { code: "XOF", symbol: "FCFA", name: "Franc CFA (UEMOA)", locale: "pt-GW" } },
  { code: "CM", name: "Cameroun", phonePrefix: "+237", currency: { code: "XAF", symbol: "FCFA", name: "Franc CFA (CEMAC)", locale: "fr-CM" } },
  { code: "GA", name: "Gabon", phonePrefix: "+241", currency: { code: "XAF", symbol: "FCFA", name: "Franc CFA (CEMAC)", locale: "fr-GA" } },
  { code: "TD", name: "Tchad", phonePrefix: "+235", currency: { code: "XAF", symbol: "FCFA", name: "Franc CFA (CEMAC)", locale: "fr-TD" } },
  { code: "CF", name: "Centrafrique", phonePrefix: "+236", currency: { code: "XAF", symbol: "FCFA", name: "Franc CFA (CEMAC)", locale: "fr-CF" } },
  { code: "GQ", name: "Guinée équatoriale", phonePrefix: "+240", currency: { code: "XAF", symbol: "FCFA", name: "Franc CFA (CEMAC)", locale: "es-GQ" } },
  { code: "GN", name: "Guinée", phonePrefix: "+224", currency: { code: "GNF", symbol: "FG", name: "Franc guinéen", locale: "fr-GN" } },
  { code: "MG", name: "Madagascar", phonePrefix: "+261", currency: { code: "MGA", symbol: "Ar", name: "Ariary", locale: "fr-MG" } },
  { code: "KM", name: "Comores", phonePrefix: "+269", currency: { code: "KMF", symbol: "FC", name: "Franc comorien", locale: "fr-KM" } },
  { code: "DJ", name: "Djibouti", phonePrefix: "+253", currency: { code: "DJF", symbol: "Fdj", name: "Franc djiboutien", locale: "fr-DJ" } },
  { code: "RW", name: "Rwanda", phonePrefix: "+250", currency: { code: "RWF", symbol: "FRw", name: "Franc rwandais", locale: "fr-RW" } },
  { code: "BI", name: "Burundi", phonePrefix: "+257", currency: { code: "BIF", symbol: "FBu", name: "Franc burundais", locale: "fr-BI" } },
  { code: "MU", name: "Maurice", phonePrefix: "+230", currency: { code: "MUR", symbol: "Rs", name: "Roupie mauricienne", locale: "fr-MU" } },
  { code: "SC", name: "Seychelles", phonePrefix: "+248", currency: { code: "SCR", symbol: "Rs", name: "Roupie seychelloise", locale: "fr-SC" } },
  { code: "MA", name: "Maroc", phonePrefix: "+212", currency: { code: "MAD", symbol: "DH", name: "Dirham marocain", locale: "fr-MA" } },
  { code: "TN", name: "Tunisie", phonePrefix: "+216", currency: { code: "TND", symbol: "DT", name: "Dinar tunisien", locale: "fr-TN" } },
  { code: "DZ", name: "Algérie", phonePrefix: "+213", currency: { code: "DZD", symbol: "DA", name: "Dinar algérien", locale: "fr-DZ" } },
];

export function getCountries(): Country[] {
  return countries;
}

export function getCountry(code: string): Country | undefined {
  return countries.find((c) => c.code === code);
}

export function getDefaultCountry(): Country {
  return countries[0]; // RD Congo as default — will come from user profile in Phase Data
}

export function formatPrice(amount: number, currencyCode: string): string {
  return `${amount.toLocaleString()} ${currencyCode}`;
}
