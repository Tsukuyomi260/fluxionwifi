"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle, Printer, X } from "lucide-react";
import { RESELLER, formatCdf, formatDate, type Sale } from "@/lib/reseller-data";

function printTicket(sale: Sale) {
  const w = window.open("", "_blank", "width=380,height=520");
  if (!w) return;
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Ticket WiFi</title>
<style>body{font-family:Arial,sans-serif;text-align:center;padding:24px}
.box{border:2px dashed #2B7FFF;border-radius:12px;padding:20px}
h1{font-size:18px;color:#0B1E4D;margin:0 0 4px}.code{font-size:34px;letter-spacing:4px;font-weight:700;margin:16px 0;font-family:monospace}
.s{color:#555;font-size:13px;margin:4px 0}</style></head><body><div class="box">
<h1>${RESELLER.network}</h1><div class="s">${sale.profileName}</div>
<div class="code">${sale.code}</div><div class="s">${formatCdf(sale.price)}</div>
<div class="s">${formatDate(sale.at)}</div></div>
<script>window.onload=function(){window.print()}<\/script></body></html>`;
  w.document.write(html);
  w.document.close();
}

export function TicketModal({ sale, onClose }: { sale: Sale; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(sale.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible */
    }
  }

  const wa = `https://wa.me/?text=${encodeURIComponent(
    `Votre ticket WiFi ${RESELLER.network} (${sale.profileName}) : ${sale.code}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Vente réussie</p>
            <h3 className="mt-1 text-lg font-bold text-[#0B1E4D]">{sale.profileName}</h3>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F5F7FA]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 rounded-xl border-2 border-dashed border-[#2B7FFF]/50 bg-[#F5F9FF] py-6 text-center">
          <p className="text-xs text-[#6B7280]">Code d&apos;accès</p>
          <p className="mt-1 font-mono text-3xl font-bold tracking-[0.2em] text-[#0B1E4D]">{sale.code}</p>
          <p className="mt-2 text-sm font-semibold text-[#2B7FFF]">{formatCdf(sale.price)}</p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <button onClick={copy} className="flex flex-col items-center gap-1 rounded-xl border border-[#E5E7EB] py-3 text-xs font-medium text-[#374151] hover:bg-[#F5F7FA]">
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copié" : "Copier"}
          </button>
          <button onClick={() => printTicket(sale)} className="flex flex-col items-center gap-1 rounded-xl border border-[#E5E7EB] py-3 text-xs font-medium text-[#374151] hover:bg-[#F5F7FA]">
            <Printer className="h-4 w-4" />
            Imprimer
          </button>
          <a href={wa} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 rounded-xl bg-emerald-500 py-3 text-xs font-medium text-white hover:bg-emerald-600">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
