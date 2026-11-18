"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrency } from "@/hooks/use-currency";
import { useTickets } from "@/hooks/use-tickets";
import { useRouters } from "@/hooks/use-routers";
import { useSessions } from "@/hooks/use-sessions";
import {
  Ticket,
  Wifi,
  Layers,
  Router,
  AlertTriangle,
  RefreshCw,
  Clock,
  Loader2,
  ChevronDown,
  BarChart3,
  Globe,
  LayoutDashboard,
  Tag,
  PlusCircle,
  Users,
  Radio,
  Activity,
  Package,
  Network,
  Star,
  Shield,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";

type SidebarItem = { label: string; href: string; icon: import("lucide-react").LucideIcon; active?: boolean; badge?: boolean };

const SIDEBAR_SECTIONS: { label: string | null; items: SidebarItem[] }[] = [
  {
    label: null,
    items: [
      { label: "Tableau de bord", href: "/console", icon: LayoutDashboard, active: true },
    ],
  },
  {
    label: "HOTSPOT",
    items: [
      { label: "Profils tarifaires", href: "/console/stock", icon: Tag },
      { label: "Générer des tickets", href: "/tickets", icon: PlusCircle },
      { label: "Stock / Utilisateurs", href: "/console/stock", icon: Users },
      { label: "Tickets en ligne", href: "/console/sessions", icon: Radio, badge: true },
      { label: "Sessions & conso", href: "/console/sessions", icon: Activity },
    ],
  },
  {
    label: "INVENTAIRE",
    items: [
      { label: "Inventaire", href: "/console/stock", icon: Package },
    ],
  },
  {
    label: "RÉSEAU",
    items: [
      { label: "Routeurs", href: "/console/routers", icon: Router },
      { label: "Routeurs indépendants", href: "/console/routers", icon: Star },
      { label: "Tunnel MikHmon VPN", href: "/vpn", icon: Shield },
    ],
  },
];

export default function ConsoleDashboard() {
  const { currency } = useCurrency();
  const { tickets, profiles, loading: tl } = useTickets();
  const { routers, loading: rl, online } = useRouters();
  const { activeSessions, loading: sl } = useSessions();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const anyLoading = tl || rl || sl;
  const availableTickets = tickets.filter((t) => t.status === "available").length;
  const offlineRouters = routers.filter((r) => r.status === "offline");

  const stockByProfile = profiles.map((p) => {
    const profileTickets = tickets.filter((t) => t.profile_id === p.id);
    const stock = profileTickets.filter((t) => t.status === "available").length;
    const actifs = profileTickets.filter((t) => t.status === "active").length;
    const epuises = profileTickets.filter(
      (t) => t.status === "used" || t.status === "expired"
    ).length;
    return { name: p.name, stock, actifs, epuises };
  });

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-[#F3F4F6] flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen w-[240px] bg-[#1E293B] flex flex-col overflow-y-auto shrink-0 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar header */}
        <div className="px-5 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold">
            <span className="text-[#2B7FFF]">FLUXION</span>
            <span className="text-emerald-400"> CONSOLE</span>
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 px-3 pb-4 space-y-1">
          {SIDEBAR_SECTIONS.map((section, si) => (
            <div key={si}>
              {section.label && (
                <p className="px-3 pt-5 pb-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  {section.label}
                </p>
              )}
              {section.items.map((item) => {
                const isActive = item.active || pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#2B7FFF] text-white"
                        : "text-slate-300 hover:bg-[#334155] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {item.badge && !sl && activeSessions.length > 0 && (
                      <span className="ml-auto rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                        {activeSessions.length}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="bg-[#1F2937] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-white hover:bg-[#374151]"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold lg:hidden">
              <span className="text-[#2B7FFF]">FLUXION</span>
              <span className="text-emerald-400"> CONSOLE</span>
            </h1>
            <span className="hidden lg:inline text-sm text-slate-300">
              Tableau de bord
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="h-8 pl-3 pr-8 rounded-lg bg-[#374151] text-white text-xs appearance-none focus:outline-none min-w-[200px]">
                <option>Tous les routeurs (global)</option>
                {routers.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/60 pointer-events-none" />
            </div>
            <span className="text-xs font-semibold text-white bg-[#374151] px-3 py-1.5 rounded-lg hidden sm:inline">
              FLUXIONWIFI
            </span>
          </div>
        </div>

        {/* Portal alert banner */}
        <div className="mx-5 mt-4 flex items-center justify-between rounded-lg bg-amber-400 px-4 py-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-900" />
            <span className="text-sm font-semibold text-amber-900">
              Portail &agrave; publier
            </span>
            <span className="rounded bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white">
              1
            </span>
          </div>
          <Link
            href="/portal"
            className="text-xs font-semibold text-amber-900 hover:text-amber-700 flex items-center gap-1"
          >
            <Globe className="h-3.5 w-3.5" />
            Publier
            <ChevronDown className="h-3 w-3 -rotate-90" />
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mx-5 mt-4">
          <div className="rounded-xl bg-emerald-500 p-5 text-white relative overflow-hidden">
            <Ticket className="absolute -right-2 -bottom-2 h-16 w-16 text-white/10" />
            <p className="text-3xl font-bold">
              {tl ? (
                <span className="inline-block h-8 w-16 rounded bg-white/20 animate-pulse" />
              ) : (
                availableTickets
              )}
            </p>
            <p className="text-sm mt-1 text-emerald-100">Tickets en stock</p>
          </div>
          <div className="rounded-xl bg-orange-500 p-5 text-white relative overflow-hidden">
            <Wifi className="absolute -right-2 -bottom-2 h-16 w-16 text-white/10" />
            <p className="text-3xl font-bold">
              {sl ? (
                <span className="inline-block h-8 w-12 rounded bg-white/20 animate-pulse" />
              ) : (
                activeSessions.length
              )}
            </p>
            <p className="text-sm mt-1 text-orange-100">Sessions actives</p>
          </div>
          <div className="rounded-xl bg-violet-500 p-5 text-white relative overflow-hidden">
            <Layers className="absolute -right-2 -bottom-2 h-16 w-16 text-white/10" />
            <p className="text-3xl font-bold">
              {tl ? (
                <span className="inline-block h-8 w-10 rounded bg-white/20 animate-pulse" />
              ) : (
                profiles.length
              )}
            </p>
            <p className="text-sm mt-1 text-violet-100">Profils</p>
          </div>
          <div className="rounded-xl bg-amber-500 p-5 text-white relative overflow-hidden">
            <Router className="absolute -right-2 -bottom-2 h-16 w-16 text-white/10" />
            <p className="text-3xl font-bold">
              {rl ? (
                <span className="inline-block h-8 w-10 rounded bg-white/20 animate-pulse" />
              ) : (
                online
              )}
            </p>
            <p className="text-sm mt-1 text-amber-100">Routeurs en ligne</p>
          </div>
        </div>

        {/* Main content — two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-5 mt-4 pb-6">
          {/* Left column (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Traffic chart placeholder */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#6B7280]" />
                  <h3 className="text-sm font-semibold text-[#1A1D26]">
                    Trafic clients (agrégé via RADIUS)
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  0 Mbps
                </span>
              </div>
              <div className="h-48 flex items-center justify-center rounded-lg bg-[#F9FAFB] border border-dashed border-[#E5E7EB]">
                <p className="text-sm text-[#9CA3AF]">
                  Graphique de trafic en temps réel
                </p>
              </div>
              <p className="text-[11px] text-[#9CA3AF] mt-2">
                Débit déduit des compteurs d&apos;accounting RADIUS
                (granularité = interim-update).
              </p>
            </div>

            {/* Journal de connexion */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#6B7280]" />
                  <h3 className="text-sm font-semibold text-[#1A1D26]">
                    Journal de connexion (RADIUS)
                  </h3>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF]">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#F1F3F7] bg-[#FAFBFC]">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#6B7280]">
                        Heure
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#6B7280]">
                        Utilisateur
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#6B7280]">
                        IP / MAC
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#6B7280]">
                        Événement
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F3F7]">
                    {sl ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center">
                          <Loader2 className="h-5 w-5 animate-spin text-[#2B7FFF] mx-auto" />
                        </td>
                      </tr>
                    ) : activeSessions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-6 text-center text-sm text-[#9CA3AF]"
                        >
                          Aucune session récente.
                        </td>
                      </tr>
                    ) : (
                      activeSessions.slice(0, 10).map((s) => (
                        <tr
                          key={s.id}
                          className="hover:bg-[#FAFBFC] transition-colors"
                        >
                          <td className="px-4 py-2.5 text-xs text-[#6B7280] whitespace-nowrap">
                            {new Date(s.started_at).toLocaleString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-4 py-2.5 text-xs font-bold text-[#1A1D26]">
                            {s.device_name || s.device_mac || "—"}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-[#6B7280] font-mono">
                            {s.ip_address || "—"}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-[#6B7280]">
                            {s.ended_at
                              ? "déconnecté"
                              : "connecté (session active)"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column (1/3) */}
          <div className="space-y-4">
            {/* Routeurs panel */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <Router className="h-4 w-4 text-[#6B7280]" />
                  <h3 className="text-sm font-semibold text-[#1A1D26]">
                    Routeurs
                  </h3>
                </div>
                <button className="p-1 rounded hover:bg-[#F3F4F6] text-[#9CA3AF]">
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="divide-y divide-[#F1F3F7]">
                {rl ? (
                  <div className="p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-[#2B7FFF] mx-auto" />
                  </div>
                ) : routers.length === 0 ? (
                  <div className="p-6 text-center text-sm text-[#9CA3AF]">
                    Aucun routeur.
                  </div>
                ) : (
                  routers.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-start gap-2.5 px-4 py-3 hover:bg-[#FAFBFC] transition-colors"
                    >
                      <div
                        className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${
                          r.status === "online"
                            ? "bg-emerald-500"
                            : r.status === "warning"
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1A1D26] truncate">
                          {r.name}
                        </p>
                        <p className="text-[11px] text-[#9CA3AF]">
                          {r.model ? `ROS ${r.model}` : "—"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[11px] text-[#9CA3AF]">
                          {r.status === "online" ? "il y a" : ""}
                        </p>
                        <p className="text-[11px] text-[#9CA3AF]">
                          {r.status === "online" ? "1s" : "hors ligne"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Stock par profil */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#6B7280]" />
                  <h3 className="text-sm font-semibold text-[#1A1D26]">
                    Stock par profil
                  </h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#F1F3F7] bg-[#FAFBFC]">
                      <th className="text-left px-4 py-2 text-xs font-semibold text-[#6B7280]">
                        Profil
                      </th>
                      <th className="text-right px-4 py-2 text-xs font-semibold text-[#6B7280]">
                        Stock
                      </th>
                      <th className="text-right px-4 py-2 text-xs font-semibold text-emerald-500">
                        Actifs
                      </th>
                      <th className="text-right px-4 py-2 text-xs font-semibold text-red-500">
                        Épuisés
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F3F7]">
                    {tl ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-4 text-center">
                          <Loader2 className="h-4 w-4 animate-spin text-[#2B7FFF] mx-auto" />
                        </td>
                      </tr>
                    ) : stockByProfile.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-4 text-center text-xs text-[#9CA3AF]"
                        >
                          Aucun profil.
                        </td>
                      </tr>
                    ) : (
                      stockByProfile.map((sp) => (
                        <tr
                          key={sp.name}
                          className="hover:bg-[#FAFBFC] transition-colors"
                        >
                          <td className="px-4 py-2.5 text-xs font-medium text-[#1A1D26]">
                            {sp.name}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-right text-[#1A1D26] font-semibold">
                            {sp.stock}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-right text-emerald-600 font-medium">
                            {sp.actifs}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-right text-red-500 font-medium">
                            {sp.epuises}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
