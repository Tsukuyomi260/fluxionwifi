"use client";

import { useState } from "react";
import { useRouters } from "@/hooks/use-routers";
import type { Router as RouterType, RouterStatus } from "@/lib/supabase/types";
import {
  Router,
  Plus,
  Search,
  AlertTriangle,
  Clock,
  Wifi,
  X,
  Eye,
  Activity,
  Loader2,
} from "lucide-react";

export default function RoutersPage() {
  const { routers, loading, addRouter, online } = useRouters();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | RouterStatus>("all");
  const [selectedRouter, setSelectedRouter] = useState<RouterType | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [addForm, setAddForm] = useState({
    name: "",
    ip_address: "",
    api_user: "",
    api_password: "",
    model: "",
    zone: "centre" as RouterType["zone"],
  });

  const filtered = routers.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.ip_address.includes(searchQuery);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalClients = routers.reduce((s, r) => s + r.clients_connected, 0);

  async function handleAddRouter() {
    if (!addForm.name || !addForm.ip_address) return;
    setSubmitting(true);
    await addRouter({
      name: addForm.name,
      ip_address: addForm.ip_address,
      model: addForm.model || "MikroTik",
      zone: addForm.zone,
    });
    setSubmitting(false);
    setShowAddModal(false);
    setAddForm({ name: "", ip_address: "", api_user: "", api_password: "", model: "", zone: "centre" });
  }

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
              <p className="text-2xl font-bold text-[#1A1D26]">{totalClients}</p>
              <p className="text-xs text-[#6B7280]">Sessions totales</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-2.5"><Activity className="h-5 w-5 text-violet-500" /></div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D26]">{routers.filter((r) => r.status === "warning").length}</p>
              <p className="text-xs text-[#6B7280]">Alertes</p>
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
          <option value="warning">Alerte</option>
        </select>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Ajouter un routeur
        </button>
      </div>

      {/* Router cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((r) => {
          const isOnline = r.status === "online";
          const isWarning = r.status === "warning";
          return (
            <div
              key={r.id}
              className={`rounded-2xl border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-all ${
                isOnline ? "border-[#E8ECF1] hover:border-[#2B7FFF]/20 hover:shadow-md"
                : isWarning ? "border-amber-200"
                : "border-red-100 opacity-80"
              }`}
            >
              <div className={`h-1 ${isOnline ? "bg-emerald-500" : isWarning ? "bg-amber-400" : "bg-red-400"}`} />
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2.5 ${isOnline ? "bg-emerald-50" : isWarning ? "bg-amber-50" : "bg-red-50"}`}>
                      <Router className={`h-5 w-5 ${isOnline ? "text-emerald-500" : isWarning ? "text-amber-500" : "text-red-400"}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#1A1D26]">{r.name}</h3>
                      <p className="font-mono text-xs text-[#9CA3AF]">{r.ip_address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      isOnline ? "bg-emerald-50 text-emerald-700"
                      : isWarning ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-600"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-emerald-500" : isWarning ? "bg-amber-500" : "bg-red-500"}`} />
                      {isOnline ? "En ligne" : isWarning ? "Alerte" : "Hors ligne"}
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
                    <p className="text-xs font-medium text-[#1A1D26] mt-0.5">{r.model || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#9CA3AF]">Zone</p>
                    <p className="text-xs font-medium text-[#1A1D26] mt-0.5 capitalize">{r.zone}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#9CA3AF]">Clients</p>
                    <p className="text-xs font-medium text-[#1A1D26] mt-0.5">{r.clients_connected} connecté{r.clients_connected !== 1 ? "s" : ""}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#9CA3AF]">Localisation</p>
                    <p className="text-xs font-medium text-[#1A1D26] mt-0.5">{r.location || "—"}</p>
                  </div>
                </div>

                {isOnline && (
                  <div className="space-y-2 pt-3 border-t border-[#F1F3F7]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#9CA3AF]">CPU</span>
                      <span className="text-[11px] font-medium text-[#1A1D26]">{r.cpu_usage}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#F1F3F7] overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${r.cpu_usage > 80 ? "bg-red-500" : r.cpu_usage > 50 ? "bg-amber-500" : "bg-[#2B7FFF]"}`} style={{ width: `${r.cpu_usage}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-[#9CA3AF]">Mémoire</span>
                      <span className="text-[11px] font-medium text-[#1A1D26]">{r.memory_usage}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#F1F3F7] overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${r.memory_usage > 80 ? "bg-red-500" : r.memory_usage > 50 ? "bg-amber-500" : "bg-violet-400"}`} style={{ width: `${r.memory_usage}%` }} />
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-[#9CA3AF]">
                      <Clock className="h-3 w-3" />
                      Uptime: {r.uptime || "—"}
                    </div>
                  </div>
                )}

                {r.status === "offline" && (
                  <div className="pt-3 border-t border-[#F1F3F7]">
                    <p className="text-xs text-red-500 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Dernière connexion : {r.last_seen ? new Date(r.last_seen).toLocaleString("fr-FR") : "—"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
            <div className={`h-1.5 ${selectedRouter.status === "online" ? "bg-emerald-500" : selectedRouter.status === "warning" ? "bg-amber-400" : "bg-red-400"}`} />
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
                { label: "Adresse IP", value: selectedRouter.ip_address },
                { label: "Port API", value: String(selectedRouter.api_port) },
                { label: "Modèle", value: selectedRouter.model || "—" },
                { label: "Identité", value: selectedRouter.identity || "—" },
                { label: "Zone", value: selectedRouter.zone.charAt(0).toUpperCase() + selectedRouter.zone.slice(1) },
                { label: "Localisation", value: selectedRouter.location || "—" },
                { label: "Clients connectés", value: String(selectedRouter.clients_connected) },
                { label: "Uptime", value: selectedRouter.uptime || "—" },
                { label: "Dernière synchro", value: selectedRouter.last_sync ? new Date(selectedRouter.last_sync).toLocaleString("fr-FR") : "—" },
                { label: "Dernière connexion", value: selectedRouter.last_seen ? new Date(selectedRouter.last_seen).toLocaleString("fr-FR") : "—" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">{row.label}</span>
                  <span className="text-sm font-medium text-[#1A1D26] font-mono">{row.value}</span>
                </div>
              ))}
              {selectedRouter.status === "online" && (
                <div className="pt-3 border-t border-[#F1F3F7] space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#6B7280]">CPU</span>
                      <span className="font-medium text-[#1A1D26]">{selectedRouter.cpu_usage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F1F3F7] overflow-hidden">
                      <div className="h-full rounded-full bg-[#2B7FFF]" style={{ width: `${selectedRouter.cpu_usage}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#6B7280]">Mémoire</span>
                      <span className="font-medium text-[#1A1D26]">{selectedRouter.memory_usage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F1F3F7] overflow-hidden">
                      <div className="h-full rounded-full bg-violet-400" style={{ width: `${selectedRouter.memory_usage}%` }} />
                    </div>
                  </div>
                </div>
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
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="Ex: MK-Bureau-01"
                  className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Adresse IP</label>
                <input
                  type="text"
                  value={addForm.ip_address}
                  onChange={(e) => setAddForm({ ...addForm, ip_address: e.target.value })}
                  placeholder="192.168.88.1"
                  className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Modèle</label>
                <input
                  type="text"
                  value={addForm.model}
                  onChange={(e) => setAddForm({ ...addForm, model: e.target.value })}
                  placeholder="Ex: hAP ac²"
                  className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Utilisateur API</label>
                  <input
                    type="text"
                    value={addForm.api_user}
                    onChange={(e) => setAddForm({ ...addForm, api_user: e.target.value })}
                    placeholder="admin"
                    className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Mot de passe API</label>
                  <input
                    type="password"
                    value={addForm.api_password}
                    onChange={(e) => setAddForm({ ...addForm, api_password: e.target.value })}
                    placeholder="••••••"
                    className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Zone</label>
                <select
                  value={addForm.zone}
                  onChange={(e) => setAddForm({ ...addForm, zone: e.target.value as RouterType["zone"] })}
                  className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-[#2B7FFF]"
                >
                  <option value="centre">Centre</option>
                  <option value="sud">Sud</option>
                  <option value="nord">Nord</option>
                  <option value="est">Est</option>
                  <option value="ouest">Ouest</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#E8ECF1] flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="h-10 px-5 rounded-xl border border-[#E8ECF1] text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors">
                Annuler
              </button>
              <button
                onClick={handleAddRouter}
                disabled={!addForm.name || !addForm.ip_address || submitting}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Ajouter le routeur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
