"use client";

import Link from "next/link";
import { useCurrency } from "@/hooks/use-currency";
import { useTickets } from "@/hooks/use-tickets";
import { useRouters } from "@/hooks/use-routers";
import { useSessions } from "@/hooks/use-sessions";
import { useSellers } from "@/hooks/use-sellers";
import { useTransactions } from "@/hooks/use-transactions";
import {
  Wallet,
  Printer,
  Users,
  Terminal,
  Ticket,
  UserCircle,
  Network,
  Shield,
  Plug,
  Wrench,
  Palette,
  BookOpen,
  Receipt,
  Globe,
  Download,
  Database,
  UsersRound,
  BookText,
  Gift,
  ChevronDown,
  TrendingUp,
} from "lucide-react";

const navTabs = [
  { name: "Facturation", href: "/finance/billing", icon: Receipt },
  { name: "Portail Captif", href: "/portal", icon: Globe },
  { name: "Télécharger", href: "#", icon: Download },
  { name: "Gestion Données", href: "#", icon: Database },
  { name: "Comptes Associés", href: "/sellers", icon: UsersRound },
  { name: "Journal", href: "/finance/balance", icon: BookText },
];

interface DashCard {
  name: string;
  href: string;
  icon: typeof Wallet;
  iconBg: string;
  iconColor: string;
  badge?: string | null;
  badgeColor?: string;
  subtitle?: string;
  subtitleColor?: string;
  specialBg?: string;
  tag?: string;
}

