"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { getCountries } from "@/lib/currency";

export function CountriesSection() {
  const countries = getCountries();
  const currencyCount = new Set(countries.map((c) => c.currency.code)).size;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3 text-sm">
        <span className="rounded-full bg-[#EBF2FF] px-4 py-1.5 font-semibold text-[#2B7FFF]">
          {countries.length} pays d&apos;Afrique
        </span>
        <span className="rounded-full bg-[#EBF2FF] px-4 py-1.5 font-semibold text-[#2B7FFF]">
          {currencyCount} devises
        </span>
      </div>

      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2.5">
        {countries.map((c) => (
          <span
            key={c.code}
            title={`${c.currency.name} (${c.currency.code})`}
            className="inline-flex items-center gap-2 rounded-full border border-[#E8ECF1] bg-white px-3.5 py-1.5 text-sm text-[#374151] shadow-sm"
          >
            <span className="rounded bg-[#F5F7FA] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-[#6B7280]">
              {c.code}
            </span>
            {c.name}
            <span className="text-xs font-semibold text-[#2B7FFF]">{c.currency.code}</span>
          </span>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/dashboard"
          className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-amber-400 bg-white px-6 text-sm font-bold uppercase tracking-wide text-amber-600 transition-colors hover:bg-amber-50"
        >
          <LayoutDashboard className="h-4 w-4" />
          Accéder au tableau de bord
        </Link>
      </div>
    </div>
  );
}
