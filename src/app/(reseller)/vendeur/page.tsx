"use client";

import { useMemo, useState } from "react";
import { Search, ShoppingCart, Printer } from "lucide-react";
import { useReseller } from "@/components/reseller/reseller-context";
import { TicketModal } from "@/components/reseller/ticket-modal";
import { RESELLER, RESELLER_PROFILES, formatCdf, netCost, type ResellerProfileItem, type Sale } from "@/lib/reseller-data";

export default function VendrePage() {
  const { sell, available } = useReseller();
  const [query, setQuery] = useState("");
  const [sale, setSale] = useState<Sale | null>(null);
  const [error, setError] = useState<string | null>(null);

  const list = useMemo(
    () => RESELLER_PROFILES.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase())),
    [query]
  );

  function handleSell(p: ResellerProfileItem) {
    const res = sell(p);
    if (res.ok) {
      setError(null);
      setSale(res.sale);
    } else {
      setError(res.error);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1E4D]">Vente de tickets WiFi</h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Choisissez un forfait. Votre commission de {RESELLER.commissionRate} % est déjà déduite de la dette ajoutée à votre crédit.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un forfait…"
          className="h-11 w-full rounded-xl border border-[#D1D5DB] bg-white pl-10 pr-4 text-sm focus:border-[#2B7FFF] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Desktop : tableau */}
      <div className="hidden overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white md:block">
        <table className="w-full text-sm">
          <thead className="bg-[#F9FAFC] text-left text-xs uppercase tracking-wide text-[#6B7280]">
            <tr>
              <th className="px-5 py-3 font-medium">Forfait</th>
              <th className="px-5 py-3 font-medium">Validité</th>
              <th className="px-5 py-3 font-medium">Prix</th>
              <th className="px-5 py-3 font-medium">À régler</th>
              <th className="px-5 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F2F5]">
            {list.map((p) => {
              const cost = netCost(p.price, RESELLER.commissionRate);
              return (
                <tr key={p.id} className="hover:bg-[#FAFBFD]">
                  <td className="px-5 py-3.5 font-medium text-[#1A1D26]">{p.name}</td>
                  <td className="px-5 py-3.5 text-[#6B7280]">{p.validity}</td>
                  <td className="px-5 py-3.5 font-semibold text-[#0B1E4D]">{formatCdf(p.price)}</td>
                  <td className="px-5 py-3.5 text-[#6B7280]">{formatCdf(cost)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleSell(p)}
                      disabled={available < cost}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-500 px-4 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-[#D1D5DB]"
                    >
                      <ShoppingCart className="h-4 w-4" /> Vendre
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile : cartes */}
      <div className="space-y-3 md:hidden">
        {list.map((p) => {
          const cost = netCost(p.price, RESELLER.commissionRate);
          return (
            <div key={p.id} className="rounded-[14px] border border-[#E5E7EB] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#1A1D26]">{p.name}</p>
                  <p className="mt-0.5 text-xs text-[#6B7280]">{p.validity} · coût {formatCdf(cost)}</p>
                </div>
                <p className="shrink-0 text-base font-bold text-[#0B1E4D]">{formatCdf(p.price)}</p>
              </div>
              <button
                onClick={() => handleSell(p)}
                disabled={available < cost}
                className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-[#D1D5DB]"
              >
                <Printer className="h-4 w-4" /> Vendre et générer le ticket
              </button>
            </div>
          );
        })}
      </div>

      {list.length === 0 && <p className="py-10 text-center text-sm text-[#6B7280]">Aucun forfait ne correspond.</p>}

      {sale && <TicketModal sale={sale} onClose={() => setSale(null)} />}
    </div>
  );
}
