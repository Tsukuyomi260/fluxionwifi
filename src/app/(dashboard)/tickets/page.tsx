"use client";

import { useState } from "react";
import { useCurrency } from "@/hooks/use-currency";
import { useTickets } from "@/hooks/use-tickets";
import {
  Printer,
  Monitor,
  CheckCircle,
  Clock,
  Loader2,
  X,
  Check,
  Copy,
} from "lucide-react";

export default function TicketsPage() {
  const { currency } = useCurrency();
  const { tickets, profiles, loading, generate } = useTickets();
  const [generating, setGenerating] = useState<string | null>(null);
  const [showSaleModal, setShowSaleModal] = useState<string | null>(null);
  const [showHistorique, setShowHistorique] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const soldTickets = tickets.filter((t) => t.status === "used" || t.status === "active");

  async function handleVendre(profileId: string) {
    setGenerating(profileId);
    await generate(profileId, 1);
    setGenerating(null);
    setShowSaleModal(profileId);
  }

  function handleImprimer(profileId: string) {
    const profileTickets = tickets.filter(
      (t) => t.profile_id === profileId && t.status === "available"
    );
    if (profileTickets.length === 0) return;
    const codes = profileTickets.slice(0, 10).map((t) => t.code);
    const win = window.open("", "_blank");
    if (!win) return;
    const profile = profiles.find((p) => p.id === profileId);
    win.document.write(`<!DOCTYPE html><html><head><title>Tickets - ${profile?.name || ""}</title>
      <style>body{font-family:monospace;padding:20px}
      .ticket{border:2px dashed #333;padding:16px;margin:10px 0;text-align:center;page-break-inside:avoid}
      .code{font-size:24px;font-weight:bold;letter-spacing:4px}
      .info{font-size:12px;color:#666;margin-top:8px}
      @media print{body{padding:0}}</style></head><body>`);
    codes.forEach((code) => {
      win.document.write(`<div class="ticket">
        <div style="font-size:14px;font-weight:bold;margin-bottom:8px">${profile?.name || ""}</div>
        <div class="code">${code}</div>
        <div class="info">${profile?.price?.toLocaleString("fr-FR")} ${currency} | FLUXIONWIFI</div>
      </div>`);
    });
    win.document.write("</body></html>");
    win.document.close();
    win.print();
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-orange-400">
            Vente de Tickets WiFi
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
            <CheckCircle className="h-3.5 w-3.5" />
            Synchronis&eacute;
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#374151]">
                <th className="text-left px-5 py-4 text-sm font-semibold text-slate-300">
                  Cat&eacute;gorie
                </th>
                <th className="text-center px-5 py-4 text-sm font-semibold text-slate-300">
                  Prix
                </th>
                <th className="text-center px-5 py-4 text-sm font-semibold text-slate-300">
                  Restants
                </th>
                <th className="text-center px-5 py-4 text-sm font-semibold text-slate-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3748]">
              {profiles.map((profile) => {
                const available = tickets.filter(
                  (t) => t.profile_id === profile.id && t.status === "available"
                ).length;
                return (
                  <tr
                    key={profile.id}
                    className="hover:bg-[#283141] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-white">
                          {profile.name}
                        </span>
                        <span className="rounded bg-violet-500/30 px-2 py-0.5 text-[10px] font-bold text-violet-300 uppercase">
                          Beta
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-sm font-semibold text-slate-200">
                        {profile.price.toLocaleString("fr-FR")} {currency}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-lg text-slate-300">
                        {available > 0 ? available : "∞"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleVendre(profile.id)}
                          disabled={generating === profile.id}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
                        >
                          {generating === profile.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Monitor className="h-4 w-4" />
                          )}
                          Vendre
                        </button>
                        <button
                          onClick={() => handleImprimer(profile.id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#2B7FFF] px-5 py-2 text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors"
                        >
                          <Printer className="h-4 w-4" />
                          Imprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {profiles.map((profile) => {
            const available = tickets.filter(
              (t) => t.profile_id === profile.id && t.status === "available"
            ).length;
            return (
              <div
                key={profile.id}
                className="rounded-xl bg-[#283141] p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {profile.name}
                    </span>
                    <span className="rounded bg-violet-500/30 px-1.5 py-0.5 text-[9px] font-bold text-violet-300 uppercase">
                      Beta
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-200">
                    {profile.price.toLocaleString("fr-FR")} {currency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Restants : {available > 0 ? available : "∞"}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVendre(profile.id)}
                    disabled={generating === profile.id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-2 text-xs font-medium text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    {generating === profile.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Monitor className="h-3.5 w-3.5" />
                    )}
                    Vendre
                  </button>
                  <button
                    onClick={() => handleImprimer(profile.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2B7FFF] py-2 text-xs font-medium text-white hover:bg-[#1A6BE6] transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Imprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty profiles */}
        {profiles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400">Aucun profil tarifaire configur&eacute;.</p>
            <p className="text-xs text-slate-500 mt-1">
              Cr&eacute;ez des profils depuis la Console pour commencer &agrave; vendre.
            </p>
          </div>
        )}
      </div>

      {/* Historique floating button */}
      <button
        onClick={() => setShowHistorique(true)}
        className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 z-30 flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-orange-600 transition-colors"
      >
        <Clock className="h-4 w-4" />
        Historique
      </button>

      {/* Sale success modal */}
      {showSaleModal && (() => {
        const profile = profiles.find((p) => p.id === showSaleModal);
        const lastTicket = tickets.find(
          (t) => t.profile_id === showSaleModal && t.status === "available"
        );
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowSaleModal(null)}
            />
            <div className="relative w-full max-w-sm bg-[#1F2937] border border-[#374151] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
                  <Check className="h-7 w-7 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Ticket g&eacute;n&eacute;r&eacute; !
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  {profile?.name} &mdash;{" "}
                  {profile?.price?.toLocaleString("fr-FR")} {currency}
                </p>
                {lastTicket && (
                  <div className="rounded-xl bg-[#111827] p-4 mb-4">
                    <p className="font-mono text-xl font-bold tracking-[0.15em] text-white">
                      {lastTicket.code}
                    </p>
                    <button
                      onClick={() => copyCode(lastTicket.code)}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#2B7FFF] hover:text-[#5BA0FF]"
                    >
                      {copiedCode === lastTicket.code ? (
                        <>
                          <Check className="h-3 w-3" /> Copi&eacute; !
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copier le code
                        </>
                      )}
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setShowSaleModal(null)}
                  className="w-full h-10 rounded-xl bg-emerald-500 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Historique modal */}
      {showHistorique && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHistorique(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[80vh] bg-[#1F2937] border border-[#374151] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#374151]">
              <h3 className="text-lg font-semibold text-white">
                Historique des ventes
              </h3>
              <button
                onClick={() => setShowHistorique(false)}
                className="p-1.5 rounded-lg hover:bg-[#374151] text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {soldTickets.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-slate-400">Aucune vente enregistr&eacute;e.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#374151]">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">
                        Code
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">
                        Profil
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">
                        Prix
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2D3748]">
                    {soldTickets.slice(0, 50).map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-[#283141]">
                        <td className="px-4 py-3 font-mono text-xs text-white">
                          {ticket.code}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-300">
                          {ticket.profile?.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-300">
                          {(ticket.profile?.price || 0).toLocaleString("fr-FR")}{" "}
                          {currency}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">
                          {ticket.used_at
                            ? new Date(ticket.used_at).toLocaleDateString("fr-FR")
                            : new Date(ticket.created_at).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
