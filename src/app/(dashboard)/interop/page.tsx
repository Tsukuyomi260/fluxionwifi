"use client";

import { useState } from "react";
import { useRouters } from "@/hooks/use-routers";
import { useTickets } from "@/hooks/use-tickets";
import { useCurrency } from "@/hooks/use-currency";
import { useSessions } from "@/hooks/use-sessions";
import type { Router, RouterStatus } from "@/lib/supabase/types";
import {
  Network,
  Plus,
  RefreshCw,
  Unlock,
  Pencil,
  X,
  Loader2,
  AlertTriangle,
  ChevronDown,
  Globe,
  MapPin,
  Save,
  CheckCircle,
  Ticket,
  Settings,
  BarChart3,
  Printer,
  CreditCard,
  Search,
  Trash2,
  Info,
  Zap,
  Clock,
  Timer,
  HardDrive,
} from "lucide-react";

const statusDot: Record<RouterStatus, string> = {
  online: "bg-emerald-500",
  warning: "bg-orange-400",
  offline: "bg-red-500",
};

const statusLabel: Record<RouterStatus, string> = {
  online: "Trafic actif",
  warning: "Trafic récent",
  offline: "Pas de trafic récent",
};

const zoneLabels: Record<string, string> = {
  sud: "Sud",
  nord: "Nord",
  est: "Est",
  ouest: "Ouest",
  centre: "Centre",
};

function trafficLine(r: Router) {
  if (r.status === "offline") {
    const ago = r.last_seen
      ? timeSince(r.last_seen)
      : "inconnu";
    return { icon: "red", text: `Aucun trafic récent · ${ago}` };
  }
  if (r.status === "warning") {
    const ago = r.last_seen ? timeSince(r.last_seen) : "";
    return { icon: "amber", text: `Trafic récent · ${ago}` };
  }
  return { icon: "green", text: "Trafic actif" };
}

