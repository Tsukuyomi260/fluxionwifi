"use client";

import { useState } from "react";
import {
  Package,
  Ticket,
  Users,
  Search,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Eye,
  X,
  Copy,
  Check,
} from "lucide-react";

interface TicketProfile {
  id: string;
  name: string;
  duration: string;
  price: number;
  speed: string;
  color: string;
  total: number;
  available: number;
  active: number;
  used: number;
  expired: number;
}

const profiles: TicketProfile[] = [
  { id: "1", name: "Express", duration: "1 heure", price: 200, speed: "5 Mbps", color: "#F59E0B", total: 20, available: 8, active: 3, used: 6, expired: 3 },
  { id: "2", name: "Standard", duration: "3 heures", price: 500, speed: "10 Mbps", color: "#2B7FFF", total: 30, available: 15, active: 5, used: 7, expired: 3 },
  { id: "3", name: "Journée", duration: "24 heures", price: 1000, speed: "15 Mbps", color: "#10B981", total: 25, available: 12, active: 4, used: 6, expired: 3 },
  { id: "4", name: "Semaine", duration: "7 jours", price: 5000, speed: "20 Mbps", color: "#8B5CF6", total: 15, available: 8, active: 2, used: 3, expired: 2 },
  { id: "5", name: "Mensuel", duration: "30 jours", price: 15000, speed: "30 Mbps", color: "#EC4899", total: 10, available: 4, active: 3, used: 2, expired: 1 },
];

interface ActiveUser {
  id: string;
  code: string;
  profile: string;
  profileColor: string;
  ip: string;
  mac: string;
  router: string;
  connectedAt: string;
  timeLeft: string;
  download: number;
  upload: number;
}

const activeUsers: ActiveUser[] = [
  { id: "1", code: "8F3A-2D7C", profile: "Standard", profileColor: "#2B7FFF", ip: "10.0.0.15", mac: "AA:BB:CC:11:22:33", router: "MK-Café-01", connectedAt: "14:32", timeLeft: "1h 36min", download: 312, upload: 45 },
  { id: "2", code: "C7E9-01AB", profile: "Express", profileColor: "#F59E0B", ip: "10.0.0.22", mac: "DD:EE:FF:44:55:66", router: "MK-Café-01", connectedAt: "15:10", timeLeft: "14min", download: 87, upload: 12 },
  { id: "3", code: "1B4F-8A3E", profile: "Journée", profileColor: "#10B981", ip: "10.0.1.8", mac: "11:22:33:AA:BB:CC", router: "MK-Hotel-03", connectedAt: "12:05", timeLeft: "20h 09min", download: 1840, upload: 230 },
  { id: "4", code: "F5A1-B3D9", profile: "Semaine", profileColor: "#8B5CF6", ip: "10.0.2.5", mac: "55:66:77:11:22:33", router: "MK-Campus-02", connectedAt: "13:58", timeLeft: "6j 21h", download: 920, upload: 156 },
  { id: "5", code: "FREE-0001", profile: "Gratuit", profileColor: "#6B7280", ip: "10.0.1.15", mac: "77:88:99:DD:EE:FF", router: "MK-Hotel-03", connectedAt: "09:45", timeLeft: "Illimité", download: 42, upload: 8 },
];

type ViewMode = "stock" | "users";

