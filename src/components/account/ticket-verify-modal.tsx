"use client";

import { useState } from "react";
import { CheckCircle2, Search, ShieldAlert, X, XCircle } from "lucide-react";
import { INITIAL_REPORTS, lookupTicket, type TicketInfo, type TicketStatus } from "@/lib/ticket-lookup";
import { useCurrency } from "@/hooks/use-currency";

const statusUi: Record<TicketStatus, { label: string; cls: string }> = {
  neuf: { label: "Neuf (jamais utilisé)", cls: "bg-sky-50 text-sky-700" },
  actif: { label: "Actif (en cours)", cls: "bg-emerald-50 text-emerald-700" },
  epuise: { label: "Épuisé", cls: "bg-red-50 text-red-600" },
  bloque: { label: "Bloqué", cls: "bg-amber-50 text-amber-700" },
};

const fmt = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)} ${iso.slice(11, 16)}`;

export function TicketVerifyModal({ onClose, initialCode = "" }: { onClose: () => void; initialCode?: string }) {
  const { currency } = useCurrency();
  const [tab, setTab] = useState<"verify" | "reports">("verify");
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<null | { found: boolean; info?: TicketInfo }>(null);
  const [reports, setReports] = useState(INITIAL_REPORTS);

  function verify(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    const info = lookupTicket(code);
    setResult(info ? { found: true, info } : { found: false });
  }

  const pending = reports.filter((r) => !r.resolved).length;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-4 sm:items-center" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-[#0B1E4D]">
            <Search className="h-5 w-5 text-orange-500" /> Vérification des tickets
          </h2>
          <button onClick={onClose} aria-label="Fermer" className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F3F4F6]"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex border-b border-[#E5E7EB] text-sm font-medium">
          <button onClick={() => setTab("verify")} className={`flex-1 border-b-2 py-3 ${tab === "verify" ? "border-orange-500 text-[#0B1E4D]" : "border-transparent text-[#6B7280]"}`}>Vérifier</button>
          <button onClick={() => setTab("reports")} className={`flex-1 border-b-2 py-3 ${tab === "reports" ? "border-orange-500 text-[#0B1E4D]" : "border-transparent text-[#6B7280]"}`}>
            Signalements reçus{pending > 0 && <span className="ml-1.5 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">{pending}</span>}
          </button>
        </div>

        {tab === "verify" && (
          <div className="space-y-4 p-5">
            <form onSubmit={verify}>
              <label htmlFor="v-code" className="text-sm text-[#374151]">Identifiant du ticket</label>
              <div className="mt-1.5 flex gap-2">
                <input
                  id="v-code"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setResult(null); }}
                  placeholder="Ex. ab12cd"
                  autoFocus
                  className="h-11 flex-1 rounded-lg border-2 border-[#374151] bg-white px-3 font-mono text-sm focus:border-orange-500 focus:outline-none"
                />
                <button className="h-11 rounded-lg bg-orange-500 px-5 text-sm font-semibold text-white hover:bg-orange-600">Vérifier</button>
              </div>
            </form>
            <p className="text-xs text-[#6B7280]">L&apos;état vient du serveur, pas de la page : il dit ce que le ticket a réellement consommé.</p>

            {result && !result.found && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" /> Aucun ticket trouvé avec cet identifiant.
              </div>
            )}
            {result?.found && result.info && (
              <div className="space-y-3 rounded-xl border border-[#E5E7EB] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-2 font-mono text-base font-bold text-[#0B1E4D]"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> {result.info.code}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusUi[result.info.status].cls}`}>{statusUi[result.info.status].label}</span>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {([
                    ["Profil", result.info.profile],
                    ["Prix", `${result.info.price.toLocaleString("fr-FR")} ${currency}`],
                    ["Consommé", result.info.consumed],
                    ["Reste", result.info.remaining],
                    ["Routeur", result.info.router],
                    ["Appareil (MAC)", result.info.mac],
                    ["Vendu par", result.info.seller],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k}><dt className="text-xs text-[#6B7280]">{k}</dt><dd className="font-medium text-[#1A1D26]">{v}</dd></div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        )}

        {tab === "reports" && (
          <div className="space-y-2 p-5">
            {reports.length === 0 && <p className="py-8 text-center text-sm text-[#6B7280]">Aucun signalement.</p>}
            {reports.map((r) => (
              <div key={r.id} className="rounded-xl border border-[#E5E7EB] p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 font-mono text-sm font-semibold text-[#0B1E4D]"><ShieldAlert className={`h-4 w-4 ${r.resolved ? "text-emerald-500" : "text-amber-500"}`} /> {r.code}</p>
                  <span className="text-xs text-[#9CA3AF]">{fmt(r.at)}</span>
                </div>
                <p className="mt-1.5 text-sm text-[#374151]">{r.message}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-[#6B7280]">{r.client}</span>
                  {r.resolved ? (
                    <span className="font-medium text-emerald-600">Résolu</span>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => { setCode(r.code); setResult(lookupTicket(r.code) ? { found: true, info: lookupTicket(r.code)! } : { found: false }); setTab("verify"); }} className="rounded-lg border border-[#D1D5DB] px-2.5 py-1 font-medium text-[#374151] hover:bg-[#F3F4F6]">Vérifier</button>
                      <button onClick={() => setReports((rs) => rs.map((x) => (x.id === r.id ? { ...x, resolved: true } : x)))} className="rounded-lg bg-emerald-500 px-2.5 py-1 font-medium text-white hover:bg-emerald-600">Marquer résolu</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
