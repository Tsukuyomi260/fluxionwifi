"use client";

import { useState } from "react";
import { useCurrency } from "@/hooks/use-currency";
import { useSellers } from "@/hooks/use-sellers";
import { useTickets } from "@/hooks/use-tickets";
import type { Seller, SellerStatus } from "@/lib/supabase/types";
import {
  Users,
  UserPlus,
  X,
  Send,
  Loader2,
  Trash2,
  Printer,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  TrendingUp,
  Ticket,
  Trophy,
  CreditCard,
  Banknote,
  Database,
} from "lucide-react";

export default function SellersPage() {
  const { currency, phonePrefix } = useCurrency();
  const {
    sellers,
    assignments,
    loading,
    addSeller,
    toggleStatus,
    assignStock,
  } = useSellers();
  const { profiles } = useTickets();

  const [vendeurFilter, setVendeurFilter] = useState("all");
  const [periodeFilter, setPeriodeFilter] = useState("today");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [typeVente, setTypeVente] = useState("brute");

  const [rembVendeur, setRembVendeur] = useState("all");
  const [rembPeriode, setRembPeriode] = useState("all");
  const [rembMethode, setRembMethode] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState<Seller | null>(null);
  const [assignProfile, setAssignProfile] = useState("");
  const [assignQty, setAssignQty] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    phone: "",
    location: "",
    commission: 15,
  });

  const activeSellers = sellers.filter((s) => s.status === "active");
  const totalRevenue = sellers.reduce((s, v) => s + v.total_revenue, 0);
  const totalSold = sellers.reduce((s, v) => s + v.total_sold, 0);
  const bestSeller = sellers.length > 0
    ? sellers.reduce((best, s) => (s.total_sold > best.total_sold ? s : best), sellers[0])
    : null;

  const totalRemboursements = assignments
    .filter((a) => a.type === "return" || a.type === "assign")
    .reduce((sum, a) => sum + (a.quantity || 0), 0);

  function filterAssignmentsByPeriod() {
    let filtered = assignments.filter((a) => a.type === "assign");
    if (vendeurFilter !== "all") {
      filtered = filtered.filter((a) => a.seller_id === vendeurFilter);
    }
    return filtered;
  }

  const filteredAssignments = filterAssignmentsByPeriod();

  async function handleAddSeller() {
    if (!addForm.name || !addForm.phone) return;
    setSubmitting(true);
    await addSeller({
      name: addForm.name,
      phone: `${phonePrefix} ${addForm.phone}`,
      location: addForm.location,
      commission_rate: addForm.commission,
    });
    setSubmitting(false);
    setShowAddModal(false);
    setAddForm({ name: "", phone: "", location: "", commission: 15 });
  }

  async function handleAssignStock() {
    if (!assignTarget || !assignProfile) return;
    setSubmitting(true);
    await assignStock(assignTarget.id, assignProfile, assignQty);
    setSubmitting(false);
    setShowAssignModal(false);
  }

  function openAssign(seller: Seller) {
    setAssignTarget(seller);
    setAssignProfile("");
    setAssignQty(10);
    setShowAssignModal(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#2B7FFF]" />
      </div>
    );
  }

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-[#1F2937] p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">
            Inventaire{" "}
            <span className="text-orange-400">(Ventes Brutes)</span>{" "}
            <span className="text-slate-400 text-base">({currency})</span>
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2B7FFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Ajouter vendeur
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-[#374151] bg-[#111827] p-5">
          <p className="text-sm text-orange-400 mb-1 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Total des ventes <span className="text-emerald-400">(brut)</span>
          </p>
          <p className="text-2xl font-bold text-white">
            {totalRevenue.toLocaleString("fr-FR")} {currency}
          </p>
        </div>
        <div className="rounded-xl border border-[#374151] bg-[#111827] p-5">
          <p className="text-sm text-orange-400 mb-1 flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Tickets vendus
          </p>
          <p className="text-2xl font-bold text-white">{totalSold}</p>
        </div>
        <div className="rounded-xl border border-[#374151] bg-[#111827] p-5">
          <p className="text-sm text-orange-400 mb-1 flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Meilleur vendeur
          </p>
          <p className="text-2xl font-bold text-white">
            {bestSeller?.name || "—"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 mb-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Vendeur</label>
            <div className="relative">
              <select
                value={vendeurFilter}
                onChange={(e) => setVendeurFilter(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-lg bg-emerald-600 text-white text-sm appearance-none focus:outline-none min-w-[160px]"
              >
                <option value="all">Tous les vendeurs</option>
                {sellers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/70 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              P&eacute;riode
            </label>
            <div className="relative">
              <select
                value={periodeFilter}
                onChange={(e) => setPeriodeFilter(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-lg bg-[#374151] text-white text-sm appearance-none focus:outline-none min-w-[130px]"
              >
                <option value="today">Aujourd&apos;hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="all">Toute la p&eacute;riode</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/70 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Date d&eacute;but
            </label>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="h-9 px-3 rounded-lg bg-[#374151] text-white text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Date fin
            </label>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="h-9 px-3 rounded-lg bg-[#374151] text-white text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Type de vente
            </label>
            <div className="relative">
              <select
                value={typeVente}
                onChange={(e) => setTypeVente(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-lg bg-amber-500 text-white text-sm appearance-none focus:outline-none min-w-[120px]"
              >
                <option value="brute">Vente brute</option>
                <option value="nette">Vente nette</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/70 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Export buttons + sales table */}
      <div className="rounded-xl border border-[#374151] bg-[#111827] overflow-hidden mb-8">
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-b border-[#374151]">
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-600 transition-colors">
            <Printer className="h-3.5 w-3.5" />
            Imprimer
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-red-600 transition-colors">
            <FileText className="h-3.5 w-3.5" />
            PDF
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Excel
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#374151]">
              <th className="text-left px-5 py-3 text-xs font-semibold text-orange-400 uppercase">
                Date
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-orange-400 uppercase">
                Vendeur
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-orange-400 uppercase">
                Cat&eacute;gorie
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-orange-400 uppercase">
                Utilisateur
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-orange-400 uppercase">
                Prix
              </th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-orange-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2D3748]">
            {filteredAssignments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-slate-400"
                >
                  Aucune vente enregistr&eacute;e pour cette p&eacute;riode.
                </td>
              </tr>
            ) : (
              filteredAssignments.map((a) => (
                <tr
                  key={a.id}
                  className="hover:bg-[#1a2332] transition-colors"
                >
                  <td className="px-5 py-3 text-sm text-slate-300">
                    {new Date(a.created_at).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-white">
                    {a.seller?.name || "—"}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-300">
                    {a.profile?.name || "—"}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-300">—</td>
                  <td className="px-5 py-3 text-sm text-slate-300">
                    {((a.quantity || 0) * 2000).toLocaleString("fr-FR")}{" "}
                    {currency}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Remboursements section */}
      <div className="rounded-xl border border-amber-500/30 bg-[#111827] p-5 mb-6">
        <h2 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Suivi des Remboursements de Cr&eacute;dit Revendeurs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#374151] bg-[#1F2937] p-4">
            <Banknote className="h-8 w-8 text-slate-400" />
            <div>
              <p className="text-white font-medium">
                Via Agr&eacute;gateur 0 {currency}
              </p>
              <p className="text-xs text-slate-400">0 transaction(s)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[#374151] bg-[#1F2937] p-4">
            <Users className="h-8 w-8 text-slate-400" />
            <div>
              <p className="text-white font-medium">
                Manuel (Admin){" "}
                {totalRevenue.toLocaleString("fr-FR")} {currency}
              </p>
              <p className="text-xs text-slate-400">
                {assignments.length} r&egrave;glement(s)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[#374151] bg-[#1F2937] p-4">
            <Database className="h-8 w-8 text-slate-400" />
            <div>
              <p className="text-white font-medium">
                Total Rembours&eacute;{" "}
                {totalRevenue.toLocaleString("fr-FR")} {currency}
              </p>
              <p className="text-xs text-slate-400">
                {assignments.length} op&eacute;ration(s)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Remboursements filters */}
      <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 mb-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Revendeur
            </label>
            <div className="relative">
              <select
                value={rembVendeur}
                onChange={(e) => setRembVendeur(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-lg bg-emerald-600 text-white text-sm appearance-none focus:outline-none min-w-[160px]"
              >
                <option value="all">Tous les revendeurs</option>
                {sellers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/70 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              P&eacute;riode
            </label>
            <div className="relative">
              <select
                value={rembPeriode}
                onChange={(e) => setRembPeriode(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-lg bg-[#374151] text-white text-sm appearance-none focus:outline-none min-w-[130px]"
              >
                <option value="all">Toute la p&eacute;riode</option>
                <option value="today">Aujourd&apos;hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/70 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              M&eacute;thode
            </label>
            <div className="relative">
              <select
                value={rembMethode}
                onChange={(e) => setRembMethode(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-lg bg-[#374151] text-white text-sm appearance-none focus:outline-none min-w-[150px]"
              >
                <option value="all">Toutes les m&eacute;thodes</option>
                <option value="manual">Manuel</option>
                <option value="aggregator">Agr&eacute;gateur</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/70 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Date d&eacute;but
            </label>
            <input
              type="date"
              className="h-9 px-3 rounded-lg bg-[#374151] text-white text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Date fin
            </label>
            <input
              type="date"
              className="h-9 px-3 rounded-lg bg-[#374151] text-white text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Remboursements export + table */}
      <div className="rounded-xl border border-[#374151] bg-[#111827] overflow-hidden mb-6">
        <div className="flex items-center justify-start gap-2 px-5 py-3 border-b border-[#374151]">
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-red-600 transition-colors">
            <FileText className="h-3.5 w-3.5" />
            PDF
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Excel
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#374151]">
              <th className="text-left px-5 py-3 text-xs font-semibold text-orange-400 uppercase">
                Date
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-orange-400 uppercase">
                Revendeur
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-orange-400 uppercase">
                Montant
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-orange-400 uppercase">
                M&eacute;thode
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-orange-400 uppercase">
                Agr&eacute;gateur / D&eacute;tail
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-orange-400 uppercase">
                ID Transaction
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2D3748]">
            {assignments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-slate-400"
                >
                  Aucun remboursement enregistr&eacute;.
                </td>
              </tr>
            ) : (
              assignments.map((a) => (
                <tr
                  key={a.id}
                  className="hover:bg-[#1a2332] transition-colors"
                >
                  <td className="px-5 py-3 text-sm text-slate-300">
                    {new Date(a.created_at).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-white">
                    {a.seller?.name || "—"}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-emerald-400">
                    {((a.quantity || 0) * 2000).toLocaleString("fr-FR")}{" "}
                    {currency}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-300 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Manuel
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-400">—</td>
                  <td className="px-5 py-3 text-sm text-slate-400">—</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Floating button - manage sellers */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 z-30 flex items-center justify-center h-14 w-14 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-colors"
        title="G&eacute;rer les vendeurs"
      >
        <Users className="h-6 w-6" />
      </button>

      {/* Add seller modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-md bg-[#1F2937] border border-[#374151] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#374151]">
              <h3 className="text-lg font-semibold text-white">
                Ajouter un vendeur
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#374151] text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm({ ...addForm, name: e.target.value })
                  }
                  placeholder="Ex: Patrick Mboma"
                  className="w-full h-10 px-4 rounded-xl bg-[#111827] border border-[#374151] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2B7FFF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  T&eacute;l&eacute;phone
                </label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center h-10 px-3 rounded-xl border border-[#374151] bg-[#374151] text-sm text-slate-300">
                    {phonePrefix}
                  </span>
                  <input
                    type="tel"
                    value={addForm.phone}
                    onChange={(e) =>
                      setAddForm({ ...addForm, phone: e.target.value })
                    }
                    placeholder="812 345 678"
                    className="flex-1 h-10 px-4 rounded-xl bg-[#111827] border border-[#374151] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2B7FFF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Localisation
                </label>
                <input
                  type="text"
                  value={addForm.location}
                  onChange={(e) =>
                    setAddForm({ ...addForm, location: e.target.value })
                  }
                  placeholder="Ex: Gombe, Kinshasa"
                  className="w-full h-10 px-4 rounded-xl bg-[#111827] border border-[#374151] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2B7FFF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Taux de commission
                </label>
                <div className="flex items-center gap-2">
                  {[10, 15, 20].map((c) => (
                    <button
                      key={c}
                      onClick={() =>
                        setAddForm({ ...addForm, commission: c })
                      }
                      className={`h-9 px-4 rounded-lg text-sm font-medium transition-all ${
                        addForm.commission === c
                          ? "bg-[#2B7FFF] text-white"
                          : "border border-[#374151] text-slate-300 hover:border-[#2B7FFF]/50"
                      }`}
                    >
                      {c}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#374151] flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="h-10 px-5 rounded-xl border border-[#374151] text-sm font-medium text-slate-300 hover:bg-[#374151] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddSeller}
                disabled={!addForm.name || !addForm.phone || submitting}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Cr&eacute;er le vendeur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign stock modal */}
      {showAssignModal && assignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAssignModal(false)}
          />
          <div className="relative w-full max-w-md bg-[#1F2937] border border-[#374151] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#374151]">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Attribuer du stock
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Vers : {assignTarget.name}
                </p>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#374151] text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {profiles.length === 0 ? (
                <p className="text-center py-6 text-sm text-slate-400">
                  Aucun profil tarifaire disponible.
                </p>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Profil tarifaire
                    </label>
                    <div className="space-y-2">
                      {profiles.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setAssignProfile(p.id)}
                          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border text-left transition-all ${
                            assignProfile === p.id
                              ? "border-[#2B7FFF] bg-[#2B7FFF]/10"
                              : "border-[#374151] hover:border-[#2B7FFF]/40"
                          }`}
                        >
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: p.color }}
                          />
                          <span className="flex-1 text-sm font-medium text-white">
                            {p.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            {p.price.toLocaleString("fr-FR")} {currency}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Quantit&eacute;
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[5, 10, 25, 50].map((q) => (
                        <button
                          key={q}
                          onClick={() => setAssignQty(q)}
                          className={`h-9 px-4 rounded-lg text-sm font-medium transition-all ${
                            assignQty === q
                              ? "bg-[#2B7FFF] text-white"
                              : "border border-[#374151] text-slate-300 hover:border-[#2B7FFF]/50"
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="px-6 py-4 border-t border-[#374151] flex justify-end gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="h-10 px-5 rounded-xl border border-[#374151] text-sm font-medium text-slate-300 hover:bg-[#374151] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAssignStock}
                disabled={!assignProfile || submitting}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors disabled:opacity-40"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <Send className="h-4 w-4" />
                Attribuer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
