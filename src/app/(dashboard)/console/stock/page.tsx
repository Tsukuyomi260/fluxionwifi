"use client";

import { useState } from "react";
import { useCurrency } from "@/hooks/use-currency";
import { useTickets } from "@/hooks/use-tickets";
import type { TicketStatus } from "@/lib/supabase/types";
import {
  Search,
  Trash2,
  Printer,
  ChevronDown,
  Loader2,
  Package,
  CheckCircle,
} from "lucide-react";

const statusLabels: Record<TicketStatus, { label: string; color: string }> = {
  available: { label: "disponible", color: "text-emerald-600" },
  active: { label: "actif", color: "text-blue-600" },
  used: { label: "utilisé", color: "text-slate-400" },
  expired: { label: "expiré", color: "text-red-500" },
};

export default function StockPage() {
  const { currency } = useCurrency();
  const { tickets, profiles, loading, deleteTicket } = useTickets();
  const [selectedProfile, setSelectedProfile] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [sortOrder, setSortOrder] = useState("recent");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  function handleCharger() {
    setLoaded(true);
    setSelectedIds(new Set());
  }

  const filteredTickets = loaded && selectedProfile
    ? tickets
        .filter((t) => t.profile_id === selectedProfile)
        .sort((a, b) =>
          sortOrder === "recent"
            ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
    : [];

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedIds.size === filteredTickets.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTickets.map((t) => t.id)));
    }
  }

  async function handleDeleteSelected() {
    setDeleting(true);
    for (const id of selectedIds) {
      await deleteTicket(id);
    }
    setSelectedIds(new Set());
    setDeleting(false);
  }

  async function handleViderProfil() {
    if (!selectedProfile) return;
    setDeleting(true);
    const toDelete = tickets.filter(
      (t) => t.profile_id === selectedProfile && t.status === "available"
    );
    for (const t of toDelete) {
      await deleteTicket(t.id);
    }
    setDeleting(false);
  }

  function handleImprimer() {
    const toPrint = filteredTickets.filter(
      (t) => selectedIds.size === 0 || selectedIds.has(t.id)
    );
    if (toPrint.length === 0) return;
    const profile = profiles.find((p) => p.id === selectedProfile);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Tickets - ${profile?.name || ""}</title>
      <style>body{font-family:monospace;padding:20px}
      .ticket{border:2px dashed #333;padding:16px;margin:10px 0;text-align:center;page-break-inside:avoid}
      .code{font-size:24px;font-weight:bold;letter-spacing:4px}
      .info{font-size:12px;color:#666;margin-top:8px}
      @media print{body{padding:0}}</style></head><body>`);
    toPrint.forEach((t) => {
      win.document.write(`<div class="ticket">
        <div style="font-size:14px;font-weight:bold;margin-bottom:8px">${profile?.name || ""}</div>
        <div class="code">${t.code}</div>
        <div class="info">${(profile?.price || 0).toLocaleString("fr-FR")} ${currency} | FLUXIONWIFI</div>
      </div>`);
    });
    win.document.write("</body></html>");
    win.document.close();
    win.print();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#2B7FFF]" />
      </div>
    );
  }

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-[#F3F4F6] p-4 lg:p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-[#1A1D26] mb-5">
        Stock / Utilisateurs
      </h1>

      {/* Stock par profil section */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#6B7280]" />
            <h2 className="text-base font-semibold text-[#1A1D26]">
              Stock par profil
            </h2>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-4 border-b border-[#E5E7EB]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-[#374151]">
              Profil :
            </span>
            <div className="relative">
              <select
                value={selectedProfile}
                onChange={(e) => {
                  setSelectedProfile(e.target.value);
                  setLoaded(false);
                }}
                className="h-9 pl-3 pr-8 rounded-lg border border-[#D1D5DB] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-[#2B7FFF] min-w-[200px]"
              >
                <option value="">— Choisir un profil —</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9CA3AF] pointer-events-none" />
            </div>

            <button
              onClick={handleCharger}
              disabled={!selectedProfile}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-emerald-500 text-sm font-medium text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              Charger
            </button>

            <span className="text-sm font-medium text-[#374151] ml-4">
              Lot :
            </span>
            <div className="relative">
              <select className="h-9 pl-3 pr-8 rounded-lg border border-[#D1D5DB] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none min-w-[130px]">
                <option>Tous les lots</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9CA3AF] pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-lg border border-[#D1D5DB] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none min-w-[120px]"
              >
                <option value="recent">Plus r&eacute;cents</option>
                <option value="oldest">Plus anciens</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9CA3AF] pointer-events-none" />
            </div>

            <button
              onClick={handleImprimer}
              disabled={!loaded || filteredTickets.length === 0}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[#D1D5DB] text-sm text-[#374151] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
            >
              <Printer className="h-4 w-4" />
              Imprimer
            </button>
          </div>

          {/* Action buttons */}
          {loaded && selectedProfile && (
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => {
                  const lotTickets = filteredTickets.filter(
                    (t) => t.status === "available"
                  );
                  if (lotTickets.length === 0) return;
                  setSelectedIds(new Set(lotTickets.map((t) => t.id)));
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Vider ce lot
              </button>
              <button
                onClick={handleViderProfil}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Vider ce profil
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAFBFC]">
                <th className="text-left px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredTickets.length > 0 &&
                      selectedIds.size === filteredTickets.length
                    }
                    onChange={toggleAll}
                    className="rounded border-[#D1D5DB]"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280]">
                  Utilisateur
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280]">
                  Mot de passe
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280]">
                  Prix
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280]">
                  Statut
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280]">
                  Imprim&eacute;
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280]">
                  Cr&eacute;&eacute; le
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F7]">
              {!loaded || !selectedProfile ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-[#9CA3AF]"
                  >
                    Choisissez un profil puis &laquo; Charger &raquo;.
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-[#9CA3AF]"
                  >
                    Aucun ticket pour ce profil.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => {
                  const st = statusLabels[t.status];
                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-[#FAFBFC] transition-colors"
                    >
                      <td className="px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(t.id)}
                          onChange={() => toggleSelect(t.id)}
                          className="rounded border-[#D1D5DB]"
                        />
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs font-bold text-[#1A1D26]">
                        {t.code}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-[#6B7280]">
                        {t.code}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-[#1A1D26]">
                        {(t.profile?.price || 0).toLocaleString("fr-FR")}{" "}
                        {currency}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs font-medium ${st.color}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-[#9CA3AF]">
                        —
                      </td>
                      <td className="px-4 py-2.5 text-xs text-[#6B7280]">
                        {new Date(t.created_at).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Delete selected */}
        {selectedIds.size > 0 && (
          <div className="px-5 py-3 border-t border-[#E5E7EB] flex items-center justify-end">
            <button
              onClick={handleDeleteSelected}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Supprimer la s&eacute;lection ({selectedIds.size})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
