"use client";

import { useMemo, useRef, useState } from "react";
import { Filter, FileDown, LogOut, RefreshCw, Trash2, FileUp } from "lucide-react";
import { ConsoleStoreProvider, useConsoleStore } from "@/components/console/console-store";
import { logout } from "@/app/(auth)/actions";

type Base = "total" | "transit";

function csv(rows: string[][]): string {
  return rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(";")).join("\n");
}

function save(name: string, content: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿" + content], { type: "text/csv;charset=utf-8" }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function Inner() {
  const { tickets, profiles, createSpecific, deleteTickets } = useConsoleStore();
  const [base, setBase] = useState<Base>("total");
  const [q, setQ] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const profileName = (id: string) => profiles.find((p) => p.id === id)?.name ?? "—";
  const price = (id: string) => profiles.find((p) => p.id === id)?.price ?? 0;

  // TicketsTotal : tout le stock. TicketsTransit : tickets neufs pas encore imprimés (en attente d'envoi).
  const inBase = useMemo(
    () => (base === "total" ? tickets : tickets.filter((t) => t.state === "neuf" && !t.printed)),
    [tickets, base],
  );
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return inBase;
    return inBase.filter((t) =>
      [t.id, profileName(t.profileId), t.password, String(price(t.profileId)), t.user].some((v) => v.toLowerCase().includes(s)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inBase, q, profiles]);

  function say(m: string) {
    setNote(m);
    setTimeout(() => setNote(null), 4500);
  }

  function rowsOf(list: typeof tickets) {
    return [["ID", "Catégorie", "Utilisateur", "Mot de passe", "Prix", "État"], ...list.map((t) => [t.id, profileName(t.profileId), t.user, t.password, String(price(t.profileId)), t.state])];
  }

  function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const lines = String(r.result).replace(/^﻿/, "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      let ok = 0;
      let bad = 0;
      for (const line of lines) {
        const [user, password, cat] = line.split(/[;,\t]/).map((c) => c.replace(/^"|"$/g, "").trim());
        if (!user || /^(utilisateur|user|id)$/i.test(user)) continue;
        const prof = profiles.find((p) => p.name.toLowerCase() === (cat || "").toLowerCase()) ?? profiles[0];
        if (!prof) { bad++; continue; }
        const res = createSpecific(prof.id, user, password || user);
        res.ok ? ok++ : bad++;
      }
      say(`Import terminé : ${ok} ticket(s) ajouté(s)${bad ? `, ${bad} ignoré(s) (doublon ou profil absent)` : ""}.`);
    };
    r.readAsText(f);
  }

  const btn = "inline-flex h-9 items-center gap-2 rounded-[3px] px-3 text-[13px] font-medium text-white";

  return (
    <div className="-m-4 min-h-[calc(100vh-4rem)] bg-[#00607A] p-4 lg:-m-6 lg:p-8">
      <div className="mx-auto max-w-[1200px] rounded-md bg-[#012F10] p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[32px] font-bold leading-tight">Gestion des tickets</h1>
          <form action={logout}>
            <button className="inline-flex h-10 items-center gap-2 rounded-md bg-[#E74C3C] px-4 text-sm font-medium hover:bg-[#d84433]"><LogOut className="h-4 w-4" /> Déconnexion</button>
          </form>
        </div>

        <div className="mt-6 flex items-center gap-3 text-[15px]">
          <label htmlFor="db">Choisir la base de données :</label>
          <select id="db" value={base} onChange={(e) => setBase(e.target.value as Base)} className="h-10 rounded-[3px] bg-white px-3 text-[#1F2937]">
            <option value="total">TicketsTotal</option>
            <option value="transit">TicketsTransit</option>
          </select>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2.5">
            <input ref={file} type="file" accept=".csv,.txt" className="hidden" onChange={onImport} />
            <button className={`${btn} bg-[#3498DB]`} onClick={() => file.current?.click()}><FileUp className="h-4 w-4" /> Importer (Général)</button>
            <button className={`${btn} bg-[#3498DB]`} onClick={() => save(`tickets-${base}.csv`, csv(rowsOf(inBase)))}><FileDown className="h-4 w-4" /> Exporter tout</button>
            <button
              className={`${btn} bg-[#E67E22]`}
              onClick={() => {
                const sold = tickets.filter((t) => t.state === "epuise").map((t) => t.id);
                if (sold.length === 0) return say("Aucune vente à purger.");
                if (confirm(`Purger ${sold.length} ticket(s) vendu(s)/épuisé(s) ? Cette action est définitive.`)) { deleteTickets(sold); say(`${sold.length} ticket(s) purgé(s).`); }
              }}
            >
              <RefreshCw className="h-4 w-4" /> Purger les Ventes
            </button>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button className={`${btn} bg-[#3498DB]`} onClick={() => save(`tickets-${base}-filtres.csv`, csv(rowsOf(filtered)))}><Filter className="h-4 w-4" /> Exporter filtrés</button>
            <button
              className={`${btn} bg-[#E74C3C]`}
              onClick={() => {
                if (!q.trim()) return say("Saisissez une recherche avant de supprimer.");
                if (filtered.length === 0) return say("Aucun ticket ne correspond à la recherche.");
                if (confirm(`Supprimer les ${filtered.length} ticket(s) trouvés ? Cette action est définitive.`)) { deleteTickets(filtered.map((t) => t.id)); say(`${filtered.length} ticket(s) supprimé(s).`); setQ(""); }
              }}
            >
              <Trash2 className="h-4 w-4" /> Supprimer recherche
            </button>
          </div>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher (ID, Catégorie, Mot de passe, Prix, Utilisateur)"
          className="mt-5 h-12 w-full rounded-[3px] bg-[#ECF0F1] px-4 text-[16px] text-[#1F2937] placeholder:text-[#6B7280]"
        />

        {note && <p className="mt-3 rounded bg-white/10 px-3 py-2 text-sm">{note}</p>}

        {filtered.length === 0 ? (
          <p className="py-6 text-center text-[15px]">Aucun ticket trouvé dans {base === "total" ? "TicketsTotal" : "TicketsTransit"}.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/20 text-[#F1C40F]">
                  {["ID", "Catégorie", "Utilisateur", "Mot de passe", "Prix", "État"].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 200).map((t) => (
                  <tr key={t.id} className="border-b border-white/10">
                    <td className="px-3 py-2 font-mono text-xs">{t.id}</td>
                    <td className="px-3 py-2">{profileName(t.profileId)}</td>
                    <td className="px-3 py-2 font-mono">{t.user}</td>
                    <td className="px-3 py-2 font-mono">{t.password}</td>
                    <td className="px-3 py-2">{price(t.profileId).toLocaleString("fr-FR")}</td>
                    <td className="px-3 py-2">{t.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 200 && <p className="mt-2 text-xs text-white/60">200 premiers résultats sur {filtered.length} : affinez la recherche ou exportez.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TicketsAdminPage() {
  return (
    <ConsoleStoreProvider>
      <Inner />
    </ConsoleStoreProvider>
  );
}
