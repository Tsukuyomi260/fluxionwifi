"use client";

import { useState } from "react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Search,
  Download,
  Smartphone,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Banknote,
  CreditCard,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import { useTransactions } from "@/hooks/use-transactions";
import type { TransactionType, TransactionStatus } from "@/lib/supabase/types";

const typeConfig: Record<TransactionType, { label: string; icon: typeof ArrowDownLeft; color: string; bgColor: string; sign: "+" | "-" }> = {
  sale: { label: "Vente", icon: ArrowDownLeft, color: "text-emerald-600", bgColor: "bg-emerald-50", sign: "+" },
  commission: { label: "Commission", icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-50", sign: "+" },
  topup: { label: "Recharge", icon: ArrowDownLeft, color: "text-violet-600", bgColor: "bg-violet-50", sign: "+" },
  withdrawal: { label: "Retrait", icon: ArrowUpRight, color: "text-orange-600", bgColor: "bg-orange-50", sign: "-" },
  refund: { label: "Remboursement", icon: ArrowUpRight, color: "text-red-500", bgColor: "bg-red-50", sign: "-" },
};

const statusConfig: Record<TransactionStatus, { label: string; icon: typeof CheckCircle; color: string; bgColor: string }> = {
  completed: { label: "Complété", icon: CheckCircle, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  pending: { label: "En attente", icon: Clock, color: "text-amber-600", bgColor: "bg-amber-50" },
  failed: { label: "Échoué", icon: XCircle, color: "text-red-500", bgColor: "bg-red-50" },
};

export default function BalancePage() {
  const { currency, format } = useCurrency();
  const { transactions, loading, balance, pendingBalance, totalRevenue, totalWithdrawn } = useTransactions();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | TransactionStatus>("all");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const filtered = transactions.filter((t) => {
    if (search && !t.description?.toLowerCase().includes(search.toLowerCase()) && !t.type.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== "all" && t.type !== filterType) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#2B7FFF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1A1D26]">Mon Solde</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Suivez vos revenus et gérez vos retraits</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[#E8ECF1] text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors">
            <Download className="h-4 w-4" />
            Exporter
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors shadow-sm"
          >
            <ArrowUpRight className="h-4 w-4" />
            Retirer
          </button>
        </div>
      </div>

      {/* Balance card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0B1E4D] via-[#122B66] to-[#1A3A7A] p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#2B7FFF]/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-[#2B7FFF]/10 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-white/70" />
              <span className="text-sm font-medium text-white/70">Solde disponible</span>
            </div>
            <button onClick={() => setShowBalance(!showBalance)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 transition-colors">
              {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-4xl sm:text-5xl font-bold tracking-tight">
            {showBalance ? format(balance) : "••••••"}
          </p>
          {pendingBalance > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1">
              <Clock className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-xs font-medium text-amber-200">{format(pendingBalance)} en attente</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1A1D26]">{format(totalRevenue)}</p>
              <p className="text-xs text-[#6B7280]">Revenus totaux</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-2.5">
              <ArrowUpRight className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1A1D26]">{format(totalWithdrawn)}</p>
              <p className="text-xs text-[#6B7280]">Total retiré</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5">
              <Banknote className="h-5 w-5 text-[#2B7FFF]" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1A1D26]">{transactions.filter(t => t.type === "sale").length}</p>
              <p className="text-xs text-[#6B7280]">Ventes totales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions header + filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-base font-semibold text-[#1A1D26]">Historique des transactions</h2>
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-52 h-9 pl-9 pr-3 rounded-lg border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF]"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as "all" | TransactionType)}
            className="h-9 px-3 rounded-lg border border-[#E8ECF1] bg-white text-xs text-[#6B7280] focus:outline-none focus:border-[#2B7FFF] appearance-none pr-7 cursor-pointer"
          >
            <option value="all">Tous types</option>
            <option value="sale">Ventes</option>
            <option value="withdrawal">Retraits</option>
            <option value="commission">Commissions</option>
            <option value="topup">Recharges</option>
            <option value="refund">Remboursements</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | TransactionStatus)}
            className="h-9 px-3 rounded-lg border border-[#E8ECF1] bg-white text-xs text-[#6B7280] focus:outline-none focus:border-[#2B7FFF] appearance-none pr-7 cursor-pointer"
          >
            <option value="all">Tous statuts</option>
            <option value="completed">Complétés</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoués</option>
          </select>
        </div>
      </div>

      {/* Transactions list */}
      <div className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] divide-y divide-[#F1F3F7]">
        {filtered.map((tx) => {
          const tc = typeConfig[tx.type];
          const sc = statusConfig[tx.status];
          const date = new Date(tx.created_at);
          return (
            <div key={tx.id} className="flex items-center justify-between px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`rounded-xl p-2.5 shrink-0 ${tc.bgColor}`}>
                  <tc.icon className={`h-4 w-4 ${tc.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1A1D26] truncate">{tc.label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-[#9CA3AF] truncate">{tx.description || "—"}</p>
                    <span className={`hidden sm:inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${sc.bgColor} ${sc.color}`}>
                      <sc.icon className="h-2.5 w-2.5" />
                      {sc.label}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className={`text-sm font-semibold ${tc.sign === "+" ? "text-emerald-600" : "text-[#1A1D26]"}`}>
                  {tc.sign}{format(tx.amount)}
                </p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                  {date.toLocaleDateString("fr-FR")} · {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Wallet className="h-10 w-10 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-sm font-medium text-[#6B7280]">Aucune transaction trouvée</p>
            <p className="text-xs text-[#9CA3AF] mt-1">Modifiez vos filtres pour voir plus de résultats</p>
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowWithdrawModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F3F7]">
              <h3 className="text-base font-semibold text-[#1A1D26]">Retrait Mobile Money</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="p-2 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl bg-[#F5F7FA] p-4 text-center">
                <p className="text-xs text-[#6B7280] mb-1">Solde disponible</p>
                <p className="text-2xl font-bold text-[#1A1D26]">{format(balance)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Montant à retirer</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full h-12 px-4 rounded-xl border border-[#E8ECF1] bg-white text-lg font-semibold text-[#1A1D26] placeholder:text-[#D1D5DB] focus:outline-none focus:border-[#2B7FFF]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#9CA3AF]">{currency}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {[1000, 2000, 5000, 10000].map((amt) => (
                    <button
                      key={amt}
                      className="flex-1 h-8 rounded-lg border border-[#E8ECF1] text-xs font-medium text-[#6B7280] hover:border-[#2B7FFF] hover:text-[#2B7FFF] hover:bg-[#EBF2FF] transition-colors"
                    >
                      {amt.toLocaleString("fr-FR")}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Méthode de retrait</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 rounded-xl border-2 border-[#2B7FFF] bg-[#EBF2FF] p-3.5 cursor-pointer">
                    <input type="radio" name="method" defaultChecked className="sr-only" />
                    <div className="rounded-lg bg-amber-100 p-2">
                      <Smartphone className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1A1D26]">Mobile Money</p>
                      <p className="text-[11px] text-[#6B7280]">MTN MoMo, Moov Money, Orange Money</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border-2 border-[#E8ECF1] p-3.5 cursor-pointer hover:border-[#2B7FFF]/50">
                    <input type="radio" name="method" className="sr-only" />
                    <div className="rounded-lg bg-blue-100 p-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1A1D26]">Virement bancaire</p>
                      <p className="text-[11px] text-[#6B7280]">Délai 2-3 jours ouvrés</p>
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Numéro de téléphone</label>
                <input
                  type="tel"
                  placeholder="+229 xx xx xx xx"
                  className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF]"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-t border-[#F1F3F7]">
              <button onClick={() => setShowWithdrawModal(false)} className="flex-1 h-10 rounded-xl border border-[#E8ECF1] text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors">
                Annuler
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors">
                <ArrowUpRight className="h-4 w-4" />
                Confirmer le retrait
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
