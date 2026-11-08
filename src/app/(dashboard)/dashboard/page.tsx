"use client";

import {
  Globe,
  Ticket,
  Terminal,
  Users,
  Wallet,
  Receipt,
  Shield,
  Network,
  Palette,
  HeadphonesIcon,
  BookOpen,
  Gift,
  TrendingUp,
  TrendingDown,
  Banknote,
  Activity,
  ShoppingCart,
  Printer,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/hooks/use-currency";

function getStats(cur: string) {
  return [
    {
      label: "Ventes aujourd'hui",
      value: "0",
      change: "+0%",
      trend: "up" as const,
      sublabel: "vs hier",
      icon: ShoppingCart,
      iconBg: "bg-blue-50",
      iconColor: "text-[#2B7FFF]",
    },
    {
      label: "Revenu du mois",
      value: `0 ${cur}`,
      change: "+0%",
      trend: "up" as const,
      sublabel: "vs mois dernier",
      icon: Banknote,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      label: "Tickets actifs",
      value: "0",
      change: "+0%",
      trend: "up" as const,
      sublabel: "en cours",
      icon: Ticket,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-500",
    },
    {
      label: "Routeurs en ligne",
      value: "0",
      change: "0%",
      trend: "down" as const,
      sublabel: "connectés",
      icon: Activity,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
  ];
}

const navTabs = [
  { name: "Facturation", href: "/finance/billing", icon: Receipt },
  { name: "Portail Captif", href: "/portal", icon: Globe },
  { name: "Interopérabilité", href: "/interop", icon: Network },
  { name: "Services Connectés", href: "/vpn", icon: Shield },
  { name: "Comptes Associés", href: "/sellers", icon: Users },
  { name: "Studio", href: "/studio", icon: Palette },
  { name: "Support", href: "/support", icon: HeadphonesIcon },
  { name: "Tutoriels", href: "/tutorials", icon: BookOpen },
  { name: "Affiliation", href: "/affiliation", icon: Gift },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

const quickActions = [
  {
    name: "Mon Solde",
    href: "/finance/balance",
    icon: Wallet,
    gradient: "from-[#2B7FFF] to-[#0B1E4D]",
  },
  {
    name: "Vente / Impression\nde Tickets",
    href: "/console/print",
    icon: Printer,
    gradient: "from-orange-500 to-red-500",
  },
  {
    name: "Inventé / Clé\nVendeurs",
    href: "/sellers",
    icon: Users,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    name: "Système\nConsole",
    href: "/console",
    icon: Terminal,
    gradient: "from-violet-500 to-purple-700",
  },
];

function getRecentActivity(cur: string) {
  return [
    { type: "Vente", detail: "Ticket 24h vendu", amount: `500 ${cur}`, time: "Il y a 2 min" },
    { type: "Connexion", detail: "Routeur MK-01 connecté", amount: null as string | null, time: "Il y a 15 min" },
    { type: "Vente", detail: "Ticket 1h vendu", amount: `200 ${cur}`, time: "Il y a 30 min" },
    { type: "Paiement", detail: "Paiement reçu via FedaPay", amount: `1 500 ${cur}`, time: "Il y a 1h" },
  ];
}

export default function DashboardPage() {
  const { currency } = useCurrency();
  const stats = getStats(currency);
  const recentActivity = getRecentActivity(currency);

  return (
    <div className="space-y-5">
      {/* Navigation bar - compact horizontal tabs like EVISIONS CONNECT */}
      <div className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          {navTabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className="flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-[13px] font-medium text-[#6B7280] hover:text-[#2B7FFF] hover:bg-blue-50/50 transition-colors border-r border-[#F1F3F7] last:border-r-0"
            >
              <tab.icon className="h-3.5 w-3.5 shrink-0" />
              {tab.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Quick action tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className={`group relative rounded-2xl bg-gradient-to-br ${action.gradient} p-5 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
            <action.icon className="h-8 w-8 mb-3 opacity-90" />
            <p className="text-sm font-semibold leading-tight whitespace-pre-line">{action.name}</p>
          </Link>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#E8ECF1] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-xl p-2 ${stat.iconBg}`}>
                <stat.icon className={`h-4.5 w-4.5 ${stat.iconColor}`} />
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  stat.trend === "up"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-[#1A1D26]">{stat.value}</p>
            <p className="mt-0.5 text-[12px] text-[#6B7280]">
              {stat.label} · {stat.sublabel}
            </p>
          </div>
        ))}
      </div>

      {/* Charts + Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-[#1A1D26]">Revenus de la semaine</h3>
              <p className="text-xs text-[#6B7280]">Suivi de vos ventes quotidiennes</p>
            </div>
            <select className="text-xs border border-[#E8ECF1] rounded-lg px-2.5 py-1.5 text-[#6B7280] bg-white">
              <option>Cette semaine</option>
              <option>Ce mois</option>
              <option>Cette année</option>
            </select>
          </div>
          <div className="flex items-end gap-3 h-44">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => {
              const heights = [40, 65, 45, 80, 55, 70, 30];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-lg bg-[#2B7FFF] opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${heights[i]}%` }}
                  />
                  <span className="text-[11px] text-[#6B7280]">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#1A1D26]">Activité récente</h3>
            <Link href="/finance/balance" className="text-xs text-primary hover:underline">
              Voir tout
            </Link>
          </div>
          <ul className="space-y-2.5">
            {recentActivity.map((item, i) => (
              <li key={i} className="flex items-center justify-between py-2 border-b border-[#F1F3F7] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#1A1D26]">{item.detail}</p>
                  <p className="text-xs text-[#6B7280]">{item.time}</p>
                </div>
                {item.amount && (
                  <span className="text-sm font-semibold text-emerald-600">+{item.amount}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
