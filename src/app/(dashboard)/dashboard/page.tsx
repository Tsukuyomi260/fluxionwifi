"use client";

import { LinkedAccountsModal, ActivityLogModal } from "@/components/account/account-modals";
import { useUser } from "@/hooks/use-user";
import { useState } from "react";
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
  ChevronDown,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Handshake,
  Store,
  Coins,
  Percent,
  Wifi,
  ArrowLeftRight,
  MessageSquare,
  CreditCard,
  Calendar,
  Key,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navTabs = [
  { name: "Facturation", href: "/finance/billing", icon: Receipt },
  { name: "Portail Captif", href: "/portal", icon: Globe },
  { name: "Télécharger", href: "/downloads", icon: Download },
  { name: "Gestion Données", href: "/data", icon: Database },
  { name: "Comptes Associés", href: "#", icon: UsersRound, modal: "accounts" as const },
  { name: "Journal", href: "#", icon: BookText, modal: "journal" as const },
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
  const [navModal, setNavModal] = useState<null | "accounts" | "journal">(null);
  const { displayName: accountName } = useUser();
  const { currency } = useCurrency();
  const { tickets, profiles, loading: tl } = useTickets();
  const { routers, online, loading: rl } = useRouters();
  const { activeSessions, loading: sl } = useSessions();
  const { sellers, loading: sel } = useSellers();
  const { balance, loading: bl } = useTransactions();

  const [affiliationExpanded, setAffiliationExpanded] = useState(false);
  const [sellersExpanded, setSellersExpanded] = useState(false);

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
      href: "/account",
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

  /* Items défilants pour l'Affiliation */
  const affiliationTicker = [
    { icon: Users, label: "2 filleul(s)", color: "text-emerald-400" },
    { icon: Coins, label: `Gains: 0 ${currency}`, color: "text-emerald-300" },
    { icon: Percent, label: "10% commission", color: "text-emerald-400" },
    { icon: Wifi, label: "Portails", color: "text-slate-300" },
    { icon: ArrowLeftRight, label: "Transferts solde", color: "text-slate-300" },
    { icon: MessageSquare, label: "SMS OTP", color: "text-slate-300" },
    { icon: CreditCard, label: "Recharges crédits", color: "text-slate-300" },
    { icon: Calendar, label: "Abonnements", color: "text-slate-300" },
  ];

  /* Items défilants pour les Ventes Partenaires */
  const sellersTicker = [
    { icon: Store, label: "Boutiques, cabines, kiosques", color: "text-amber-300" },
    { icon: Ticket, label: `Stock confié : ${totalSellersStock} tickets`, color: "text-amber-400" },
    { icon: Users, label: `${activeSellers} revendeur${activeSellers > 1 ? "s" : ""} actif${activeSellers > 1 ? "s" : ""}`, color: "text-orange-300" },
    { icon: Flame, label: "Encaissement direct Mobile Money", color: "text-amber-300" },
    { icon: Percent, label: "Marges personnalisées", color: "text-orange-400" },
    { icon: Printer, label: "Impression rapide", color: "text-slate-300" },
  ];

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-gradient-to-b from-[#0F1E36] via-[#13223D] to-[#0B1526] p-4 lg:p-6 text-white">
      {/* Styles autonomes pour l'animation ticker fluide */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fluxionTickerScroll {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            .fluxion-ticker-track {
              display: flex !important;
              width: max-content !important;
              white-space: nowrap !important;
              will-change: transform;
              animation: fluxionTickerScroll 20s linear infinite !important;
            }
            .fluxion-ticker-track:hover {
              animation-play-state: paused !important;
            }
          `,
        }}
      />
      {/* 1. Bande Navigation Tabs : satinée, lisible et harmonisée */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none mb-4 bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-2xl p-1.5 shadow-sm">
        {navTabs.map((tab) => (
          tab.modal ? (
            <button key={tab.name} type="button" onClick={() => setNavModal(tab.modal)} className="flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all">
              <tab.icon className="h-4 w-4 text-[#5BA0FF] shrink-0" />
              {tab.name}
            </button>
          ) : (
           <Link
              key={tab.name}
              href={tab.href}
              className="flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all"
            >
              <tab.icon className="h-4 w-4 text-[#5BA0FF] shrink-0" />
              {tab.name}
            </Link>
            )
        ))}
      </div>

      {/* 2. Bande Déroulante / Animée : AFFILIATION */}
      <div className="mb-3 rounded-2xl bg-[#06241D] border border-emerald-500/30 text-white shadow-lg overflow-hidden transition-all duration-300">
        {/* En-tête cliquable avec Marquee animé */}
        <div
          onClick={() => setAffiliationExpanded(!affiliationExpanded)}
          className="flex items-center gap-3 px-4 sm:px-5 py-3 cursor-pointer select-none hover:bg-white/[0.03] transition-colors"
        >
          {/* Côté Gauche FIXE */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-xs">
              <Handshake className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">Affiliation</span>
            <span className="rounded-md bg-[#EF4444] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
              GAGNEZ
            </span>
          </div>

          {/* Centre DÉFILANT (Marquee ticker en boucle continue) */}
          <div className="relative flex-1 min-w-0 overflow-hidden mx-2 sm:mx-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#06241D] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#06241D] to-transparent z-10" />
            <div className="fluxion-ticker-track flex items-center gap-8 py-0.5">
              {/* Premier set */}
              {affiliationTicker.map((item, idx) => (
                <div key={`aff-1-${idx}`} className="flex items-center gap-2 shrink-0 text-xs">
                  <item.icon className={cn("h-3.5 w-3.5", item.color)} />
                  <span className={item.color}>{item.label}</span>
                  <span className="text-emerald-500/40 text-[10px] ml-2">●</span>
                </div>
              ))}
              {/* Deuxième set pour la boucle continue sans coupure */}
              {affiliationTicker.map((item, idx) => (
                <div key={`aff-2-${idx}`} className="flex items-center gap-2 shrink-0 text-xs">
                  <item.icon className={cn("h-3.5 w-3.5", item.color)} />
                  <span className={item.color}>{item.label}</span>
                  <span className="text-emerald-500/40 text-[10px] ml-2">●</span>
                </div>
              ))}
            </div>
          </div>

          {/* Côté Droit FIXE : Bouton Chevron animé */}
          <div className="shrink-0 pl-1">
            <div className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-emerald-400 transition-transform duration-300",
                  affiliationExpanded && "rotate-180"
                )}
              />
            </div>
          </div>
        </div>

        {/* Corps déroulé (Accordéon comme sur la capture) */}
        {affiliationExpanded && (
          <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-emerald-500/20 bg-black/20 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* 3 Cartes de métriques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="rounded-xl bg-white/[0.04] border border-emerald-500/20 p-4 text-center">
                <p className="text-2xl font-black text-emerald-400">2</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  FILLEUL(S)
                </p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-emerald-500/20 p-4 text-center">
                <p className="text-2xl font-black text-emerald-400">0 {currency}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  GAINS TOTAUX
                </p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-emerald-500/20 p-4 text-center">
                <p className="text-2xl font-black text-emerald-400">10%</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  COMMISSION
                </p>
              </div>
            </div>

            {/* Badges horizontaux */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              {[
                { label: "Recharges crédits", icon: CreditCard },
                { label: "Abonnements", icon: Calendar },
                { label: "Achats portails", icon: Wifi },
                { label: "Transferts solde", icon: ArrowLeftRight },
                { label: "Frais d'intégration", icon: Key },
                { label: "Recharges SMS OTP", icon: MessageSquare },
              ].map((pill) => (
                <span
                  key={pill.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs text-emerald-300"
                >
                  <pill.icon className="h-3 w-3 text-emerald-400" />
                  {pill.label}
                </span>
              ))}
            </div>

            {/* Explication */}
            <p className="text-center text-xs text-slate-300 max-w-2xl mx-auto mb-4 leading-relaxed">
              Partagez votre lien unique. Pour chaque inscription via votre lien, vous gagnez une commission sur{" "}
              <strong className="text-emerald-400">toutes les activités</strong> de vos filleuls.
            </p>

            {/* Bouton CTA vert émeraude éclatant */}
            <div className="max-w-md mx-auto mb-6">
              <Link
                href="/affiliation"
                className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all"
              >
                <span>🔗 Ouvrir mon espace affiliation</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Section Découvrir aussi */}
            <div className="pt-4 border-t border-white/10 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                DÉCOUVRIR AUSSI
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {[
                  { name: "Ventes partenaires", href: "/sellers" },
                  { name: "VPN accès distant", href: "/vpn" },
                  { name: "Santé du réseau", href: "/console/sessions" },
                  { name: "Interopérabilité", href: "/interop" },
                  { name: "Licence entreprise", href: "/finance/billing" },
                  { name: "Ticket d'assistance", href: "/support" },
                  { name: "Studio Visibilité", href: "/studio" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/15 text-[11px] text-slate-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bande Déroulante / Animée : VENTES PARTENAIRES */}
      <div className="mb-6 rounded-2xl bg-[#241508] border border-amber-500/30 text-white shadow-lg overflow-hidden transition-all duration-300">
        {/* En-tête cliquable avec Marquee animé */}
        <div
          onClick={() => setSellersExpanded(!sellersExpanded)}
          className="flex items-center gap-3 px-4 sm:px-5 py-3 cursor-pointer select-none hover:bg-white/[0.03] transition-colors"
        >
          {/* Côté Gauche FIXE */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="h-8 w-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-xs">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">Ventes partenaires</span>
            <span className="rounded-md bg-[#EA580C] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
              VENDEZ PLUS
            </span>
          </div>

          {/* Centre DÉFILANT (Marquee ticker en boucle continue) */}
          <div className="relative flex-1 min-w-0 overflow-hidden mx-2 sm:mx-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#241508] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#241508] to-transparent z-10" />
            <div className="fluxion-ticker-track flex items-center gap-8 py-0.5">
              {/* Premier set */}
              {sellersTicker.map((item, idx) => (
                <div key={`sel-1-${idx}`} className="flex items-center gap-2 shrink-0 text-xs">
                  <item.icon className={cn("h-3.5 w-3.5", item.color)} />
                  <span className={item.color}>{item.label}</span>
                  <span className="text-amber-500/40 text-[10px] ml-2">●</span>
                </div>
              ))}
              {/* Deuxième set pour la boucle continue */}
              {sellersTicker.map((item, idx) => (
                <div key={`sel-2-${idx}`} className="flex items-center gap-2 shrink-0 text-xs">
                  <item.icon className={cn("h-3.5 w-3.5", item.color)} />
                  <span className={item.color}>{item.label}</span>
                  <span className="text-amber-500/40 text-[10px] ml-2">●</span>
                </div>
              ))}
            </div>
          </div>

          {/* Côté Droit FIXE : Bouton Chevron animé */}
          <div className="shrink-0 pl-1">
            <div className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-amber-400 transition-transform duration-300",
                  sellersExpanded && "rotate-180"
                )}
              />
            </div>
          </div>
        </div>

        {/* Corps déroulé (Accordéon Vendeurs) */}
        {sellersExpanded && (
          <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-amber-500/20 bg-black/20 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* 3 Cartes de métriques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="rounded-xl bg-white/[0.04] border border-amber-500/20 p-4 text-center">
                <p className="text-2xl font-black text-amber-400">{activeSellers}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  VENDEUR(S) ACTIF(S)
                </p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-amber-500/20 p-4 text-center">
                <p className="text-2xl font-black text-amber-400">{totalSellersStock}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  TICKETS CONFIÉS
                </p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-amber-500/20 p-4 text-center">
                <p className="text-2xl font-black text-amber-400">100%</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  GESTION AUTONOME
                </p>
              </div>
            </div>

            {/* Badges horizontaux */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              {[
                { label: "Boutiques relais", icon: Store },
                { label: "Attribution de stock", icon: Ticket },
                { label: "Commissions sur marge", icon: Percent },
                { label: "Encaissement Mobile Money", icon: Wallet },
                { label: "Rapports journaliers", icon: Receipt },
                { label: "Impression rapide", icon: Printer },
              ].map((pill) => (
                <span
                  key={pill.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs text-amber-300"
                >
                  <pill.icon className="h-3 w-3 text-amber-400" />
                  {pill.label}
                </span>
              ))}
            </div>

            {/* Explication */}
            <p className="text-center text-xs text-slate-300 max-w-2xl mx-auto mb-4 leading-relaxed">
              Multipliez vos ventes en confiant des stocks de tickets WiFi à des boutiques, kiosques et gérants de cabines. Chaque vendeur encaisse directement et reverse vos gains.
            </p>

            {/* Bouton CTA orange éclatant */}
            <div className="max-w-md mx-auto mb-6">
              <Link
                href="/sellers"
                className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all"
              >
                <span>🏪 Gérer mes vendeurs & partenaires</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Section Découvrir aussi */}
            <div className="pt-4 border-t border-white/10 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                RACCOURCIS RAPIDES
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {[
                  { name: "Impression rapide", href: "/console/print" },
                  { name: "Stock & Utilisateurs", href: "/console/stock" },
                  { name: "Console Hotspot", href: "/console" },
                  { name: "Mon Solde", href: "/finance/balance" },
                  { name: "Sessions & Conso", href: "/console/sessions" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/15 text-[11px] text-slate-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grille des Cartes Blanches Contrastées */}
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
      {navModal === "accounts" && <LinkedAccountsModal currentName={accountName} onClose={() => setNavModal(null)} />}
      {navModal === "journal" && <ActivityLogModal onClose={() => setNavModal(null)} />}
    </div>
  );
}
