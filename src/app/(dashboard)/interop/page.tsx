"use client";

import { useState } from "react";
import { useRouters } from "@/hooks/use-routers";
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
  const [group, setGroup] = useState("default");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Router | null>(null);
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState(false);

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
