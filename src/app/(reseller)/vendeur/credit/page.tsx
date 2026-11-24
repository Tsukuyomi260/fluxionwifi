"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Wallet, X } from "lucide-react";
import { useReseller } from "@/components/reseller/reseller-context";
import { RESELLER, formatCdf, formatDate } from "@/lib/reseller-data";

const typeLabel = { topup: "Recharge", sale: "Vente", refund: "Remboursement", adjustment: "Ajustement" } as const;

export default function CreditPage() {
  const { balance, ledger, topUp } = useReseller();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return;
    topUp(Math.round(n));
    setAmount("");
    setOpen(false);
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#0B1E4D]">Mon crédit</h1>

      <div className="relative overflow-hidden rounded-[14px] bg-[#0B1E4D] p-6 text-white">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#2B7FFF]/30 blur-2xl" />
        <p className="relative text-sm text-white/70">Solde disponible</p>
        <p className="relative mt-1 text-4xl font-bold">{formatCdf(balance)}</p>
        <p className="relative mt-2 text-xs text-white/60">Commission : {RESELLER.commissionRate} % sur chaque vente</p>
        <button
          onClick={() => setOpen(true)}
          className="relative mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-[#0B1E4D] hover:bg-[#EBF2FF]"
        >
          <Wallet className="h-4 w-4" /> Recharger
        </button>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#6B7280]">Mouvements</h2>
        <div className="divide-y divide-[#F0F2F5] overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white">
          {ledger.map((l) => {
            const credit = l.amount > 0;
            return (
              <div key={l.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className={`rounded-full p-2 ${credit ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                  {credit ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#1A1D26]">
                    {typeLabel[l.type]} · {l.note}
                  </p>
                  <p className="text-xs text-[#6B7280]">{formatDate(l.at)}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${credit ? "text-emerald-600" : "text-red-500"}`}>
                    {credit ? "+" : ""}
                    {formatCdf(l.amount)}
                  </p>
                  <p className="text-[11px] text-[#9CA3AF]">Solde {formatCdf(l.balanceAfter)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0B1E4D]">Recharger mon crédit</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F5F7FA]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <label className="mt-4 block text-sm font-medium text-[#374151]" htmlFor="amount">Montant (CDF)</label>
            <input
              id="amount"
              type="number"
              min={1000}
              step={500}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex. 10000"
              className="mt-1.5 h-11 w-full rounded-xl border border-[#D1D5DB] px-4 text-sm focus:border-[#2B7FFF] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20"
            />
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Démonstration : le paiement Mobile Money (FlexPay) sera branché avec le back-end. Ici, le montant est ajouté directement.
            </p>
            <button type="submit" className="mt-4 h-11 w-full rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6]">
              Confirmer
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
