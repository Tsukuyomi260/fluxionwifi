"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Ticket, Coins, TrendingUp } from "lucide-react";
import { useReseller } from "@/components/reseller/reseller-context";
import { TicketModal } from "@/components/reseller/ticket-modal";
import { formatCdf, formatDate, type Sale } from "@/lib/reseller-data";

const ranges = [
  { key: "today", label: "Aujourd'hui", days: 1 },
  { key: "week", label: "7 jours", days: 7 },
  { key: "month", label: "30 jours", days: 30 },
  { key: "all", label: "Tout", days: 0 },
] as const;

export default function HistoriquePage() {
  const { sales } = useReseller();
  const [range, setRange] = useState<(typeof ranges)[number]["key"]>("all");
  const [now, setNow] = useState<number | null>(null);
  const [selected, setSelected] = useState<Sale | null>(null);

  useEffect(() => setNow(Date.now()), []);

  const filtered = useMemo(() => {
    const r = ranges.find((x) => x.key === range)!;
    if (!r.days || now === null) return sales;
    return sales.filter((s) => now - new Date(s.at).getTime() <= r.days * 86_400_000);
  }, [sales, range, now]);

  const revenue = filtered.reduce((sum, s) => sum + s.price, 0);
  const earned = filtered.reduce((sum, s) => sum + (s.price - s.cost), 0);

  const stats = [
    { label: "Tickets vendus", value: String(filtered.length), icon: Ticket, tone: "bg-[#EBF2FF] text-[#2B7FFF]" },
    { label: "Chiffre d'affaires", value: formatCdf(revenue), icon: TrendingUp, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Commission gagnée", value: formatCdf(earned), icon: Coins, tone: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#0B1E4D]">Historique des ventes</h1>

      <div className="flex flex-wrap gap-2">
        {ranges.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              range === r.key ? "bg-[#2B7FFF] text-white" : "border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F5F7FA]"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-[14px] border border-[#E5E7EB] bg-white p-4">
            <div className={`rounded-xl p-2.5 ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">{s.label}</p>
              <p className="text-lg font-bold text-[#1A1D26]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="divide-y divide-[#F0F2F5] overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white">
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-[#6B7280]">Aucune vente sur cette période.</p>}
        {filtered.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-3 px-4 py-3.5">
            <div className="min-w-0">
              <p className="truncate font-medium text-[#1A1D26]">{s.profileName}</p>
              <p className="text-xs text-[#6B7280]">
                {formatDate(s.at)} · <span className="font-mono">{s.code}</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm font-semibold text-[#0B1E4D]">{formatCdf(s.price)}</span>
              <button
                onClick={() => setSelected(s)}
                aria-label="Revoir le ticket"
                className="rounded-lg border border-[#E5E7EB] p-2 text-[#6B7280] hover:bg-[#F5F7FA]"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && <TicketModal sale={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
