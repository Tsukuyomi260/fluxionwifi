"use client";

import { ArrowDownLeft, ArrowUpRight, Info } from "lucide-react";
import { useReseller } from "@/components/reseller/reseller-context";
import { RESELLER, formatCdf, formatDate } from "@/lib/reseller-data";

const typeLabel = { sale: "Vente", payment: "Règlement", adjustment: "Ajustement" } as const;

export default function CreditPage() {
  const { creditUsed, creditLimit, available, ledger } = useReseller();
  const pct = Math.min(100, Math.round((creditUsed / creditLimit) * 100));

  const boxes = [
    { label: "Crédit utilisé", value: formatCdf(creditUsed), tone: "text-amber-600" },
    { label: "Limite de crédit", value: formatCdf(creditLimit), tone: "text-[#1A1D26]" },
    { label: "Commission", value: `${RESELLER.commissionRate} %`, tone: "text-emerald-600" },
    { label: "Disponible", value: formatCdf(available), tone: "text-[#2B7FFF]" },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#0B1E4D]">Mon crédit</h1>

      <div className="rounded-[14px] border border-[#E5E7EB] bg-white p-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {boxes.map((b) => (
            <div key={b.label} className="rounded-xl bg-[#F5F7FA] p-4 text-center">
              <p className="text-xs text-[#6B7280]">{b.label}</p>
              <p className={`mt-1 text-lg font-bold ${b.tone}`}>{b.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F0F2F5]">
          <div className={`h-full rounded-full ${pct > 85 ? "bg-red-500" : "bg-[#2B7FFF]"}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-[#6B7280]">{pct} % de votre limite utilisée</p>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-[#EBF2FF] px-4 py-3 text-sm text-[#1E4FB5]">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        Vous vendez à crédit : chaque vente augmente votre dette. Remettez le montant au propriétaire, qui soldera votre crédit.
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#6B7280]">Journal de la dette</h2>
        <div className="divide-y divide-[#F0F2F5] overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white">
          {ledger.map((l) => {
            const up = l.amount > 0;
            return (
              <div key={l.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className={`rounded-full p-2 ${up ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
                  {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#1A1D26]">
                    {typeLabel[l.type]} · {l.note}
                  </p>
                  <p className="text-xs text-[#6B7280]">{formatDate(l.at)}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${up ? "text-amber-600" : "text-emerald-600"}`}>
                    {up ? "+" : ""}
                    {l.amount.toLocaleString("fr-FR")}
                  </p>
                  <p className="text-[11px] text-[#9CA3AF]">Dette {formatCdf(l.debtAfter)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
