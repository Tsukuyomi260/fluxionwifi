"use client";

import { useState } from "react";
import Link from "next/link";
import { useCurrency } from "@/hooks/use-currency";
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
} from "lucide-react";

const stats = [
  {
    label: "Tickets en stock",
    value: "47",
    change: "+12",
    sublabel: "disponibles",
    icon: Ticket,
    iconBg: "bg-blue-50",
    iconColor: "text-[#2B7FFF]",
    color: "#2B7FFF",
  },
  {
    label: "Sessions actives",
    value: "5",
    change: "+2",
    sublabel: "connectés maintenant",
    icon: Users,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    color: "#10B981",
  },
  {
    label: "Profils tarifaires",
    value: "5",
    change: "",
    sublabel: "configurés",
    icon: Layers,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    color: "#8B5CF6",
  },
  {
    label: "Routeurs en ligne",
    value: "3/4",
    change: "1 hors ligne",
    sublabel: "connectés",
    icon: Router,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    color: "#F59E0B",
  },
];

const quickActions = [
  { name: "Générer des tickets", href: "/tickets", icon: Plus, desc: "Créer de nouveaux tickets WiFi" },
  { name: "Impression rapide", href: "/console/print", icon: Printer, desc: "Imprimer vos tickets en lot" },
  { name: "Voir le stock", href: "/console/stock", icon: Package, desc: "Stock et utilisateurs actifs" },
  { name: "Sessions en cours", href: "/console/sessions", icon: Activity, desc: "Monitorer les connexions" },
];

const trafficData = [
  { hour: "08h", download: 12, upload: 3 },
  { hour: "09h", download: 25, upload: 8 },
  { hour: "10h", download: 45, upload: 15 },
  { hour: "11h", download: 38, upload: 12 },
  { hour: "12h", download: 55, upload: 20 },
  { hour: "13h", download: 42, upload: 14 },
  { hour: "14h", download: 65, upload: 22 },
  { hour: "15h", download: 78, upload: 28 },
  { hour: "16h", download: 60, upload: 18 },
  { hour: "17h", download: 45, upload: 12 },
  { hour: "18h", download: 30, upload: 8 },
  { hour: "19h", download: 20, upload: 5 },
];

const maxTraffic = Math.max(...trafficData.map((d) => d.download));

interface DemoRouter {
  id: string;
  name: string;
  ip: string;
  model: string;
  status: "online" | "offline";
  sessions: number;
  uptime: string;
  cpu: number;
  memory: number;
}

const demoRouters: DemoRouter[] = [
  { id: "1", name: "MK-Café-01", ip: "192.168.88.1", model: "hAP ac²", status: "online", sessions: 2, uptime: "12j 4h", cpu: 23, memory: 45 },
  { id: "2", name: "MK-Hotel-03", ip: "192.168.88.2", model: "RB4011", status: "online", sessions: 2, uptime: "8j 15h", cpu: 15, memory: 38 },
  { id: "3", name: "MK-Campus-02", ip: "192.168.88.3", model: "hEX S", status: "online", sessions: 1, uptime: "3j 22h", cpu: 8, memory: 25 },
  { id: "4", name: "MK-Resto-04", ip: "192.168.88.4", model: "hAP lite", status: "offline", sessions: 0, uptime: "—", cpu: 0, memory: 0 },
];

function getRecentEvents(cur: string) {
  return [
    { type: "auth", text: "ticket-C7E901 connecté via MK-Café-01", time: "Il y a 2 min" },
    { type: "sale", text: `Ticket Standard vendu (500 ${cur})`, time: "Il y a 8 min" },
    { type: "disconnect", text: "ticket-9D2C4E déconnecté — temps écoulé", time: "Il y a 15 min" },
    { type: "auth", text: "ticket-8F3A2D connecté via MK-Café-01", time: "Il y a 32 min" },
    { type: "router", text: "MK-Resto-04 hors ligne", time: "Il y a 3h" },
    { type: "sale", text: `Ticket Journée vendu (1 000 ${cur})`, time: "Il y a 4h" },
  ];
}

const eventConfig: Record<string, { dot: string }> = {
  auth: { dot: "bg-emerald-500" },
  sale: { dot: "bg-[#2B7FFF]" },
  disconnect: { dot: "bg-amber-500" },
  router: { dot: "bg-red-500" },
};

