"use client";

import { useMemo, useState } from "react";
import { Layers, Package, Printer, Search, Trash2 } from "lucide-react";
import { useConsoleStore, type TicketState } from "@/components/console/console-store";
import { useCurrency } from "@/hooks/use-currency";

const field = "h-11 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1D26] focus:border-[#2B7FFF] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 sm:w-auto sm:min-w-[200px]";
const stateLabel: Record<TicketState, { t: string; c: string }> = {
  neuf: { t: "neuf", c: "bg-[#F3F4F6] text-[#4B5563]" },
  actif: { t: "actif", c: "bg-emerald-50 text-emerald-700" },
  epuise: { t: "épuisé", c: "bg-red-50 text-red-600" },
};

export default function StockPage() {
  const { profiles, lots, tickets, clearLot, clearProfile, deleteTickets, markPrinted } = useConsoleStore();
  const { currency } = useCurrency();
  const [profileId, setProfileId] = useState("");
  const [loadedId, setLoadedId] = useState("");
  const [lotId, setLotId] = useState("all");
  const [order, setOrder] = useState<"recent" | "old">("recent");
  const [selected, setSelected] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<null | "lot" | "profile" | "selection">(null);

  const profile = profiles.find((p) => p.id === loadedId);
  const profileLots = lots.filter((l) => l.profileId === loadedId);

  const rows = useMemo(() => {
    if (!loadedId) return [];
    let r = tickets.filter((t) => t.profileId === loadedId && (lotId === "all" || t.lotId === lotId));
    if (order === "old") r = [...r].reverse();
    return r;
  }, [tickets, loadedId, lotId, order]);

  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  function load() {
    setLoadedId(profileId);
    setLotId("all");
    setSelected([]);
    setConfirm(null);
  }

  function run(kind: "lot" | "profile" | "selection") {
    if (confirm !== kind) return setConfirm(kind);
    if (kind === "lot" && lotId !== "all") clearLot(lotId);
    if (kind === "profile" && loadedId) clearProfile(loadedId);
    if (kind === "selection") deleteTickets(selected);
    setSelected([]);
    setConfirm(null);
    if (kind === "lot") setLotId("all");
  }

  function print() {
    const ids = (selected.length ? selected : rows.map((r) => r.id));
    markPrinted(ids);
    window.print();
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#1A1D26]">Stock / Utilisateurs</h1>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="flex items-center gap-2 border-b border-[#E5E7EB] px-5 py-4 text-base font-semibold text-[#1A1D26]">
          <Package className="h-5 w-5 text-[#6B7280]" /> Stock par profil
        </div>

        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-end gap-3">
            <label className="w-full text-sm font-semibold text-[#1A1D26] sm:w-auto">
              Profil :
              <select className={`${field} mt-1.5 block`} value={profileId} onChange={(e) => setProfileId(e.target.value)}>
                <option value="">— Choisir un profil —</option>
                {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <button onClick={load} disabled={!profileId} className="flex h-11 items-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50">
              <Search className="h-4 w-4" /> Charger
            </button>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <label className="w-full text-sm font-semibold text-[#1A1D26] sm:w-auto">
              Lot :
              <select className={`${field} mt-1.5 block`} value={lotId} onChange={(e) => { setLotId(e.target.value); setSelected([]); }} disabled={!loadedId}>
                <option value="all">Tous les lots</option>
                {profileLots.map((l) => <option key={l.id} value={l.id}>{l.id} · {l.createdAt.slice(8, 10)}/{l.createdAt.slice(5, 7)} · {l.count}</option>)}
              </select>
            </label>
            <select aria-label="Ordre" className={field} value={order} onChange={(e) => setOrder(e.target.value as "recent" | "old")} disabled={!loadedId}>
              <option value="recent">Plus récents</option>
              <option value="old">Plus anciens</option>
            </select>
            <button onClick={print} disabled={!rows.length} className="flex h-11 items-center gap-2 rounded-lg border border-[#D1D5DB] px-5 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-50">
              <Printer className="h-4 w-4" /> Imprimer
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => run("lot")} disabled={lotId === "all"} className={`flex h-11 items-center gap-2 rounded-lg border px-5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 ${confirm === "lot" ? "border-amber-500 bg-amber-500 text-white" : "border-amber-400 text-amber-600 hover:bg-amber-50"}`}>
              <Layers className="h-4 w-4" /> {confirm === "lot" ? "Confirmer" : "Vider ce lot"}
            </button>
            <button onClick={() => run("profile")} disabled={!loadedId} className={`flex h-11 items-center gap-2 rounded-lg border px-5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 ${confirm === "profile" ? "border-red-500 bg-red-500 text-white" : "border-red-300 text-red-500 hover:bg-red-50"}`}>
              <Trash2 className="h-4 w-4" /> {confirm === "profile" ? "Confirmer" : "Vider ce profil"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border-t border-[#E5E7EB]">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="text-left text-xs font-semibold text-[#1A1D26]">
              <tr className="border-b border-[#E5E7EB]">
                <th className="px-5 py-3">
                  <input type="checkbox" aria-label="Tout sélectionner" checked={allSelected} onChange={() => setSelected(allSelected ? [] : rows.map((r) => r.id))} />
                </th>
                <th className="px-3 py-3">Utilisateur</th>
                <th className="px-3 py-3">Mot de passe</th>
                <th className="px-3 py-3 text-right">Prix</th>
                <th className="px-3 py-3">Statut</th>
                <th className="px-5 py-3">Imprimé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F5]">
              {!loadedId && <tr><td colSpan={6} className="py-10 text-center text-[#6B7280]">Choisissez un profil puis « Charger ».</td></tr>}
              {loadedId && rows.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-[#6B7280]">Aucun ticket pour ce profil.</td></tr>}
              {rows.map((t) => (
                <tr key={t.id} className="hover:bg-[#FAFBFC]">
                  <td className="px-5 py-2.5"><input type="checkbox" aria-label={`Sélectionner ${t.user}`} checked={selected.includes(t.id)} onChange={() => setSelected((s) => (s.includes(t.id) ? s.filter((x) => x !== t.id) : [...s, t.id]))} /></td>
                  <td className="px-3 py-2.5 font-mono font-semibold text-[#1A1D26]">{t.user}{t.special && <span className="ml-1.5 rounded bg-teal-50 px-1.5 text-[10px] font-sans font-medium text-teal-600">spécial</span>}</td>
                  <td className="px-3 py-2.5 font-mono text-[#4B5563]">{t.password}</td>
                  <td className="px-3 py-2.5 text-right">{profile ? `${profile.price.toLocaleString("fr-FR")} ${currency}` : "—"}</td>
                  <td className="px-3 py-2.5"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stateLabel[t.state].c}`}>{stateLabel[t.state].t}</span></td>
                  <td className="px-5 py-2.5 text-[#4B5563]">{t.printed ? "oui" : "non"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end border-t border-[#E5E7EB] px-5 py-4">
          <button onClick={() => run("selection")} disabled={!selected.length} className={`flex h-10 items-center gap-2 rounded-lg border px-5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 ${confirm === "selection" ? "border-red-500 bg-red-500 text-white" : "border-red-300 text-red-500 hover:bg-red-50"}`}>
            <Trash2 className="h-4 w-4" /> {confirm === "selection" ? `Confirmer (${selected.length})` : "Supprimer la sélection"}
          </button>
        </div>
      </div>
    </div>
  );
}
