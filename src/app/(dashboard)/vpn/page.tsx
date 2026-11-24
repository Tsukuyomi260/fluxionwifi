"use client";

import { useState } from "react";
import Link from "next/link";
import { useVpn } from "@/hooks/use-vpn";
import { useRouters } from "@/hooks/use-routers";
import { AddRouterWizard } from "@/components/vpn/add-router-wizard";
import { TopologyPanel } from "@/components/vpn/topology-panel";
import type { VpnTunnel, VpnProtocol, TunnelStatus } from "@/lib/supabase/types";
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
  Eye,
  EyeOff,
  AlertTriangle,
  Zap,
  Lock,
  Key,
  Loader2,
  Monitor,
  Radio,
  CreditCard,
  Users,
  HelpCircle,
  ChevronRight,
  Activity,
} from "lucide-react";

type SidebarTab =
  | "overview"
  | "server"
  | "add-router"
  | "routers-vpn"
  | "workstations"
  | "subscription"
  | "affiliation"
  | "help";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

const statusConfig: Record<TunnelStatus, { label: string; dot: string; text: string; bg: string; icon: typeof Wifi }> = {
  connected: { label: "Connecté", dot: "bg-emerald-500", text: "text-emerald-400", bg: "bg-emerald-500/10", icon: Wifi },
  disconnected: { label: "Déconnecté", dot: "bg-red-500", text: "text-red-400", bg: "bg-red-500/10", icon: WifiOff },
  connecting: { label: "Connexion...", dot: "bg-amber-400", text: "text-amber-400", bg: "bg-amber-500/10", icon: RefreshCw },
};

