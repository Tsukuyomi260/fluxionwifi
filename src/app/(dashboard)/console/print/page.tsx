"use client";

import { useState } from "react";
import { useCurrency } from "@/hooks/use-currency";
import {
  Printer,
  Ticket,
  ChevronDown,
  Download,
  Eye,
  Grid3X3,
  List,
  Check,
  Copy,
  Wifi,
  QrCode,
} from "lucide-react";

interface PrintProfile {
  id: string;
  name: string;
  duration: string;
  price: number;
  color: string;
  availableCount: number;
}

const printProfiles: PrintProfile[] = [
  { id: "1", name: "Express", duration: "1h", price: 200, color: "#F59E0B", availableCount: 8 },
  { id: "2", name: "Standard", duration: "3h", price: 500, color: "#2B7FFF", availableCount: 15 },
  { id: "3", name: "Journée", duration: "24h", price: 1000, color: "#10B981", availableCount: 12 },
  { id: "4", name: "Semaine", duration: "7j", price: 5000, color: "#8B5CF6", availableCount: 8 },
  { id: "5", name: "Mensuel", duration: "30j", price: 15000, color: "#EC4899", availableCount: 4 },
];

interface PrintTicket {
  code: string;
  profile: string;
  profileColor: string;
  duration: string;
  price: number;
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

type PrintLayout = "grid" | "list";

export default function PrintPage() {
  const { currency } = useCurrency();
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [quantity, setQuantity] = useState(10);
  const [tickets, setTickets] = useState<PrintTicket[]>([]);
  const [layout, setLayout] = useState<PrintLayout>("grid");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const profile = printProfiles.find((p) => p.id === selectedProfile);

  function generateTickets() {
    if (!profile) return;
    const maxQty = Math.min(quantity, profile.availableCount);
    const newTickets: PrintTicket[] = Array.from({ length: maxQty }, () => ({
      code: generateCode(),
      profile: profile.name,
      profileColor: profile.color,
      duration: profile.duration,
      price: profile.price,
    }));
    setTickets(newTickets);
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6">
      {/* Config panel */}
      <div className="rounded-2xl border border-[#E8ECF1] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h3 className="text-base font-semibold text-[#1A1D26] mb-4">Configurer l'impression</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Profile selector */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Profil tarifaire</label>
            <div className="grid grid-cols-1 gap-2">
              {printProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProfile(p.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                    selectedProfile === p.id
                      ? "border-[#2B7FFF] bg-[#2B7FFF]/5 ring-1 ring-[#2B7FFF]/20"
                      : "border-[#E8ECF1] hover:border-[#2B7FFF]/30"
                  }`}
                >
                  <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-[#1A1D26]">{p.name}</span>
                    <span className="text-xs text-[#9CA3AF] ml-2">{p.duration}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: p.color }}>{p.price} {currency}</span>
                  <span className="text-[10px] text-[#9CA3AF]">({p.availableCount})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + actions */}
          <div className="sm:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Quantité à imprimer</label>
              <div className="flex flex-wrap gap-2">
                {[5, 10, 25, 50].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q)}
                    className={`h-10 px-5 rounded-xl text-sm font-medium transition-all ${
                      quantity === q
                        ? "bg-[#2B7FFF] text-white shadow-sm"
                        : "border border-[#E8ECF1] text-[#374151] hover:border-[#2B7FFF]/30"
                    }`}
                  >
                    {q}
                  </button>
                ))}
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(100, Number(e.target.value))))}
                  className="h-10 w-20 px-3 rounded-xl border border-[#E8ECF1] text-sm text-center text-[#1A1D26] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20"
                />
              </div>
              {profile && quantity > profile.availableCount && (
                <p className="text-xs text-amber-600 mt-2">
                  Seulement {profile.availableCount} tickets disponibles pour ce profil
                </p>
              )}
            </div>

            {/* Summary */}
            {profile && (
              <div className="rounded-xl bg-[#F5F7FA] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: profile.color }} />
                  <span className="text-sm font-semibold text-[#1A1D26]">{profile.name} — {profile.duration}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                  <span>{Math.min(quantity, profile.availableCount)} ticket{Math.min(quantity, profile.availableCount) > 1 ? "s" : ""}</span>
                  <span>·</span>
                  <span className="font-semibold text-[#1A1D26]">
                    {(profile.price * Math.min(quantity, profile.availableCount)).toLocaleString()} {currency} valeur totale
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={generateTickets}
                disabled={!profile}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#2B7FFF]/90 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Ticket className="h-4 w-4" />
                Préparer les tickets
              </button>
              {tickets.length > 0 && (
                <>
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 h-10 px-5 rounded-xl border border-[#E8ECF1] bg-white text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                  >
                    <Printer className="h-4 w-4" />
                    Imprimer
                  </button>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="inline-flex items-center gap-2 h-10 px-5 rounded-xl border border-[#E8ECF1] bg-white text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Aperçu
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Generated tickets */}
      {tickets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#1A1D26]">
              {tickets.length} ticket{tickets.length > 1 ? "s" : ""} prêt{tickets.length > 1 ? "s" : ""}
            </h3>
            <div className="flex items-center gap-1 bg-[#F5F7FA] rounded-lg p-0.5">
              <button
                onClick={() => setLayout("grid")}
                className={`p-1.5 rounded-md transition-colors ${layout === "grid" ? "bg-white shadow-sm" : "text-[#9CA3AF]"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setLayout("list")}
                className={`p-1.5 rounded-md transition-colors ${layout === "list" ? "bg-white shadow-sm" : "text-[#9CA3AF]"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Grid layout */}
          {layout === "grid" && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 print:grid-cols-3">
              {tickets.map((t, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden print:break-inside-avoid"
                >
                  <div className="h-1" style={{ backgroundColor: t.profileColor }} />
                  <div className="p-4 text-center space-y-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <Wifi className="h-4 w-4 text-[#2B7FFF]" />
                      <span className="text-xs font-bold text-[#0B1E4D] uppercase tracking-wider">FLUXIONWIFI</span>
                    </div>
                    <div>
                      <p className="text-xs text-[#9CA3AF]">{t.profile} · {t.duration}</p>
                      <p className="font-mono text-xl font-bold text-[#1A1D26] mt-1 tracking-wider">{t.code}</p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-bold" style={{ color: t.profileColor }}>{t.price.toLocaleString()} {currency}</span>
                      <button
                        onClick={() => copyCode(t.code)}
                        className="p-1 rounded hover:bg-[#F5F7FA] text-[#9CA3AF] print:hidden"
                      >
                        {copiedCode === t.code ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <div className="h-12 w-12 bg-[#F5F7FA] rounded-lg flex items-center justify-center">
                        <QrCode className="h-8 w-8 text-[#D1D5DB]" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List layout */}
          {layout === "list" && (
            <div className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8ECF1] bg-[#FAFBFC]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">#</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Code</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Profil</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Durée</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Prix</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider print:hidden">Copier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F7]">
                  {tickets.map((t, i) => (
                    <tr key={i} className="hover:bg-[#FAFBFC] transition-colors">
                      <td className="px-4 py-3 text-xs text-[#9CA3AF]">{i + 1}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-bold text-[#1A1D26] tracking-wider">{t.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: t.profileColor }}>
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.profileColor }} />
                          {t.profile}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#6B7280]">{t.duration}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-[#1A1D26]">{t.price.toLocaleString()} {currency}</td>
                      <td className="px-4 py-3 text-right print:hidden">
                        <button
                          onClick={() => copyCode(t.code)}
                          className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                        >
                          {copiedCode === t.code ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {tickets.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#E8ECF1] bg-white p-12 text-center">
          <Printer className="h-10 w-10 text-[#D1D5DB] mx-auto mb-3" />
          <p className="text-sm font-medium text-[#6B7280]">Sélectionnez un profil et une quantité</p>
          <p className="text-xs text-[#9CA3AF] mt-1">Les tickets générés apparaîtront ici, prêts à imprimer</p>
        </div>
      )}

      {/* Print preview modal */}
      {showPreview && tickets.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
          <div className="relative w-full max-w-3xl max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF1]">
              <h3 className="text-lg font-semibold text-[#1A1D26]">Aperçu d'impression</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#2B7FFF]/90 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  Imprimer
                </button>
                <button onClick={() => setShowPreview(false)} className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF]">
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-64px)]">
              <div className="grid grid-cols-3 gap-4">
                {tickets.map((t, i) => (
                  <div key={i} className="border border-[#E8ECF1] rounded-xl p-3 text-center">
                    <p className="text-[10px] font-bold text-[#0B1E4D] uppercase tracking-wider mb-1">FLUXIONWIFI</p>
                    <p className="text-[9px] text-[#9CA3AF]">{t.profile} · {t.duration}</p>
                    <p className="font-mono text-base font-bold text-[#1A1D26] my-2 tracking-wider">{t.code}</p>
                    <p className="text-xs font-bold" style={{ color: t.profileColor }}>{t.price.toLocaleString()} {currency}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
