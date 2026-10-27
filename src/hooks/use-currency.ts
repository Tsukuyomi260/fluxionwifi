import { getDefaultCountry, formatPrice, type Country } from "@/lib/currency";

export function useCurrency() {
  // Phase UI: default country (RD Congo)
  // Phase Data: will read from user profile in Supabase (user_metadata.country)
  const country = getDefaultCountry();
  const currency = country.currency.code;
  const phonePrefix = country.phonePrefix;

  function format(amount: number): string {
    return formatPrice(amount, currency);
  }

  return { country, currency, phonePrefix, format };
}