export default function VpnPage() {
  const { tunnels, loading, addTunnel, deleteTunnel, connected: connectedCount, disconnected: disconnectedCount, refetch } = useVpn();
  const { routers, online: routersOnline } = useRouters();

  const [activeTab, setActiveTab] = useState<SidebarTab>("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formName, setFormName] = useState("");
  const [formProtocol, setFormProtocol] = useState<VpnProtocol>("WireGuard");
  const [formServerIp, setFormServerIp] = useState("vpn1.fluxionwifi.tech");
  const [formRouterId, setFormRouterId] = useState("");

  const totalTunnels = tunnels.length;
  const connectingCount = tunnels.filter((t) => t.status === "connecting").length;
  const showDetailModal = detailId ? tunnels.find((t) => t.id === detailId) || null : null;

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  }

  async function handleCreate() {
    if (!formName.trim()) return;
    setCreating(true);
    await addTunnel({
      name: formName.trim(),
      protocol: formProtocol,
      server_ip: formServerIp,
      port: formProtocol === "WireGuard" ? 51820 : 443,
      router_id: formRouterId || null,
    } as Partial<VpnTunnel>);
    setCreating(false);
    setShowCreateModal(false);
    setFormName("");
    setFormProtocol("WireGuard");
    setFormServerIp("vpn1.fluxionwifi.tech");
    setFormRouterId("");
  }

  async function handleDelete(id: string) {
    await deleteTunnel(id);
    setDetailId(null);
    setMenuOpen(null);
  }

  const sidebarItems: { key: SidebarTab; label: string; icon: typeof Shield; section?: string; badge?: string | number }[] = [
    { key: "overview", label: "Vue d'ensemble", icon: Activity },
    { key: "server", label: "Serveur VPN (VPS)", icon: Server, section: "CONFIGURATION" },
    { key: "add-router", label: "Ajouter un routeur", icon: Plus },
    { key: "routers-vpn", label: "Routeurs VPN", icon: Shield, section: "PARC" },
    { key: "workstations", label: "Postes de travail", icon: Monitor, badge: connectedCount || 0 },
    { key: "subscription", label: "Abonnement", icon: CreditCard, section: "ABONNEMENT", badge: `${totalTunnels}/25` },
    { key: "affiliation", label: "Affiliation", icon: Users, section: "PARRAINAGE" },
    { key: "help", label: "Aide", icon: HelpCircle },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#0E7490]" />
      </div>
    );
  }

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-[#0F172A] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[230px] shrink-0 bg-gradient-to-b from-[#0E7490] to-[#065666] text-white">
        <div className="px-5 py-5">
          <h1 className="text-lg font-bold">
            <span className="text-white">FLUXION</span>{" "}
            <span className="text-emerald-300">VPN</span>
          </h1>
        </div>

        <nav className="flex-1 px-2 pb-4 space-y-0.5 overflow-y-auto">
          {sidebarItems.map((item, i) => (
            <div key={item.key}>
              {item.section && (
                <p className="px-3 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
                  {item.section}
                </p>
              )}
              <button
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === item.key
                    ? "bg-white/20 font-semibold text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="truncate flex-1 text-left">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                    {item.badge}
                  </span>
                )}
              </button>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile tab selector */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-[#0E7490] px-2 py-2 flex gap-1 overflow-x-auto">
        {sidebarItems.slice(0, 5).map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === item.key ? "bg-white/20 text-white" : "text-white/60"
            }`}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-[#0E7490]" />
            <span className="text-sm text-slate-400">Tunnels multi-protocole</span>
          </div>
          <span className="rounded-lg bg-[#1E293B] px-4 py-1.5 text-sm font-semibold text-white">
            FLUXIONWIFI
          </span>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-5 pb-24 lg:pb-6">
          {activeTab === "overview" && (
            <OverviewTab
              tunnels={tunnels}
              routers={routers}
              totalTunnels={totalTunnels}
              connectedCount={connectedCount}
              disconnectedCount={disconnectedCount}
              connectingCount={connectingCount}
              routersOnline={routersOnline}
              onRefetch={refetch}
            />
          )}

          {activeTab === "server" && <ServerTab />}

          {activeTab === "add-router" && (
            <AddRouterWizard
              serverHost="vpn1.fluxionwifi.tech"
              onCreate={async (r) => {
                const res = await addTunnel({
                  name: r.name,
                  protocol: r.protocol,
                  server_ip: r.serverHost,
                  port: r.port,
                  router_id: null,
                } as Partial<VpnTunnel>);
                if (res?.error) throw new Error(res.error);
              }}
              onDone={() => setActiveTab("routers-vpn")}
            />
          )}

          {activeTab === "routers-vpn" && (
            <RoutersVpnTab
              tunnels={tunnels}
              onDetail={setDetailId}
              onDelete={handleDelete}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              onCreateNew={() => setShowCreateModal(true)}
            />
          )}

          {activeTab === "workstations" && <WorkstationsTab connectedCount={connectedCount} />}

          {activeTab === "subscription" && <SubscriptionTab totalTunnels={totalTunnels} />}

          {activeTab === "affiliation" && <AffiliationTab />}

          {activeTab === "help" && <HelpTab />}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 text-center">
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-400">FLUXION CONSOLE</span> — Gestion VPN multi-protocole
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (() => {
        const t = showDetailModal;
        const sc = statusConfig[t.status] || statusConfig.disconnected;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => { setDetailId(null); setShowKey(false); }}>
            <div className="w-full max-w-lg rounded-2xl bg-[#1E293B] border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-2.5 ${t.protocol === "WireGuard" ? "bg-violet-500/20" : "bg-cyan-500/20"}`}>
                    <Shield className={`h-5 w-5 ${t.protocol === "WireGuard" ? "text-violet-400" : "text-cyan-400"}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">{t.name}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${sc.text}`}>
                      <sc.icon className={`h-3 w-3 ${t.status === "connecting" ? "animate-spin" : ""}`} />
                      {sc.label}
                    </span>
                  </div>
                </div>
                <button onClick={() => { setDetailId(null); setShowKey(false); }} className="p-2 rounded-lg hover:bg-white/10 text-slate-400">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Protocole", value: <><Lock className="h-3.5 w-3.5 text-slate-400 inline mr-1" />{t.protocol}</> },
                    { label: "Port", value: t.port },
                    { label: "Serveur", value: t.server_ip || "—" },
                    { label: "IP locale", value: t.local_ip || "—" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-[#0F172A] p-3.5">
                      <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                      <p className="text-sm font-medium text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-white/10 p-4">
                  <p className="text-xs font-medium text-slate-400 mb-2">Routeur lié</p>
                  {t.router?.name ? (
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-[#0E7490]/20 p-2"><Server className="h-4 w-4 text-[#0E7490]" /></div>
                      <div>
                        <p className="text-sm font-medium text-white">{t.router.name}</p>
                        <p className="text-xs text-slate-500">{t.router.ip_address}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Aucun routeur lié</p>
                  )}
                </div>

                {t.public_key && (
                  <div className="rounded-xl border border-white/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-slate-400">Clé publique</p>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setShowKey(!showKey)} className="p-1 rounded hover:bg-white/10 text-slate-500">
                          {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                        <button onClick={() => copyToClipboard(t.public_key!)} className="p-1 rounded hover:bg-white/10 text-slate-500">
                          {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs font-mono text-slate-300 bg-[#0F172A] rounded-lg px-3 py-2 break-all">
                      {showKey ? t.public_key : "••••••••••••••••••••••••••••••••••••••••••••"}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Uptime", value: <><Clock className="h-3.5 w-3.5 text-slate-400 inline mr-1" />{t.uptime || "—"}</> },
                    { label: "Dernière activité", value: t.last_seen ? new Date(t.last_seen).toLocaleDateString("fr-FR") : "—" },
                    { label: "Trafic entrant", value: <span className="text-emerald-400">{formatBytes(t.bytes_in || 0)}</span> },
                    { label: "Trafic sortant", value: <span className="text-blue-400">{formatBytes(t.bytes_out || 0)}</span> },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-[#0F172A] p-3.5">
                      <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                      <p className="text-sm font-medium text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 px-6 py-4 border-t border-white/10">
                <button className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors">
                  <Download className="h-4 w-4" /> Config
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors">
                  <RefreshCw className="h-4 w-4" /> Reconnecter
                </button>
                <button onClick={() => handleDelete(t.id)} className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-red-500/30 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowCreateModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-[#1E293B] border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-base font-semibold text-white">Nouveau tunnel VPN</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Nom du tunnel</label>
                <input
                  type="text"
                  placeholder="Ex: Tunnel Site Principal"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border border-white/10 bg-[#0F172A] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0E7490]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Protocole</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["WireGuard", "SSTP"] as VpnProtocol[]).map((proto) => (
                    <button
                      key={proto}
                      type="button"
                      onClick={() => setFormProtocol(proto)}
                      className={`flex items-center gap-3 rounded-xl border-2 p-3.5 transition-colors ${
                        formProtocol === proto ? "border-[#0E7490] bg-[#0E7490]/10" : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className={`rounded-lg p-2 ${proto === "WireGuard" ? "bg-violet-500/20" : "bg-cyan-500/20"}`}>
                        {proto === "WireGuard" ? <Zap className="h-4 w-4 text-violet-400" /> : <Lock className="h-4 w-4 text-cyan-400" />}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">{proto}</p>
                        <p className="text-[11px] text-slate-500">{proto === "WireGuard" ? "Rapide & léger" : "Port 443"}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Serveur VPN</label>
                <select
                  value={formServerIp}
                  onChange={(e) => setFormServerIp(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border border-white/10 bg-[#0F172A] text-sm text-white appearance-none focus:outline-none focus:border-[#0E7490]"
                >
                  <option value="vpn1.fluxionwifi.tech">vpn1.fluxionwifi.tech (Afrique Centrale)</option>
                  <option value="vpn2.fluxionwifi.tech">vpn2.fluxionwifi.tech (Afrique de l&apos;Ouest)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Lier à un routeur (optionnel)</label>
                <select
                  value={formRouterId}
                  onChange={(e) => setFormRouterId(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border border-white/10 bg-[#0F172A] text-sm text-white appearance-none focus:outline-none focus:border-[#0E7490]"
                >
                  <option value="">Aucun routeur</option>
                  {routers.map((r) => (
                    <option key={r.id} value={r.id}>{r.name} ({r.ip_address})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-t border-white/10">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 h-10 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors">
                Annuler
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !formName.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-[#0E7490] text-sm font-medium text-white hover:bg-[#0C6880] transition-colors disabled:opacity-50"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                Générer le tunnel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TAB COMPONENTS
   ═══════════════════════════════════════════ */

function OverviewTab({
  tunnels,
  routers,
  totalTunnels,
  connectedCount,
  disconnectedCount,
  connectingCount,
  routersOnline,
  onRefetch,
}: {
  tunnels: VpnTunnel[];
  routers: { id: string; name: string; ip_address: string; status: string }[];
  totalTunnels: number;
  connectedCount: number;
  disconnectedCount: number;
  connectingCount: number;
  routersOnline: number;
  onRefetch: () => void;
}) {
  const healthScore = totalTunnels > 0 ? Math.round((connectedCount / totalTunnels) * 100) : 0;
  const critiques = disconnectedCount;
  const totalEquipments = routers.length + totalTunnels;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Vue d&apos;ensemble</h2>
        <button onClick={onRefetch} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-emerald-600 p-5 text-white relative overflow-hidden">
          <Server className="absolute -right-2 -bottom-2 h-14 w-14 text-white/10" />
          <p className="text-3xl font-bold">{routers.length}</p>
          <p className="text-sm mt-1 text-emerald-100">Routeurs configurés</p>
        </div>
        <div className="rounded-xl bg-[#0E7490] p-5 text-white relative overflow-hidden">
          <Shield className="absolute -right-2 -bottom-2 h-14 w-14 text-white/10" />
          <p className="text-3xl font-bold">{connectedCount}</p>
          <p className="text-sm mt-1 text-cyan-100">Tunnels actifs</p>
        </div>
        <div className="rounded-xl bg-amber-500 p-5 text-white relative overflow-hidden">
          <Radio className="absolute -right-2 -bottom-2 h-14 w-14 text-white/10" />
          <p className="text-3xl font-bold">{routers.length}</p>
          <p className="text-sm mt-1 text-amber-100">{routersOnline} en ligne · {routers.length - routersOnline} joignables</p>
          <p className="text-xs text-amber-200 mt-0.5">Antennes</p>
        </div>
        <div className="rounded-xl bg-[#1E293B] border border-white/10 p-5 text-white relative overflow-hidden">
          <Monitor className="absolute -right-2 -bottom-2 h-14 w-14 text-white/10" />
          <p className="text-3xl font-bold">{connectedCount}</p>
          <p className="text-sm mt-1 text-slate-400">{connectedCount} en ligne</p>
          <p className="text-xs text-slate-500 mt-0.5">Postes</p>
        </div>
      </div>

      {/* Topologie section */}
      <div className="rounded-xl border border-white/10 bg-[#1E293B] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-sm font-semibold text-white">Topologie</h3>
            <span className="text-xs text-slate-500">Légende :</span>
            <span className="text-xs text-slate-400">VPS : vpn1.fluxionwifi.tech:443</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0E7490]/20 px-2.5 py-1 text-[11px] font-medium text-[#0E7490]">
              <Radio className="h-3 w-3" /> {routers.length} antennes
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
              {routersOnline} en ligne
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-1 text-[11px] font-medium text-red-400">
              {routers.length - routersOnline} hors ligne
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/20 px-2.5 py-1 text-[11px] font-medium text-slate-400">
              {connectingCount} indéterminés
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
              Parc stable ce mois-ci
            </span>
            <span className="text-xs text-slate-400 ml-auto">
              {totalTunnels} / 25
            </span>
            {critiques > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400">
                <AlertTriangle className="h-3 w-3" /> {critiques} critique(s)
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-2">
            {critiques > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                <AlertTriangle className="h-3 w-3" /> {critiques} à surveiller
              </span>
            )}
            <span className="text-xs text-slate-400">Santé du parc {healthScore}/100</span>
            <div className="flex-1 h-2 bg-[#0F172A] rounded-full overflow-hidden max-w-xs">
              <div
                className={`h-full rounded-full transition-all ${
                  healthScore >= 70 ? "bg-emerald-500" : healthScore >= 40 ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>
        </div>

        <TopologyPanel routers={routers} />
      </div>

      {/* Equipment banner */}
      <div className="rounded-xl bg-gradient-to-r from-[#0E7490] to-[#065666] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-white/20 px-2 py-1 text-xs font-bold text-white">{totalEquipments}</span>
          <p className="text-sm text-white">
            {totalEquipments} équipements ajoutés — votre réseau compte <span className="font-bold">{totalEquipments} équipements</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ServerTab() {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-white">Serveur VPN (VPS)</h2>
      <div className="rounded-xl border border-white/10 bg-[#1E293B] p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Adresse du serveur", value: "vpn1.fluxionwifi.tech" },
            { label: "Protocole principal", value: "WireGuard" },
            { label: "Port WireGuard", value: "51820" },
            { label: "Port SSTP", value: "443" },
            { label: "Région", value: "Afrique Centrale" },
            { label: "Statut", value: "En ligne", color: "text-emerald-400" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-[#0F172A] p-4">
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p className={`text-sm font-medium ${item.color || "text-white"}`}>{item.value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-[#0F172A] p-4">
          <p className="text-xs text-slate-500 mb-2">Serveur secondaire</p>
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-white">vpn2.fluxionwifi.tech</span>
            <span className="text-xs text-slate-500">(Afrique de l&apos;Ouest)</span>
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> En ligne
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoutersVpnTab({
  tunnels,
  onDetail,
  onDelete,
  menuOpen,
  setMenuOpen,
  onCreateNew,
}: {
  tunnels: VpnTunnel[];
  onDetail: (id: string) => void;
  onDelete: (id: string) => void;
  menuOpen: string | null;
  setMenuOpen: (id: string | null) => void;
  onCreateNew: () => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = tunnels.filter(
    (t) => !search || t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Routeurs VPN</h2>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-[#0E7490] text-sm font-medium text-white hover:bg-[#0C6880] transition-colors"
        >
          <Plus className="h-4 w-4" /> Nouveau tunnel
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-white/10 bg-[#0F172A] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0E7490]"
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#1E293B] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Tunnel</th>
              <th className="text-left text-xs font-medium text-slate-500 px-5 py-3 hidden sm:table-cell">Protocole</th>
              <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Statut</th>
              <th className="text-left text-xs font-medium text-slate-500 px-5 py-3 hidden lg:table-cell">Routeur</th>
              <th className="text-left text-xs font-medium text-slate-500 px-5 py-3 hidden lg:table-cell">Trafic</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tunnel) => {
              const sc = statusConfig[tunnel.status] || statusConfig.disconnected;
              return (
                <tr
                  key={tunnel.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => onDetail(tunnel.id)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${sc.dot} shrink-0`} />
                      <div>
                        <p className="text-sm font-medium text-white">{tunnel.name}</p>
                        <p className="text-xs text-slate-500">{tunnel.server_ip}:{tunnel.port}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium ${
                      tunnel.protocol === "WireGuard" ? "bg-violet-500/20 text-violet-400" : "bg-cyan-500/20 text-cyan-400"
                    }`}>
                      <Lock className="h-3 w-3" /> {tunnel.protocol}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}>
                      <sc.icon className={`h-3 w-3 ${tunnel.status === "connecting" ? "animate-spin" : ""}`} />
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <p className="text-sm text-slate-300">{tunnel.router?.name || "—"}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <div className="text-xs text-slate-400">
                      <span className="text-emerald-400">↓</span> {formatBytes(tunnel.bytes_in || 0)}{" "}
                      <span className="text-blue-400">↑</span> {formatBytes(tunnel.bytes_out || 0)}
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === tunnel.id ? null : tunnel.id); }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {menuOpen === tunnel.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-white/10 bg-[#1E293B] shadow-lg z-20 py-1">
                          <button onClick={(e) => { e.stopPropagation(); onDetail(tunnel.id); setMenuOpen(null); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
                            <Eye className="h-4 w-4" /> Détails
                          </button>
                          <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
                            <Download className="h-4 w-4" /> Config
                          </button>
                          <hr className="my-1 border-white/10" />
                          <button onClick={(e) => { e.stopPropagation(); onDelete(tunnel.id); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4" /> Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-500">
                  Aucun tunnel trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WorkstationsTab({ connectedCount }: { connectedCount: number }) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-white">Postes de travail</h2>
      <div className="rounded-xl border border-white/10 bg-[#1E293B] p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="rounded-xl bg-[#0E7490]/20 p-3">
            <Monitor className="h-6 w-6 text-[#0E7490]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{connectedCount}</p>
            <p className="text-sm text-slate-400">Postes connectés via VPN</p>
          </div>
        </div>
        <div className="rounded-xl bg-[#0F172A] p-8 text-center">
          <Monitor className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">Les postes de travail connectés apparaîtront ici.</p>
          <p className="text-xs text-slate-500 mt-1">Configurez un tunnel VPN pour connecter vos postes.</p>
        </div>
      </div>
    </div>
  );
}

function SubscriptionTab({ totalTunnels }: { totalTunnels: number }) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-white">Abonnement</h2>
      <div className="rounded-xl bg-gradient-to-r from-[#0E7490] to-[#065666] p-6 text-white">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white/10 p-4 text-center">
            <p className="text-3xl font-bold">1</p>
            <p className="text-xs text-cyan-200 mt-1">Pack(s) actif(s)</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4 text-center">
            <p className="text-3xl font-bold">{totalTunnels}</p>
            <p className="text-xs text-cyan-200 mt-1">Routeur(s) débloqé(s)</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4 text-center">
            <p className="text-3xl font-bold">{totalTunnels}</p>
            <p className="text-xs text-cyan-200 mt-1">Actuellement utilisé(s)</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4 text-center">
            <p className="text-lg font-bold">—</p>
            <p className="text-xs text-cyan-200 mt-1">Prochaine expiration</p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#1E293B] p-6">
        <h3 className="text-sm font-semibold text-white mb-3">Avantages inclus avec votre déblocage</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          {[
            "Tunnels WireGuard & SSTP illimités",
            "Topologie réseau en temps réel",
            "Surveillance santé du parc",
            "Support technique prioritaire",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AffiliationTab() {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-white">Affiliation</h2>
      <div className="rounded-xl border border-white/10 bg-[#1E293B] p-6 text-center">
        <Users className="h-10 w-10 text-[#0E7490] mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-white mb-2">Programme d&apos;affiliation VPN</h3>
        <p className="text-sm text-slate-400 mb-4">
          Parrainez d&apos;autres utilisateurs et gagnez des crédits sur vos abonnements VPN.
        </p>
        <Link
          href="/affiliation"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#0E7490] text-sm font-medium text-white hover:bg-[#0C6880] transition-colors"
        >
          Voir le programme
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function HelpTab() {
  const faqs = [
    { q: "Quel protocole choisir ?", a: "WireGuard est recommandé pour sa rapidité. SSTP est utile si le port 51820 est bloqué sur votre réseau." },
    { q: "Comment ajouter un routeur ?", a: "Allez dans 'Ajouter un routeur', remplissez le formulaire puis appliquez la configuration générée sur votre MikroTik." },
    { q: "Mon tunnel est déconnecté", a: "Vérifiez que votre routeur est en ligne et accessible. Assurez-vous que les ports VPN sont ouverts." },
    { q: "Combien de tunnels puis-je créer ?", a: "Votre plan actuel permet jusqu'à 25 tunnels. Contactez le support pour augmenter cette limite." },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-white">Aide</h2>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.q} className="rounded-xl border border-white/10 bg-[#1E293B] p-5">
            <h3 className="text-sm font-semibold text-white mb-2">{faq.q}</h3>
            <p className="text-sm text-slate-400">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
