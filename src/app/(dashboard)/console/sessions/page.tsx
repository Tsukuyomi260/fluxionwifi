"use client";

import { useState } from "react";
import { useSessions } from "@/hooks/use-sessions";
import { useRouters } from "@/hooks/use-routers";
import type { Session } from "@/lib/supabase/types";
import {
  Users,
  Clock,
  Search,
  ChevronDown,
  PowerOff,
  MoreHorizontal,
  X,
  Eye,
  Activity,
  CheckCircle2,
  XCircle,
  Terminal,
  AlertCircle,
  Monitor,
  ArrowDownUp,
  Loader2,
} from "lucide-react";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDuration(startedAt: string, endedAt: string | null): string {
  const start = new Date(startedAt).getTime();
  const end = endedAt ? new Date(endedAt).getTime() : Date.now();
  const diffMin = Math.floor((end - start) / 60000);
  if (diffMin < 1) return "< 1min";
  if (diffMin < 60) return `${diffMin}min`;
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

type SessionFilter = "all" | "active" | "ended";

const statusConfig = {
  active: { label: "Actif", bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle2 },
  ended: { label: "Terminé", bg: "bg-red-50", text: "text-red-600", icon: XCircle },
};

export default function SessionsPage() {
  const { sessions, activeSessions, loading, totalBytesIn, totalBytesOut } = useSessions();
  const { routers } = useRouters();

  const [searchQuery, setSearchQuery] = useState("");
  const [sessionFilter, setSessionFilter] = useState<SessionFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const routerMap = new Map(routers.map((r) => [r.id, r.name]));

  const getStatus = (s: Session): "active" | "ended" => s.is_active ? "active" : "ended";

  const filteredSessions = sessions.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      (s.device_name || "").toLowerCase().includes(q) ||
      (s.ip_address || "").includes(q) ||
      (s.device_mac || "").toLowerCase().includes(q) ||
      (s.router_id ? routerMap.get(s.router_id) || "" : "").toLowerCase().includes(q);
    const status = getStatus(s);
    const matchStatus = sessionFilter === "all" || sessionFilter === status;
    return matchSearch && matchStatus;
  });

  const selectedSession = selectedId ? sessions.find((s) => s.id === selectedId) || null : null;
  const endedCount = sessions.length - activeSessions.length;

  const stats = [
    { label: "Sessions actives", value: activeSessions.length, icon: Users, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
    { label: "Sessions terminées", value: endedCount, icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
    { label: "Trafic entrant", value: formatBytes(totalBytesIn), icon: Activity, iconBg: "bg-violet-50", iconColor: "text-violet-500" },
    { label: "Trafic sortant", value: formatBytes(totalBytesOut), icon: ArrowDownUp, iconBg: "bg-blue-50", iconColor: "text-[#2B7FFF]" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#2B7FFF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3">
              <div className={`rounded-xl p-2.5 ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1D26]">{stat.value}</p>
                <p className="text-xs text-[#6B7280]">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par appareil, IP, MAC, routeur..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20 transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value as SessionFilter)}
            className="h-10 pl-4 pr-10 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-[#2B7FFF] transition-colors"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="ended">Terminé</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
        </div>
      </div>

      <div className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8ECF1] bg-[#FAFBFC]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Appareil</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">IP / MAC</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Routeur</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Début</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Durée</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Trafic</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Statut</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F7]">
              {filteredSessions.map((session) => {
                const status = getStatus(session);
                const sc = statusConfig[status];
                const Icon = sc.icon;
                const rName = session.router_id ? routerMap.get(session.router_id) || "—" : "—";
                return (
                  <tr key={session.id} className="hover:bg-[#FAFBFC] transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-[#1A1D26]">{session.device_name || "Inconnu"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-[#1A1D26]">{session.ip_address || "—"}</p>
                      <p className="font-mono text-[10px] text-[#9CA3AF]">{session.device_mac || "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">{rName}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">
                      {session.started_at ? new Date(session.started_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                        <Clock className="h-3 w-3" />
                        {session.started_at ? formatDuration(session.started_at, session.ended_at) : "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-[#6B7280]">
                        <span className="text-emerald-600">↓ {formatBytes(session.bytes_in || 0)}</span>
                        <span className="mx-1 text-[#D1D5DB]">·</span>
                        <span className="text-[#2B7FFF]">↑ {formatBytes(session.bytes_out || 0)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                        <Icon className="h-3 w-3" />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setOpenMenu(openMenu === session.id ? null : session.id)}
                          className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {openMenu === session.id && (
                          <div className="absolute right-0 top-8 w-44 bg-white rounded-xl border border-[#E8ECF1] shadow-xl z-20 overflow-hidden">
                            <button
                              onClick={() => { setSelectedId(session.id); setOpenMenu(null); }}
                              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                            >
                              <Eye className="h-4 w-4 text-[#9CA3AF]" />
                              Détails
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden divide-y divide-[#F1F3F7]">
          {filteredSessions.map((session) => {
            const status = getStatus(session);
            const sc = statusConfig[status];
            const Icon = sc.icon;
            const rName = session.router_id ? routerMap.get(session.router_id) || "—" : "—";
            return (
              <div key={session.id} className="p-4 space-y-3" onClick={() => setSelectedId(session.id)}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1A1D26]">{session.device_name || "Inconnu"}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{rName} · {session.ip_address || "—"}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                    <Icon className="h-3 w-3" />
                    {sc.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {session.started_at ? formatDuration(session.started_at, session.ended_at) : "—"}
                  </span>
                  <span className="text-emerald-600">↓ {formatBytes(session.bytes_in || 0)}</span>
                  <span className="text-[#2B7FFF]">↑ {formatBytes(session.bytes_out || 0)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSessions.length === 0 && (
          <div className="p-12 text-center">
            <Users className="h-8 w-8 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-sm text-[#6B7280]">Aucune session trouvée</p>
          </div>
        )}
      </div>

      {/* Session detail modal */}
      {selectedSession && (() => {
        const status = getStatus(selectedSession);
        const sc = statusConfig[status];
        const Icon = sc.icon;
        const rName = selectedSession.router_id ? routerMap.get(selectedSession.router_id) || "—" : "—";
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedId(null)} />
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF1]">
                <h3 className="text-lg font-semibold text-[#1A1D26]">Détails de la session</h3>
                <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF]">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                {[
                  { label: "Appareil", value: selectedSession.device_name || "Inconnu" },
                  { label: "Adresse IP", value: selectedSession.ip_address || "—" },
                  { label: "Adresse MAC", value: selectedSession.device_mac || "—" },
                  { label: "Routeur", value: rName },
                  { label: "Début", value: selectedSession.started_at ? new Date(selectedSession.started_at).toLocaleString("fr-FR") : "—" },
                  { label: "Durée", value: selectedSession.started_at ? formatDuration(selectedSession.started_at, selectedSession.ended_at) : "—" },
                  { label: "Trafic entrant", value: formatBytes(selectedSession.bytes_in || 0) },
                  { label: "Trafic sortant", value: formatBytes(selectedSession.bytes_out || 0) },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">{row.label}</span>
                    <span className="text-sm font-medium text-[#1A1D26] font-mono">{row.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Statut</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}>
                    <Icon className="h-3 w-3" />
                    {sc.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
