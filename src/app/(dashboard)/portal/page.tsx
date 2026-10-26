"use client";

import { useState } from "react";
import {
  Globe,
  Plus,
  Eye,
  Trash2,
  Copy,
  MoreHorizontal,
  Wifi,
  Users,
  Palette,
  Search,
  ChevronDown,
  X,
  Check,
  Smartphone,
  Monitor,
  Ticket,
  CreditCard,
  Share2,
} from "lucide-react";

type AuthMethod = "ticket" | "free" | "mobile_money" | "social";
type PortalStatus = "active" | "inactive" | "draft";

interface Portal {
  id: string;
  name: string;
  description: string;
  status: PortalStatus;
  theme: string;
  themeColor: string;
  authMethods: AuthMethod[];
  connectedRouters: number;
  totalConnections: number;
  createdAt: string;
  logoUrl?: string;
}

const authMethodLabels: Record<AuthMethod, { label: string; icon: typeof Ticket }> = {
  ticket: { label: "Ticket / Code", icon: Ticket },
  free: { label: "Accès gratuit", icon: Wifi },
  mobile_money: { label: "Mobile Money", icon: CreditCard },
  social: { label: "Réseaux sociaux", icon: Share2 },
};

const statusConfig: Record<PortalStatus, { label: string; bg: string; text: string; dot: string }> = {
  active: { label: "Actif", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  inactive: { label: "Inactif", bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  draft: { label: "Brouillon", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
};

const themePresets = [
  { name: "Moderne Bleu", color: "#2B7FFF", bg: "bg-[#2B7FFF]" },
  { name: "Émeraude", color: "#10B981", bg: "bg-emerald-500" },
  { name: "Violet Royal", color: "#8B5CF6", bg: "bg-violet-500" },
  { name: "Orange Chaleur", color: "#F97316", bg: "bg-orange-500" },
  { name: "Rose Élégant", color: "#EC4899", bg: "bg-pink-500" },
  { name: "Sombre Premium", color: "#0B1E4D", bg: "bg-[#0B1E4D]" },
];

const demoPortals: Portal[] = [
  {
    id: "1",
    name: "Café Connect",
    description: "Portail pour le café-restaurant principal",
    status: "active",
    theme: "Moderne Bleu",
    themeColor: "#2B7FFF",
    authMethods: ["ticket", "mobile_money"],
    connectedRouters: 2,
    totalConnections: 847,
    createdAt: "2026-10-15",
  },
  {
    id: "2",
    name: "Hôtel Prestige WiFi",
    description: "Portail premium pour l'hôtel",
    status: "active",
    theme: "Sombre Premium",
    themeColor: "#0B1E4D",
    authMethods: ["ticket", "free"],
    connectedRouters: 5,
    totalConnections: 2341,
    createdAt: "2026-09-28",
  },
  {
    id: "3",
    name: "Campus UniKin",
    description: "Portail étudiant - Université de Kinshasa",
    status: "draft",
    theme: "Violet Royal",
    themeColor: "#8B5CF6",
    authMethods: ["ticket"],
    connectedRouters: 0,
    totalConnections: 0,
    createdAt: "2026-10-24",
  },
];

export default function PortalPage() {
  const [portals, setPortals] = useState<Portal[]>(demoPortals);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreview, setShowPreview] = useState<Portal | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | PortalStatus>("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [newPortal, setNewPortal] = useState({
    name: "",
    description: "",
    theme: themePresets[0],
    authMethods: ["ticket"] as AuthMethod[],
  });

  const filtered = portals.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: "Total portails", value: portals.length, icon: Globe, iconBg: "bg-blue-50", iconColor: "text-[#2B7FFF]" },
    { label: "Portails actifs", value: portals.filter((p) => p.status === "active").length, icon: Wifi, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
    { label: "Routeurs connectés", value: portals.reduce((s, p) => s + p.connectedRouters, 0), icon: Monitor, iconBg: "bg-violet-50", iconColor: "text-violet-500" },
    { label: "Connexions totales", value: portals.reduce((s, p) => s + p.totalConnections, 0).toLocaleString("fr-FR"), icon: Users, iconBg: "bg-orange-50", iconColor: "text-orange-500" },
  ];

  function handleCreate() {
    const portal: Portal = {
      id: Date.now().toString(),
      name: newPortal.name,
      description: newPortal.description,
      status: "draft",
      theme: newPortal.theme.name,
      themeColor: newPortal.theme.color,
      authMethods: newPortal.authMethods,
      connectedRouters: 0,
      totalConnections: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPortals([portal, ...portals]);
    setShowCreateModal(false);
    setNewPortal({ name: "", description: "", theme: themePresets[0], authMethods: ["ticket"] });
  }

  function toggleAuth(method: AuthMethod) {
    setNewPortal((prev) => ({
      ...prev,
      authMethods: prev.authMethods.includes(method)
        ? prev.authMethods.filter((m) => m !== method)
        : [...prev.authMethods, method],
    }));
  }

  function toggleStatus(id: string) {
    setPortals((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
      )
    );
    setOpenMenu(null);
  }

  function duplicatePortal(portal: Portal) {
    const dup: Portal = {
      ...portal,
      id: Date.now().toString(),
      name: `${portal.name} (copie)`,
      status: "draft",
      connectedRouters: 0,
      totalConnections: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPortals([dup, ...portals]);
    setOpenMenu(null);
  }

  function deletePortal(id: string) {
    setPortals((prev) => prev.filter((p) => p.id !== id));
    setOpenMenu(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1A1D26]">Portail Captif</h2>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Créez et personnalisez vos pages de connexion WiFi
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2B7FFF] px-5 text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" />
          Créer un portail
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
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
            placeholder="Rechercher un portail..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20 transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="h-10 pl-4 pr-10 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-[#2B7FFF] transition-colors"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="draft">Brouillon</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
        </div>
      </div>

      {/* Portal List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 text-[#2B7FFF]" />
          </div>
          <h3 className="text-base font-semibold text-[#1A1D26]">Aucun portail trouvé</h3>
          <p className="mt-1 text-sm text-[#6B7280] max-w-sm mx-auto">
            {searchQuery || filterStatus !== "all"
              ? "Aucun portail ne correspond à vos critères de recherche."
              : "Créez votre premier portail captif pour commencer à personnaliser l'expérience WiFi de vos utilisateurs."}
          </p>
          {!searchQuery && filterStatus === "all" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#2B7FFF] px-5 text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Créer un portail
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((portal) => {
            const sc = statusConfig[portal.status];
            return (
              <div
                key={portal.id}
                className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden group hover:shadow-md hover:border-[#2B7FFF]/20 transition-all"
              >
                {/* Theme preview bar */}
                <div className="h-2" style={{ backgroundColor: portal.themeColor }} />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${portal.themeColor}15` }}
                        >
                          <Globe className="h-5 w-5" style={{ color: portal.themeColor }} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-[#1A1D26] truncate">{portal.name}</h3>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${sc.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                            {sc.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions menu */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === portal.id ? null : portal.id)}
                        className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenu === portal.id && (
                        <div className="absolute right-0 top-8 w-48 bg-white rounded-xl border border-[#E8ECF1] shadow-xl z-20 overflow-hidden">
                          <button
                            onClick={() => { setShowPreview(portal); setOpenMenu(null); }}
                            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                          >
                            <Eye className="h-4 w-4 text-[#9CA3AF]" />
                            Aperçu
                          </button>
                          <button
                            onClick={() => toggleStatus(portal.id)}
                            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                          >
                            <Wifi className="h-4 w-4 text-[#9CA3AF]" />
                            {portal.status === "active" ? "Désactiver" : "Activer"}
                          </button>
                          <button
                            onClick={() => duplicatePortal(portal)}
                            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                          >
                            <Copy className="h-4 w-4 text-[#9CA3AF]" />
                            Dupliquer
                          </button>
                          <div className="border-t border-[#E8ECF1]" />
                          <button
                            onClick={() => deletePortal(portal.id)}
                            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-[#6B7280] line-clamp-2">{portal.description}</p>

                  {/* Auth methods */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {portal.authMethods.map((method) => {
                      const { label, icon: Icon } = authMethodLabels[method];
                      return (
                        <span
                          key={method}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#F5F7FA] px-2 py-1 text-[11px] font-medium text-[#6B7280]"
                        >
                          <Icon className="h-3 w-3" />
                          {label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Footer stats */}
                  <div className="mt-4 pt-4 border-t border-[#F1F3F7] flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                      <span className="flex items-center gap-1">
                        <Monitor className="h-3.5 w-3.5" />
                        {portal.connectedRouters} routeur{portal.connectedRouters !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {portal.totalConnections.toLocaleString("fr-FR")} connexions
                      </span>
                    </div>
                    <button
                      onClick={() => setShowPreview(portal)}
                      className="text-xs font-medium text-[#2B7FFF] hover:text-[#1A6BE6] transition-colors flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Voir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#E8ECF1] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h3 className="text-lg font-semibold text-[#1A1D26]">Nouveau portail captif</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Configurez votre page de connexion WiFi</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF] hover:text-[#6B7280]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#1A1D26] mb-1.5">
                  Nom du portail
                </label>
                <input
                  type="text"
                  value={newPortal.name}
                  onChange={(e) => setNewPortal({ ...newPortal, name: e.target.value })}
                  placeholder="ex: Mon Café WiFi"
                  className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#1A1D26] mb-1.5">
                  Description
                </label>
                <textarea
                  value={newPortal.description}
                  onChange={(e) => setNewPortal({ ...newPortal, description: e.target.value })}
                  placeholder="Décrivez brièvement ce portail..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8ECF1] text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20 resize-none"
                />
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-[#1A1D26] mb-2">
                  Thème couleur
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {themePresets.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => setNewPortal({ ...newPortal, theme })}
                      className={`relative flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all ${
                        newPortal.theme.name === theme.name
                          ? "border-[#2B7FFF] bg-[#EBF2FF]/50"
                          : "border-[#E8ECF1] hover:border-[#D1D5DB]"
                      }`}
                    >
                      <div className={`h-5 w-5 rounded-full shrink-0 ${theme.bg}`} />
                      <span className="text-xs font-medium text-[#1A1D26] truncate">{theme.name}</span>
                      {newPortal.theme.name === theme.name && (
                        <Check className="absolute top-1.5 right-1.5 h-3.5 w-3.5 text-[#2B7FFF]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auth methods */}
              <div>
                <label className="block text-sm font-medium text-[#1A1D26] mb-2">
                  Méthodes d&apos;authentification
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(authMethodLabels) as AuthMethod[]).map((method) => {
                    const { label, icon: Icon } = authMethodLabels[method];
                    const selected = newPortal.authMethods.includes(method);
                    return (
                      <button
                        key={method}
                        onClick={() => toggleAuth(method)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all ${
                          selected
                            ? "border-[#2B7FFF] bg-[#EBF2FF]/50"
                            : "border-[#E8ECF1] hover:border-[#D1D5DB]"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${selected ? "text-[#2B7FFF]" : "text-[#9CA3AF]"}`} />
                        <span className={`text-xs font-medium ${selected ? "text-[#1A1D26]" : "text-[#6B7280]"}`}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-[#E8ECF1] px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowCreateModal(false)}
                className="h-10 px-5 rounded-xl border border-[#D1D5DB] text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreate}
                disabled={!newPortal.name.trim() || newPortal.authMethods.length === 0}
                className="h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer le portail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPreview(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Preview header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF1]">
              <div>
                <h3 className="text-lg font-semibold text-[#1A1D26]">Aperçu : {showPreview.name}</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Prévisualisation du portail captif</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#F5F7FA] rounded-lg p-0.5">
                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className={`p-1.5 rounded-md transition-colors ${previewDevice === "mobile" ? "bg-white shadow-sm text-[#2B7FFF]" : "text-[#9CA3AF]"}`}
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className={`p-1.5 rounded-md transition-colors ${previewDevice === "desktop" ? "bg-white shadow-sm text-[#2B7FFF]" : "text-[#9CA3AF]"}`}
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => setShowPreview(null)}
                  className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF] hover:text-[#6B7280]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Preview body */}
            <div className="flex-1 overflow-y-auto bg-[#F5F7FA] p-6 flex items-center justify-center">
              <div
                className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all ${
                  previewDevice === "mobile" ? "w-[320px]" : "w-full max-w-xl"
                }`}
              >
                {/* Simulated portal */}
                <div className="h-40 relative flex items-center justify-center" style={{ backgroundColor: showPreview.themeColor }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
                  <div className="relative text-center text-white px-4">
                    <Wifi className="h-10 w-10 mx-auto mb-2 opacity-90" />
                    <h4 className="text-lg font-bold">{showPreview.name}</h4>
                    <p className="text-xs opacity-80 mt-1">Connectez-vous au WiFi</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-[#6B7280]">Bienvenue ! Choisissez votre méthode de connexion :</p>
                  </div>

                  {showPreview.authMethods.includes("ticket") && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Entrez votre code ticket"
                        className="w-full h-11 px-4 rounded-xl border border-[#E8ECF1] text-sm text-center"
                        readOnly
                      />
                      <button
                        className="w-full h-11 rounded-xl text-sm font-medium text-white transition-colors"
                        style={{ backgroundColor: showPreview.themeColor }}
                      >
                        Se connecter
                      </button>
                    </div>
                  )}

                  {showPreview.authMethods.includes("mobile_money") && (
                    <button className="w-full h-11 rounded-xl border-2 text-sm font-medium transition-colors" style={{ borderColor: showPreview.themeColor, color: showPreview.themeColor }}>
                      Payer via Mobile Money
                    </button>
                  )}

                  {showPreview.authMethods.includes("free") && (
                    <button className="w-full h-11 rounded-xl bg-[#F5F7FA] text-sm font-medium text-[#374151] hover:bg-[#E8ECF1] transition-colors">
                      Accès gratuit
                    </button>
                  )}

                  {showPreview.authMethods.includes("social") && (
                    <button className="w-full h-11 rounded-xl bg-[#F5F7FA] text-sm font-medium text-[#374151] hover:bg-[#E8ECF1] transition-colors flex items-center justify-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Continuer avec un réseau social
                    </button>
                  )}

                  <p className="text-center text-[10px] text-[#9CA3AF] pt-2">
                    Propulsé par FLUXIONWIFI
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E8ECF1] px-6 py-3 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <Palette className="h-3.5 w-3.5" />
                Thème : {showPreview.theme}
              </div>
              <button
                onClick={() => setShowPreview(null)}
                className="h-9 px-4 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors"
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
