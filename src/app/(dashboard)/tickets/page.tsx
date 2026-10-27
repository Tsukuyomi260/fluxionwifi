"use client";

import { useState } from "react";
import { useCurrency } from "@/hooks/use-currency";
import {
  Ticket,
  Plus,
  Search,
  ChevronDown,
  MoreHorizontal,
  Copy,
  Trash2,
  Eye,
  X,
  Check,
  Clock,
  Wifi,
  Users,
  Banknote,
  Package,
  CheckCircle2,
  XCircle,
  Zap,
  Share2,
} from "lucide-react";

type TicketStatus = "available" | "active" | "used" | "expired";
type ProfileDuration = "1h" | "3h" | "6h" | "12h" | "24h" | "3j" | "7j" | "30j";

interface TicketProfile {
  id: string;
  name: string;
  duration: ProfileDuration;
  price: number;
  speedLimit: string;
  deviceLimit: number;
  color: string;
}

interface WifiTicket {
  id: string;
  code: string;
  profileId: string;
  profileName: string;
  duration: ProfileDuration;
  price: number;
  status: TicketStatus;
  createdAt: string;
  usedAt?: string;
  expiresAt?: string;
  assignedTo?: string;
}

const durationLabels: Record<ProfileDuration, string> = {
  "1h": "1 heure",
  "3h": "3 heures",
  "6h": "6 heures",
  "12h": "12 heures",
  "24h": "24 heures",
  "3j": "3 jours",
  "7j": "7 jours",
  "30j": "30 jours",
};

const statusConfig: Record<TicketStatus, { label: string; bg: string; text: string; icon: typeof CheckCircle2 }> = {
  available: { label: "Disponible", bg: "bg-blue-50", text: "text-[#2B7FFF]", icon: Ticket },
  active: { label: "En cours", bg: "bg-emerald-50", text: "text-emerald-700", icon: Wifi },
  used: { label: "Utilisé", bg: "bg-gray-100", text: "text-gray-600", icon: CheckCircle2 },
  expired: { label: "Expiré", bg: "bg-red-50", text: "text-red-600", icon: XCircle },
};

const demoProfiles: TicketProfile[] = [
  { id: "p1", name: "Express", duration: "1h", price: 200, speedLimit: "5 Mbps", deviceLimit: 1, color: "#2B7FFF" },
  { id: "p2", name: "Standard", duration: "3h", price: 500, speedLimit: "10 Mbps", deviceLimit: 2, color: "#10B981" },
  { id: "p3", name: "Journée", duration: "24h", price: 1000, speedLimit: "15 Mbps", deviceLimit: 3, color: "#F97316" },
  { id: "p4", name: "Semaine", duration: "7j", price: 5000, speedLimit: "20 Mbps", deviceLimit: 3, color: "#8B5CF6" },
  { id: "p5", name: "Mensuel", duration: "30j", price: 15000, speedLimit: "Illimité", deviceLimit: 5, color: "#0B1E4D" },
];

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const demoTickets: WifiTicket[] = [
  { id: "1", code: "KFMR-4A7B", profileId: "p1", profileName: "Express", duration: "1h", price: 200, status: "available", createdAt: "2026-10-26" },
  { id: "2", code: "T9WN-X3PL", profileId: "p1", profileName: "Express", duration: "1h", price: 200, status: "available", createdAt: "2026-10-26" },
  { id: "3", code: "H5CZ-QE8M", profileId: "p2", profileName: "Standard", duration: "3h", price: 500, status: "active", createdAt: "2026-10-25", usedAt: "2026-10-26 14:30", expiresAt: "2026-10-26 17:30" },
  { id: "4", code: "BVLD-7FKS", profileId: "p3", profileName: "Journée", duration: "24h", price: 1000, status: "active", createdAt: "2026-10-25", usedAt: "2026-10-26 08:00", expiresAt: "2026-10-27 08:00" },
  { id: "5", code: "RP2G-ANWT", profileId: "p2", profileName: "Standard", duration: "3h", price: 500, status: "used", createdAt: "2026-10-24", usedAt: "2026-10-25 10:00" },
  { id: "6", code: "YCMJ-6DV4", profileId: "p1", profileName: "Express", duration: "1h", price: 200, status: "expired", createdAt: "2026-10-23", usedAt: "2026-10-24 16:00" },
  { id: "7", code: "WLXN-8KF3", profileId: "p4", profileName: "Semaine", duration: "7j", price: 5000, status: "active", createdAt: "2026-10-20", usedAt: "2026-10-21 09:00", expiresAt: "2026-10-28 09:00", assignedTo: "Vendeur Mbudi" },
  { id: "8", code: "QA5T-GRHM", profileId: "p3", profileName: "Journée", duration: "24h", price: 1000, status: "available", createdAt: "2026-10-26", assignedTo: "Vendeur Lemba" },
];

