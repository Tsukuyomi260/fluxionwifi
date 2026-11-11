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
  Info,
  Send,
  UserCircle,
  Receipt,
  Coins,
  Monitor,
  Network,
  Shield,
  Radio,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/hooks/use-currency";
import { useTransactions } from "@/hooks/use-transactions";
import type { TransactionType, TransactionStatus } from "@/lib/supabase/types";

const statusConfig: Record<TransactionStatus, { label: string; color: string }> = {
  completed: { label: "Payé", color: "text-emerald-400" },
  pending: { label: "En attente", color: "text-amber-400" },
  failed: { label: "Échoué", color: "text-red-400" },
};

const services = [
  { name: "Facturation sur abonnement", desc: "Activez ou prolongez votre abonnement mensuel / annuel.", price: "À partir de 3 962", icon: Receipt },
  { name: "Facturation sur crédit", desc: "Rechargez votre crédit plateforme (prélèvement en % sur chaque vente).", price: "Recharge dès 3 962", icon: Coins },
  { name: "Achat de portails", desc: "Débloquez à vie un modèle de portail captif premium.", price: "À partir de 3 962", icon: Monitor },
  { name: "Espace interopérabilité", desc: "Ajoutez des routeurs au réseau d'interopérabilité multi-sites.", price: "À partir de 5 151 / mois", icon: Network },
  { name: "Espace VPN", desc: "Débloquez des espaces VPN (routeurs et postes de travail).", price: "À partir de 1 981 / mois", icon: Shield },
  { name: "Espace antenne", desc: "Ajoutez des antennes LAN pilotables à distance (validité 1 an).", price: "1 189 / espace (1 an)", icon: Radio },
];

