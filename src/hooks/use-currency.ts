"use client";

import { useUser } from "./use-user";
import { getDefaultCountry, getCountry, getCountryByName, formatPrice, type Country } from "@/lib/currency";

export function useCurrency() {
  const { user } = useUser();

  let country: Country = getDefaultCountry();

  if (user?.user_metadata?.country) {
    const raw = user.user_metadata.country as string;
    const byCode = getCountry(raw);
    if (byCode) {
      country = byCode;
    } else {
      const byName = getCountryByName(raw);
      if (byName) country = byName;
    }
  }

  const currency = country.currency.code;
  const phonePrefix = country.phonePrefix;

  function format(amount: number): string {
    return formatPrice(amount, currency);
  }

  return { country, currency, phonePrefix, format };
}
