"use client";

import { useState } from "react";
import {
  Network,
  Router,
  Wifi,
  Signal,
  SignalZero,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Clock,
  Users,
  Activity,
  RefreshCw,
  Settings,
  Trash2,
  Eye,
  X,
  CheckCircle,
  Copy,
  Upload,
  Globe,
  Zap,
  ChevronDown,
  MonitorSmartphone,
  ArrowUpDown,
  WifiOff,
  Bell,
  Send,
} from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";

type RouterStatus = "online" | "offline" | "warning";

interface SiteRouter {
  id: string;
  name: string;
  model: string;
  ip: string;
  location: string;
  zone: string;
  status: RouterStatus;
  clients: number;
  uptime: string;
  lastSeen: string;
  firmware: string;
  cpuLoad: number;
  memoryUsed: number;
  bandwidth: { up: string; down: string };
  syncStatus: "synced" | "pending" | "failed";
  roaming: boolean;
}

const demoRouters: SiteRouter[] = [
  {
    id: "R001",
    name: "Hotspot Cotonou Centre",
    model: "MikroTik hAP ac³",
    ip: "192.168.88.1",
    location: "Cotonou, Bénin",
    zone: "Zone Sud",
    status: "online",
    clients: 34,
    uptime: "12j 5h 30m",
    lastSeen: "Maintenant",
    firmware: "RouterOS 7.14",
    cpuLoad: 23,
    memoryUsed: 45,
    bandwidth: { up: "12.4 Mbps", down: "45.8 Mbps" },
    syncStatus: "synced",
    roaming: true,
  },
  {
    id: "R002",
    name: "Hotspot Ganhi Mall",
    model: "MikroTik RB951Ui",
    ip: "192.168.88.2",
    location: "Cotonou, Bénin",
    zone: "Zone Sud",
    status: "online",
    clients: 18,
    uptime: "5j 12h 10m",
    lastSeen: "Maintenant",
    firmware: "RouterOS 7.14",
    cpuLoad: 56,
    memoryUsed: 62,
    bandwidth: { up: "8.2 Mbps", down: "32.1 Mbps" },
    syncStatus: "synced",
    roaming: true,
  },
  {
    id: "R003",
    name: "Hotspot Porto-Novo Gare",
    model: "MikroTik hAP ac²",
    ip: "192.168.88.3",
    location: "Porto-Novo, Bénin",
    zone: "Zone Est",
    status: "warning",
    clients: 8,
    uptime: "1j 2h 45m",
    lastSeen: "Il y a 3 min",
    firmware: "RouterOS 7.12",
    cpuLoad: 89,
    memoryUsed: 78,
    bandwidth: { up: "2.1 Mbps", down: "9.4 Mbps" },
    syncStatus: "pending",
    roaming: true,
  },
  {
    id: "R004",
    name: "Hotspot Parakou Central",
    model: "MikroTik RB750Gr3",
    ip: "192.168.88.4",
    location: "Parakou, Bénin",
    zone: "Zone Nord",
    status: "offline",
    clients: 0,
    uptime: "—",
    lastSeen: "Il y a 2h",
    firmware: "RouterOS 7.10",
    cpuLoad: 0,
    memoryUsed: 0,
    bandwidth: { up: "—", down: "—" },
    syncStatus: "failed",
    roaming: false,
  },
  {
    id: "R005",
    name: "Hotspot Abomey Place",
    model: "MikroTik hAP ac³",
    ip: "192.168.88.5",
    location: "Abomey, Bénin",
    zone: "Zone Centre",
    status: "online",
    clients: 12,
    uptime: "8j 18h 22m",
    lastSeen: "Maintenant",
    firmware: "RouterOS 7.14",
    cpuLoad: 31,
    memoryUsed: 40,
    bandwidth: { up: "5.6 Mbps", down: "22.3 Mbps" },
    syncStatus: "synced",
    roaming: true,
  },
  {
    id: "R006",
    name: "Hotspot Lokossa Market",
    model: "MikroTik RB951Ui",
    ip: "192.168.88.6",
    location: "Lokossa, Bénin",
    zone: "Zone Ouest",
    status: "online",
    clients: 6,
    uptime: "3j 9h 15m",
    lastSeen: "Maintenant",
    firmware: "RouterOS 7.14",
    cpuLoad: 15,
    memoryUsed: 33,
    bandwidth: { up: "3.8 Mbps", down: "14.7 Mbps" },
    syncStatus: "synced",
    roaming: false,
  },
];

