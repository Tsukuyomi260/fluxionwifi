"use client";

import { useState } from "react";
import {
  Shield,
  Plus,
  Search,
  MoreVertical,
  Wifi,
  WifiOff,
  Download,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  X,
  Server,
  Globe,
  Clock,
  ArrowUpDown,
  ChevronDown,
  Eye,
  EyeOff,
  AlertTriangle,
  Zap,
  Lock,
  Key,
} from "lucide-react";

type Protocol = "WireGuard" | "SSTP";
type TunnelStatus = "connected" | "disconnected" | "connecting";

interface VpnTunnel {
  id: string;
  name: string;
  protocol: Protocol;
  status: TunnelStatus;
  serverIp: string;
  localIp: string;
  routerName: string | null;
  routerIp: string | null;
  publicKey?: string;
  port: number;
  uptime: string | null;
  lastSeen: string;
  bytesIn: string;
  bytesOut: string;
}

const tunnels: VpnTunnel[] = [
  {
    id: "vpn-001",
    name: "Tunnel Principal",
    protocol: "WireGuard",
    status: "connected",
    serverIp: "vpn1.fluxionwifi.tech",
    localIp: "10.10.0.2/32",
    routerName: "MK-GOMBE-01",
    routerIp: "192.168.88.1",
    publicKey: "aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5=",
    port: 51820,
    uptime: "3j 14h 22min",
    lastSeen: "En ligne",
    bytesIn: "2.4 GB",
    bytesOut: "856 MB",
  },
  {
    id: "vpn-002",
    name: "Tunnel Backup",
    protocol: "WireGuard",
    status: "connected",
    serverIp: "vpn2.fluxionwifi.tech",
    localIp: "10.10.0.3/32",
    routerName: "MK-LIMETE-02",
    routerIp: "192.168.88.1",
    publicKey: "xY9zW8vU7tS6rQ5pO4nM3lK2jI1hG0fE9dC8bA7=",
    port: 51820,
    uptime: "1j 8h 45min",
    lastSeen: "En ligne",
    bytesIn: "1.1 GB",
    bytesOut: "420 MB",
  },
  {
    id: "vpn-003",
    name: "Site Ngaliema",
    protocol: "SSTP",
    status: "disconnected",
    serverIp: "vpn1.fluxionwifi.tech",
    localIp: "10.20.0.4/32",
    routerName: "MK-NGALIEMA-03",
    routerIp: "192.168.88.1",
    port: 443,
    uptime: null,
    lastSeen: "Il y a 2h",
    bytesIn: "0 B",
    bytesOut: "0 B",
  },
  {
    id: "vpn-004",
    name: "Site Barumbu",
    protocol: "WireGuard",
    status: "connecting",
    serverIp: "vpn1.fluxionwifi.tech",
    localIp: "10.10.0.5/32",
    routerName: null,
    routerIp: null,
    publicKey: "mN3oP4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5=",
    port: 51820,
    uptime: null,
    lastSeen: "Connexion...",
    bytesIn: "0 B",
    bytesOut: "0 B",
  },
];

const statusConfig = {
  connected: { label: "Connecté", color: "bg-emerald-500", textColor: "text-emerald-600", bgColor: "bg-emerald-50", icon: Wifi },
  disconnected: { label: "Déconnecté", color: "bg-red-400", textColor: "text-red-500", bgColor: "bg-red-50", icon: WifiOff },
  connecting: { label: "Connexion...", color: "bg-amber-400", textColor: "text-amber-600", bgColor: "bg-amber-50", icon: RefreshCw },
};

