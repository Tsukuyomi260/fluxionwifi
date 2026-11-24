"use client";

import { useState } from "react";
import { Check, ChevronRight, Copy, Download, Info, KeyRound, RefreshCw, Repeat, Wrench } from "lucide-react";
import { useRouters } from "@/hooks/use-routers";

type Mode = "manual" | "radius" | "ondemand";

const modes: { key: Mode; label: string; disabled?: boolean; desc?: string }[] = [
  { key: "manual", label: "Manuel (import Mikhmon)" },
  { key: "radius", label: "Tickets pré-créés (RADIUS)" },
  { key: "ondemand", label: "Création à la demande (Désactivé)", disabled: true },
];

const field = "h-10 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm focus:border-[#2B7FFF] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20";

export default function ModePage() {
  const { routers } = useRouters();
  const [mode, setMode] = useState<Mode>("radius");
  const [routerId, setRouterId] = useState("FLX-FLU-001-Site");
  const [interval, setIntervalValue] = useState("30s");
  const [strict, setStrict] = useState(false);
  const [command, setCommand] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    // Démonstration : le vrai script (récupération + planificateur RouterOS) sera produit par le back-end.
    setCommand(`/tool fetch url="https://VOTRE-DOMAINE/api/coordinator/${encodeURIComponent(routerId)}.rsc?interval=${interval}${strict ? "&ssl=strict" : ""}" mode=https dst-path=fluxion-coordinator.rsc; /import fluxion-coordinator.rsc`);
  }

  async function copy() {
    if (!command) return;
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible */
    }
  }

  const card = "overflow-hidden rounded-xl border border-[#E5E7EB] bg-white";
  const head = "flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3.5 text-base font-semibold text-[#1A1D26]";

  const rows: [string, React.ReactNode][] = [
    ["Routeur", <span key="r" className="font-mono">{routerId}</span>],
    ["Mode désiré (portail)", <span key="m" className="rounded bg-cyan-500 px-2 py-0.5 text-xs font-medium text-white">{modes.find((m) => m.key === mode)?.label}</span>],
    ["Mode appliqué (routeur)", "—"],
    ["Migration en cours", "—"],
    ["Dernière mise à jour", "—"],
    ["Dernière erreur", "—"],
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#1A1D26]">Coordinateur de mode</h1>

      <div className="flex gap-2.5 rounded-xl border border-[#E5E7EB] bg-white p-4 text-sm leading-relaxed text-[#374151]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#2B7FFF]" />
        <p>
          Le <b>coordinateur</b> est un petit scheduler installé sur le routeur. Il surveille le <b>mode de création des tickets</b> choisi dans le portail et, à chaque changement, télécharge et applique automatiquement l&apos;installation du mode cible : <b>RADIUS</b> (tickets pré-créés) ou <b>Création à la demande</b>. Vous n&apos;avez qu&apos;à l&apos;installer une fois.
        </p>
      </div>

      <div className={card}>
        <div className={head}>
          <span className="flex items-center gap-2"><Wrench className="h-5 w-5 text-[#6B7280]" /> État du coordinateur</span>
          <RefreshCw className="h-4 w-4 text-[#9CA3AF]" />
        </div>
        <dl className="divide-y divide-[#F0F2F5] px-5 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-3 py-2.5"><dt className="font-semibold text-[#1A1D26]">{k}</dt><dd className="text-[#4B5563]">{v}</dd></div>
          ))}
        </dl>
        <p className="flex items-center gap-1.5 px-5 pb-4 text-xs text-[#6B7280]"><Info className="h-3.5 w-3.5" /> Aucun rapport du coordinateur pour l&apos;instant. Installez-le puis attendez un cycle.</p>
      </div>

      <div className={card}>
        <div className={head}><span className="flex items-center gap-2"><Repeat className="h-5 w-5 text-[#6B7280]" /> Changer de mode</span></div>
        <div className="space-y-3 p-5">
          <p className="text-xs text-[#6B7280]">Définit le mode désiré du portail. Le coordinateur installé sur le routeur appliquera la migration au prochain cycle.</p>
          <div className="overflow-hidden rounded-lg border border-[#D1D5DB]">
            {modes.map((m) => (
              <button
                key={m.key}
                disabled={m.disabled}
                onClick={() => setMode(m.key)}
                className={`flex w-full items-center gap-2 border-b border-[#E5E7EB] px-4 py-2.5 text-left text-sm last:border-b-0 ${
                  mode === m.key ? "bg-[#2B7FFF] text-white" : m.disabled ? "cursor-not-allowed bg-white text-[#9CA3AF]" : "bg-white text-[#374151] hover:bg-[#F3F4F6]"
                }`}
              >
                {mode === m.key && <Check className="h-4 w-4" />} {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={card}>
        <div className={head}><span className="flex items-center gap-2"><Download className="h-5 w-5 text-[#6B7280]" /> Installer / Mettre à jour le coordinateur</span></div>
        <div className="space-y-4 p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_140px_auto] sm:items-end">
            <label className="text-sm font-semibold text-[#1A1D26]">
              Identifiant du routeur
              {routers.length > 0 ? (
                <select className={`${field} mt-1.5`} value={routerId} onChange={(e) => setRouterId(e.target.value)}>
                  {routers.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              ) : (
                <input className={`${field} mt-1.5`} value={routerId} onChange={(e) => setRouterId(e.target.value)} />
              )}
              <span className="mt-1 block text-[11px] font-normal text-[#6B7280]">Doit correspondre à l&apos;identité du routeur (/system identity).</span>
            </label>
            <label className="text-sm font-semibold text-[#1A1D26]">
              Intervalle
              <input className={`${field} mt-1.5`} value={interval} onChange={(e) => setIntervalValue(e.target.value)} />
            </label>
            <label className="flex items-center gap-1.5 pb-2.5 text-xs font-medium text-[#374151]"><input type="checkbox" checked={strict} onChange={(e) => setStrict(e.target.checked)} /> SSL strict</label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={generate} className="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-500 px-4 text-sm font-medium text-white hover:bg-emerald-600"><KeyRound className="h-4 w-4" /> Générer le script d&apos;installation</button>
            <button onClick={copy} disabled={!command} className="flex h-9 items-center gap-1.5 rounded-lg border border-[#D1D5DB] px-3 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-40">{copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />} Copier</button>
            <button disabled={!command} onClick={() => { const u = URL.createObjectURL(new Blob([command], { type: "text/plain" })); const a = document.createElement("a"); a.href = u; a.download = "fluxion-coordinator.rsc"; a.click(); URL.revokeObjectURL(u); }} className="flex h-9 items-center gap-1.5 rounded-lg border border-[#D1D5DB] px-3 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-40"><Download className="h-4 w-4" /> Télécharger .rsc</button>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-[#1A1D26]">Commande terminal (collez dans New Terminal du routeur) :</p>
            <pre className="min-h-[44px] overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-[#0F172A] p-3 font-mono text-xs text-emerald-300">{command || "—"}</pre>
          </div>

          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">Démonstration : l&apos;adresse et le contenu du script seront générés par le back-end (planificateur RouterOS authentifié par routeur).</p>
          <details className="text-xs text-[#6B7280]"><summary className="flex cursor-pointer items-center gap-1"><ChevronRight className="h-3.5 w-3.5" /> Voir le script d&apos;installation complet</summary><p className="mt-2">Le script complet sera disponible une fois le coordinateur branché au serveur.</p></details>
        </div>
      </div>
    </div>
  );
}
