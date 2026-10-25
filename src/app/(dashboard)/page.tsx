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
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Banknote,
  Activity,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

const stats = [
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
    value: "0 FCFA",
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

const modules = [
  {
    name: "Portail Captif",
    description: "Gérez vos pages de connexion WiFi",
    href: "/portal",
    icon: Globe,
    iconBg: "bg-blue-50",
    iconColor: "text-[#2B7FFF]",
  },
  {
    name: "Tickets",
    description: "Créez et gérez vos tickets WiFi",
    href: "/tickets",
    icon: Ticket,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    name: "Console RADIUS",
    description: "Administrez votre serveur RADIUS",
    href: "/console",
    icon: Terminal,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
  },
  {
    name: "Vendeurs",
    description: "Gérez votre équipe de vendeurs",
    href: "/sellers",
    icon: Users,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    name: "Mon Solde",
    description: "Consultez votre solde et transactions",
    href: "/finance/balance",
    icon: Wallet,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-500",
  },
  {
    name: "Facturation",
    description: "Gérez vos factures et paiements",
    href: "/finance/billing",
    icon: Receipt,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-500",
  },
  {
    name: "VPN",
    description: "Accès distant à vos routeurs",
    href: "/vpn",
    icon: Shield,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-500",
  },
  {
    name: "Interopérabilité",
    description: "Connectez vos agrégateurs de paiement",
    href: "/interop",
    icon: Network,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    name: "Studio",
    description: "Personnalisez vos portails captifs",
    href: "/studio",
    icon: Palette,
    iconBg: "bg-fuchsia-50",
    iconColor: "text-fuchsia-500",
  },
  {
    name: "Support",
    description: "Contactez l'équipe support",
    href: "/support",
    icon: HeadphonesIcon,
    iconBg: "bg-red-50",
    iconColor: "text-red-400",
  },
  {
    name: "Tutoriels",
    description: "Apprenez à utiliser la plateforme",
    href: "/tutorials",
    icon: BookOpen,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
  },
  {
    name: "Affiliation",
    description: "Gagnez 20% de commission",
    href: "/affiliation",
    icon: Gift,
    iconBg: "bg-lime-50",
    iconColor: "text-lime-600",
  },
];

const recentActivity = [
  { type: "Vente", detail: "Ticket 24h vendu", amount: "500 FCFA", time: "Il y a 2 min" },
  { type: "Connexion", detail: "Routeur MK-01 connecté", amount: null, time: "Il y a 15 min" },
  { type: "Vente", detail: "Ticket 1h vendu", amount: "200 FCFA", time: "Il y a 30 min" },
  { type: "Paiement", detail: "Paiement reçu via FedaPay", amount: "1 500 FCFA", time: "Il y a 1h" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-xl p-2.5 ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
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
            <p className="mt-4 text-[28px] font-bold text-[#1A1D26]">{stat.value}</p>
            <p className="mt-0.5 text-[13px] text-[#6B7280]">
              {stat.label} · {stat.sublabel}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-[#1A1D26]">Revenus de la semaine</h3>
              <p className="text-xs text-[#6B7280]">Suivi de vos ventes quotidiennes</p>
            </div>
            <select className="text-xs border border-[#E8ECF1] rounded-lg px-2.5 py-1.5 text-[#6B7280] bg-white">
              <option>Cette semaine</option>
              <option>Ce mois</option>
              <option>Cette année</option>
            </select>
          </div>
          <div className="flex items-end gap-3 h-48">
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
            <h3 className="text-base font-semibold text-[#1A1D26]">Activité récente</h3>
            <Link href="/finance/balance" className="text-xs text-primary hover:underline">
              Voir tout
            </Link>
          </div>
          <ul className="space-y-3">
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

      <div>
        <h3 className="mb-4 text-base font-semibold text-[#1A1D26]">Modules</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map((mod) => (
            <Link
              key={mod.name}
              href={mod.href}
              className="group rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-md hover:border-primary/30"
            >
              <div className="flex items-start justify-between">
                <div className={`rounded-xl p-2.5 ${mod.iconBg}`}>
                  <mod.icon className={`h-5 w-5 ${mod.iconColor}`} />
                </div>
                <ArrowRight className="h-4 w-4 text-[#D1D5DB] opacity-0 transition-all group-hover:opacity-100 group-hover:text-primary" />
              </div>
              <h4 className="mt-3 text-sm font-semibold text-[#1A1D26]">{mod.name}</h4>
              <p className="mt-1 text-xs text-[#6B7280]">{mod.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
