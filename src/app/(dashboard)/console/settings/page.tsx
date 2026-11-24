"use client";

import { Settings } from "lucide-react";
import { CodeSettingsForm } from "@/components/console/code-settings";
import { useCurrency } from "@/hooks/use-currency";

export default function TicketSettingsPage() {
  const { currency, country } = useCurrency();
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#1A1D26]">Configuration tickets</h1>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="flex items-center gap-2 border-b border-[#E5E7EB] px-5 py-3.5 text-base font-semibold text-[#1A1D26]">
          <Settings className="h-5 w-5 text-[#6B7280]" /> Format des codes
        </div>
        <div className="p-5">
          <p className="mb-4 text-sm text-[#6B7280]">Définit à quoi ressemblent les identifiants générés : lettres, chiffres, longueur, voucher ou utilisateur + mot de passe. S&apos;applique à tous les prochains lots.</p>
          <CodeSettingsForm />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-5 py-3.5 text-base font-semibold text-[#1A1D26]">Devise des prix</div>
        <div className="space-y-2 p-5 text-sm">
          <p className="text-[#374151]">Les prix des profils et des ventes sont exprimés en <b>{currency}</b> ({country.name}).</p>
          <p className="text-xs text-[#6B7280]">La devise suit le pays choisi à l&apos;inscription. Elle sera modifiable depuis « Mon compte ».</p>
        </div>
      </div>
    </div>
  );
}