function timeSince(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `il y a ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
}

export default function InteropPage() {
  const { routers, loading, addRouter, deleteRouter, online, refetch } =
    useRouters();
  const { tickets, profiles, loading: ticketsLoading } = useTickets();
  const { currency, format: formatPrice } = useCurrency();
  const { sessions, activeSessions, totalBytesIn, totalBytesOut } = useSessions();
  const [group, setGroup] = useState("default");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Router | null>(null);
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");
  const [userEqPass, setUserEqPass] = useState(false);
  const [showAdvancedGen, setShowAdvancedGen] = useState(false);
  const [limitType, setLimitType] = useState<"duration" | "volume">("duration");
  const [showAdvancedProfile, setShowAdvancedProfile] = useState(false);
  const [consoFilter, setConsoFilter] = useState("all");
  const [consoSearch, setConsoSearch] = useState("");

  const maxSlots = 10;
  const occupied = routers.length;
  const activeCount = routers.filter((r) => r.status === "online").length;

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAdding(true);
    const fd = new FormData(e.currentTarget);
    await addRouter({
      name: fd.get("name") as string,
      ip_address: fd.get("ip") as string,
      api_port: Number(fd.get("port")) || 8728,
      identity: fd.get("identity") as string,
      zone: (fd.get("zone") as string) || "sud",
      model: "MikroTik",
      location: "",
      status: "offline",
      roaming_enabled: true,
    } as Partial<Router>);
    setAdding(false);
    setShowAddModal(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#2B7FFF]" />
      </div>
    );
  }

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-[#111827] p-4 lg:p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Connectée
          </span>
          <span className="text-sm text-slate-400">
            Admin : FLUXIONWIFI
          </span>
        </div>
        <span className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white">
          Réseau Multi-Routeurs
        </span>
      </div>

      {/* Section header */}
      <div className="rounded-2xl bg-white p-5 lg:p-6 mb-4">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-violet-600" />
            <h1 className="text-xl font-bold text-[#1A1D26]">
              Réseau Multi-Routeurs
            </h1>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            🔒 {occupied}/{maxSlots} places occupées
          </span>
          <span className="text-sm text-[#6B7280]">
            {activeCount} actif(s) / {routers.length} routeur(s)
          </span>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-[#6B7280]">Groupe :</span>
          <div className="relative">
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="h-9 pl-3 pr-8 rounded-lg border border-[#D1D5DB] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-[#2B7FFF] min-w-[120px]"
            >
              <option value="default">default</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9CA3AF] pointer-events-none" />
          </div>

          <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-orange-300 text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors">
            <AlertTriangle className="h-4 w-4" />
            Réinitialisation
          </button>
          <button
            onClick={() => refetch()}
            className="h-9 w-9 rounded-lg border border-[#D1D5DB] flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-[#6B7280]" />
          </button>
          <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-emerald-500 text-sm font-medium text-white hover:bg-emerald-600 transition-colors">
            <Unlock className="h-4 w-4" />
            Débloquer
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-violet-600 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouveau routeur
          </button>
        </div>
      </div>

      {/* Router cards grid */}
      {routers.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center">
          <Network className="h-10 w-10 text-[#D1D5DB] mx-auto mb-3" />
          <p className="text-sm text-[#6B7280]">
            Aucun routeur configuré. Cliquez « Nouveau routeur » pour commencer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {routers.map((r) => {
            const traffic = trafficLine(r);
            return (
              <div
                key={r.id}
                className="relative rounded-2xl bg-white border border-[#E5E7EB] p-4 hover:shadow-md transition-shadow"
              >
                {/* Edit / Delete icons */}
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    onClick={() => setShowEditModal(r)}
                    className="p-1 rounded hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteRouter(r.id)}
                    className="p-1 rounded hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Router name + status dot */}
                <div className="flex items-start gap-2 mb-1 pr-14">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${statusDot[r.status]}`}
                  />
                  <h3 className="text-sm font-bold text-[#1A1D26] leading-tight">
                    {r.name}
                  </h3>
                </div>

                {/* Identity */}
                <p className="text-xs text-[#9CA3AF] mb-3 ml-4">
                  {r.identity || r.ip_address}
                </p>

                {/* Mode RADIUS badge + ROS version */}
                <div className="flex items-center gap-2 mb-3 ml-4">
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    ⚡ Mode RADIUS
                  </span>
                  <span className="text-[11px] text-[#9CA3AF]">
                    {r.model || "ROS"}
                  </span>
                </div>

                {/* Traffic status */}
                <div className="flex items-center gap-1.5 ml-4">
                  {traffic.icon === "green" && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  )}
                  {traffic.icon === "amber" && (
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                  )}
                  {traffic.icon === "red" && (
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                  )}
                  <span
                    className={`text-xs ${
                      traffic.icon === "green"
                        ? "text-emerald-600"
                        : traffic.icon === "amber"
                        ? "text-amber-600"
                        : "text-red-500"
                    }`}
                  >
                    {traffic.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="rounded-2xl bg-white border border-[#E5E7EB] px-5 py-3 flex flex-wrap items-center gap-6 text-xs text-[#6B7280]">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Trafic actif
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
          Trafic récent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          Pas de trafic récent
        </span>
        <span className="italic text-[#9CA3AF]">
          Le statut reflète l&apos;activité des clients, pas l&apos;alimentation du routeur
        </span>
      </div>

      {/* ═══ 6 Tabs Section ═══ */}
      <div className="mt-4 rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden">
        {/* Tab bar */}
        <div className="flex flex-wrap items-center gap-1 px-4 pt-4 border-b border-[#E5E7EB]">
          {([
            { id: "generate", icon: "🎫", label: "Générer des tickets" },
            { id: "profiles", icon: "⚙️", label: "Créer des profils" },
            { id: "stock", icon: "📊", label: "Voir le stock" },
            { id: "print", icon: "🖨️", label: "Impression" },
            { id: "conso", icon: "📡", label: "Consommation" },
            { id: "billing", icon: "💳", label: "Facturation" },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-violet-600 text-violet-700"
                  : "border-transparent text-[#6B7280] hover:text-[#1A1D26]"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {/* ── Tab 1: Générer des tickets ── */}
          {activeTab === "generate" && (
            <div>
              <h2 className="text-lg font-bold text-[#1A1D26] text-center mb-1">Générer des tickets</h2>
              <p className="text-sm text-[#6B7280] text-center mb-6">
                Les tickets sont créés sur Supabase et synchronisés automatiquement vers vos routeurs.
              </p>
              <div className="max-w-2xl mx-auto rounded-xl border border-[#E5E7EB] p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Profil / Offre</label>
                  <div className="relative">
                    <select className="w-full h-10 pl-4 pr-10 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-violet-500">
                      {profiles.length === 0 && <option>Aucun profil disponible</option>}
                      {profiles.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Quantité</label>
                    <input type="number" defaultValue={100} className="w-full h-10 px-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#1A1D26] focus:outline-none focus:border-violet-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Préfixe user <span className="text-[#9CA3AF] font-normal">(opt.)</span></label>
                    <input type="text" placeholder="wifi, net, ..." className="w-full h-10 px-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-violet-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-violet-500" />
                    <div>
                      <p className="text-sm font-medium text-[#1A1D26]">User = Password</p>
                      <p className="text-xs text-[#9CA3AF]">Le mot de passe sera identique au nom d&apos;utilisateur.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUserEqPass(!userEqPass)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${userEqPass ? "bg-violet-600" : "bg-[#D1D5DB]"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${userEqPass ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <button onClick={() => setShowAdvancedGen(!showAdvancedGen)} className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1A1D26] transition-colors">
                  <span className={`transition-transform ${showAdvancedGen ? "rotate-90" : ""}`}>▶</span>
                  <Settings className="h-3.5 w-3.5" />
                  Configuration avancée des identifiants
                  <span className="text-xs text-[#9CA3AF] ml-auto">Préfixe, suffixe, longueur, méthode, charset...</span>
                </button>
                {showAdvancedGen && (
                  <div className="rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#6B7280] mb-1">Préfixe</label>
                        <input type="text" placeholder="ex: FLX-" className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-violet-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#6B7280] mb-1">Suffixe</label>
                        <input type="text" placeholder="ex: -wifi" className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-violet-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#6B7280] mb-1">Longueur</label>
                        <input type="number" defaultValue={8} className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-violet-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#6B7280] mb-1">Charset</label>
                        <select className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-sm appearance-none focus:outline-none focus:border-violet-500">
                          <option>Alphanumérique</option>
                          <option>Numérique</option>
                          <option>Alphabétique</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                <button className="w-full h-12 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2">
                  🚀 Générer les tickets
                </button>
              </div>
            </div>
          )}

          {/* ── Tab 2: Créer des profils ── */}
          {activeTab === "profiles" && (
            <div>
              <h2 className="text-lg font-bold text-[#1A1D26] text-center mb-1">Créer un profil</h2>
              <p className="text-sm text-[#6B7280] text-center mb-6">
                Définissez une offre (durée, prix, limite) — propagée automatiquement vers vos routeurs.
              </p>
              <div className="max-w-2xl mx-auto rounded-xl border border-[#E5E7EB] p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Nom de l&apos;offre *</label>
                    <input type="text" placeholder="Ex: 3H, 1Jour, 5Go..." className="w-full h-10 px-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-violet-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Prix ({currency})</label>
                    <input type="number" placeholder="Ex: 100" className="w-full h-10 px-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-violet-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Durée de validité</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" defaultValue={1} className="w-full h-10 px-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#1A1D26] focus:outline-none focus:border-violet-500" />
                    <div className="relative">
                      <select className="w-full h-10 pl-4 pr-10 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-violet-500">
                        <option value="m">Minute(s)</option>
                        <option value="h">Heure(s)</option>
                        <option value="d" selected>Jour(s)</option>
                        <option value="w">Semaine(s)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Type de limitation</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setLimitType("duration")}
                      className={`h-10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                        limitType === "duration"
                          ? "bg-violet-600 text-white"
                          : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
                      }`}
                    >
                      <Timer className="h-4 w-4" />
                      Durée session
                    </button>
                    <button
                      onClick={() => setLimitType("volume")}
                      className={`h-10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                        limitType === "volume"
                          ? "bg-orange-500 text-white"
                          : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
                      }`}
                    >
                      <HardDrive className="h-4 w-4" />
                      Volume données
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Vide = illimité"
                    className="w-full h-10 px-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-violet-500"
                  />
                  <div className="relative">
                    <select className="w-full h-10 pl-4 pr-10 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-violet-500">
                      {limitType === "duration" ? (
                        <>
                          <option value="m">Minute(s)</option>
                          <option value="h">Heure(s)</option>
                          <option value="d">Jour(s)</option>
                        </>
                      ) : (
                        <>
                          <option value="MB">Mo</option>
                          <option value="GB">Go</option>
                          <option value="TB">To</option>
                        </>
                      )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
                  </div>
                </div>
                <p className="text-xs text-[#9CA3AF]">
                  {limitType === "duration" ? "Durée max de session. Vide = illimité." : "Volume max de données. Vide = illimité."}
                </p>
                <button onClick={() => setShowAdvancedProfile(!showAdvancedProfile)} className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1A1D26] transition-colors">
                  <span className={`transition-transform ${showAdvancedProfile ? "rotate-90" : ""}`}>▶</span>
                  Options avancées
                </button>
                {showAdvancedProfile && (
                  <div className="rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#6B7280] mb-1">Limite appareils</label>
                        <input type="number" defaultValue={1} className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-violet-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#6B7280] mb-1">Limite débit (Mbps)</label>
                        <input type="text" placeholder="Ex: 2M/2M" className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-violet-500" />
                      </div>
                    </div>
                  </div>
                )}
                <button className="w-full h-12 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2">
                  <Zap className="h-4 w-4" />
                  Créer le profil
                </button>
              </div>
            </div>
          )}

          {/* ── Tab 3: Voir le stock ── */}
          {activeTab === "stock" && (() => {
            const stockByProfile = profiles.map((p) => {
              const count = tickets.filter((t) => t.profile_id === p.id && t.status === "available").length;
              return { ...p, count };
            });
            const totalStock = stockByProfile.reduce((a, b) => a + b.count, 0);
            return (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#1A1D26]">Voir le stock</h2>
                  <button className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-medium">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Rafraîchir
                  </button>
                </div>
                <p className="text-sm text-[#6B7280] mb-4">
                  Tickets disponibles dans Supabase — synchronisés automatiquement.
                </p>
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 mb-4">
                  <Info className="h-4 w-4 text-emerald-600 shrink-0" />
                  <p className="text-xs text-emerald-700">
                    Les routeurs vérifient les changements toutes les <strong>30 secondes</strong> via leur scheduler. Tout ticket ou profil créé ici sera automatiquement appliqué.
                  </p>
                </div>
                <p className="text-sm text-[#1A1D26] font-medium mb-4">
                  Total : <strong>{totalStock} ticket(s)</strong> dans {profiles.length} catégorie(s)
                </p>
                {ticketsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {stockByProfile.map((sp) => (
                      <div key={sp.id} className="rounded-xl border border-[#E5E7EB] p-4 text-center hover:shadow-sm transition-shadow">
                        <p className={`text-2xl font-bold ${sp.count > 0 ? "text-violet-600" : "text-red-500"}`}>{sp.count}</p>
                        <p className="text-xs font-medium text-[#1A1D26] mt-1 truncate">{sp.name}</p>
                        <button className="mt-2 text-[11px] font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 mx-auto">
                          <Trash2 className="h-3 w-3" />
                          Vider
                        </button>
                      </div>
                    ))}
                    {stockByProfile.length === 0 && (
                      <div className="col-span-full text-center py-8 text-sm text-[#9CA3AF]">
                        Aucun profil créé.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── Tab 4: Impression ── */}
          {activeTab === "print" && (() => {
            const printProfiles = profiles.map((p) => {
              const remaining = tickets.filter((t) => t.profile_id === p.id && t.status === "available").length;
              return { ...p, remaining };
            });
            return (
              <div>
                <div className="rounded-xl bg-[#1F2937] p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-orange-400">FLUXIONWIFI</span>
                      </div>
                      <p className="text-sm font-semibold text-white">Vente de Tickets WiFi</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          🛡️ Connecté
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">👤 Administrateur</p>
                      <p className="text-xs text-slate-400">Mode : Serveur RADIUS</p>
                      <button className="mt-2 inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 transition-colors">
                        <Settings className="h-3 w-3" />
                        Gérer les profils
                      </button>
                    </div>
                  </div>
                </div>
                <h2 className="text-lg font-bold text-[#1A1D26] mb-1">Impression des tickets</h2>
                <p className="text-xs text-[#9CA3AF] mb-4">Interface complète de vente et d&apos;impression — gérée par PageVenteTicket_Ultra.</p>
                <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280]">Catégorie</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280]">Prix ({currency})</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280]">Restants</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-[#6B7280]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F3F7]">
                      {printProfiles.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-sm text-[#9CA3AF]">Aucun profil disponible.</td>
                        </tr>
                      ) : (
                        printProfiles.map((p) => (
                          <tr key={p.id} className="hover:bg-[#F9FAFB] transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-[#1A1D26]">{p.name}</td>
                            <td className="px-4 py-3 text-sm text-right text-[#6B7280]">{formatPrice(p.price)}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              <span className={`font-semibold ${p.remaining > 0 ? "text-emerald-600" : "text-red-500"}`}>{p.remaining}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button className="inline-flex items-center gap-1 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-100 transition-colors">
                                <Printer className="h-3 w-3" />
                                Imprimer
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* ── Tab 5: Consommation ── */}
          {activeTab === "conso" && (() => {
            const consumed = tickets.filter((t) => t.status === "used").length;
            const expired = tickets.filter((t) => t.status === "expired").length;
            const active = tickets.filter((t) => t.status === "active").length;
            function fmtBytes(b: number) {
              if (b === 0) return "0 B";
              const u = ["B", "KB", "MB", "GB", "TB"];
              const i = Math.floor(Math.log(b) / Math.log(1024));
              return `${(b / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${u[i]}`;
            }
            const filteredTickets = tickets.filter((t) => {
              if (consoSearch && !t.code.toLowerCase().includes(consoSearch.toLowerCase())) return false;
              if (consoFilter === "all") return true;
              if (consoFilter === "active") return t.status === "active";
              if (consoFilter === "consumed") return t.status === "used";
              if (consoFilter === "expired") return t.status === "expired";
              if (consoFilter === "available") return t.status === "available";
              return true;
            });
            return (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#1A1D26]">Consommation des tickets</h2>
                  <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Auto-refresh 30s
                    <button className="text-violet-600 font-medium hover:text-violet-700">Rafraîchir</button>
                  </div>
                </div>
                <p className="text-sm text-[#6B7280] mb-4">Vue agrégée sur l&apos;ensemble des routeurs du groupe. Cumul temps réel de toutes les sessions.</p>
                <div className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 mb-4">
                  <Info className="h-4 w-4 text-blue-600 shrink-0" />
                  <p className="text-xs text-blue-700">
                    Les compteurs <strong>Bytes In/Out natifs de Winbox</strong> sont locaux à chaque routeur (limite RouterOS). Cette vue agrège la consommation relevée sur <strong>tous les routeurs</strong> du groupe à partir de Supabase.
                  </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="rounded-xl border border-[#E5E7EB] p-4">
                    <p className="text-2xl font-bold text-[#1A1D26]">{consumed + active}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">TICKETS CONSOMMATEURS</p>
                    <p className="text-[10px] text-[#9CA3AF]">Déjà utilisés au moins une fois</p>
                  </div>
                  <div className="rounded-xl border border-[#E5E7EB] p-4">
                    <p className="text-2xl font-bold text-emerald-600">{activeSessions.length}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">ACTIFS EN CE MOMENT</p>
                    <p className="text-[10px] text-[#9CA3AF]">Sessions en cours</p>
                  </div>
                  <div className="rounded-xl border border-[#E5E7EB] p-4">
                    <p className="text-2xl font-bold text-violet-600">{fmtBytes(totalBytesIn + totalBytesOut)}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">VOLUME TOTAL CONSOMMÉ</p>
                    <p className="text-[10px] text-[#9CA3AF]">Cumul sur tout le groupe</p>
                  </div>
                  <div className="rounded-xl border border-[#E5E7EB] p-4">
                    <p className="text-2xl font-bold text-red-500">{expired}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">TICKETS ÉPUISÉS</p>
                    <p className="text-[10px] text-[#9CA3AF]">Quota 100% atteint</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    <input
                      type="text"
                      placeholder="Rechercher un ticket ou une catégorie..."
                      value={consoSearch}
                      onChange={(e) => setConsoSearch(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    {[
                      { id: "all", label: "Tous", color: "bg-violet-600" },
                      { id: "active", label: "Actifs", color: "bg-emerald-500" },
                      { id: "consumed", label: "Consommés", color: "bg-blue-500" },
                      { id: "expired", label: "Épuisés", color: "bg-red-500" },
                      { id: "available", label: "Inutilisés", color: "bg-gray-400" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setConsoFilter(f.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                          consoFilter === f.id
                            ? `${f.color} text-white`
                            : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${consoFilter === f.id ? "bg-white" : f.color}`} />
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280]">Code</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280]">Profil</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280]">Statut</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280]">Créé</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F3F7]">
                      {filteredTickets.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-sm text-[#9CA3AF]">Aucun ticket trouvé.</td>
                        </tr>
                      ) : (
                        filteredTickets.slice(0, 20).map((t) => (
                          <tr key={t.id} className="hover:bg-[#F9FAFB] transition-colors">
                            <td className="px-4 py-2.5 text-xs font-mono font-medium text-[#1A1D26]">{t.code}</td>
                            <td className="px-4 py-2.5 text-xs text-[#6B7280]">{t.profile?.name || "—"}</td>
                            <td className="px-4 py-2.5">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                t.status === "active" ? "bg-emerald-50 text-emerald-700"
                                : t.status === "used" ? "bg-blue-50 text-blue-700"
                                : t.status === "expired" ? "bg-red-50 text-red-600"
                                : "bg-gray-100 text-gray-600"
                              }`}>
                                {t.status === "active" ? "Actif" : t.status === "used" ? "Consommé" : t.status === "expired" ? "Épuisé" : "Disponible"}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-xs text-[#9CA3AF]">
                              {new Date(t.created_at).toLocaleDateString("fr-FR")}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* ── Tab 6: Facturation ── */}
          {activeTab === "billing" && (
            <div>
              <div className="rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 p-6 mb-6">
                <h2 className="text-lg font-bold text-white mb-1">Facturation &amp; abonnements routeurs</h2>
                <p className="text-sm text-violet-200 mb-4">
                  Vous avez des packs actifs totalisant {routers.length} routeurs. Chaque pack a sa propre échéance, et porte ses propres routeurs.
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3.5">
                    <p className="text-2xl font-bold text-white">1</p>
                    <p className="text-xs text-violet-200">Pack(s) actif(s)</p>
                  </div>
                  <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3.5">
                    <p className="text-2xl font-bold text-white">{routers.length}</p>
                    <p className="text-xs text-violet-200">Routeur(s) débloqué(s)</p>
                  </div>
                  <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3.5">
                    <p className="text-2xl font-bold text-white">{routers.length}</p>
                    <p className="text-xs text-violet-200">Actuellement utilisé(s)</p>
                  </div>
                  <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3.5">
                    <p className="text-2xl font-bold text-white">—</p>
                    <p className="text-xs text-violet-200">Prochaine expiration</p>
                  </div>
                </div>
              </div>
              <h3 className="text-base font-bold text-[#1A1D26] mb-3">Avantages inclus avec votre déblocage</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { icon: "🔓", title: "Accès RADIUS complet", desc: "Génération et synchronisation automatique des tickets" },
                  { icon: "📊", title: "Console temps réel", desc: "Monitoring trafic, sessions, consommation" },
                  { icon: "🌐", title: "Portail captif", desc: "Page de connexion personnalisable pour vos clients" },
                  { icon: "🖨️", title: "Impression tickets", desc: "Interface de vente et impression directe" },
                  { icon: "🔗", title: "Interopérabilité", desc: "Synchronisation multi-routeurs automatique" },
                  { icon: "📡", title: "VPN accès distant", desc: "Gestion à distance via tunnels sécurisés" },
                ].map((a) => (
                  <div key={a.title} className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] p-4">
                    <span className="text-xl">{a.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1D26]">{a.title}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add router modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-md bg-[#1F2937] border border-[#374151] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#374151]">
              <h3 className="text-lg font-semibold text-white">
                Nouveau routeur
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#374151] text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Nom du site
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    name="name"
                    required
                    placeholder="Ex : Hotspot Cotonou Gare"
                    className="w-full rounded-xl border border-[#374151] bg-[#111827] pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2B7FFF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Adresse IP
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    name="ip"
                    required
                    placeholder="192.168.88.1"
                    className="w-full rounded-xl border border-[#374151] bg-[#111827] pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2B7FFF]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Port API
                  </label>
                  <input
                    name="port"
                    defaultValue="8728"
                    className="w-full rounded-xl border border-[#374151] bg-[#111827] px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2B7FFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Zone
                  </label>
                  <div className="relative">
                    <select
                      name="zone"
                      defaultValue="sud"
                      className="w-full appearance-none rounded-xl border border-[#374151] bg-[#111827] px-4 pr-9 py-2.5 text-sm text-white focus:outline-none focus:border-[#2B7FFF]"
                    >
                      {Object.entries(zoneLabels).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Identité MikroTik
                </label>
                <input
                  name="identity"
                  placeholder="FLX-XXX-Site"
                  className="w-full rounded-xl border border-[#374151] bg-[#111827] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2B7FFF]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border border-[#374151] py-2.5 text-sm font-medium text-slate-300 hover:bg-[#374151] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
                >
                  {adding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit router modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEditModal(null)}
          />
          <div className="relative w-full max-w-md bg-[#1F2937] border border-[#374151] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#374151]">
              <h3 className="text-lg font-semibold text-white">
                {showEditModal.name}
              </h3>
              <button
                onClick={() => setShowEditModal(null)}
                className="p-1.5 rounded-lg hover:bg-[#374151] text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#111827] p-3">
                  <p className="text-[10px] uppercase text-slate-500 mb-1">
                    IP
                  </p>
                  <p className="text-sm font-medium text-white">
                    {showEditModal.ip_address}
                  </p>
                </div>
                <div className="rounded-xl bg-[#111827] p-3">
                  <p className="text-[10px] uppercase text-slate-500 mb-1">
                    Zone
                  </p>
                  <p className="text-sm font-medium text-white">
                    {zoneLabels[showEditModal.zone] || showEditModal.zone}
                  </p>
                </div>
                <div className="rounded-xl bg-[#111827] p-3">
                  <p className="text-[10px] uppercase text-slate-500 mb-1">
                    Modèle
                  </p>
                  <p className="text-sm font-medium text-white">
                    {showEditModal.model || "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-[#111827] p-3">
                  <p className="text-[10px] uppercase text-slate-500 mb-1">
                    Statut
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-2 w-2 rounded-full ${statusDot[showEditModal.status]}`}
                    />
                    <p className="text-sm font-medium text-white">
                      {statusLabel[showEditModal.status]}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl bg-[#111827] p-3">
                  <p className="text-[10px] uppercase text-slate-500 mb-1">
                    Clients
                  </p>
                  <p className="text-sm font-medium text-white">
                    {showEditModal.clients_connected}
                  </p>
                </div>
                <div className="rounded-xl bg-[#111827] p-3">
                  <p className="text-[10px] uppercase text-slate-500 mb-1">
                    Uptime
                  </p>
                  <p className="text-sm font-medium text-white">
                    {showEditModal.uptime || "—"}
                  </p>
                </div>
              </div>

              {/* CPU / RAM */}
              {showEditModal.status !== "offline" && (
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>CPU</span>
                      <span>{showEditModal.cpu_usage}%</span>
                    </div>
                    <div className="h-1.5 bg-[#374151] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          showEditModal.cpu_usage > 80
                            ? "bg-red-400"
                            : showEditModal.cpu_usage > 50
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                        }`}
                        style={{ width: `${showEditModal.cpu_usage}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>RAM</span>
                      <span>{showEditModal.memory_usage}%</span>
                    </div>
                    <div className="h-1.5 bg-[#374151] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          showEditModal.memory_usage > 80
                            ? "bg-red-400"
                            : showEditModal.memory_usage > 50
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                        }`}
                        style={{ width: `${showEditModal.memory_usage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowEditModal(null)}
                className="w-full rounded-xl border border-[#374151] py-2.5 text-sm font-medium text-slate-300 hover:bg-[#374151] transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