export default function ConsoleDashboard() {
  const { currency } = useCurrency();
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }

  return (
    <div className="space-y-6">
      {/* Alert banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800">1 routeur hors ligne</p>
          <p className="text-xs text-amber-600 mt-0.5">MK-Resto-04 est injoignable depuis 3 heures</p>
        </div>
        <Link
          href="/console/routers"
          className="text-xs font-medium text-amber-700 hover:text-amber-900 whitespace-nowrap"
        >
          Voir les routeurs →
        </Link>
      </div>

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
              {stat.change && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </span>
              )}
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

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Traffic chart */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-[#1A1D26]">Trafic réseau</h3>
              <p className="text-xs text-[#6B7280]">RADIUS accounting — Aujourd'hui (Mbps)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#2B7FFF]" />
                  Download
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#2B7FFF]/30" />
                  Upload
                </span>
              </div>
              <button
                onClick={handleRefresh}
                className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF] transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
          <div className="flex items-end gap-2 h-52">
            {trafficData.map((d) => (
              <div key={d.hour} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-0.5" style={{ height: "200px" }}>
                  <div className="w-full flex-1 flex flex-col justify-end gap-0.5">
                    <div
                      className="w-full rounded-t bg-[#2B7FFF] transition-all hover:opacity-80"
                      style={{ height: `${(d.download / maxTraffic) * 100}%` }}
                    />
                    <div
                      className="w-full rounded-b bg-[#2B7FFF]/30"
                      style={{ height: `${(d.upload / maxTraffic) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-[#9CA3AF]">{d.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent events */}
        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#1A1D26]">Activité récente</h3>
            <Link href="/console/sessions" className="text-xs text-[#2B7FFF] hover:underline">
              Voir tout
            </Link>
          </div>
          <ul className="space-y-1">
            {getRecentEvents(currency).map((event, i) => {
              const ec = eventConfig[event.type] || eventConfig.auth;
              return (
                <li key={i} className="flex items-start gap-3 py-2.5 border-b border-[#F1F3F7] last:border-0">
                  <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${ec.dot}`} />
                  <div className="min-w-0">
                    <p className="text-sm text-[#1A1D26] leading-snug">{event.text}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{event.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
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

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8ECF1] bg-[#FAFBFC]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Routeur</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Modèle</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Statut</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Sessions</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Uptime</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">CPU / RAM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F7]">
              {demoRouters.map((r) => (
                <tr key={r.id} className="hover:bg-[#FAFBFC] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-2 w-2 rounded-full ${r.status === "online" ? "bg-emerald-500" : "bg-red-500"}`} />
                      <div>
                        <p className="text-sm font-medium text-[#1A1D26]">{r.name}</p>
                        <p className="font-mono text-xs text-[#9CA3AF]">{r.ip}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#6B7280]">MikroTik {r.model}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      r.status === "online" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                    }`}>
                      {r.status === "online" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      {r.status === "online" ? "En ligne" : "Hors ligne"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-medium text-[#1A1D26]">{r.sessions}</span>
                    <span className="text-xs text-[#9CA3AF] ml-1">active{r.sessions !== 1 ? "s" : ""}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#6B7280]">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {r.uptime}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {r.status === "online" ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1.5 rounded-full bg-[#F1F3F7] overflow-hidden">
                            <div className="h-full rounded-full bg-[#2B7FFF]" style={{ width: `${r.cpu}%` }} />
                          </div>
                          <span className="text-[11px] text-[#6B7280]">{r.cpu}%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1.5 rounded-full bg-[#F1F3F7] overflow-hidden">
                            <div className="h-full rounded-full bg-violet-400" style={{ width: `${r.memory}%` }} />
                          </div>
                          <span className="text-[11px] text-[#6B7280]">{r.memory}%</span>
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
          {demoRouters.map((r) => (
            <div key={r.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`h-2.5 w-2.5 rounded-full ${r.status === "online" ? "bg-emerald-500" : "bg-red-500"}`} />
                  <div>
                    <p className="text-sm font-semibold text-[#1A1D26]">{r.name}</p>
                    <p className="font-mono text-xs text-[#9CA3AF]">{r.ip} · {r.model}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  r.status === "online" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                }`}>
                  {r.status === "online" ? "En ligne" : "Hors ligne"}
                </span>
              </div>
              {r.status === "online" && (
                <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                  <span>{r.sessions} session{r.sessions !== 1 ? "s" : ""}</span>
                  <span>Uptime: {r.uptime}</span>
                  <span>CPU: {r.cpu}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
