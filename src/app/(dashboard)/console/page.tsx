"use client";

import { useState } from "react";
import Link from "next/link";
import { useCurrency } from "@/hooks/use-currency";
import { useTickets } from "@/hooks/use-tickets";
import { useRouters } from "@/hooks/use-routers";
import { useSessions } from "@/hooks/use-sessions";
import type { Router as RouterType } from "@/lib/supabase/types";
import {
  Ticket,
  Users,
  Layers,
  Router,
  Activity,
  TrendingUp,
  ArrowRight,
  Printer,
  Plus,
  Package,
  Wifi,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  RefreshCw,
  Loader2,
} from "lucide-react";

const quickActions = [
  { name: "Générer des tickets", href: "/tickets", icon: Plus, desc: "Créer de nouveaux tickets WiFi" },
  { name: "Impression rapide", href: "/console/print", icon: Printer, desc: "Imprimer vos tickets en lot" },
  { name: "Voir le stock", href: "/console/stock", icon: Package, desc: "Stock et utilisateurs actifs" },
  { name: "Sessions en cours", href: "/console/sessions", icon: Activity, desc: "Monitorer les connexions" },
];

export default function ConsoleDashboard() {
  const { currency } = useCurrency();
  const { tickets, profiles, loading: ticketsLoading } = useTickets();
  const { routers, loading: routersLoading, online } = useRouters();
  const { activeSessions, loading: sessionsLoading } = useSessions();

  const loading = ticketsLoading || routersLoading || sessionsLoading;

  const availableTickets = tickets.filter((t) => t.status === "available").length;
  const offlineRouters = routers.filter((r) => r.status === "offline");

  const stats = [
    {
      label: "Tickets en stock",
      value: String(availableTickets),
      sublabel: "disponibles",
      icon: Ticket,
      iconBg: "bg-blue-50",
      iconColor: "text-[#2B7FFF]",
    },
    {
      label: "Sessions actives",
      value: String(activeSessions.length),
      sublabel: "connectés maintenant",
      icon: Users,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      label: "Profils tarifaires",
      value: String(profiles.length),
      sublabel: "configurés",
      icon: Layers,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-500",
    },
    {
      label: "Routeurs en ligne",
      value: `${online}/${routers.length}`,
      sublabel: offlineRouters.length > 0 ? `${offlineRouters.length} hors ligne` : "tous connectés",
      icon: Router,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#2B7FFF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert banner for offline routers */}
      {offlineRouters.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              {offlineRouters.length} routeur{offlineRouters.length > 1 ? "s" : ""} hors ligne
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              {offlineRouters.map((r) => r.name).join(", ")}
            </p>
          </div>
          <Link
            href="/console/routers"
            className="text-xs font-medium text-amber-700 hover:text-amber-900 whitespace-nowrap"
          >
            Voir les routeurs →
          </Link>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-xl p-2.5 ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="mt-4 text-[28px] font-bold text-[#1A1D26]">{stat.value}</p>
            <p className="mt-0.5 text-[13px] text-[#6B7280]">
              {stat.label} · {stat.sublabel}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group flex items-center gap-3 rounded-2xl border border-[#E8ECF1] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#2B7FFF]/20 hover:shadow-md transition-all"
          >
            <div className="rounded-xl bg-[#2B7FFF]/10 p-2.5">
              <action.icon className="h-5 w-5 text-[#2B7FFF]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1A1D26]">{action.name}</p>
              <p className="text-xs text-[#6B7280] truncate">{action.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-[#D1D5DB] group-hover:text-[#2B7FFF] transition-colors shrink-0" />
          </Link>
        ))}
      </div>

      {/* Routeurs panel */}
      <div className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8ECF1]">
          <div className="flex items-center gap-2">
            <Router className="h-5 w-5 text-[#2B7FFF]" />
            <h3 className="text-base font-semibold text-[#1A1D26]">Routeurs MikroTik</h3>
          </div>
          <Link href="/console/routers" className="text-xs text-[#2B7FFF] hover:underline">
            Gérer les routeurs →
          </Link>
        </div>

        {routers.length === 0 ? (
          <div className="p-12 text-center">
            <Router className="h-8 w-8 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-sm text-[#6B7280]">Aucun routeur configuré</p>
            <Link href="/console/routers" className="text-xs text-[#2B7FFF] hover:underline mt-1 inline-block">
              Ajouter un routeur
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8ECF1] bg-[#FAFBFC]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Routeur</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Modèle</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Statut</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Clients</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Uptime</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">CPU / RAM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F7]">
                  {routers.map((r) => (
                    <tr key={r.id} className="hover:bg-[#FAFBFC] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-2 w-2 rounded-full ${r.status === "online" ? "bg-emerald-500" : r.status === "warning" ? "bg-amber-500" : "bg-red-500"}`} />
                          <div>
                            <p className="text-sm font-medium text-[#1A1D26]">{r.name}</p>
                            <p className="font-mono text-xs text-[#9CA3AF]">{r.ip_address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#6B7280]">{r.model ? `MikroTik ${r.model}` : "—"}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          r.status === "online" ? "bg-emerald-50 text-emerald-700"
                            : r.status === "warning" ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-600"
                        }`}>
                          {r.status === "online" ? (
                            <><CheckCircle2 className="h-3 w-3" />En ligne</>
                          ) : r.status === "warning" ? (
                            <><AlertTriangle className="h-3 w-3" />Attention</>
                          ) : (
                            <><AlertTriangle className="h-3 w-3" />Hors ligne</>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-[#1A1D26]">{r.clients_connected ?? 0}</span>
                        <span className="text-xs text-[#9CA3AF] ml-1">connecté{(r.clients_connected ?? 0) !== 1 ? "s" : ""}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#6B7280]">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {r.uptime || "—"}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {r.status === "online" ? (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-16 h-1.5 rounded-full bg-[#F1F3F7] overflow-hidden">
                                <div className="h-full rounded-full bg-[#2B7FFF]" style={{ width: `${r.cpu_usage ?? 0}%` }} />
                              </div>
                              <span className="text-[11px] text-[#6B7280]">{r.cpu_usage ?? 0}%</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-16 h-1.5 rounded-full bg-[#F1F3F7] overflow-hidden">
                                <div className="h-full rounded-full bg-violet-400" style={{ width: `${r.memory_usage ?? 0}%` }} />
                              </div>
                              <span className="text-[11px] text-[#6B7280]">{r.memory_usage ?? 0}%</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-[#9CA3AF]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-[#F1F3F7]">
              {routers.map((r) => (
                <div key={r.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-2.5 w-2.5 rounded-full ${r.status === "online" ? "bg-emerald-500" : r.status === "warning" ? "bg-amber-500" : "bg-red-500"}`} />
                      <div>
                        <p className="text-sm font-semibold text-[#1A1D26]">{r.name}</p>
                        <p className="font-mono text-xs text-[#9CA3AF]">{r.ip_address} · {r.model || "—"}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      r.status === "online" ? "bg-emerald-50 text-emerald-700"
                        : r.status === "warning" ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-600"
                    }`}>
                      {r.status === "online" ? "En ligne" : r.status === "warning" ? "Attention" : "Hors ligne"}
                    </span>
                  </div>
                  {r.status !== "offline" && (
                    <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                      <span>{r.clients_connected ?? 0} client{(r.clients_connected ?? 0) !== 1 ? "s" : ""}</span>
                      <span>Uptime: {r.uptime || "—"}</span>
                      <span>CPU: {r.cpu_usage ?? 0}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