export default function StockPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("stock");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const totalAvailable = profiles.reduce((s, p) => s + p.available, 0);
  const totalActive = profiles.reduce((s, p) => s + p.active, 0);
  const totalTickets = profiles.reduce((s, p) => s + p.total, 0);

  const filteredUsers = activeUsers.filter((u) =>
    u.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.ip.includes(searchQuery) ||
    u.router.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.profile.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5"><Package className="h-5 w-5 text-[#2B7FFF]" /></div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D26]">{totalAvailable}</p>
              <p className="text-xs text-[#6B7280]">Tickets disponibles</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5"><Users className="h-5 w-5 text-emerald-500" /></div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D26]">{totalActive}</p>
              <p className="text-xs text-[#6B7280]">Utilisateurs connectés</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-2.5"><Ticket className="h-5 w-5 text-violet-500" /></div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D26]">{totalTickets}</p>
              <p className="text-xs text-[#6B7280]">Tickets générés (total)</p>
            </div>
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-1 bg-[#F5F7FA] rounded-xl p-1 w-fit">
        <button
          onClick={() => setViewMode("stock")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === "stock" ? "bg-white text-[#1A1D26] shadow-sm" : "text-[#6B7280] hover:text-[#1A1D26]"
          }`}
        >
          <Package className="h-4 w-4" />
          Stock par profil
        </button>
        <button
          onClick={() => setViewMode("users")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === "users" ? "bg-white text-[#1A1D26] shadow-sm" : "text-[#6B7280] hover:text-[#1A1D26]"
          }`}
        >
          <Users className="h-4 w-4" />
          Utilisateurs actifs
        </button>
      </div>

      {/* Stock view */}
      {viewMode === "stock" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {profiles.map((p) => {
            const usedPercent = ((p.total - p.available) / p.total) * 100;
            return (
              <div key={p.id} className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="h-1" style={{ backgroundColor: p.color }} />
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-[#1A1D26]">{p.name}</h3>
                      <p className="text-xs text-[#6B7280]">{p.duration} · {p.speed}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: p.color }}>{p.price.toLocaleString()} CDF</span>
                  </div>

                  {/* Stock bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[#6B7280]">Stock utilisé</span>
                      <span className="font-medium text-[#1A1D26]">{p.total - p.available}/{p.total}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#F1F3F7] overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${usedPercent}%`, backgroundColor: p.color }} />
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#F1F3F7]">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-[#6B7280]">Disponibles</span>
                      <span className="text-xs font-semibold text-[#1A1D26] ml-auto">{p.available}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#2B7FFF]" />
                      <span className="text-xs text-[#6B7280]">Actifs</span>
                      <span className="text-xs font-semibold text-[#1A1D26] ml-auto">{p.active}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#9CA3AF]" />
                      <span className="text-xs text-[#6B7280]">Utilisés</span>
                      <span className="text-xs font-semibold text-[#1A1D26] ml-auto">{p.used}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-400" />
                      <span className="text-xs text-[#6B7280]">Expirés</span>
                      <span className="text-xs font-semibold text-[#1A1D26] ml-auto">{p.expired}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Users view */}
      {viewMode === "users" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par code, IP, routeur, profil..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20 transition-colors"
            />
          </div>

          <div className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            {/* Desktop */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8ECF1] bg-[#FAFBFC]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Code ticket</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Profil</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">IP / MAC</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Routeur</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Temps restant</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Trafic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F7]">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAFBFC] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-[#1A1D26]">{u.code}</span>
                          <button
                            onClick={() => copyCode(u.code)}
                            className="p-1 rounded hover:bg-[#F5F7FA] text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                          >
                            {copiedCode === u.code ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={{ backgroundColor: u.profileColor + "15", color: u.profileColor }}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: u.profileColor }} />
                          {u.profile}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs text-[#1A1D26]">{u.ip}</p>
                        <p className="font-mono text-[10px] text-[#9CA3AF]">{u.mac}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#6B7280]">{u.router}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="h-3 w-3 text-[#9CA3AF]" />
                          <span className="font-medium text-[#1A1D26]">{u.timeLeft}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-[#6B7280]">
                          <span className="text-emerald-600">↓ {u.download} Mo</span>
                          <span className="mx-1 text-[#D1D5DB]">·</span>
                          <span className="text-[#2B7FFF]">↑ {u.upload} Mo</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="lg:hidden divide-y divide-[#F1F3F7]">
              {filteredUsers.map((u) => (
                <div key={u.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-[#1A1D26]">{u.code}</span>
                      <button onClick={() => copyCode(u.code)} className="p-1 text-[#9CA3AF]">
                        {copiedCode === u.code ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: u.profileColor + "15", color: u.profileColor }}>
                      {u.profile}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-[#6B7280]">
                    <span>{u.router}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{u.timeLeft}</span>
                    <span className="text-emerald-600">↓ {u.download} Mo</span>
                    <span className="text-[#2B7FFF]">↑ {u.upload} Mo</span>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="p-12 text-center">
                <Users className="h-8 w-8 text-[#D1D5DB] mx-auto mb-3" />
                <p className="text-sm text-[#6B7280]">Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
