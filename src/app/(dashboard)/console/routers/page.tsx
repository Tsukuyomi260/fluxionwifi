"use client";

import { useState } from "react";
import {
  Router,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wifi,
  Settings,
  MoreHorizontal,
  X,
  Eye,
  Power,
  RefreshCw,
  Monitor,
  Signal,
  Activity,
} from "lucide-react";

type RouterStatus = "online" | "offline";

interface MikroTikRouter {
  id: string;
  name: string;
  ip: string;
  publicIp: string;
  model: string;
  version: string;
  status: RouterStatus;
  sessions: number;
  uptime: string;
  cpu: number;
  memory: number;
  lastSeen: string;
  mode: "hotspot" | "pppoe" | "dhcp";
  bandwidth: { download: number; upload: number };
}

const demoRouters: MikroTikRouter[] = [
  {
    id: "1", name: "MK-Café-01", ip: "192.168.88.1", publicIp: "41.243.xx.xx",
    model: "hAP ac²", version: "7.14.3", status: "online", sessions: 2,
    uptime: "12j 4h 32min", cpu: 23, memory: 45, lastSeen: "Maintenant",
    mode: "hotspot", bandwidth: { download: 45, upload: 12 },
  },
  {
    id: "2", name: "MK-Hotel-03", ip: "192.168.88.2", publicIp: "41.243.xx.xx",
    model: "RB4011iGS+", version: "7.14.3", status: "online", sessions: 2,
    uptime: "8j 15h 11min", cpu: 15, memory: 38, lastSeen: "Maintenant",
    mode: "hotspot", bandwidth: { download: 120, upload: 35 },
  },
  {
    id: "3", name: "MK-Campus-02", ip: "192.168.88.3", publicIp: "41.243.xx.xx",
    model: "hEX S", version: "6.49.15", status: "online", sessions: 1,
    uptime: "3j 22h 05min", cpu: 8, memory: 25, lastSeen: "Maintenant",
    mode: "hotspot", bandwidth: { download: 28, upload: 8 },
  },
  {
    id: "4", name: "MK-Resto-04", ip: "192.168.88.4", publicIp: "—",
    model: "hAP lite", version: "6.49.15", status: "offline", sessions: 0,
    uptime: "—", cpu: 0, memory: 0, lastSeen: "Il y a 3h",
    mode: "hotspot", bandwidth: { download: 0, upload: 0 },
  },
];