export default function BalancePage() {
  const { currency, format } = useCurrency();
  const { transactions, loading, balance, pendingBalance, totalRevenue, totalWithdrawn } = useTransactions();
  const [withdrawAmount, setWithdrawAmount] = useState("1000");
  const [withdrawReason, setWithdrawReason] = useState("");

  const salesCount = transactions.filter((t) => t.type === "sale").length;
  const pendingCount = transactions.filter((t) => t.status === "pending").length;
  const withdrawnCount = transactions.filter((t) => t.type === "withdrawal" && t.status === "completed").length;
  const internalPayments = transactions.filter((t) => t.type === "commission" || t.type === "topup");
  const internalTotal = internalPayments.reduce((acc, t) => acc + t.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#2B7FFF]" />
      </div>
    );
  }

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-[#1F2937] p-4 lg:p-6 space-y-6">
      {/* Title */}
      <div className="rounded-2xl bg-[#111827] border border-[#374151] p-6">
        <h1 className="text-center text-lg font-bold text-white tracking-wide uppercase">
          💰 Tableau de bord financier
        </h1>
        <div className="h-px bg-gradient-to-r from-transparent via-[#2B7FFF] to-transparent mt-4" />

        {/* Currency badge */}
        <div className="flex justify-center mt-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#4B5563] bg-[#1F2937] px-4 py-1.5 text-sm text-slate-300">
            💵 {currency === "CDF" ? "Franc Congolais" : currency === "XOF" ? "Franc CFA" : currency} ({currency})
          </span>
        </div>

        {/* Stat cards — 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="rounded-xl bg-[#1F2937] border-l-4 border-emerald-500 p-4">
            <div className="flex justify-center mb-2">
              <Banknote className="h-8 w-8 text-emerald-400" />
            </div>
            <p className="text-xs font-semibold text-slate-400 text-center uppercase">Montant encaissé</p>
            <p className="text-xl font-bold text-orange-400 text-center mt-1">
              {totalRevenue.toLocaleString("fr-FR")} {currency}
              <span className="text-xs text-slate-500 ml-1">{salesCount}</span>
            </p>
            <p className="text-[11px] text-slate-500 text-center">transaction{salesCount !== 1 ? "s" : ""}</p>
          </div>

          <div className="rounded-xl bg-[#1F2937] border-l-4 border-[#2B7FFF] p-4">
            <div className="flex justify-center mb-2">
              <Wallet className="h-8 w-8 text-[#2B7FFF]" />
            </div>
            <p className="text-xs font-semibold text-slate-400 text-center uppercase">Solde disponible</p>
            <p className="text-xl font-bold text-orange-400 text-center mt-1">
              {balance.toLocaleString("fr-FR")} {currency}
            </p>
            <p className="text-[11px] text-slate-500 text-center">Prêt pour retrait (min. 1000 {currency})</p>
          </div>

          <div className="rounded-xl bg-[#1F2937] border-l-4 border-amber-500 p-4">
            <div className="flex justify-center mb-2">
              <Clock className="h-8 w-8 text-amber-400" />
            </div>
            <p className="text-xs font-semibold text-slate-400 text-center uppercase">Demandes en attente</p>
            <p className="text-xl font-bold text-orange-400 text-center mt-1">
              {pendingBalance.toLocaleString("fr-FR")} {currency}
              <span className="text-xs text-slate-500 ml-1">{pendingCount}</span>
            </p>
            <p className="text-[11px] text-slate-500 text-center">demande{pendingCount !== 1 ? "s" : ""}</p>
          </div>

          <div className="rounded-xl bg-[#1F2937] border-l-4 border-violet-500 p-4">
            <div className="flex justify-center mb-2">
              <ArrowUpRight className="h-8 w-8 text-violet-400" />
            </div>
            <p className="text-xs font-semibold text-slate-400 text-center uppercase">Total retiré</p>
            <p className="text-xl font-bold text-orange-400 text-center mt-1">
              {totalWithdrawn.toLocaleString("fr-FR")} {currency}
              <span className="text-xs text-slate-500 ml-1">{withdrawnCount}</span>
            </p>
            <p className="text-[11px] text-slate-500 text-center">demande{withdrawnCount !== 1 ? "s" : ""} validée{withdrawnCount !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Paiements internes card */}
        <div className="mt-4">
          <div className="rounded-xl bg-[#1F2937] border-l-4 border-[#2B7FFF] p-4 w-full sm:w-72">
            <div className="flex justify-center mb-2">
              <ShoppingBag className="h-8 w-8 text-[#2B7FFF]" />
            </div>
            <p className="text-xs font-semibold text-slate-400 text-center uppercase">Paiements internes</p>
            <p className="text-xl font-bold text-orange-400 text-center mt-1">
              {internalTotal.toLocaleString("fr-FR")} {currency}
              <span className="text-xs text-slate-500 ml-1">{internalPayments.length}</span>
            </p>
            <p className="text-[11px] text-slate-500 text-center">paiement{internalPayments.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="rounded-2xl bg-[#111827] border border-[#374151] border-l-4 border-l-amber-500 p-5">
        <p className="text-sm text-slate-300">
          <span className="font-semibold text-amber-400">ℹ Information :</span>{" "}
          Le solde disponible = ventes &gt; 72h (après commission) + Recharges - Total Retiré - Demandes en Attente - Paiements Internes
        </p>
      </div>

      {/* Demande de retrait */}
      <div className="rounded-2xl bg-[#111827] border border-[#374151] p-6">
        <h2 className="text-center text-base font-bold text-amber-400 uppercase mb-4">
          💳 Demande de retrait
        </h2>

        <div className="flex justify-center mb-5">
          <p className="text-sm text-emerald-400 bg-[#1F2937] rounded-xl px-5 py-2.5 border border-[#374151]">
            Vous pouvez demander un retrait. Montant max: {balance.toLocaleString("fr-FR")} {currency}.
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <div>
            <p className="text-sm text-slate-300 text-center mb-2">🪙 Montant souhaité ({currency}):</p>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full h-12 rounded-xl bg-[#1F2937] border border-[#4B5563] text-center text-lg font-bold text-orange-400 focus:outline-none focus:border-[#2B7FFF]"
            />
          </div>
          <div>
            <p className="text-sm text-slate-300 text-center mb-2">📋 Motif ou détails du retrait :</p>
            <textarea
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              placeholder="Ex. : achat de matériel, paiement du fournisseur, précision sur le numéro à utiliser..."
              rows={3}
              className="w-full rounded-xl bg-[#1F2937] border border-[#4B5563] p-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-[#2B7FFF] resize-none"
            />
          </div>
          <div className="flex items-center gap-3 justify-center">
            <button className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#374151] text-sm font-medium text-slate-300 hover:bg-[#4B5563] transition-colors">
              <UserCircle className="h-4 w-4" />
              Modifier Profil
            </button>
            <button className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-orange-500 text-sm font-medium text-white hover:bg-orange-600 transition-colors">
              <Send className="h-4 w-4" />
              Demander un retrait
            </button>
          </div>
        </div>
      </div>

      {/* Payer avec mon solde */}
      <div className="rounded-2xl bg-[#111827] border border-[#374151] p-6">
        <h2 className="text-base font-bold text-amber-400 uppercase mb-3">
          🛒 Payer avec mon solde
        </h2>
        <div className="rounded-xl bg-[#1F2937] border-l-4 border-l-amber-500 p-4 mb-5">
          <p className="text-sm text-slate-300">
            ⚡ Réglez vos services FLUXIONWIFI sans passer par Mobile Money : le montant est débité immédiatement de votre <strong className="text-white">Solde Disponible</strong> et le service est activé dans la foulée.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((svc) => (
            <div key={svc.name} className="rounded-xl bg-[#1F2937] border border-[#374151] p-4 hover:border-[#2B7FFF]/50 transition-colors">
              <svc.icon className="h-7 w-7 text-amber-400 mb-3" />
              <h3 className="text-sm font-semibold text-white mb-1">{svc.name}</h3>
              <p className="text-xs text-slate-400 mb-3">{svc.desc}</p>
              <p className="text-xs font-semibold text-emerald-400">{svc.price} {currency}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Historique des Paiements Internes */}
      <div className="rounded-2xl bg-[#111827] border border-[#374151] p-6">
        <h2 className="text-base font-bold text-amber-400 uppercase mb-4 border-l-4 border-amber-400 pl-3">
          📊 Historique des Paiements Internes
        </h2>

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#374151]">
                <th className="text-left px-4 py-3 text-xs font-bold text-[#2B7FFF] uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#2B7FFF] uppercase">Service</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#2B7FFF] uppercase">Détail</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-amber-400 uppercase">Montant débité</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#2B7FFF] uppercase">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#2B7FFF] uppercase">Référence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]">
              {transactions.map((tx) => {
                const sc = statusConfig[tx.status];
                const date = new Date(tx.created_at);
                return (
                  <tr key={tx.id} className="hover:bg-[#1F2937]/50">
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {date.toLocaleDateString("fr-FR")} {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">{tx.type}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{tx.description || "—"}</td>
                    <td className="px-4 py-3 text-xs text-slate-300">{tx.amount.toLocaleString("fr-FR")} {currency}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${sc.color}`}>✅ {sc.label}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{tx.id.slice(0, 12).toUpperCase()}</td>
                  </tr>
                );
              })}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                    Aucune transaction
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden space-y-3">
          {transactions.map((tx) => {
            const sc = statusConfig[tx.status];
            const date = new Date(tx.created_at);
            return (
              <div key={tx.id} className="rounded-xl bg-[#1F2937] border border-[#374151] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{date.toLocaleDateString("fr-FR")}</span>
                  <span className={`text-xs font-medium ${sc.color}`}>✅ {sc.label}</span>
                </div>
                <p className="text-sm font-medium text-slate-300">{tx.type}</p>
                <p className="text-xs text-slate-400">{tx.description || "—"}</p>
                <p className="text-sm font-bold text-orange-400">{tx.amount.toLocaleString("fr-FR")} {currency}</p>
              </div>
            );
          })}
          {transactions.length === 0 && (
            <div className="text-center py-12 text-sm text-slate-500">Aucune transaction</div>
          )}
        </div>
      </div>
    </div>
  );
}
