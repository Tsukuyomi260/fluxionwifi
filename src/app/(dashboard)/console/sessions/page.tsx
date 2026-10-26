"use client";

import { useState } from "react";
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
} from "lucide-react";

type SessionStatus = "active" | "idle" | "expired";

interface RadiusSession {
  id: string;
  username: string;
  profile: string;
  ipAddress: string;
  macAddress: string;
  nasName: string;
  startTime: string;
  duration: string;
  uploadMb: number;
  downloadMb: number;
  status: SessionStatus;
}

const statusConfig: Record<SessionStatus, { label: string; bg: string; text: string; icon: typeof CheckCircle2 }> = {
  active: { label: "Actif", bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle2 },
  idle: { label: "Inactif", bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
  expired: { label: "Expiré", bg: "bg-red-50", text: "text-red-600", icon: XCircle },
};

const demoSessions: RadiusSession[] = [
  { id: "1", username: "ticket-8F3A2D", profile: "Standard (3h)", ipAddress: "10.0.0.15", macAddress: "AA:BB:CC:11:22:33", nasName: "MK-Café-01", startTime: "14:32", duration: "1h 24min", uploadMb: 45, downloadMb: 312, status: "active" },
  { id: "2", username: "ticket-C7E901", profile: "Express (1h)", ipAddress: "10.0.0.22", macAddress: "DD:EE:FF:44:55:66", nasName: "MK-Café-01", startTime: "15:10", duration: "46min", uploadMb: 12, downloadMb: 87, status: "active" },
  { id: "3", username: "ticket-1B4F8A", profile: "Journée (24h)", ipAddress: "10.0.1.8", macAddress: "11:22:33:AA:BB:CC", nasName: "MK-Hotel-03", startTime: "12:05", duration: "3h 51min", uploadMb: 230, downloadMb: 1840, status: "idle" },
  { id: "4", username: "free-guest-01", profile: "Gratuit", ipAddress: "10.0.1.15", macAddress: "77:88:99:DD:EE:FF", nasName: "MK-Hotel-03", startTime: "09:45", duration: "5h 11min", uploadMb: 8, downloadMb: 42, status: "idle" },
  { id: "5", username: "ticket-9D2C4E", profile: "Standard (3h)", ipAddress: "10.0.0.31", macAddress: "CC:DD:EE:77:88:99", nasName: "MK-Café-01", startTime: "08:20", duration: "Expiré", uploadMb: 67, downloadMb: 456, status: "expired" },
  { id: "6", username: "ticket-F5A1B3", profile: "Semaine (7j)", ipAddress: "10.0.2.5", macAddress: "55:66:77:11:22:33", nasName: "MK-Campus-02", startTime: "13:58", duration: "2h 02min", uploadMb: 156, downloadMb: 920, status: "active" },
];

interface LogEntry {
  id: string;
  time: string;
  type: "auth" | "disconnect" | "error" | "nas";
  message: string;
}

const demoLogs: LogEntry[] = [
  { id: "1", time: "15:10:03", type: "auth", message: "Auth-Accept: ticket-C7E901 via MK-Café-01 (10.0.0.22)" },
  { id: "2", time: "14:58:21", type: "disconnect", message: "Session terminée: ticket-9D2C4E — temps écoulé (MK-Café-01)" },
  { id: "3", time: "14:32:15", type: "auth", message: "Auth-Accept: ticket-8F3A2D via MK-Café-01 (10.0.0.15)" },
  { id: "4", time: "13:58:44", type: "auth", message: "Auth-Accept: ticket-F5A1B3 via MK-Campus-02 (10.0.2.5)" },
  { id: "5", time: "13:45:02", type: "error", message: "Auth-Reject: ticket-INVALID — code invalide (MK-Café-01)" },
  { id: "6", time: "12:05:33", type: "auth", message: "Auth-Accept: ticket-1B4F8A via MK-Hotel-03 (10.0.1.8)" },
  { id: "7", time: "11:30:00", type: "nas", message: "NAS MK-Resto-04 (192.168.88.4) — connexion perdue" },
  { id: "8", time: "09:45:12", type: "auth", message: "Auth-Accept: free-guest-01 via MK-Hotel-03 (10.0.1.15)" },
];

const logTypeConfig: Record<string, { bg: string; text: string }> = {
  auth: { bg: "bg-emerald-50", text: "text-emerald-700" },
  disconnect: { bg: "bg-amber-50", text: "text-amber-700" },
  error: { bg: "bg-red-50", text: "text-red-600" },
  nas: { bg: "bg-blue-50", text: "text-[#2B7FFF]" },
};

type ViewMode = "sessions" | "logs";

export default function SessionsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("sessions");
  const [sessions, setSessions] = useState(demoSessions);
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionFilter, setSessionFilter] = useState<"all" | SessionStatus>("all");
  const [selectedSession, setSelectedSession] = useState<RadiusSession | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filteredSessions = sessions.filter((s) => {
    const matchSearch =
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ipAddress.includes(searchQuery) ||
      s.macAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nasName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = sessionFilter === "all" || s.status === sessionFilter;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: "Sessions actives", value: sessions.filter((s) => s.status === "active").length, icon: Users, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
    { label: "Sessions inactives", value: sessions.filter((s) => s.status === "idle").length, icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
    { label: "Bande passante totale", value: (sessions.reduce((s, x) => s + x.downloadMb + x.uploadMb, 0) / 1024).toFixed(1) + " Go", icon: Activity, iconBg: "bg-violet-50", iconColor: "text-violet-500" },
    { label: "Erreurs auth", value: demoLogs.filter((l) => l.type === "error").length, icon: AlertCircle, iconBg: "bg-red-50", iconColor: "text-red-500" },
  ];

  function disconnectSession(id: string) {
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, status: "expired" as SessionStatus, duration: "Déconnecté" } : s));
    setOpenMenu(null);
    setSelectedSession(null);
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

      {/* View toggle */}
      <div className="flex items-center gap-1 bg-[#F5F7FA] rounded-xl p-1 w-fit">
        <button
          onClick={() => setViewMode("sessions")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === "sessions" ? "bg-white text-[#1A1D26] shadow-sm" : "text-[#6B7280] hover:text-[#1A1D26]"
          }`}
        >
          <Users className="h-4 w-4" />
          Sessions
        </button>
        <button
          onClick={() => setViewMode("logs")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === "logs" ? "bg-white text-[#1A1D26] shadow-sm" : "text-[#6B7280] hover:text-[#1A1D26]"
          }`}
        >
          <Terminal className="h-4 w-4" />
          Logs RADIUS
        </button>
      </div>

      {/* Sessions view */}
      {viewMode === "sessions" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par utilisateur, IP, MAC, routeur..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20 transition-colors"
              />
            </div>
            <div className="relative">
              <select
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value as typeof sessionFilter)}
                className="h-10 pl-4 pr-10 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-[#2B7FFF] transition-colors"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="idle">Inactif</option>
                <option value="expired">Expiré</option>
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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Utilisateur</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Profil</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">IP / MAC</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Routeur</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Durée</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Trafic</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Statut</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F7]">
                  {filteredSessions.map((session) => {
                    const sc = statusConfig[session.status];
                    const Icon = sc.icon;
                    return (
                      <tr key={session.id} className="hover:bg-[#FAFBFC] transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-medium text-[#1A1D26]">{session.username}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#6B7280]">{session.profile}</td>
                        <td className="px-4 py-3">
                          <p className="font-mono text-xs text-[#1A1D26]">{session.ipAddress}</p>
                          <p className="font-mono text-[10px] text-[#9CA3AF]">{session.macAddress}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#6B7280]">{session.nasName}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                            <Clock className="h-3 w-3" />
                            {session.duration}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-[#6B7280]">
                            <span className="text-emerald-600">↓ {session.downloadMb} Mo</span>
                            <span className="mx-1 text-[#D1D5DB]">·</span>
                            <span className="text-[#2B7FFF]">↑ {session.uploadMb} Mo</span>
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
                                  onClick={() => { setSelectedSession(session); setOpenMenu(null); }}
                                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                                >
                                  <Eye className="h-4 w-4 text-[#9CA3AF]" />
                                  Détails
                                </button>
                                {session.status !== "expired" && (
                                  <button
                                    onClick={() => disconnectSession(session.id)}
                                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                  >
                                    <PowerOff className="h-4 w-4" />
                                    Déconnecter
                                  </button>
                                )}
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
                const sc = statusConfig[session.status];
                const Icon = sc.icon;
                return (
                  <div key={session.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-sm font-medium text-[#1A1D26]">{session.username}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{session.profile} · {session.nasName}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                        <Icon className="h-3 w-3" />
                        {sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{session.duration}</span>
                      <span className="text-emerald-600">↓ {session.downloadMb} Mo</span>
                      <span className="text-[#2B7FFF]">↑ {session.uploadMb} Mo</span>
                    </div>
                    {session.status !== "expired" && (
                      <button
                        onClick={() => disconnectSession(session.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600"
                      >
                        <PowerOff className="h-3 w-3" />
                        Déconnecter
                      </button>
                    )}
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
        </div>
      )}

      {/* Logs view */}
      {viewMode === "logs" && (
        <div className="rounded-2xl border border-[#E8ECF1] bg-[#0B1E4D] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-[#2B7FFF]" />
              <span className="text-sm font-medium text-white">Logs RADIUS — Temps réel</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400">Live</span>
            </div>
          </div>
          <div className="p-4 space-y-1 font-mono text-xs max-h-[500px] overflow-y-auto">
            {demoLogs.map((log) => {
              const lc = logTypeConfig[log.type];
              return (
                <div key={log.id} className="flex items-start gap-3 py-1.5 hover:bg-white/5 rounded px-2 -mx-2 transition-colors">
                  <span className="text-[#6B7280] shrink-0 w-16">{log.time}</span>
                  <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shrink-0 ${lc.bg} ${lc.text}`}>
                    {log.type}
                  </span>
                  <span className="text-[#E2E8F0] break-all">{log.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Session detail modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedSession(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF1]">
              <h3 className="text-lg font-semibold text-[#1A1D26]">Détails de la session</h3>
              <button onClick={() => setSelectedSession(null)} className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: "Utilisateur", value: selectedSession.username },
                { label: "Profil", value: selectedSession.profile },
                { label: "Adresse IP", value: selectedSession.ipAddress },
                { label: "Adresse MAC", value: selectedSession.macAddress },
                { label: "Routeur", value: selectedSession.nasName },
                { label: "Début", value: selectedSession.startTime },
                { label: "Durée", value: selectedSession.duration },
                { label: "Download", value: `${selectedSession.downloadMb} Mo` },
                { label: "Upload", value: `${selectedSession.uploadMb} Mo` },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">{row.label}</span>
                  <span className="text-sm font-medium text-[#1A1D26] font-mono">{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Statut</span>
                {(() => {
                  const sc = statusConfig[selectedSession.status];
                  const Icon = sc.icon;
                  return (
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}>
                      <Icon className="h-3 w-3" />
                      {sc.label}
                    </span>
                  );
                })()}
              </div>
            </div>
            {selectedSession.status !== "expired" && (
              <div className="px-6 py-4 border-t border-[#E8ECF1] flex justify-end">
                <button
                  onClick={() => disconnectSession(selectedSession.id)}
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-red-500 text-sm font-medium text-white hover:bg-red-600 transition-colors"
                >
                  <PowerOff className="h-4 w-4" />
                  Déconnecter la session
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
