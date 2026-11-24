"use client";

import { useMemo, useState } from "react";
import { BarChart3, Download, FileText, Package, Receipt, RefreshCw, Timer, Users, Layers } from "lucide-react";
import { useConsoleStore } from "@/components/console/console-store";
import { useCurrency } from "@/hooks/use-currency";

type Tab = "stock" | "report" | "sales" | "lots" | "expiry" | "sellers";
type Range = "day" | "month" | "year" | "period";

const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "stock", label: "Stock & cycle de vie", icon: Package },
  { key: "report", label: "Rapport de ventes", icon: Receipt },
  { key: "sales", label: "Ventes", icon: BarChart3 },
  { key: "lots", label: "Lots", icon: Layers },
  { key: "expiry", label: "Expirations", icon: Timer },
  { key: "sellers", label: "Vendeurs", icon: Users },
];

const field = "h-9 rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1D26] focus:border-[#2B7FFF] focus:outline-none";

const fmtDate = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
const fmtTime = (iso: string) => iso.slice(11, 16);

export default function InventoryPage() {
  const { profiles, tickets, lots, sales } = useConsoleStore();
  const { currency } = useCurrency();
  const [tab, setTab] = useState<Tab>("stock");
  const [period, setPeriod] = useState("30");

  // Rapport de ventes
  const [range, setRange] = useState<Range>("day");
  const [day, setDay] = useState("2026-11-18");
  const [from, setFrom] = useState("2026-11-01");
  const [to, setTo] = useState("2026-11-30");
  const [pf, setPf] = useState("");
  const [q, setQ] = useState("");

  const nameOf = (id: string) => profiles.find((p) => p.id === id)?.name ?? "—";
  const money = (n: number) => `${n.toLocaleString("fr-FR")} ${currency}`;

  const kpi = useMemo(() => {
    const neuf = tickets.filter((t) => t.state === "neuf").length;
    const actif = tickets.filter((t) => t.state === "actif").length;
    const epuise = tickets.filter((t) => t.state === "epuise").length;
    const total = sales.reduce((s, r) => s + r.price, 0);
    return { all: tickets.length, neuf, actif, epuise, total, count: sales.length };
  }, [tickets, sales]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return sales.filter((r) => {
      const d = r.at.slice(0, 10);
      if (range === "day" && d !== day) return false;
      if (range === "month" && d.slice(0, 7) !== day.slice(0, 7)) return false;
      if (range === "year" && d.slice(0, 4) !== day.slice(0, 4)) return false;
      if (range === "period" && (d < from || d > to)) return false;
      if (pf && r.profileId !== pf) return false;
      if (term && !`${r.user} ${r.ip} ${r.mac}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [sales, range, day, from, to, pf, q]);

  const filteredTotal = filtered.reduce((s, r) => s + r.price, 0);

  function exportCsv() {
    const head = ["N°", "Date", "Heure", "Utilisateur", "Profil", "Prix", "IP", "MAC", "Validité", "Vendeur"];
    const rows = filtered.map((r) => [r.id, fmtDate(r.at), fmtTime(r.at), r.user, nameOf(r.profileId), r.price, r.ip, r.mac, r.validity, r.seller]);
    const csv = [head, ...rows].map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "rapport-ventes.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const byProfile = useMemo(() => {
    const m = new Map<string, { n: number; total: number }>();
    sales.forEach((r) => m.set(r.profileId, { n: (m.get(r.profileId)?.n ?? 0) + 1, total: (m.get(r.profileId)?.total ?? 0) + r.price }));
    return [...m.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [sales]);
  const bySeller = useMemo(() => {
    const m = new Map<string, { n: number; total: number }>();
    sales.forEach((r) => m.set(r.seller, { n: (m.get(r.seller)?.n ?? 0) + 1, total: (m.get(r.seller)?.total ?? 0) + r.price }));
    return [...m.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [sales]);
  const byHour = useMemo(() => {
    const h = Array.from({ length: 24 }, () => 0);
    sales.forEach((r) => (h[Number(r.at.slice(11, 13))] += r.price));
    return h;
  }, [sales]);
  const maxHour = Math.max(1, ...byHour);

  const kpiBoxes = [
    { v: kpi.all, l: "Tickets dans RADIUS" },
    { v: kpi.neuf, l: "Jamais utilisés" },
    { v: kpi.actif, l: "Sessions actives" },
    { v: kpi.epuise, l: "Épuisés" },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[#1A1D26]">Inventaire</h1>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium text-[#374151]">Période des ventes :</span>
        <select className={field} value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="Période des ventes">
          <option value="7">7 derniers jours</option>
          <option value="30">30 derniers jours</option>
          <option value="90">90 derniers jours</option>
        </select>
        <button className="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-500 px-3 font-medium text-white hover:bg-emerald-600"><RefreshCw className="h-4 w-4" /> Actualiser</button>
        <button onClick={exportCsv} className="flex h-9 items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3 font-medium text-[#374151] hover:bg-[#F3F4F6]"><Download className="h-4 w-4" /> Exporter (CSV)</button>
        <button onClick={() => window.print()} className="flex h-9 items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3 font-medium text-[#374151] hover:bg-[#F3F4F6]"><FileText className="h-4 w-4" /> Imprimer / PDF</button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {kpiBoxes.map((b) => (
          <div key={b.l} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
            <p className="text-2xl font-bold text-[#1A1D26]">{b.v}</p>
            <p className="text-xs text-[#6B7280]">{b.l}</p>
          </div>
        ))}
        <div className="col-span-2 rounded-xl border border-[#E5E7EB] bg-white p-4 lg:col-span-1">
          <p className="text-2xl font-bold text-[#1A1D26]">{money(kpi.total)}</p>
          <p className="text-xs text-[#6B7280]">Montant des ventes</p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-[#E5E7EB]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium ${tab === t.key ? "border-[#2B7FFF] text-[#2B7FFF]" : "border-transparent text-[#6B7280] hover:text-[#374151]"}`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Stock & cycle de vie */}
      {tab === "stock" && (
        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
          <p className="border-b border-[#E5E7EB] px-4 py-3 text-xs text-[#6B7280]">Cycle de vie par profil (RADIUS) : tickets jamais utilisés, actifs, épuisés, imprimés.</p>
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-xs text-[#6B7280]">
              <tr className="border-b border-[#E5E7EB]">
                <th className="px-4 py-2.5">Profil</th><th className="px-3 py-2.5 text-right">RADIUS</th><th className="px-3 py-2.5 text-right">Jamais utilisés</th>
                <th className="px-3 py-2.5 text-right">Actifs</th><th className="px-3 py-2.5 text-right">Épuisés</th><th className="px-3 py-2.5 text-right">Imprimés</th><th className="px-4 py-2.5 text-right">Spéciaux</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F5]">
              {profiles.map((p) => {
                const ts = tickets.filter((t) => t.profileId === p.id);
                const n = (f: (t: (typeof ts)[number]) => boolean) => ts.filter(f).length;
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-2.5 font-medium text-[#1A1D26]">{p.name}</td>
                    <td className="px-3 py-2.5 text-right">{ts.length}</td>
                    <td className="px-3 py-2.5 text-right">{n((t) => t.state === "neuf")}</td>
                    <td className="px-3 py-2.5 text-right text-emerald-600">{n((t) => t.state === "actif")}</td>
                    <td className="px-3 py-2.5 text-right text-red-500">{n((t) => t.state === "epuise")}</td>
                    <td className="px-3 py-2.5 text-right">{n((t) => t.printed)}</td>
                    <td className="px-4 py-2.5 text-right">{n((t) => t.special)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Rapport de ventes */}
      {tab === "report" && (
        <div className="space-y-3 rounded-xl border border-[#E5E7EB] bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex overflow-hidden rounded-lg border border-[#D1D5DB] text-sm">
              {([["day", "Jour"], ["month", "Mois"], ["year", "Année"], ["period", "Période"]] as [Range, string][]).map(([k, l]) => (
                <button key={k} onClick={() => setRange(k)} className={`px-3.5 py-1.5 ${range === k ? "bg-[#2B7FFF] text-white" : "bg-white text-[#374151] hover:bg-[#F3F4F6]"}`}>{l}</button>
              ))}
            </div>
            {range === "period" ? (
              <>
                <input type="date" className={field} value={from} onChange={(e) => setFrom(e.target.value)} aria-label="Du" />
                <span className="text-[#6B7280]">→</span>
                <input type="date" className={field} value={to} onChange={(e) => setTo(e.target.value)} aria-label="Au" />
              </>
            ) : (
              <input type="date" className={field} value={day} onChange={(e) => setDay(e.target.value)} aria-label="Date" />
            )}
            <select className={field} value={pf} onChange={(e) => setPf(e.target.value)} aria-label="Profil">
              <option value="">Tous les profils</option>
              {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input className={`${field} min-w-[180px] flex-1`} placeholder="Rechercher : code, adresse IP, MAC…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-1">
            <p><span className="text-2xl font-bold text-[#1A1D26]">{filtered.length}</span> <span className="text-xs text-[#6B7280]">ventes sur la période</span></p>
            <p><span className="text-2xl font-bold text-[#2B7FFF]">{money(filteredTotal)}</span> <span className="text-xs text-[#6B7280]">montant encaissé</span></p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="text-left text-xs text-[#6B7280]">
                <tr className="border-b border-[#E5E7EB]">
                  <th className="px-2 py-2">N°</th><th className="px-2 py-2">Date</th><th className="px-2 py-2">Heure</th><th className="px-2 py-2">Utilisateur</th>
                  <th className="px-2 py-2">Profil</th><th className="px-2 py-2">Commentaire</th><th className="px-2 py-2 text-right">Prix</th><th className="px-2 py-2">Adresse IP</th>
                  <th className="px-2 py-2">MAC</th><th className="px-2 py-2">Validité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F2F5]">
                {filtered.length === 0 && <tr><td colSpan={10} className="py-10 text-center text-[#6B7280]">Aucune vente pour ces critères.</td></tr>}
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAFBFC]">
                    <td className="px-2 py-2 text-[#6B7280]">{r.id}</td>
                    <td className="px-2 py-2">{fmtDate(r.at)}</td>
                    <td className="px-2 py-2">{fmtTime(r.at)}</td>
                    <td className="px-2 py-2 font-mono text-[#2B7FFF]">{r.user}</td>
                    <td className="px-2 py-2">{nameOf(r.profileId)}</td>
                    <td className="px-2 py-2 text-[#6B7280]">{r.comment}</td>
                    <td className="px-2 py-2 text-right font-semibold">{money(r.price)}</td>
                    <td className="px-2 py-2 font-mono text-xs">{r.ip}</td>
                    <td className="px-2 py-2 font-mono text-xs">{r.mac}</td>
                    <td className="px-2 py-2">{r.validity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ventes */}
      {tab === "sales" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
            <p className="mb-3 text-sm text-[#6B7280]"><b className="text-[#1A1D26]">{kpi.count}</b> vente(s) · {money(kpi.total)} · répartition par heure</p>
            <div className="flex h-40 items-end gap-1">
              {byHour.map((v, h) => (
                <div key={h} className="group relative flex-1">
                  <div className="rounded-t bg-emerald-500/80 group-hover:bg-emerald-500" style={{ height: `${(v / maxHour) * 100}%`, minHeight: v ? 3 : 1 }} />
                  <span className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-[#1F2937] px-1.5 py-0.5 text-[10px] text-white group-hover:block">{h}h : {money(v)}</span>
                </div>
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-[#9CA3AF]"><span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>23h</span></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: "Par profil", rows: byProfile.map(([k, v]) => [nameOf(k), v] as const) },
              { title: "Par vendeur", rows: bySeller.map(([k, v]) => [k, v] as const) },
            ].map((blk) => (
              <div key={blk.title} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                <h3 className="mb-3 text-sm font-semibold text-[#1A1D26]">{blk.title}</h3>
                <ul className="space-y-2.5">
                  {blk.rows.map(([name, v]) => (
                    <li key={name}>
                      <div className="flex justify-between text-xs"><span className="truncate text-[#374151]">{name}</span><span className="shrink-0 font-semibold">{v.n} · {money(v.total)}</span></div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#F0F2F5]"><div className="h-full rounded-full bg-[#2B7FFF]" style={{ width: `${(v.total / (blk.rows[0]?.[1].total || 1)) * 100}%` }} /></div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lots */}
      {tab === "lots" && (
        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="text-left text-xs text-[#6B7280]"><tr className="border-b border-[#E5E7EB]"><th className="px-4 py-2.5">Lot</th><th className="px-3 py-2.5">Profil</th><th className="px-3 py-2.5">Vendeur</th><th className="px-3 py-2.5">Créé le</th><th className="px-3 py-2.5 text-right">Quantité</th><th className="px-3 py-2.5 text-right">Neufs</th><th className="px-4 py-2.5 text-right">Imprimés</th></tr></thead>
            <tbody className="divide-y divide-[#F0F2F5]">
              {lots.map((l) => {
                const ts = tickets.filter((t) => t.lotId === l.id);
                return (
                  <tr key={l.id}>
                    <td className="px-4 py-2.5 font-mono text-xs text-[#6B7280]">{l.id}</td>
                    <td className="px-3 py-2.5 font-medium">{nameOf(l.profileId)}</td>
                    <td className="px-3 py-2.5">{l.seller}</td>
                    <td className="px-3 py-2.5">{fmtDate(l.createdAt)}</td>
                    <td className="px-3 py-2.5 text-right">{l.count}</td>
                    <td className="px-3 py-2.5 text-right">{ts.filter((t) => t.state === "neuf").length}</td>
                    <td className="px-4 py-2.5 text-right">{ts.filter((t) => t.printed).length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Expirations */}
      {tab === "expiry" && (
        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
          <p className="border-b border-[#E5E7EB] px-4 py-3 text-xs text-[#6B7280]">Tickets actifs et leur validité après le premier login. Les dates d&apos;expiration réelles viendront de RADIUS.</p>
          <table className="w-full min-w-[480px] text-sm">
            <thead className="text-left text-xs text-[#6B7280]"><tr className="border-b border-[#E5E7EB]"><th className="px-4 py-2.5">Utilisateur</th><th className="px-3 py-2.5">Profil</th><th className="px-4 py-2.5">Validité</th></tr></thead>
            <tbody className="divide-y divide-[#F0F2F5]">
              {tickets.filter((t) => t.state === "actif").slice(0, 30).map((t) => (
                <tr key={t.id}><td className="px-4 py-2.5 font-mono">{t.user}</td><td className="px-3 py-2.5">{nameOf(t.profileId)}</td><td className="px-4 py-2.5">{profiles.find((p) => p.id === t.profileId)?.validity || "—"}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Vendeurs */}
      {tab === "sellers" && (
        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="text-left text-xs text-[#6B7280]"><tr className="border-b border-[#E5E7EB]"><th className="px-4 py-2.5">Vendeur</th><th className="px-3 py-2.5 text-right">Ventes</th><th className="px-4 py-2.5 text-right">Montant</th></tr></thead>
            <tbody className="divide-y divide-[#F0F2F5]">
              {bySeller.map(([name, v]) => (
                <tr key={name}><td className="px-4 py-2.5 font-medium">{name}</td><td className="px-3 py-2.5 text-right">{v.n}</td><td className="px-4 py-2.5 text-right font-semibold">{money(v.total)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