export default function RoutersPage() {
  const [routers] = useState(demoRouters);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | RouterStatus>("all");
  const [selectedRouter, setSelectedRouter] = useState<MikroTikRouter | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = routers.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.ip.includes(searchQuery);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const online = routers.filter((r) => r.status === "online").length;
  const totalBandwidth = routers.reduce((s, r) => s + r.bandwidth.download + r.bandwidth.upload, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5"><Router className="h-5 w-5 text-emerald-500" /></div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D26]">{online}/{routers.length}</p>
              <p className="text-xs text-[#6B7280]">Routeurs en ligne</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5"><Wifi className="h-5 w-5 text-[#2B7FFF]" /></div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D26]">{routers.reduce((s, r) => s + r.sessions, 0)}</p>
              <p className="text-xs text-[#6B7280]">Sessions totales</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-2.5"><Activity className="h-5 w-5 text-violet-500" /></div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D26]">{(totalBandwidth / 1024).toFixed(1)} Go</p>
              <p className="text-xs text-[#6B7280]">Bande passante totale</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un routeur..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="h-10 pl-4 pr-10 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-[#2B7FFF] transition-colors"
        >
          <option value="all">Tous</option>
          <option value="online">En ligne</option>
          <option value="offline">Hors ligne</option>
        </select>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#2B7FFF]/90 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Ajouter un routeur
        </button>
      </div>

      {/* Router cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((r) => (
          <div
            key={r.id}
            className={`rounded-2xl border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-all ${
              r.status === "online" ? "border-[#E8ECF1] hover:border-[#2B7FFF]/20 hover:shadow-md" : "border-red-100 opacity-80"
            }`}
          >
            {/* Color top bar */}
            <div className={`h-1 ${r.status === "online" ? "bg-emerald-500" : "bg-red-400"}`} />
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-2.5 ${r.status === "online" ? "bg-emerald-50" : "bg-red-50"}`}>
                    <Router className={`h-5 w-5 ${r.status === "online" ? "text-emerald-500" : "text-red-400"}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1D26]">{r.name}</h3>
                    <p className="font-mono text-xs text-[#9CA3AF]">{r.ip}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    r.status === "online" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${r.status === "online" ? "bg-emerald-500" : "bg-red-500"}`} />
                    {r.status === "online" ? "En ligne" : "Hors ligne"}
                  </span>
                  <button
                    onClick={() => setSelectedRouter(r)}
                    className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#F1F3F7]">
                <div>
                  <p className="text-[11px] text-[#9CA3AF]">Modèle</p>
                  <p className="text-xs font-medium text-[#1A1D26] mt-0.5">MikroTik {r.model}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#9CA3AF]">RouterOS</p>
                  <p className="text-xs font-medium text-[#1A1D26] mt-0.5">v{r.version}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#9CA3AF]">Sessions</p>
                  <p className="text-xs font-medium text-[#1A1D26] mt-0.5">{r.sessions} active{r.sessions !== 1 ? "s" : ""}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#9CA3AF]">Mode</p>
                  <p className="text-xs font-medium text-[#1A1D26] mt-0.5 capitalize">{r.mode}</p>
                </div>
              </div>

              {r.status === "online" && (
                <div className="space-y-2 pt-3 border-t border-[#F1F3F7]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#9CA3AF]">CPU</span>
                    <span className="text-[11px] font-medium text-[#1A1D26]">{r.cpu}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#F1F3F7] overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${r.cpu > 80 ? "bg-red-500" : r.cpu > 50 ? "bg-amber-500" : "bg-[#2B7FFF]"}`} style={{ width: `${r.cpu}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-[#9CA3AF]">Mémoire</span>
                    <span className="text-[11px] font-medium text-[#1A1D26]">{r.memory}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#F1F3F7] overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${r.memory > 80 ? "bg-red-500" : r.memory > 50 ? "bg-amber-500" : "bg-violet-400"}`} style={{ width: `${r.memory}%` }} />
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-[#9CA3AF]">
                    <Clock className="h-3 w-3" />
                    Uptime: {r.uptime}
                  </div>
                </div>
              )}

              {r.status === "offline" && (
                <div className="pt-3 border-t border-[#F1F3F7]">
                  <p className="text-xs text-red-500 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Dernière connexion : {r.lastSeen}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <Router className="h-8 w-8 text-[#D1D5DB] mx-auto mb-3" />
          <p className="text-sm text-[#6B7280]">Aucun routeur trouvé</p>
        </div>
      )}

      {/* Router detail modal */}
      {selectedRouter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedRouter(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className={`h-1.5 ${selectedRouter.status === "online" ? "bg-emerald-500" : "bg-red-400"}`} />
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF1]">
              <div className="flex items-center gap-3">
                <Router className="h-5 w-5 text-[#2B7FFF]" />
                <h3 className="text-lg font-semibold text-[#1A1D26]">{selectedRouter.name}</h3>
              </div>
              <button onClick={() => setSelectedRouter(null)} className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: "Adresse IP locale", value: selectedRouter.ip },
                { label: "Adresse IP publique", value: selectedRouter.publicIp },
                { label: "Modèle", value: `MikroTik ${selectedRouter.model}` },
                { label: "RouterOS", value: `v${selectedRouter.version}` },
                { label: "Mode", value: selectedRouter.mode.charAt(0).toUpperCase() + selectedRouter.mode.slice(1) },
                { label: "Sessions actives", value: String(selectedRouter.sessions) },
                { label: "Uptime", value: selectedRouter.uptime },
                { label: "Dernière connexion", value: selectedRouter.lastSeen },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">{row.label}</span>
                  <span className="text-sm font-medium text-[#1A1D26] font-mono">{row.value}</span>
                </div>
              ))}
              {selectedRouter.status === "online" && (
                <>
                  <div className="pt-3 border-t border-[#F1F3F7] space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#6B7280]">CPU</span>
                        <span className="font-medium text-[#1A1D26]">{selectedRouter.cpu}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#F1F3F7] overflow-hidden">
                        <div className="h-full rounded-full bg-[#2B7FFF]" style={{ width: `${selectedRouter.cpu}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#6B7280]">Mémoire</span>
                        <span className="font-medium text-[#1A1D26]">{selectedRouter.memory}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#F1F3F7] overflow-hidden">
                        <div className="h-full rounded-full bg-violet-400" style={{ width: `${selectedRouter.memory}%` }} />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#6B7280]">Bande passante</span>
                      <span>
                        <span className="text-emerald-600">↓ {selectedRouter.bandwidth.download} Mbps</span>
                        <span className="mx-1 text-[#D1D5DB]">·</span>
                        <span className="text-[#2B7FFF]">↑ {selectedRouter.bandwidth.upload} Mbps</span>
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add router modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF1]">
              <h3 className="text-lg font-semibold text-[#1A1D26]">Ajouter un routeur</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Nom du routeur</label>
                <input type="text" placeholder="Ex: MK-Bureau-01" className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Adresse IP</label>
                <input type="text" placeholder="192.168.88.1" className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Utilisateur API</label>
                  <input type="text" placeholder="admin" className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Mot de passe API</label>
                  <input type="password" placeholder="••••••" className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Type de connexion</label>
                <select className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-[#2B7FFF]">
                  <option>VPN (recommandé)</option>
                  <option>IP Publique directe</option>
                  <option>Cloud (CHR)</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#E8ECF1] flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="h-10 px-5 rounded-xl border border-[#E8ECF1] text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors">
                Annuler
              </button>
              <button className="h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#2B7FFF]/90 transition-colors">
                Tester la connexion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