const statusConfig: Record<RouterStatus, { label: string; color: string; bg: string; icon: typeof Signal }> = {
  online: { label: "En ligne", color: "text-emerald-600", bg: "bg-emerald-50", icon: Signal },
  offline: { label: "Hors ligne", color: "text-red-500", bg: "bg-red-50", icon: SignalZero },
  warning: { label: "Instable", color: "text-amber-600", bg: "bg-amber-50", icon: AlertTriangle },
};

const syncConfig: Record<string, { label: string; color: string; bg: string }> = {
  synced: { label: "Synchronisé", color: "text-emerald-600", bg: "bg-emerald-50" },
  pending: { label: "En attente", color: "text-amber-600", bg: "bg-amber-50" },
  failed: { label: "Échoué", color: "text-red-500", bg: "bg-red-50" },
};

export default function InteropPage() {
  const { currency } = useCurrency();
  const [search, setSearch] = useState("");
  const [filterZone, setFilterZone] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRouter, setSelectedRouter] = useState<SiteRouter | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const zones = [...new Set(demoRouters.map((r) => r.zone))];

  const filtered = demoRouters.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.ip.includes(search) ||
      r.location.toLowerCase().includes(search.toLowerCase());
    const matchZone = filterZone === "all" || r.zone === filterZone;
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchZone && matchStatus;
  });

  const totalClients = demoRouters.reduce((s, r) => s + r.clients, 0);
  const onlineCount = demoRouters.filter((r) => r.status === "online").length;
  const offlineCount = demoRouters.filter((r) => r.status === "offline").length;
  const warningCount = demoRouters.filter((r) => r.status === "warning").length;

  const stats = [
    { label: "Total routeurs", value: demoRouters.length, icon: Router, color: "text-[#2B7FFF]", bg: "bg-blue-50" },
    { label: "En ligne", value: onlineCount, icon: Signal, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Hors ligne", value: offlineCount, icon: SignalZero, color: "text-red-500", bg: "bg-red-50" },
    { label: "Clients connectés", value: totalClients, icon: Users, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1E4D]">Interopérabilité</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez et synchronisez tous vos routeurs depuis un seul tableau de bord
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSyncModal(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#2B7FFF] bg-white px-4 py-2.5 text-sm font-medium text-[#2B7FFF] hover:bg-blue-50 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Synchroniser
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2B7FFF] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2563EB] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Ajouter un routeur
          </button>
        </div>
      </div>

      {/* Alert banner */}
      {(offlineCount > 0 || warningCount > 0) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Attention requise</p>
              <p className="text-sm text-amber-700 mt-0.5">
                {offlineCount > 0 && `${offlineCount} routeur(s) hors ligne`}
                {offlineCount > 0 && warningCount > 0 && " · "}
                {warningCount > 0 && `${warningCount} routeur(s) instable(s)`}
                {" — vérifiez la connectivité de vos équipements."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[#E8ECF1] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-xl ${s.bg} p-2.5`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0B1E4D]">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="p-4 border-b border-[#E8ECF1]">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, IP ou localisation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={filterZone}
                  onChange={(e) => setFilterZone(e.target.value)}
                  className="appearance-none rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-3 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20"
                >
                  <option value="all">Toutes les zones</option>
                  {zones.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-3 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="online">En ligne</option>
                  <option value="warning">Instable</option>
                  <option value="offline">Hors ligne</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8ECF1]">
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Routeur</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Statut</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Zone</th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase px-4 py-3">Clients</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">CPU / RAM</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Uptime</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Sync</th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase px-4 py-3">Roaming</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const st = statusConfig[r.status];
                const sy = syncConfig[r.syncStatus];
                return (
                  <tr key={r.id} className="border-b border-[#E8ECF1] last:border-0 hover:bg-[#F5F7FA]/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg ${st.bg} p-2`}>
                          <Router className={`h-4 w-4 ${st.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0B1E4D]">{r.name}</p>
                          <p className="text-xs text-gray-400">{r.ip} · {r.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg ${st.bg} px-2.5 py-1 text-xs font-medium ${st.color}`}>
                        <st.icon className="h-3 w-3" />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600">{r.zone}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{r.location}</p>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-sm font-semibold text-[#0B1E4D]">{r.clients}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      {r.status !== "offline" ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-8">CPU</span>
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${r.cpuLoad > 80 ? "bg-red-400" : r.cpuLoad > 50 ? "bg-amber-400" : "bg-emerald-400"}`}
                                style={{ width: `${r.cpuLoad}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-8 text-right">{r.cpuLoad}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-8">RAM</span>
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${r.memoryUsed > 80 ? "bg-red-400" : r.memoryUsed > 50 ? "bg-amber-400" : "bg-emerald-400"}`}
                                style={{ width: `${r.memoryUsed}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-8 text-right">{r.memoryUsed}%</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-gray-600">{r.uptime}</p>
                      <p className="text-xs text-gray-400">{r.lastSeen}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 rounded-lg ${sy.bg} px-2 py-0.5 text-xs font-medium ${sy.color}`}>
                        {sy.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {r.roaming ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === r.id ? null : r.id)}
                          className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                        {menuOpen === r.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                            <div className="absolute right-0 top-8 z-20 w-48 rounded-xl border border-[#E8ECF1] bg-white shadow-lg py-1">
                              <button
                                onClick={() => { setSelectedRouter(r); setMenuOpen(null); }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-[#F5F7FA]"
                              >
                                <Eye className="h-4 w-4" /> Détails
                              </button>
                              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-[#F5F7FA]">
                                <RefreshCw className="h-4 w-4" /> Resynchroniser
                              </button>
                              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-[#F5F7FA]">
                                <Settings className="h-4 w-4" /> Configurer
                              </button>
                              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" /> Retirer
                              </button>
                            </div>
                          </>
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
        <div className="lg:hidden divide-y divide-[#E8ECF1]">
          {filtered.map((r) => {
            const st = statusConfig[r.status];
            const sy = syncConfig[r.syncStatus];
            return (
              <div key={r.id} className="p-4" onClick={() => setSelectedRouter(r)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg ${st.bg} p-2`}>
                      <Router className={`h-4 w-4 ${st.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0B1E4D]">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.ip}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-lg ${st.bg} px-2.5 py-1 text-xs font-medium ${st.color}`}>
                    <st.icon className="h-3 w-3" />
                    {st.label}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-[#F5F7FA] p-2">
                    <p className="text-xs text-gray-500">Clients</p>
                    <p className="text-sm font-semibold text-[#0B1E4D]">{r.clients}</p>
                  </div>
                  <div className="rounded-lg bg-[#F5F7FA] p-2">
                    <p className="text-xs text-gray-500">Zone</p>
                    <p className="text-sm font-medium text-[#0B1E4D] truncate">{r.zone.replace("Zone ", "")}</p>
                  </div>
                  <div className="rounded-lg bg-[#F5F7FA] p-2">
                    <p className="text-xs text-gray-500">Sync</p>
                    <p className={`text-sm font-medium ${sy.color}`}>{sy.label}</p>
                  </div>
                </div>
                {r.status !== "offline" && (
                  <div className="mt-3 flex gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">CPU</span>
                        <span className="text-xs text-gray-500">{r.cpuLoad}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${r.cpuLoad > 80 ? "bg-red-400" : r.cpuLoad > 50 ? "bg-amber-400" : "bg-emerald-400"}`}
                          style={{ width: `${r.cpuLoad}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">RAM</span>
                        <span className="text-xs text-gray-500">{r.memoryUsed}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${r.memoryUsed > 80 ? "bg-red-400" : r.memoryUsed > 50 ? "bg-amber-400" : "bg-emerald-400"}`}
                          style={{ width: `${r.memoryUsed}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <WifiOff className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Aucun routeur trouvé</p>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedRouter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-[#E8ECF1]">
              <h2 className="text-lg font-bold text-[#0B1E4D]">Détails du routeur</h2>
              <button onClick={() => setSelectedRouter(null)} className="rounded-lg p-1.5 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Status header */}
              <div className="flex items-center gap-4">
                <div className={`rounded-xl ${statusConfig[selectedRouter.status].bg} p-3`}>
                  <Router className={`h-6 w-6 ${statusConfig[selectedRouter.status].color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#0B1E4D]">{selectedRouter.name}</h3>
                  <p className="text-sm text-gray-500">{selectedRouter.model}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-xl ${statusConfig[selectedRouter.status].bg} px-3 py-1.5 text-sm font-medium ${statusConfig[selectedRouter.status].color}`}>
                  {statusConfig[selectedRouter.status].label}
                </span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Adresse IP", value: selectedRouter.ip, icon: Globe },
                  { label: "Localisation", value: selectedRouter.location, icon: MapPin },
                  { label: "Zone", value: selectedRouter.zone, icon: Network },
                  { label: "Firmware", value: selectedRouter.firmware, icon: Settings },
                  { label: "Uptime", value: selectedRouter.uptime, icon: Clock },
                  { label: "Dernière activité", value: selectedRouter.lastSeen, icon: Activity },
                  { label: "Clients connectés", value: String(selectedRouter.clients), icon: Users },
                  { label: "Roaming", value: selectedRouter.roaming ? "Activé" : "Désactivé", icon: ArrowUpDown },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-[#F5F7FA] p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <item.icon className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">{item.label}</span>
                    </div>
                    <p className="text-sm font-medium text-[#0B1E4D]">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Performance */}
              {selectedRouter.status !== "offline" && (
                <div className="rounded-xl border border-[#E8ECF1] p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-[#0B1E4D]">Performance</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">CPU</span>
                        <span className="text-xs font-medium text-[#0B1E4D]">{selectedRouter.cpuLoad}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${selectedRouter.cpuLoad > 80 ? "bg-red-400" : selectedRouter.cpuLoad > 50 ? "bg-amber-400" : "bg-emerald-400"}`}
                          style={{ width: `${selectedRouter.cpuLoad}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Mémoire</span>
                        <span className="text-xs font-medium text-[#0B1E4D]">{selectedRouter.memoryUsed}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${selectedRouter.memoryUsed > 80 ? "bg-red-400" : selectedRouter.memoryUsed > 50 ? "bg-amber-400" : "bg-emerald-400"}`}
                          style={{ width: `${selectedRouter.memoryUsed}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-lg bg-[#F5F7FA] p-2.5 text-center">
                      <p className="text-xs text-gray-500">↑ Upload</p>
                      <p className="text-sm font-semibold text-[#0B1E4D]">{selectedRouter.bandwidth.up}</p>
                    </div>
                    <div className="rounded-lg bg-[#F5F7FA] p-2.5 text-center">
                      <p className="text-xs text-gray-500">↓ Download</p>
                      <p className="text-sm font-semibold text-[#0B1E4D]">{selectedRouter.bandwidth.down}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B7FFF] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2563EB] transition-colors">
                  <RefreshCw className="h-4 w-4" />
                  Resynchroniser
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8ECF1] px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="h-4 w-4" />
                  Configurer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add router modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-[#E8ECF1]">
              <h2 className="text-lg font-bold text-[#0B1E4D]">Ajouter un routeur</h2>
              <button onClick={() => setShowAddModal(false)} className="rounded-lg p-1.5 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom du site</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ex : Hotspot Cotonou Gare"
                    className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse IP du routeur</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ex : 192.168.88.1"
                    className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Port API</label>
                  <input
                    type="text"
                    placeholder="8728"
                    className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Zone</label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 pr-9">
                      <option>Zone Sud</option>
                      <option>Zone Nord</option>
                      <option>Zone Est</option>
                      <option>Zone Ouest</option>
                      <option>Zone Centre</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Identifiant MikroTik</label>
                <div className="relative">
                  <MonitorSmartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="admin"
                    className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-100 p-3">
                <Wifi className="h-5 w-5 text-[#2B7FFF] shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#0B1E4D]">Roaming inter-sites</p>
                  <p className="text-xs text-gray-500">Les tickets seront valides sur ce routeur</p>
                </div>
                <div className="ml-auto">
                  <div className="w-10 h-6 bg-[#2B7FFF] rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border border-[#E8ECF1] py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B7FFF] py-2.5 text-sm font-medium text-white hover:bg-[#2563EB] transition-colors">
                  <Plus className="h-4 w-4" />
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sync modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-[#E8ECF1]">
              <h2 className="text-lg font-bold text-[#0B1E4D]">Synchronisation groupée</h2>
              <button onClick={() => setShowSyncModal(false)} className="rounded-lg p-1.5 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">
                Poussez votre configuration vers tous les routeurs en ligne. Cette action va synchroniser :
              </p>
              <div className="space-y-2">
                {[
                  { label: "Portail captif", desc: "Page de connexion, logo, CGU", checked: true },
                  { label: "Tarifs tickets", desc: "Prix, durées, forfaits", checked: true },
                  { label: "Profils RADIUS", desc: "Limites de bande passante", checked: true },
                  { label: "Règles de firewall", desc: "Filtrage, whitelist, blacklist", checked: false },
                ].map((item) => (
                  <label key={item.label} className="flex items-start gap-3 rounded-xl border border-[#E8ECF1] p-3 cursor-pointer hover:bg-[#F5F7FA] transition-colors">
                    <input type="checkbox" defaultChecked={item.checked} className="mt-0.5 rounded border-gray-300 text-[#2B7FFF] focus:ring-[#2B7FFF]" />
                    <div>
                      <p className="text-sm font-medium text-[#0B1E4D]">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cible</label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 pr-9">
                    <option>Tous les routeurs en ligne ({onlineCount})</option>
                    {zones.map((z) => (
                      <option key={z}>{z}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700">
                    La synchronisation écrasera la configuration actuelle des routeurs ciblés. Les routeurs hors ligne seront synchronisés à leur prochaine connexion.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowSyncModal(false)}
                  className="flex-1 rounded-xl border border-[#E8ECF1] py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B7FFF] py-2.5 text-sm font-medium text-white hover:bg-[#2563EB] transition-colors">
                  <Send className="h-4 w-4" />
                  Lancer la sync
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
