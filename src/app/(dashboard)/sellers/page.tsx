"use client";

import { useState } from "react";
import { useCurrency } from "@/hooks/use-currency";
import {
  Users,
  Plus,
  Search,
  ChevronDown,
  Phone,
  MapPin,
  Ticket,
  Package,
  TrendingUp,
  MoreHorizontal,
  X,
  Eye,
  Edit3,
  Power,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Banknote,
  BarChart3,
  UserPlus,
  AlertTriangle,
} from "lucide-react";

type SellerStatus = "active" | "inactive" | "suspended";

interface Seller {
  id: string;
  name: string;
  phone: string;
  location: string;
  status: SellerStatus;
  joinedAt: string;
  commission: number;
  totalAssigned: number;
  totalSold: number;
  totalRevenue: number;
  stockRemaining: number;
  lastActive: string;
  avatar: string;
}

const statusConfig: Record<SellerStatus, { label: string; bg: string; text: string; dot: string }> = {
  active: { label: "Actif", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  inactive: { label: "Inactif", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  suspended: { label: "Suspendu", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
};

const demoSellers: Seller[] = [
  {
    id: "1", name: "Patrick Mboma", phone: "+243 812 345 678", location: "Gombe, Kinshasa",
    status: "active", joinedAt: "15 mars 2026", commission: 15, totalAssigned: 120,
    totalSold: 98, totalRevenue: 48500, stockRemaining: 22, lastActive: "Il y a 5 min",
    avatar: "PM",
  },
  {
    id: "2", name: "Grace Landu", phone: "+243 823 456 789", location: "Lingwala, Kinshasa",
    status: "active", joinedAt: "02 avril 2026", commission: 15, totalAssigned: 85,
    totalSold: 71, totalRevenue: 35200, stockRemaining: 14, lastActive: "Il y a 20 min",
    avatar: "GL",
  },
  {
    id: "3", name: "David Kasongo", phone: "+243 834 567 890", location: "Matete, Kinshasa",
    status: "active", joinedAt: "18 mai 2026", commission: 10, totalAssigned: 60,
    totalSold: 45, totalRevenue: 22000, stockRemaining: 15, lastActive: "Il y a 1h",
    avatar: "DK",
  },
  {
    id: "4", name: "Sarah Mbuyi", phone: "+243 845 678 901", location: "Lemba, Kinshasa",
    status: "inactive", joinedAt: "10 juin 2026", commission: 10, totalAssigned: 40,
    totalSold: 32, totalRevenue: 15800, stockRemaining: 8, lastActive: "Il y a 3j",
    avatar: "SM",
  },
  {
    id: "5", name: "Jean Kalala", phone: "+243 856 789 012", location: "Barumbu, Kinshasa",
    status: "suspended", joinedAt: "22 juillet 2026", commission: 15, totalAssigned: 25,
    totalSold: 10, totalRevenue: 5000, stockRemaining: 0, lastActive: "Il y a 2 sem",
    avatar: "JK",
  },
];

interface StockAssignment {
  id: string;
  sellerName: string;
  profile: string;
  profileColor: string;
  quantity: number;
  date: string;
  type: "assign" | "return";
}

const recentAssignments: StockAssignment[] = [
  { id: "1", sellerName: "Patrick Mboma", profile: "Standard", profileColor: "#2B7FFF", quantity: 20, date: "Aujourd'hui, 14:30", type: "assign" },
  { id: "2", sellerName: "Grace Landu", profile: "Express", profileColor: "#F59E0B", quantity: 15, date: "Aujourd'hui, 11:00", type: "assign" },
  { id: "3", sellerName: "David Kasongo", profile: "Journée", profileColor: "#10B981", quantity: 10, date: "Hier, 16:45", type: "assign" },
  { id: "4", sellerName: "Patrick Mboma", profile: "Express", profileColor: "#F59E0B", quantity: 5, date: "Hier, 09:20", type: "return" },
  { id: "5", sellerName: "Sarah Mbuyi", profile: "Standard", profileColor: "#2B7FFF", quantity: 8, date: "Il y a 3j", type: "assign" },
];

interface TicketProfile {
  id: string;
  name: string;
  color: string;
  available: number;
}

const ticketProfiles: TicketProfile[] = [
  { id: "1", name: "Express (1h)", color: "#F59E0B", available: 8 },
  { id: "2", name: "Standard (3h)", color: "#2B7FFF", available: 15 },
  { id: "3", name: "Journée (24h)", color: "#10B981", available: 12 },
  { id: "4", name: "Semaine (7j)", color: "#8B5CF6", available: 8 },
  { id: "5", name: "Mensuel (30j)", color: "#EC4899", available: 4 },
];

type ViewTab = "list" | "assignments";

export default function SellersPage() {
  const { currency, phonePrefix } = useCurrency();
  const [sellers, setSellers] = useState(demoSellers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SellerStatus>("all");
  const [viewTab, setViewTab] = useState<ViewTab>("list");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState<Seller | null>(null);
  const [assignProfile, setAssignProfile] = useState("");
  const [assignQty, setAssignQty] = useState(10);

  const filtered = sellers.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeSellers = sellers.filter((s) => s.status === "active").length;
  const totalRevenue = sellers.reduce((s, v) => s + v.totalRevenue, 0);
  const totalSold = sellers.reduce((s, v) => s + v.totalSold, 0);
  const lowStock = sellers.filter((s) => s.stockRemaining <= 5 && s.status === "active");

  function toggleStatus(id: string) {
    setSellers((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: (s.status === "active" ? "inactive" : "active") as SellerStatus }
          : s
      )
    );
    setOpenMenu(null);
  }

  function openAssign(seller: Seller) {
    setAssignTarget(seller);
    setAssignProfile("");
    setAssignQty(10);
    setShowAssignModal(true);
    setOpenMenu(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1A1D26]">Vendeurs</h2>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Gérez votre équipe de revendeurs et leur stock de tickets
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#2B7FFF]/90 transition-colors shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          Ajouter un vendeur
        </button>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">Stock bas</p>
            <p className="text-xs text-amber-600 mt-0.5">
              {lowStock.map((s) => s.name).join(", ")} — moins de 5 tickets restants
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5"><Users className="h-5 w-5 text-[#2B7FFF]" /></div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D26]">{activeSellers}/{sellers.length}</p>
              <p className="text-xs text-[#6B7280]">Vendeurs actifs</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5"><Banknote className="h-5 w-5 text-emerald-500" /></div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D26]">{totalRevenue.toLocaleString()} {currency}</p>
              <p className="text-xs text-[#6B7280]">Revenus vendeurs (total)</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-2.5"><Ticket className="h-5 w-5 text-violet-500" /></div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D26]">{totalSold}</p>
              <p className="text-xs text-[#6B7280]">Tickets vendus (total)</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-2.5"><Package className="h-5 w-5 text-orange-500" /></div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D26]">{sellers.reduce((s, v) => s + v.stockRemaining, 0)}</p>
              <p className="text-xs text-[#6B7280]">Tickets en stock (vendeurs)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#F5F7FA] rounded-xl p-1 w-fit">
        <button
          onClick={() => setViewTab("list")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewTab === "list" ? "bg-white text-[#1A1D26] shadow-sm" : "text-[#6B7280] hover:text-[#1A1D26]"
          }`}
        >
          <Users className="h-4 w-4" />
          Vendeurs
        </button>
        <button
          onClick={() => setViewTab("assignments")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewTab === "assignments" ? "bg-white text-[#1A1D26] shadow-sm" : "text-[#6B7280] hover:text-[#1A1D26]"
          }`}
        >
          <Send className="h-4 w-4" />
          Attributions
        </button>
      </div>

      {/* Vendors list tab */}
      {viewTab === "list" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, téléphone, localisation..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20 transition-colors"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="h-10 pl-4 pr-10 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] appearance-none focus:outline-none focus:border-[#2B7FFF] transition-colors"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="suspended">Suspendu</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
            </div>
          </div>

          {/* Desktop table */}
          <div className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8ECF1] bg-[#FAFBFC]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Vendeur</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Localisation</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Statut</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Stock</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Vendus</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Revenus</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Commission</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F7]">
                  {filtered.map((seller) => {
                    const sc = statusConfig[seller.status];
                    return (
                      <tr key={seller.id} className="hover:bg-[#FAFBFC] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-[#2B7FFF]/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-semibold text-[#2B7FFF]">{seller.avatar}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#1A1D26]">{seller.name}</p>
                              <p className="text-xs text-[#9CA3AF]">{seller.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                            <MapPin className="h-3 w-3" />
                            {seller.location}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm font-semibold ${seller.stockRemaining <= 5 ? "text-amber-600" : "text-[#1A1D26]"}`}>
                              {seller.stockRemaining}
                            </span>
                            {seller.stockRemaining <= 5 && seller.status === "active" && (
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs">
                            <span className="font-medium text-[#1A1D26]">{seller.totalSold}</span>
                            <span className="text-[#9CA3AF]"> / {seller.totalAssigned}</span>
                          </div>
                          <div className="w-20 h-1.5 rounded-full bg-[#F1F3F7] mt-1 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${seller.totalAssigned > 0 ? (seller.totalSold / seller.totalAssigned) * 100 : 0}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-[#1A1D26]">
                          {seller.totalRevenue.toLocaleString()} {currency}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold text-[#2B7FFF]">{seller.commission}%</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={() => setOpenMenu(openMenu === seller.id ? null : seller.id)}
                              className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {openMenu === seller.id && (
                              <div className="absolute right-0 top-8 w-52 bg-white rounded-xl border border-[#E8ECF1] shadow-xl z-20 overflow-hidden">
                                <button
                                  onClick={() => { setSelectedSeller(seller); setOpenMenu(null); }}
                                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                                >
                                  <Eye className="h-4 w-4 text-[#9CA3AF]" />
                                  Détails
                                </button>
                                <button
                                  onClick={() => openAssign(seller)}
                                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                                >
                                  <Send className="h-4 w-4 text-[#9CA3AF]" />
                                  Attribuer du stock
                                </button>
                                <button
                                  onClick={() => setOpenMenu(null)}
                                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                                >
                                  <Edit3 className="h-4 w-4 text-[#9CA3AF]" />
                                  Modifier
                                </button>
                                <button
                                  onClick={() => toggleStatus(seller.id)}
                                  className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm transition-colors ${
                                    seller.status === "active" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                                  }`}
                                >
                                  <Power className="h-4 w-4" />
                                  {seller.status === "active" ? "Désactiver" : "Activer"}
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
              {filtered.map((seller) => {
                const sc = statusConfig[seller.status];
                return (
                  <div key={seller.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#2B7FFF]/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-[#2B7FFF]">{seller.avatar}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1A1D26]">{seller.name}</p>
                          <p className="text-xs text-[#9CA3AF]">{seller.phone}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                      <MapPin className="h-3 w-3" />
                      {seller.location}
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#F1F3F7]">
                      <div>
                        <p className="text-[11px] text-[#9CA3AF]">Stock</p>
                        <p className={`text-sm font-semibold ${seller.stockRemaining <= 5 ? "text-amber-600" : "text-[#1A1D26]"}`}>
                          {seller.stockRemaining}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#9CA3AF]">Vendus</p>
                        <p className="text-sm font-semibold text-[#1A1D26]">{seller.totalSold}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#9CA3AF]">Revenus</p>
                        <p className="text-sm font-semibold text-[#1A1D26]">{seller.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => openAssign(seller)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2B7FFF] hover:text-[#2B7FFF]/80"
                      >
                        <Send className="h-3 w-3" />
                        Attribuer
                      </button>
                      <button
                        onClick={() => setSelectedSeller(seller)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1A1D26]"
                      >
                        <Eye className="h-3 w-3" />
                        Détails
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="p-12 text-center">
                <Users className="h-8 w-8 text-[#D1D5DB] mx-auto mb-3" />
                <p className="text-sm text-[#6B7280]">Aucun vendeur trouvé</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assignments tab */}
      {viewTab === "assignments" && (
        <div className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8ECF1]">
            <h3 className="text-sm font-semibold text-[#1A1D26]">Historique des attributions</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">Suivi des stocks attribués et retournés</p>
          </div>
          <div className="divide-y divide-[#F1F3F7]">
            {recentAssignments.map((a) => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFBFC] transition-colors">
                <div className={`rounded-xl p-2 ${a.type === "assign" ? "bg-emerald-50" : "bg-amber-50"}`}>
                  {a.type === "assign" ? (
                    <Send className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Package className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1A1D26]">
                    <span className="font-medium">{a.sellerName}</span>
                    {a.type === "assign" ? " — " : " — retour de "}
                    <span className="font-semibold">{a.quantity}</span> tickets
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ backgroundColor: a.profileColor + "15", color: a.profileColor }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: a.profileColor }} />
                      {a.profile}
                    </span>
                    <span className="text-xs text-[#9CA3AF]">{a.date}</span>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${a.type === "assign" ? "text-emerald-600" : "text-amber-600"}`}>
                  {a.type === "assign" ? "+" : "−"}{a.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seller detail modal */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedSeller(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF1]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#2B7FFF]/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-[#2B7FFF]">{selectedSeller.avatar}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1A1D26]">{selectedSeller.name}</h3>
                  <p className="text-xs text-[#9CA3AF]">Vendeur depuis {selectedSeller.joinedAt}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSeller(null)} className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: "Téléphone", value: selectedSeller.phone },
                { label: "Localisation", value: selectedSeller.location },
                { label: "Commission", value: `${selectedSeller.commission}%` },
                { label: "Dernière activité", value: selectedSeller.lastActive },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">{row.label}</span>
                  <span className="text-sm font-medium text-[#1A1D26]">{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Statut</span>
                {(() => {
                  const sc = statusConfig[selectedSeller.status];
                  return (
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>
                  );
                })()}
              </div>

              <div className="pt-3 border-t border-[#F1F3F7]">
                <h4 className="text-sm font-semibold text-[#1A1D26] mb-3">Performance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#F5F7FA] p-3 text-center">
                    <p className="text-lg font-bold text-[#1A1D26]">{selectedSeller.totalSold}</p>
                    <p className="text-[11px] text-[#6B7280]">Tickets vendus</p>
                  </div>
                  <div className="rounded-xl bg-[#F5F7FA] p-3 text-center">
                    <p className="text-lg font-bold text-[#1A1D26]">{selectedSeller.totalRevenue.toLocaleString()}</p>
                    <p className="text-[11px] text-[#6B7280]">Revenus ({currency})</p>
                  </div>
                  <div className="rounded-xl bg-[#F5F7FA] p-3 text-center">
                    <p className="text-lg font-bold text-[#1A1D26]">{selectedSeller.stockRemaining}</p>
                    <p className="text-[11px] text-[#6B7280]">Stock restant</p>
                  </div>
                  <div className="rounded-xl bg-[#F5F7FA] p-3 text-center">
                    <p className="text-lg font-bold text-[#1A1D26]">
                      {selectedSeller.totalAssigned > 0
                        ? Math.round((selectedSeller.totalSold / selectedSeller.totalAssigned) * 100)
                        : 0}%
                    </p>
                    <p className="text-[11px] text-[#6B7280]">Taux de vente</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#E8ECF1] flex justify-end gap-3">
              <button
                onClick={() => { openAssign(selectedSeller); setSelectedSeller(null); }}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#2B7FFF]/90 transition-colors"
              >
                <Send className="h-4 w-4" />
                Attribuer du stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add seller modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF1]">
              <h3 className="text-lg font-semibold text-[#1A1D26]">Ajouter un vendeur</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Nom complet</label>
                <input type="text" placeholder="Ex: Patrick Mboma" className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Téléphone</label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center h-10 px-3 rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] text-sm text-[#6B7280]">{phonePrefix}</span>
                  <input type="tel" placeholder="812 345 678" className="flex-1 h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Localisation</label>
                <input type="text" placeholder="Ex: Gombe, Kinshasa" className="w-full h-10 px-4 rounded-xl border border-[#E8ECF1] bg-white text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Taux de commission</label>
                <div className="flex items-center gap-3">
                  {[10, 15, 20].map((c) => (
                    <button
                      key={c}
                      className="h-10 px-5 rounded-xl border border-[#E8ECF1] text-sm font-medium text-[#374151] hover:border-[#2B7FFF]/30 transition-colors"
                    >
                      {c}%
                    </button>
                  ))}
                  <input
                    type="number"
                    min={1}
                    max={50}
                    placeholder="%"
                    className="h-10 w-20 px-3 rounded-xl border border-[#E8ECF1] text-sm text-center text-[#1A1D26] focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#E8ECF1] flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="h-10 px-5 rounded-xl border border-[#E8ECF1] text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors">
                Annuler
              </button>
              <button className="h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#2B7FFF]/90 transition-colors">
                Créer le vendeur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign stock modal */}
      {showAssignModal && assignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAssignModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF1]">
              <div>
                <h3 className="text-lg font-semibold text-[#1A1D26]">Attribuer du stock</h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Vers : {assignTarget.name}</p>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Profil tarifaire</label>
                <div className="space-y-2">
                  {ticketProfiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setAssignProfile(p.id)}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border text-left transition-all ${
                        assignProfile === p.id
                          ? "border-[#2B7FFF] bg-[#2B7FFF]/5 ring-1 ring-[#2B7FFF]/20"
                          : "border-[#E8ECF1] hover:border-[#2B7FFF]/30"
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="flex-1 text-sm font-medium text-[#1A1D26]">{p.name}</span>
                      <span className="text-xs text-[#9CA3AF]">{p.available} dispo</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Quantité</label>
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 25, 50].map((q) => (
                    <button
                      key={q}
                      onClick={() => setAssignQty(q)}
                      className={`h-10 px-5 rounded-xl text-sm font-medium transition-all ${
                        assignQty === q
                          ? "bg-[#2B7FFF] text-white"
                          : "border border-[#E8ECF1] text-[#374151] hover:border-[#2B7FFF]/30"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={assignQty}
                    onChange={(e) => setAssignQty(Math.max(1, Number(e.target.value)))}
                    className="h-10 w-20 px-3 rounded-xl border border-[#E8ECF1] text-sm text-center text-[#1A1D26] focus:outline-none focus:border-[#2B7FFF]"
                  />
                </div>
              </div>
              {assignProfile && (
                <div className="rounded-xl bg-[#F5F7FA] p-4">
                  <p className="text-sm text-[#1A1D26]">
                    <span className="font-semibold">{assignQty}</span> tickets{" "}
                    <span className="font-semibold">{ticketProfiles.find((p) => p.id === assignProfile)?.name}</span>
                    {" → "}<span className="font-semibold">{assignTarget.name}</span>
                  </p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-[#E8ECF1] flex justify-end gap-3">
              <button onClick={() => setShowAssignModal(false)} className="h-10 px-5 rounded-xl border border-[#E8ECF1] text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors">
                Annuler
              </button>
              <button
                disabled={!assignProfile}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#2B7FFF]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                Attribuer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
