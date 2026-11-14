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
  Sparkles,
} from "lucide-react";

const navTabs = [
  { name: "Facturation", href: "/finance/billing", icon: Receipt },
  { name: "Portail Captif", href: "/portal", icon: Globe },
  { name: "Télécharger", href: "/downloads", icon: Download },
  { name: "Gestion Données", href: "/data", icon: Database },
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
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      badge: !bl && balance > 0 ? `${balance >= 1000 ? (balance / 1000).toFixed(1) + "k" : balance}` : null,
      badgeColor: "bg-emerald-500",
      subtitle: bl ? undefined : `Retirable : ${balance.toLocaleString("fr-FR")} ${currency}`,
      subtitleColor: "text-emerald-600 font-semibold",
    },
    {
      name: "Vente/Impression de Tickets",
      href: "/tickets",
      icon: Printer,
      iconBg: "bg-blue-50",
      iconColor: "text-[#2B7FFF]",
      badge: !tl && totalStock > 0 ? `${totalStock >= 1000 ? (totalStock / 1000).toFixed(1) + "k" : totalStock}` : null,
      badgeColor: "bg-[#2B7FFF]",
      subtitle: tl ? undefined : profiles.length > 0 ? `${profiles[0].name}: ${profiles[0].price?.toLocaleString("fr-FR")} ${currency}` : "Générer vos tickets",
      subtitleColor: "text-[#2B7FFF]",
    },
    {
      name: "Inventaire Vendeurs",
      href: "/sellers",
      icon: Users,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      badge: !sel && activeSellers > 0 ? `${activeSellers} actif${activeSellers > 1 ? "s" : ""}` : null,
      badgeColor: "bg-[#2B7FFF]",
      subtitle: sel ? undefined : `Stock confié : ${totalSellersStock} tickets`,
      subtitleColor: "text-amber-700",
    },
    {
      name: "Console",
      href: "/console",
      icon: Terminal,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      subtitle: "Tickets pré-créés : profils & ...",
      subtitleColor: "text-violet-600",
    },
    {
      name: "Administration Tickets",
      href: "/console/stock",
      icon: Ticket,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-600",
      badge: tl ? null : String(availableTickets),
      badgeColor: availableTickets > 0 ? "bg-emerald-500" : "bg-rose-500",
      subtitle: tl ? undefined : `Stock Total : ${availableTickets}`,
      subtitleColor: availableTickets > 0 ? "text-emerald-600 font-semibold" : "text-rose-600",
    },
    {
      name: "Mon Compte",
      href: "/settings",
      icon: UserCircle,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      subtitle: "Piloter les comptes administrateurs.",
      subtitleColor: "text-[#6B7280]",
    },
    {
      name: "Interopérabilité",
      href: "/interop",
      icon: Network,
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      subtitle: "Synchroniser plusieurs routeurs",
      subtitleColor: "text-cyan-700",
    },
    {
      name: "VPN accès distant",
      href: "/vpn",
      icon: Shield,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      subtitle: rl ? undefined : `${online} routeur${online !== 1 ? "s" : ""} connecté${online !== 1 ? "s" : ""}`,
      subtitleColor: "text-emerald-600",
    },
    {
      name: "Mon intégration",
      href: "/integration",
      icon: Plug,
      iconBg: "bg-blue-50",
      iconColor: "text-[#2B7FFF]",
      subtitle: "Integration : 8/10 · 80%",
      subtitleColor: "text-[#2B7FFF]",
    },
    {
      name: "Services & Boutique",
      href: "/services",
      icon: Wrench,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      subtitle: "Dépannage à distance",
      subtitleColor: "text-slate-500",
    },
    {
      name: "Studio Visibilité",
      href: "/studio",
      icon: Palette,
      iconBg: "bg-fuchsia-50",
      iconColor: "text-fuchsia-600",
      tag: "NOUVEAU",
      subtitle: "Affiches, bâches & vidéos",
      subtitleColor: "text-fuchsia-600",
    },
    {
      name: "Tutoriels",
      href: "/tutorials",
      icon: BookOpen,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      subtitle: "Guides vidéo et documentation",
      subtitleColor: "text-slate-500",
    },
  ];

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-gradient-to-b from-[#0F1E36] via-[#13223D] to-[#0B1526] p-4 lg:p-6 text-white">
      {/* 1. Bande Navigation Tabs : satinée, lisible et harmonisée */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none mb-4 bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-2xl p-1.5 shadow-sm">
        {navTabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className="flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all"
          >
            <tab.icon className="h-4 w-4 text-[#5BA0FF] shrink-0" />
            {tab.name}
          </Link>
        ))}
      </div>

      {/* 2. Bande Affiliation : Dégradé émeraude riche et raffiné */}
      <Link
        href="/affiliation"
        className="flex items-center gap-3 mb-3 rounded-2xl bg-gradient-to-r from-[#047857] via-[#059669] to-[#10B981] border border-emerald-400/30 px-5 py-3 text-white shadow-md hover:shadow-lg hover:brightness-105 transition-all overflow-x-auto scrollbar-none"
      >
        <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <Gift className="h-4 w-4" />
        </div>
        <span className="text-sm font-bold shrink-0">Affiliation</span>
        <span className="shrink-0 rounded-full bg-white/20 border border-white/30 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
          Gagnez
        </span>
        <span className="text-xs text-emerald-100 shrink-0 font-medium">Gains : 0 {currency}</span>
        <span className="text-xs text-emerald-200/90 shrink-0">✂ 10% commission</span>
        <div className="ml-auto shrink-0 pl-2">
          <ChevronDown className="h-4 w-4 text-white/70" />
        </div>
      </Link>

      {/* 3. Bande Ventes partenaires : Dégradé ambre/or chaleureux et satiné */}
      <Link
        href="/sellers"
        className="flex items-center gap-3 mb-6 rounded-2xl bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#F59E0B] border border-amber-400/30 px-5 py-3 text-white shadow-md hover:shadow-lg hover:brightness-105 transition-all overflow-x-auto scrollbar-none"
      >
        <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <TrendingUp className="h-4 w-4" />
        </div>
        <span className="text-sm font-bold shrink-0">Ventes partenaires</span>
        <span className="shrink-0 rounded-full bg-white/20 border border-white/30 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
          Vendez plus
        </span>
        <span className="text-xs text-amber-100 shrink-0 font-medium">Boutiques, cabines, kiosques</span>
        <span className="text-xs text-amber-200/90 shrink-0">Stock confié à chaque revendeur</span>
        <div className="ml-auto shrink-0 pl-2">
          <ChevronDown className="h-4 w-4 text-white/70" />
        </div>
      </Link>

      {/* Grille des Cartes : Cartes blanches lumineuses qui contrastent fortement avec le fond nuit */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="group relative flex flex-col justify-between rounded-2xl bg-white border border-[#E8ECF1] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.18)] hover:shadow-2xl hover:scale-[1.02] hover:border-[#2B7FFF]/50 transition-all duration-200"
          >
            {/* Badge de stock ou solde */}
            {card.badge && (
              <span
                className={`absolute -top-2.5 -right-2.5 z-10 inline-flex items-center justify-center min-w-[28px] h-7 rounded-full ${
                  card.badgeColor || "bg-[#2B7FFF]"
                } px-2.5 text-xs font-bold text-white shadow-md`}
              >
                {card.badge}
              </span>
            )}

            {/* Tag Nouveau */}
            {card.tag && (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-600 border border-purple-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                <Sparkles className="h-2.5 w-2.5" />
                {card.tag}
              </span>
            )}

            {/* Haut de la carte : Icône */}
            <div>
              <div
                className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${card.iconBg}`}
              >
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>

              {/* Titre */}
              <h3 className="text-center text-sm font-bold text-[#0B1E4D] group-hover:text-[#2B7FFF] transition-colors leading-snug">
                {card.name}
              </h3>
            </div>

            {/* Bas de la carte : Sous-titre */}
            <div className="mt-2.5 pt-2 border-t border-slate-100">
              {anyLoading && !card.subtitle ? (
                <div className="mx-auto h-3 w-20 rounded bg-slate-200 animate-pulse" />
              ) : card.subtitle ? (
                <p className={`text-center text-xs truncate ${card.subtitleColor || "text-[#6B7280]"}`}>
                  {card.subtitle}
                </p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