export default function DashboardPage() {
  const { currency } = useCurrency();
  const { tickets, profiles, loading: tl } = useTickets();
  const { routers, online, loading: rl } = useRouters();
  const { activeSessions, loading: sl } = useSessions();
  const { sellers, loading: sel } = useSellers();
  const { balance, loading: bl } = useTransactions();

  const anyLoading = tl || rl || sl || sel || bl;

  const availableTickets = tickets.filter((t) => t.status === "available").length;
  const totalStock = tickets.length;
  const activeSellers = sellers.filter((s) => s.status === "active").length;
  const totalSellersStock = sellers.reduce((acc, s) => acc + (s.stock_remaining || 0), 0);

  const cards: DashCard[] = [
    {
      name: "Mon Solde",
      href: "/finance/balance",
      icon: Wallet,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
      badge: !bl && balance > 0 ? `${balance >= 1000 ? (balance / 1000).toFixed(1) + "k" : balance}` : null,
      badgeColor: "bg-emerald-500",
      subtitle: bl ? undefined : `Retirable : ${balance.toLocaleString("fr-FR")} ${currency}`,
      subtitleColor: "text-emerald-500",
    },
    {
      name: "Vente/Impression de Tickets",
      href: "/tickets",
      icon: Printer,
      iconBg: "bg-blue-100",
      iconColor: "text-[#2B7FFF]",
      badge: !tl && totalStock > 0 ? `${totalStock >= 1000 ? (totalStock / 1000).toFixed(1) + "k" : totalStock}` : null,
      badgeColor: "bg-emerald-500",
      subtitle: tl ? undefined : profiles.length > 0 ? `${profiles[0].name}: ${profiles[0].price?.toLocaleString("fr-FR")} ${currency}` : "Aucun profil",
      subtitleColor: "text-[#2B7FFF]",
    },
    {
      name: "Inventaire Vendeurs",
      href: "/sellers",
      icon: Users,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      badge: !sel && activeSellers > 0 ? String(activeSellers) : null,
      badgeColor: "bg-[#2B7FFF]",
      subtitle: sel ? undefined : `Stock confié : ${totalSellersStock} tickets`,
      subtitleColor: "text-amber-600",
    },
    {
      name: "Console",
      href: "/console",
      icon: Terminal,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      subtitle: `Tickets pré-créés : profils & ...`,
      subtitleColor: "text-violet-500",
    },
    {
      name: "Administration Tickets",
      href: "/console/stock",
      icon: Ticket,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      badge: tl ? null : String(availableTickets),
      badgeColor: availableTickets > 0 ? "bg-emerald-500" : "bg-red-500",
      subtitle: tl ? undefined : `Stock Total : ${availableTickets}`,
      subtitleColor: availableTickets > 0 ? "text-emerald-500" : "text-red-500",
    },
    {
      name: "Mon Compte",
      href: "/settings",
      icon: UserCircle,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-500",
      subtitle: "Piloter les comptes administrateurs.",
      subtitleColor: "text-[#6B7280]",
    },
    {
      name: "Interopérabilité",
      href: "/interop",
      icon: Network,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      subtitle: "Synchroniser plusieurs routeurs",
      subtitleColor: "text-cyan-600",
    },
    {
      name: "VPN accès distant",
      href: "/vpn",
      icon: Shield,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      subtitle: rl ? undefined : `${online} routeur${online !== 1 ? "s" : ""} connecté${online !== 1 ? "s" : ""}`,
      subtitleColor: "text-emerald-600",
    },
    {
      name: "Mon intégration",
      href: "/integration",
      icon: Plug,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-500",
      specialBg: "bg-violet-50 border-violet-200",
      subtitle: "Integration : 8/10 · 80%",
      subtitleColor: "text-violet-500",
    },
    {
      name: "Services & Boutique",
      href: "#",
      icon: Wrench,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-500",
      specialBg: "bg-[#1E293B] border-[#334155]",
      subtitle: "Dépannage à distance",
      subtitleColor: "text-slate-400",
    },
    {
      name: "Studio Visibilité",
      href: "/studio",
      icon: Palette,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-500",
      tag: "NOUVEAU",
      subtitle: "Affiches, bâches & vidéos",
      subtitleColor: "text-pink-500",
    },
    {
      name: "Tutoriels",
      href: "/tutorials",
      icon: BookOpen,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      subtitle: "Guides vidéo et documentation",
      subtitleColor: "text-red-500",
    },
  ];

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-[#1F2937] p-4 lg:p-6">
      {/* Navigation tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide mb-5 bg-[#374151] rounded-2xl p-1.5">
        {navTabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className="flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl text-[13px] font-medium text-slate-300 hover:text-white hover:bg-[#4B5563] transition-colors"
          >
            <tab.icon className="h-4 w-4 shrink-0" />
            {tab.name}
          </Link>
        ))}
      </div>

      {/* Affiliation banner */}
      <div className="flex items-center gap-3 mb-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-white overflow-x-auto">
        <Gift className="h-5 w-5 shrink-0" />
        <span className="text-sm font-semibold shrink-0">Affiliation</span>
        <span className="shrink-0 rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-bold uppercase">Gagnez</span>
        <span className="text-xs text-emerald-100 shrink-0">Gains : 0 {currency}</span>
        <span className="text-xs text-emerald-100 shrink-0">✂ 10% commission</span>
        <div className="ml-auto shrink-0">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {/* Ventes partenaires banner */}
      <div className="flex items-center gap-3 mb-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-white overflow-x-auto">
        <TrendingUp className="h-5 w-5 shrink-0" />
        <span className="text-sm font-semibold shrink-0">Ventes partenaires</span>
        <span className="shrink-0 rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-bold uppercase">Vendez plus</span>
        <span className="text-xs text-orange-100 shrink-0">Boutiques, cabines, kiosques</span>
        <span className="text-xs text-orange-100 shrink-0">Stock confié à chaque revendeur</span>
        <div className="ml-auto shrink-0">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {/* Cards grid — 4 columns */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className={`group relative rounded-2xl border p-5 transition-all hover:shadow-lg hover:scale-[1.02] ${
              card.specialBg || "bg-white border-[#E8ECF1]"
            }`}
          >
            {/* Badge */}
            {card.badge && (
              <span className={`absolute -top-2 -right-2 z-10 inline-flex items-center justify-center min-w-[28px] h-7 rounded-full ${card.badgeColor || "bg-emerald-500"} px-2 text-xs font-bold text-white shadow-md`}>
                {card.badge}
              </span>
            )}

            {/* Tag */}
            {card.tag && (
              <span className="absolute top-3 right-3 rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                {card.tag}
              </span>
            )}

            {/* Icon */}
            <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}>
              <card.icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>

            {/* Title */}
            <h3 className={`text-center text-sm font-semibold leading-tight ${
              card.specialBg?.includes("1E293B") ? "text-white" : "text-[#1A1D26]"
            }`}>
              {card.name}
            </h3>

            {/* Subtitle — skeleton or real */}
            {anyLoading && !card.subtitle ? (
              <div className="mt-2 mx-auto h-3 w-20 rounded bg-slate-200 animate-pulse" />
            ) : card.subtitle ? (
              <p className={`mt-1.5 text-center text-xs ${card.subtitleColor || "text-[#6B7280]"}`}>
                {card.subtitle}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