export default function VpnPage() {
  const [search, setSearch] = useState("");
  const [filterProtocol, setFilterProtocol] = useState<"all" | Protocol>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | TunnelStatus>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<VpnTunnel | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const filtered = tunnels.filter((t) => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.routerName?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterProtocol !== "all" && t.protocol !== filterProtocol) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    return true;
  });

  const totalTunnels = tunnels.length;
  const connectedCount = tunnels.filter((t) => t.status === "connected").length;
  const disconnectedCount = tunnels.filter((t) => t.status === "disconnected").length;

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1A1D26]">VPN & Accès distant</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Gérez vos tunnels VPN pour accéder à vos routeurs à distance</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nouveau tunnel
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5">
              <Shield className="h-5 w-5 text-[#2B7FFF]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D26]">{totalTunnels}</p>
              <p className="text-xs text-[#6B7280]">Tunnels configurés</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5">
              <Wifi className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D26]">{connectedCount}</p>
              <p className="text-xs text-[#6B7280]">Connectés</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-2.5">
              <WifiOff className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D26]">{disconnectedCount}</p>
              <p className="text-xs text-[#6B7280]">Déconnectés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert for disconnected tunnels */}
      {disconnectedCount > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700">
            <span className="font-medium">{disconnectedCount} tunnel{disconnectedCount > 1 ? "s" : ""} déconnecté{disconnectedCount > 1 ? "s" : ""}</span> — vérifiez la connectivité de vos routeurs.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Rechercher par nom ou routeur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF]"
          />
        </div>
        <select
          value={filterProtocol}
          onChange={(e) => setFilterProtocol(e.target.value as "all" | Protocol)}
          className="h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#6B7280] focus:outline-none focus:border-[#2B7FFF] appearance-none pr-8 cursor-pointer"
        >
          <option value="all">Tous les protocoles</option>
          <option value="WireGuard">WireGuard</option>
          <option value="SSTP">SSTP</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as "all" | TunnelStatus)}
          className="h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#6B7280] focus:outline-none focus:border-[#2B7FFF] appearance-none pr-8 cursor-pointer"
        >
          <option value="all">Tous les statuts</option>
          <option value="connected">Connectés</option>
          <option value="disconnected">Déconnectés</option>
          <option value="connecting">En cours</option>
        </select>
      </div>

      {/* Tunnels — Desktop table */}
      <div className="hidden lg:block rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F1F3F7]">
              <th className="text-left text-xs font-medium text-[#6B7280] px-5 py-3.5">Tunnel</th>
              <th className="text-left text-xs font-medium text-[#6B7280] px-5 py-3.5">Protocole</th>
              <th className="text-left text-xs font-medium text-[#6B7280] px-5 py-3.5">Statut</th>
              <th className="text-left text-xs font-medium text-[#6B7280] px-5 py-3.5">Routeur lié</th>
              <th className="text-left text-xs font-medium text-[#6B7280] px-5 py-3.5">Serveur</th>
              <th className="text-left text-xs font-medium text-[#6B7280] px-5 py-3.5">Uptime</th>
              <th className="text-left text-xs font-medium text-[#6B7280] px-5 py-3.5">Trafic</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tunnel) => {
              const sc = statusConfig[tunnel.status];
              return (
                <tr
                  key={tunnel.id}
                  className="border-b border-[#F1F3F7] last:border-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                  onClick={() => setShowDetailModal(tunnel)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${sc.color} shrink-0`} />
                      <div>
                        <p className="text-sm font-medium text-[#1A1D26]">{tunnel.name}</p>
                        <p className="text-xs text-[#9CA3AF]">{tunnel.localIp}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${
                      tunnel.protocol === "WireGuard"
                        ? "bg-violet-50 text-violet-600"
                        : "bg-cyan-50 text-cyan-600"
                    }`}>
                      <Lock className="h-3 w-3" />
                      {tunnel.protocol}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${sc.bgColor} ${sc.textColor}`}>
                      <sc.icon className={`h-3 w-3 ${tunnel.status === "connecting" ? "animate-spin" : ""}`} />
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {tunnel.routerName ? (
                      <div>
                        <p className="text-sm text-[#1A1D26]">{tunnel.routerName}</p>
                        <p className="text-xs text-[#9CA3AF]">{tunnel.routerIp}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-[#9CA3AF] italic">Non lié</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-[#6B7280]">{tunnel.serverIp}</p>
                    <p className="text-xs text-[#9CA3AF]">:{tunnel.port}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-[#6B7280]">{tunnel.uptime || "—"}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs text-[#6B7280]">
                      <span className="text-emerald-500">↓</span> {tunnel.bytesIn}
                      <br />
                      <span className="text-blue-500">↑</span> {tunnel.bytesOut}
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === tunnel.id ? null : tunnel.id); }}
                        className="p-1.5 rounded-lg hover:bg-[#F1F3F7] text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {menuOpen === tunnel.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-[#E8ECF1] bg-white shadow-lg z-20 py-1">
                          <button onClick={(e) => { e.stopPropagation(); setShowDetailModal(tunnel); setMenuOpen(null); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#374151] hover:bg-[#F5F7FA]">
                            <Eye className="h-4 w-4" /> Détails
                          </button>
                          <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#374151] hover:bg-[#F5F7FA]">
                            <Download className="h-4 w-4" /> Télécharger config
                          </button>
                          <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#374151] hover:bg-[#F5F7FA]">
                            <RefreshCw className="h-4 w-4" /> Reconnecter
                          </button>
                          <hr className="my-1 border-[#F1F3F7]" />
                          <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" /> Supprimer
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

      {/* Tunnels — Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((tunnel) => {
          const sc = statusConfig[tunnel.status];
          return (
            <div
              key={tunnel.id}
              onClick={() => setShowDetailModal(tunnel)}
              className="rounded-2xl border border-[#E8ECF1] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] cursor-pointer active:bg-[#F9FAFB]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${sc.color}`} />
                  <div>
                    <p className="text-sm font-semibold text-[#1A1D26]">{tunnel.name}</p>
                    <p className="text-xs text-[#9CA3AF]">{tunnel.localIp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-medium ${
                    tunnel.protocol === "WireGuard" ? "bg-violet-50 text-violet-600" : "bg-cyan-50 text-cyan-600"
                  }`}>
                    {tunnel.protocol}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-medium ${sc.bgColor} ${sc.textColor}`}>
                    <sc.icon className={`h-3 w-3 ${tunnel.status === "connecting" ? "animate-spin" : ""}`} />
                    {sc.label}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div>
                  <span className="text-[#9CA3AF]">Routeur: </span>
                  <span className="text-[#374151]">{tunnel.routerName || "Non lié"}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF]">Serveur: </span>
                  <span className="text-[#374151]">{tunnel.serverIp}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF]">Uptime: </span>
                  <span className="text-[#374151]">{tunnel.uptime || "—"}</span>
                </div>
                <div>
                  <span className="text-emerald-500">↓</span> {tunnel.bytesIn}{" "}
                  <span className="text-blue-500">↑</span> {tunnel.bytesOut}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <Shield className="h-10 w-10 text-[#D1D5DB] mx-auto mb-3" />
          <p className="text-sm font-medium text-[#6B7280]">Aucun tunnel trouvé</p>
          <p className="text-xs text-[#9CA3AF] mt-1">Modifiez vos filtres ou créez un nouveau tunnel</p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (() => {
        const t = showDetailModal;
        const sc = statusConfig[t.status];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => { setShowDetailModal(null); setShowKey(false); }}>
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F3F7]">
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-2.5 ${t.protocol === "WireGuard" ? "bg-violet-50" : "bg-cyan-50"}`}>
                    <Shield className={`h-5 w-5 ${t.protocol === "WireGuard" ? "text-violet-500" : "text-cyan-500"}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#1A1D26]">{t.name}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${sc.textColor}`}>
                      <sc.icon className={`h-3 w-3 ${t.status === "connecting" ? "animate-spin" : ""}`} />
                      {sc.label}
                    </span>
                  </div>
                </div>
                <button onClick={() => { setShowDetailModal(null); setShowKey(false); }} className="p-2 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Connection info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#F5F7FA] p-3.5">
                    <p className="text-xs text-[#9CA3AF] mb-1">Protocole</p>
                    <div className="flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-[#6B7280]" />
                      <p className="text-sm font-medium text-[#1A1D26]">{t.protocol}</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#F5F7FA] p-3.5">
                    <p className="text-xs text-[#9CA3AF] mb-1">Port</p>
                    <p className="text-sm font-medium text-[#1A1D26]">{t.port}</p>
                  </div>
                  <div className="rounded-xl bg-[#F5F7FA] p-3.5">
                    <p className="text-xs text-[#9CA3AF] mb-1">Serveur</p>
                    <p className="text-sm font-medium text-[#1A1D26]">{t.serverIp}</p>
                  </div>
                  <div className="rounded-xl bg-[#F5F7FA] p-3.5">
                    <p className="text-xs text-[#9CA3AF] mb-1">IP locale</p>
                    <p className="text-sm font-medium text-[#1A1D26]">{t.localIp}</p>
                  </div>
                </div>

                {/* Router link */}
                <div className="rounded-xl border border-[#E8ECF1] p-4">
                  <p className="text-xs font-medium text-[#6B7280] mb-2">Routeur lié</p>
                  {t.routerName ? (
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-50 p-2">
                        <Server className="h-4 w-4 text-[#2B7FFF]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1D26]">{t.routerName}</p>
                        <p className="text-xs text-[#9CA3AF]">{t.routerIp}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#9CA3AF] italic">Aucun routeur lié</p>
                      <button className="text-xs font-medium text-[#2B7FFF] hover:underline">Lier un routeur</button>
                    </div>
                  )}
                </div>

                {/* Public key (WireGuard only) */}
                {t.publicKey && (
                  <div className="rounded-xl border border-[#E8ECF1] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-[#6B7280]">Clé publique</p>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setShowKey(!showKey)} className="p-1 rounded hover:bg-[#F5F7FA] text-[#9CA3AF]">
                          {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                        <button onClick={() => copyToClipboard(t.publicKey!)} className="p-1 rounded hover:bg-[#F5F7FA] text-[#9CA3AF]">
                          {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs font-mono text-[#374151] bg-[#F5F7FA] rounded-lg px-3 py-2 break-all">
                      {showKey ? t.publicKey : "••••••••••••••••••••••••••••••••••••••••••••"}
                    </p>
                  </div>
                )}

                {/* Traffic stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#F5F7FA] p-3.5">
                    <p className="text-xs text-[#9CA3AF] mb-1">Uptime</p>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#6B7280]" />
                      <p className="text-sm font-medium text-[#1A1D26]">{t.uptime || "—"}</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#F5F7FA] p-3.5">
                    <p className="text-xs text-[#9CA3AF] mb-1">Dernière activité</p>
                    <p className="text-sm font-medium text-[#1A1D26]">{t.lastSeen}</p>
                  </div>
                  <div className="rounded-xl bg-[#F5F7FA] p-3.5">
                    <p className="text-xs text-[#9CA3AF] mb-1">Trafic entrant</p>
                    <p className="text-sm font-medium text-emerald-600">{t.bytesIn}</p>
                  </div>
                  <div className="rounded-xl bg-[#F5F7FA] p-3.5">
                    <p className="text-xs text-[#9CA3AF] mb-1">Trafic sortant</p>
                    <p className="text-sm font-medium text-blue-600">{t.bytesOut}</p>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex items-center gap-3 px-6 py-4 border-t border-[#F1F3F7]">
                <button className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-[#E8ECF1] text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors">
                  <Download className="h-4 w-4" />
                  Config
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-[#E8ECF1] text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors">
                  <RefreshCw className="h-4 w-4" />
                  Reconnecter
                </button>
                <button className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowCreateModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F3F7]">
              <h3 className="text-base font-semibold text-[#1A1D26]">Nouveau tunnel VPN</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Nom du tunnel</label>
                <input
                  type="text"
                  placeholder="Ex: Tunnel Site Principal"
                  className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Protocole</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 rounded-xl border-2 border-[#2B7FFF] bg-[#EBF2FF] p-3.5 cursor-pointer">
                    <input type="radio" name="protocol" value="WireGuard" defaultChecked className="sr-only" />
                    <div className="rounded-lg bg-violet-100 p-2">
                      <Zap className="h-4 w-4 text-violet-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1D26]">WireGuard</p>
                      <p className="text-[11px] text-[#6B7280]">Rapide & léger</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border-2 border-[#E8ECF1] p-3.5 cursor-pointer hover:border-[#2B7FFF]/50">
                    <input type="radio" name="protocol" value="SSTP" className="sr-only" />
                    <div className="rounded-lg bg-cyan-100 p-2">
                      <Lock className="h-4 w-4 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1D26]">SSTP</p>
                      <p className="text-[11px] text-[#6B7280]">Port 443</p>
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Serveur VPN</label>
                <select className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-[#2B7FFF]">
                  <option>vpn1.fluxionwifi.tech (Afrique Centrale)</option>
                  <option>vpn2.fluxionwifi.tech (Afrique de l&apos;Ouest)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Lier à un routeur (optionnel)</label>
                <select className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-[#2B7FFF]">
                  <option value="">Aucun routeur</option>
                  <option>MK-GOMBE-01 (192.168.88.1)</option>
                  <option>MK-LIMETE-02 (192.168.88.1)</option>
                  <option>MK-NGALIEMA-03 (192.168.88.1)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-t border-[#F1F3F7]">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 h-10 rounded-xl border border-[#E8ECF1] text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors">
                Annuler
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors">
                <Key className="h-4 w-4" />
                Générer le tunnel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