type Tab = "tickets" | "profiles";

export default function TicketsPage() {
  const { currency } = useCurrency();
  const [activeTab, setActiveTab] = useState<Tab>("tickets");
  const [tickets, setTickets] = useState(demoTickets);
  const [profiles] = useState(demoProfiles);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TicketStatus>("all");
  const [profileFilter, setProfileFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<WifiTicket | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [generateForm, setGenerateForm] = useState({
    profileId: demoProfiles[0].id,
    quantity: 10,
  });

  const [profileForm, setProfileForm] = useState({
    name: "",
    duration: "1h" as ProfileDuration,
    price: 0,
    speedLimit: "",
    deviceLimit: 1,
  });

  const filteredTickets = tickets.filter((t) => {
    const matchSearch = t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.profileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.assignedTo && t.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchProfile = profileFilter === "all" || t.profileId === profileFilter;
    return matchSearch && matchStatus && matchProfile;
  });

  const stats = [
    { label: "Total tickets", value: tickets.length, icon: Package, iconBg: "bg-blue-50", iconColor: "text-[#2B7FFF]" },
    { label: "Disponibles", value: tickets.filter((t) => t.status === "available").length, icon: Ticket, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
    { label: "En cours", value: tickets.filter((t) => t.status === "active").length, icon: Wifi, iconBg: "bg-violet-50", iconColor: "text-violet-500" },
    { label: "Revenu potentiel", value: tickets.filter((t) => t.status === "available").reduce((s, t) => s + t.price, 0).toLocaleString("fr-FR") + ` ${currency}`, icon: Banknote, iconBg: "bg-orange-50", iconColor: "text-orange-500" },
  ];

  function handleGenerate() {
    const profile = profiles.find((p) => p.id === generateForm.profileId)!;
    const newTickets: WifiTicket[] = Array.from({ length: generateForm.quantity }, (_, i) => ({
      id: Date.now().toString() + i,
      code: generateCode(),
      profileId: profile.id,
      profileName: profile.name,
      duration: profile.duration,
      price: profile.price,
      status: "available" as TicketStatus,
      createdAt: new Date().toISOString().split("T")[0],
    }));
    setTickets([...newTickets, ...tickets]);
    setShowGenerateModal(false);
    setGenerateForm({ profileId: demoProfiles[0].id, quantity: 10 });
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  function deleteTicket(id: string) {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    setOpenMenu(null);
  }

  const selectedProfile = profiles.find((p) => p.id === generateForm.profileId);

  const tabs: { id: Tab; label: string; icon: typeof Ticket }[] = [
    { id: "tickets", label: "Tickets", icon: Ticket },
    { id: "profiles", label: "Profils", icon: Zap },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1A1D26]">Tickets WiFi</h2>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Générez, gérez et distribuez vos tickets d&apos;accès WiFi
          </p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2B7FFF] px-5 text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" />
          Générer des tickets
        </button>
      </div>

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

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#F5F7FA] rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? "bg-white text-[#1A1D26] shadow-sm" : "text-[#6B7280] hover:text-[#1A1D26]"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tickets Tab */}
      {activeTab === "tickets" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par code, profil, vendeur..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="h-10 pl-3 pr-8 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-[#2B7FFF] transition-colors"
                >
                  <option value="all">Statut</option>
                  <option value="available">Disponible</option>
                  <option value="active">En cours</option>
                  <option value="used">Utilisé</option>
                  <option value="expired">Expiré</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9CA3AF] pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={profileFilter}
                  onChange={(e) => setProfileFilter(e.target.value)}
                  className="h-10 pl-3 pr-8 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-[#2B7FFF] transition-colors"
                >
                  <option value="all">Profil</option>
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9CA3AF] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tickets grid */}
          {filteredTickets.length === 0 ? (
            <div className="rounded-2xl border border-[#E8ECF1] bg-white p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <Ticket className="h-8 w-8 text-[#D1D5DB] mx-auto mb-3" />
              <h3 className="text-base font-semibold text-[#1A1D26]">Aucun ticket trouvé</h3>
              <p className="mt-1 text-sm text-[#6B7280]">
                {searchQuery || statusFilter !== "all" || profileFilter !== "all"
                  ? "Aucun ticket ne correspond à vos filtres."
                  : "Générez vos premiers tickets WiFi pour commencer à vendre."}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E8ECF1] bg-[#FAFBFC]">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Code</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Profil</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Durée</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Prix</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Vendeur</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Statut</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F3F7]">
                    {filteredTickets.map((ticket) => {
                      const sc = statusConfig[ticket.status];
                      const Icon = sc.icon;
                      const profile = profiles.find((p) => p.id === ticket.profileId);
                      return (
                        <tr key={ticket.id} className="hover:bg-[#FAFBFC] transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold text-[#1A1D26] tracking-wider">{ticket.code}</span>
                              <button
                                onClick={() => copyCode(ticket.code)}
                                className="p-1 rounded hover:bg-[#F5F7FA] text-[#9CA3AF] hover:text-[#2B7FFF] transition-colors"
                              >
                                {copiedCode === ticket.code ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: profile?.color }} />
                              <span className="text-sm text-[#1A1D26]">{ticket.profileName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                              <Clock className="h-3 w-3" />
                              {durationLabels[ticket.duration]}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-semibold text-[#1A1D26]">{ticket.price.toLocaleString("fr-FR")} {currency}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-[#6B7280]">{ticket.assignedTo || "—"}</span>
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
                                onClick={() => setOpenMenu(openMenu === ticket.id ? null : ticket.id)}
                                className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                              {openMenu === ticket.id && (
                                <div className="absolute right-0 top-8 w-44 bg-white rounded-xl border border-[#E8ECF1] shadow-xl z-20 overflow-hidden">
                                  <button
                                    onClick={() => { setShowDetailModal(ticket); setOpenMenu(null); }}
                                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                                  >
                                    <Eye className="h-4 w-4 text-[#9CA3AF]" />
                                    Détails
                                  </button>
                                  <button
                                    onClick={() => { copyCode(ticket.code); setOpenMenu(null); }}
                                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                                  >
                                    <Copy className="h-4 w-4 text-[#9CA3AF]" />
                                    Copier le code
                                  </button>
                                  {ticket.status === "available" && (
                                    <button
                                      onClick={() => setOpenMenu(null)}
                                      className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                                    >
                                      <Share2 className="h-4 w-4 text-[#9CA3AF]" />
                                      Attribuer
                                    </button>
                                  )}
                                  <div className="border-t border-[#E8ECF1]" />
                                  <button
                                    onClick={() => deleteTicket(ticket.id)}
                                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Supprimer
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
                {filteredTickets.map((ticket) => {
                  const sc = statusConfig[ticket.status];
                  const Icon = sc.icon;
                  const profile = profiles.find((p) => p.id === ticket.profileId);
                  return (
                    <div key={ticket.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-[#1A1D26] tracking-wider">{ticket.code}</span>
                            <button onClick={() => copyCode(ticket.code)} className="p-1 rounded hover:bg-[#F5F7FA] text-[#9CA3AF]">
                              {copiedCode === ticket.code ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: profile?.color }} />
                            <span className="text-xs text-[#6B7280]">{ticket.profileName} · {durationLabels[ticket.duration]}</span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                          <Icon className="h-3 w-3" />
                          {sc.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#1A1D26]">{ticket.price.toLocaleString("fr-FR")} {currency}</span>
                        {ticket.assignedTo && <span className="text-[#9CA3AF]">{ticket.assignedTo}</span>}
                        <button
                          onClick={() => setShowDetailModal(ticket)}
                          className="text-[#2B7FFF] font-medium flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Détails
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Profiles Tab */}
      {activeTab === "profiles" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {profiles.map((profile) => {
            const ticketCount = tickets.filter((t) => t.profileId === profile.id).length;
            const availableCount = tickets.filter((t) => t.profileId === profile.id && t.status === "available").length;
            return (
              <div key={profile.id} className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-md hover:border-[#2B7FFF]/20 transition-all">
                <div className="h-2" style={{ backgroundColor: profile.color }} />
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${profile.color}15` }}>
                        <Ticket className="h-5 w-5" style={{ color: profile.color }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#1A1D26]">{profile.name}</h3>
                        <p className="text-xs text-[#9CA3AF]">{durationLabels[profile.duration]}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-[#1A1D26]">{profile.price.toLocaleString("fr-FR")} <span className="text-xs font-normal text-[#9CA3AF]">{currency}</span></span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-[#F1F3F7]">
                    <div>
                      <p className="text-[11px] text-[#9CA3AF]">Débit max</p>
                      <p className="text-xs font-medium text-[#1A1D26] mt-0.5">{profile.speedLimit}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#9CA3AF]">Appareils</p>
                      <p className="text-xs font-medium text-[#1A1D26] mt-0.5">{profile.deviceLimit} max</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#9CA3AF]">Tickets</p>
                      <p className="text-xs font-medium text-[#1A1D26] mt-0.5">{availableCount}/{ticketCount}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => { setGenerateForm({ profileId: profile.id, quantity: 10 }); setShowGenerateModal(true); }}
                    className="mt-4 w-full h-9 rounded-xl border border-[#E8ECF1] text-xs font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Générer des tickets
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowGenerateModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF1]">
              <div>
                <h3 className="text-lg font-semibold text-[#1A1D26]">Générer des tickets</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Choisissez un profil et la quantité</p>
              </div>
              <button onClick={() => setShowGenerateModal(false)} className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#1A1D26] mb-2">Profil de ticket</label>
                <div className="space-y-2">
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setGenerateForm({ ...generateForm, profileId: p.id })}
                      className={`flex items-center justify-between w-full p-3 rounded-xl border-2 transition-all ${
                        generateForm.profileId === p.id ? "border-[#2B7FFF] bg-[#EBF2FF]/30" : "border-[#E8ECF1] hover:border-[#D1D5DB]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
                        <div className="text-left">
                          <p className="text-sm font-medium text-[#1A1D26]">{p.name}</p>
                          <p className="text-[11px] text-[#9CA3AF]">{durationLabels[p.duration]} · {p.speedLimit}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#1A1D26]">{p.price.toLocaleString("fr-FR")} {currency}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1D26] mb-1.5">Quantité</label>
                <div className="flex items-center gap-3">
                  {[5, 10, 25, 50, 100].map((q) => (
                    <button
                      key={q}
                      onClick={() => setGenerateForm({ ...generateForm, quantity: q })}
                      className={`h-10 px-4 rounded-xl text-sm font-medium transition-all ${
                        generateForm.quantity === q
                          ? "bg-[#2B7FFF] text-white"
                          : "border border-[#E8ECF1] text-[#374151] hover:bg-[#F5F7FA]"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {selectedProfile && (
                <div className="rounded-xl bg-[#F5F7FA] p-4">
                  <p className="text-xs text-[#6B7280]">Récapitulatif</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-[#1A1D26]">{generateForm.quantity}x {selectedProfile.name}</span>
                    <span className="text-base font-bold text-[#1A1D26]">
                      {(selectedProfile.price * generateForm.quantity).toLocaleString("fr-FR")} {currency}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] mt-1">Valeur totale des tickets générés</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-[#E8ECF1] flex items-center justify-end gap-3">
              <button onClick={() => setShowGenerateModal(false)} className="h-10 px-5 rounded-xl border border-[#D1D5DB] text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors">
                Annuler
              </button>
              <button onClick={handleGenerate} className="h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors">
                Générer {generateForm.quantity} tickets
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDetailModal(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF1]">
              <h3 className="text-lg font-semibold text-[#1A1D26]">Détails du ticket</h3>
              <button onClick={() => setShowDetailModal(null)} className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5">
              {/* Ticket card visual */}
              <div className="rounded-xl p-5 text-center mb-5" style={{ backgroundColor: `${profiles.find((p) => p.id === showDetailModal.profileId)?.color}10` }}>
                <p className="font-mono text-2xl font-bold tracking-[0.2em] text-[#1A1D26]">{showDetailModal.code}</p>
                <button
                  onClick={() => copyCode(showDetailModal.code)}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#2B7FFF] hover:text-[#1A6BE6]"
                >
                  {copiedCode === showDetailModal.code ? <><Check className="h-3 w-3" /> Copié !</> : <><Copy className="h-3 w-3" /> Copier le code</>}
                </button>
              </div>

              <div className="space-y-3.5">
                {[
                  { label: "Profil", value: showDetailModal.profileName },
                  { label: "Durée", value: durationLabels[showDetailModal.duration] },
                  { label: "Prix", value: `${showDetailModal.price.toLocaleString("fr-FR")} {currency}` },
                  { label: "Créé le", value: showDetailModal.createdAt },
                  ...(showDetailModal.usedAt ? [{ label: "Utilisé le", value: showDetailModal.usedAt }] : []),
                  ...(showDetailModal.expiresAt ? [{ label: "Expire le", value: showDetailModal.expiresAt }] : []),
                  ...(showDetailModal.assignedTo ? [{ label: "Vendeur", value: showDetailModal.assignedTo }] : []),
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">{row.label}</span>
                    <span className="text-sm font-medium text-[#1A1D26]">{row.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Statut</span>
                  {(() => {
                    const sc = statusConfig[showDetailModal.status];
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
            </div>

            <div className="px-6 py-4 border-t border-[#E8ECF1] flex justify-end">
              <button onClick={() => setShowDetailModal(null)} className="h-9 px-4 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
