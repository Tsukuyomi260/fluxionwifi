"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Receipt,
  Wallet,
  Plus,
  CreditCard,
  Shield,
  Globe,
  Network,
  Radio,
  Zap,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Download,
  Smartphone,
  Crown,
  Star,
  ArrowRight,
  Bell,
  RefreshCw,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  Ticket,
  Terminal,
} from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";

type TabId = "overview" | "subscribe" | "active" | "history";

interface ActiveService {
  id: string;
  name: string;
  description: string;
  icon: typeof Shield;
  iconBg: string;
  iconColor: string;
  price: number;
  period: string;
  expiresAt: string;
  daysLeft: number;
  autoRenew: boolean;
}

interface BillingEvent {
  id: string;
  type: "recharge" | "debit" | "refund";
  label: string;
  description: string;
  amount: number;
  date: string;
  time: string;
  status: "completed" | "pending" | "failed";
  receiptUrl?: string;
}

const activeServices: ActiveService[] = [
  {
    id: "srv-001",
    name: "Formule Pro",
    description: "5 routeurs, tickets illimités, VPN inclus",
    icon: Crown,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    price: 15000,
    period: "/mois",
    expiresAt: "15 Nov 2026",
    daysLeft: 18,
    autoRenew: true,
  },
  {
    id: "srv-002",
    name: "Espace VPN",
    description: "3 tunnels WireGuard + 1 SSTP",
    icon: Shield,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    price: 500,
    period: "/mois",
    expiresAt: "15 Nov 2026",
    daysLeft: 18,
    autoRenew: true,
  },
  {
    id: "srv-003",
    name: "Portail Premium",
    description: "Modèle Business avec logo personnalisé",
    icon: Globe,
    iconBg: "bg-blue-50",
    iconColor: "text-[#2B7FFF]",
    price: 1000,
    period: "à vie",
    expiresAt: "—",
    daysLeft: -1,
    autoRenew: false,
  },
];

const billingHistory: BillingEvent[] = [
  { id: "bh-001", type: "recharge", label: "Recharge Mobile Money", description: "Via MTN MoMo", amount: 20000, date: "25 Oct 2026", time: "14:30", status: "completed" },
  { id: "bh-002", type: "debit", label: "Renouvellement Formule Pro", description: "Abonnement mensuel", amount: 15000, date: "15 Oct 2026", time: "00:01", status: "completed", receiptUrl: "#" },
  { id: "bh-003", type: "debit", label: "Renouvellement Espace VPN", description: "3 tunnels WireGuard + 1 SSTP", amount: 500, date: "15 Oct 2026", time: "00:01", status: "completed", receiptUrl: "#" },
  { id: "bh-004", type: "recharge", label: "Recharge Mobile Money", description: "Via Moov Money", amount: 10000, date: "10 Oct 2026", time: "09:15", status: "completed" },
  { id: "bh-005", type: "debit", label: "Achat Portail Premium", description: "Modèle Business", amount: 1000, date: "5 Oct 2026", time: "16:40", status: "completed", receiptUrl: "#" },
  { id: "bh-006", type: "recharge", label: "Recharge FedaPay", description: "Carte Visa", amount: 30000, date: "1 Oct 2026", time: "11:00", status: "completed" },
  { id: "bh-007", type: "debit", label: "Renouvellement Formule Pro", description: "Abonnement mensuel", amount: 15000, date: "15 Sep 2026", time: "00:01", status: "completed", receiptUrl: "#" },
];

const plans = [
  {
    name: "Starter",
    price: 0,
    period: "",
    description: "Pour démarrer",
    features: ["1 routeur", "100 tickets/mois", "1 portail captif", "Support email"],
    current: false,
    highlighted: false,
  },
  {
    name: "Pro",
    price: 15000,
    period: "/mois",
    description: "Pour les opérateurs actifs",
    features: ["5 routeurs", "Tickets illimités", "Portails personnalisés", "VPN inclus", "Gestion vendeurs", "Support prioritaire"],
    current: true,
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: 0,
    period: "",
    priceLabel: "Sur mesure",
    description: "Grandes organisations",
    features: ["Routeurs illimités", "API complète", "Console RADIUS", "Multi-sites", "Account manager", "SLA garanti"],
    current: false,
    highlighted: false,
  },
];

const SHOP: { title: string; dot: string; items: { name: string; sub: string; icon: typeof Shield; bg: string; fg: string; included?: boolean; href?: string }[] }[] = [
  {
    title: "FORMULE DE LA PLATEFORME", dot: "bg-[#10206B]",
    items: [
      { name: "Abonnement", sub: "3 887 / mois", icon: Calendar, bg: "bg-slate-100", fg: "text-slate-700", included: true },
      { name: "Crédit plateforme", sub: "10 % par vente", icon: CreditCard, bg: "bg-violet-50", fg: "text-violet-600" },
    ],
  },
  {
    title: "CAPACITÉS À DÉBLOQUER", dot: "bg-emerald-500",
    items: [
      { name: "Ventes partenaires", sub: "Comprise", icon: Ticket, bg: "bg-violet-50", fg: "text-violet-600", included: true },
      { name: "Vente par Mobile Money", sub: "Comprise", icon: Smartphone, bg: "bg-emerald-50", fg: "text-emerald-600", included: true },
      { name: "Espaces interopérabilité", sub: "dès 5 054 / mois", icon: Network, bg: "bg-emerald-50", fg: "text-emerald-600" },
      { name: "Espaces VPN", sub: "dès 1 944 / mois", icon: Radio, bg: "bg-cyan-50", fg: "text-cyan-600" },
      { name: "Espaces antennes", sub: "1 166 / antenne", icon: Zap, bg: "bg-rose-50", fg: "text-rose-500" },
    ],
  },
  {
    title: "OPTIONS ET CONSOMMABLES", dot: "bg-amber-500",
    items: [
      { name: "Portails captifs", sub: "dès 3 887", icon: Globe, bg: "bg-amber-50", fg: "text-amber-600", href: "/portal" },
      { name: "Tutoriels techniques", sub: "dès 3 887", icon: Star, bg: "bg-teal-50", fg: "text-teal-600", href: "/tutorials" },
      { name: "FLUXION Studio", sub: "Aucune commande à régler", icon: Zap, bg: "bg-pink-50", fg: "text-pink-600", href: "/studio" },
      { name: "Sous-domaine du portail", sub: "Inclus", icon: Globe, bg: "bg-cyan-50", fg: "text-cyan-600", included: true },
      { name: "Crédits d'assistance", sub: "0 crédit(s)", icon: Zap, bg: "bg-violet-50", fg: "text-violet-600" },
      { name: "Crédits Ticket SMS", sub: "10 crédit(s)", icon: Bell, bg: "bg-sky-50", fg: "text-sky-600" },
    ],
  },
  {
    title: "LICENCES", dot: "bg-rose-500",
    items: [
      { name: "Identité", sub: "194 367 / an", icon: Crown, bg: "bg-amber-50", fg: "text-amber-600" },
      { name: "Services", sub: "dès 116 620 / an", icon: Shield, bg: "bg-blue-50", fg: "text-blue-600" },
      { name: "Intégrale", sub: "dès 279 889 / an", icon: Crown, bg: "bg-violet-50", fg: "text-violet-600" },
    ],
  },
];

const addons = [
  { id: "addon-vpn", name: "Espace VPN", description: "Tunnels WireGuard & SSTP supplémentaires", icon: Shield, iconBg: "bg-violet-50", iconColor: "text-violet-500", price: 500, period: "/mois" },
  { id: "addon-portal", name: "Portail Premium", description: "Débloquez un modèle de portail captif premium à vie", icon: Globe, iconBg: "bg-blue-50", iconColor: "text-[#2B7FFF]", price: 1000, period: "unique" },
  { id: "addon-interop", name: "Interopérabilité", description: "Ajoutez des routeurs au réseau multi-sites", icon: Network, iconBg: "bg-amber-50", iconColor: "text-amber-500", price: 1300, period: "/mois" },
  { id: "addon-antenna", name: "Espace antenne", description: "Antennes LAN pilotables à distance (1 an)", icon: Radio, iconBg: "bg-teal-50", iconColor: "text-teal-500", price: 300, period: "/an" },
];

export default function BillingPage() {
  const { currency, format } = useCurrency();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [shopNote, setShopNote] = useState<string | null>(null);
  const router = useRouter();

  const billingBalance = 13500;
  const currentPlan = "Pro";
  const nextRenewal = "15 Nov 2026";
  const totalPaidThisMonth = 15500;

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "subscribe", label: "Souscrire" },
    { id: "active", label: "Droits actifs" },
    { id: "history", label: "Historique" },
  ];

  const menu: { section: string; items: { id?: TabId; label: string; icon: typeof Receipt; href?: string; badge?: number }[] }[] = [
    { section: "FACTURATION", items: [{ id: "overview", label: "Vue d'ensemble", icon: Receipt }, { id: "subscribe", label: "Souscrire & payer", icon: CreditCard }] },
    { section: "SUIVI", items: [{ id: "active", label: "Mes droits actifs", icon: Star, badge: activeServices.length }, { id: "history", label: "Historique & reçus", icon: FileText }] },
    { section: "AILLEURS", items: [{ label: "Retraits (Mon Solde)", icon: Wallet, href: "/finance/balance" }, { label: "Studio Visibilité", icon: Zap, href: "/studio" }] },
  ];

  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] bg-[#F1F3F7] lg:-m-6">
      <aside className="hidden w-[230px] shrink-0 bg-[#1B2336] text-slate-300 lg:block">
        <div className="border-b border-white/10 px-5 py-4 text-[20px] font-extrabold text-white">
          FLUXION <span className="text-amber-400">FACTURATION</span>
        </div>
        <nav className="p-2">
          {menu.map((g) => (
            <div key={g.section}>
              <p className="px-3 pb-1 pt-5 text-[12px] font-semibold uppercase tracking-wide text-slate-400">{g.section}</p>
              {g.items.map((it) =>
                it.href ? (
                  <Link key={it.label} href={it.href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] hover:bg-white/5">
                    <it.icon className="h-4 w-4" /> {it.label}
                  </Link>
                ) : (
                  <button
                    key={it.label}
                    onClick={() => setActiveTab(it.id!)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[15px] ${activeTab === it.id ? "bg-[#17307A] text-white" : "hover:bg-white/5"}`}
                  >
                    <it.icon className="h-4 w-4" /> <span className="flex-1">{it.label}</span>
                    {it.badge ? <span className="rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">{it.badge}</span> : null}
                  </button>
                ),
              )}
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between bg-gradient-to-r from-[#10206B] to-[#1B3A9E] px-4 text-white">
          <span className="text-[15px]">Facturation</span>
          <div className="flex items-center gap-4 text-sm">
            <span className="rounded bg-white/10 px-2 py-0.5 text-xs font-semibold">{billingBalance.toLocaleString("fr-FR")} {currency}</span>
            <Link href="/dashboard" aria-label="Quitter la facturation"><X className="h-4 w-4" /></Link>
          </div>
        </header>

        <div className="lg:hidden flex gap-1 overflow-x-auto bg-white p-2">
          {menu.flatMap((g) => g.items).filter((i) => i.id).map((i) => (
            <button key={i.id} onClick={() => setActiveTab(i.id!)} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${activeTab === i.id ? "bg-[#17307A] text-white" : "text-[#6B7280]"}`}>{i.label}</button>
          ))}
        </div>

        <div className="flex-1 space-y-6 p-4 lg:p-6">
          <h1 className="text-[28px] font-medium text-[#1A1D26]">
            {activeTab === "overview" ? "Vue d'ensemble" : activeTab === "subscribe" ? "Souscrire & payer" : activeTab === "active" ? "Mes droits actifs" : "Historique & reçus"}
          </h1>

      {/* === TAB: Vue d'ensemble === */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          {/* Balance + plan card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0B1E4D] via-[#122B66] to-[#1A3A7A] p-6 text-white relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#2B7FFF]/15 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-[#2B7FFF]/10 blur-2xl" />
            <div className="relative z-10 grid gap-6 sm:grid-cols-4">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Solde disponible</p>
                <p className="text-3xl font-bold">{format(billingBalance)}</p>
                <button
                  onClick={() => setShowRechargeModal(true)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#2B7FFF] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1A6BE6] transition-colors"
                >
                  <Plus className="h-3 w-3" /> Recharger
                </button>
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Formule</p>
                <p className="text-xl font-bold">{currentPlan}</p>
                <p className="text-xs text-white/50 mt-1">{format(15000)}{currency === currency ? "/mois" : ""}</p>
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Prochaine échéance</p>
                <p className="text-xl font-bold">{nextRenewal}</p>
                <p className="text-xs text-white/50 mt-1">Renouvellement auto</p>
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Réglé ce mois</p>
                <p className="text-xl font-bold">{format(totalPaidThisMonth)}</p>
                <p className="text-xs text-white/50 mt-1">2 paiement(s)</p>
              </div>
            </div>
            {/* Breakdown toggle */}
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="mt-4 flex items-center gap-1 text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              {showBreakdown ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              D&apos;où vient ce montant
            </button>
            {showBreakdown && (
              <div className="mt-3 pt-3 border-t border-white/10 grid gap-2 sm:grid-cols-3 text-xs text-white/60">
                <div className="flex justify-between"><span>Recharges</span><span className="text-emerald-300">+{format(20000)}</span></div>
                <div className="flex justify-between"><span>Formule Pro</span><span className="text-orange-300">-{format(15000)}</span></div>
                <div className="flex justify-between"><span>Espace VPN</span><span className="text-orange-300">-{format(500)}</span></div>
              </div>
            )}
          </div>

          {/* Alerts */}
          <div className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#6B7280]" />
                <h3 className="text-sm font-semibold text-[#1A1D26]">Échéances et alertes</h3>
              </div>
              <span className="text-xs text-[#9CA3AF]">1 à traiter</span>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">Renouvellement dans 18 jours</p>
                <p className="text-xs text-amber-600 mt-0.5">Formule Pro + Espace VPN seront débités le 15 Nov ({format(15500)}). Solde actuel : {format(billingBalance)}.</p>
              </div>
              <button className="text-xs font-medium text-[#2B7FFF] hover:underline shrink-0">Voir</button>
            </div>
          </div>

          {/* What you pay */}
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="h-4 w-4 text-[#6B7280]" />
                <h3 className="text-sm font-semibold text-[#1A1D26]">Ce que vous payez</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F1F3F7]">
                    <th className="text-left text-xs font-medium text-[#9CA3AF] pb-2.5">Service</th>
                    <th className="text-left text-xs font-medium text-[#9CA3AF] pb-2.5">Détails</th>
                    <th className="text-right text-xs font-medium text-[#9CA3AF] pb-2.5">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {activeServices.filter(s => s.autoRenew).map((s) => (
                    <tr key={s.id} className="border-b border-[#F1F3F7] last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`rounded-lg p-1.5 ${s.iconBg}`}>
                            <s.icon className={`h-3.5 w-3.5 ${s.iconColor}`} />
                          </div>
                          <span className="text-sm font-medium text-[#1A1D26]">{s.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-xs text-[#6B7280]">{s.description}</td>
                      <td className="py-3 text-right text-sm font-medium text-[#1A1D26]">{format(s.price)}{s.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* How balance works */}
            <div className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
              <h3 className="text-sm font-semibold text-[#1A1D26] mb-4">Comment fonctionne votre solde</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-50 p-1.5 mt-0.5">
                    <Zap className="h-3.5 w-3.5 text-[#2B7FFF]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1D26]">Paiement par solde immédiat</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Le montant est débité dès l&apos;activation du service.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-50 p-1.5 mt-0.5">
                    <RefreshCw className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1D26]">Renouvellement automatique</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Les abonnements sont renouvelés si le solde est suffisant.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-amber-50 p-1.5 mt-0.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1D26]">Solde insuffisant ?</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Le service est suspendu. Rechargez pour réactiver.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === TAB: Souscrire & payer === */}
      {activeTab === "subscribe" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-[#10206B] to-[#1B3A9E] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10"><Wallet className="h-5 w-5 text-amber-300" /></span>
              <div>
                <p className="text-[11px] font-semibold tracking-wide text-white/70">SOLDE DISPONIBLE</p>
                <p className="text-[22px] font-extrabold">{billingBalance.toLocaleString("fr-FR")} {currency}</p>
              </div>
            </div>
            <button onClick={() => setShowRechargeModal(true)} className="inline-flex h-9 items-center gap-2 rounded-md bg-amber-400 px-4 text-sm font-bold text-[#1B1300] hover:bg-amber-300"><Plus className="h-4 w-4" /> Recharger</button>
          </div>

          {shopNote && <p className="rounded-lg bg-[#EBF2FF] px-4 py-2.5 text-sm text-[#1A6BE6]">{shopNote}</p>}

          {SHOP.map((g) => (
            <div key={g.title}>
              <p className="mb-2 flex items-center gap-2 text-[12px] font-extrabold tracking-wide text-[#10206B]"><span className={`h-2 w-2 rounded-full ${g.dot}`} /> {g.title}</p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {g.items.map((it) => (
                  <button
                    key={it.name}
                    onClick={() => (it.href ? router.push(it.href) : setShopNote(`${it.name} : le paiement par solde sera activé avec le backend.`))}
                    className="flex items-center gap-3 rounded-lg border border-[#E2E6EE] bg-white px-4 py-3 text-left shadow-sm transition-colors hover:border-[#2B7FFF]"
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${it.bg}`}><it.icon className={`h-5 w-5 ${it.fg}`} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-bold text-[#1A1D26]">{it.name}</span>
                      <span className="block truncate text-[12px] text-[#6B7280]">{it.sub}</span>
                    </span>
                    {it.included ? <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" /> : <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === TAB: Droits actifs === */}
      {activeTab === "active" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1A1D26]">Services actifs</h2>
            <span className="text-xs text-[#9CA3AF]">{activeServices.length} service(s)</span>
          </div>
          {activeServices.map((service) => (
            <div key={service.id} className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3.5">
                  <div className={`rounded-xl p-2.5 ${service.iconBg}`}>
                    <service.icon className={`h-5 w-5 ${service.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1D26]">{service.name}</h3>
                    <p className="text-xs text-[#6B7280] mt-0.5">{service.description}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600">
                  <CheckCircle className="h-3 w-3" /> Actif
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl bg-[#F5F7FA] p-3">
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Prix</p>
                  <p className="text-sm font-semibold text-[#1A1D26] mt-0.5">{format(service.price)} <span className="text-xs font-normal text-[#9CA3AF]">{service.period}</span></p>
                </div>
                <div className="rounded-xl bg-[#F5F7FA] p-3">
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Expiration</p>
                  <p className="text-sm font-semibold text-[#1A1D26] mt-0.5">{service.expiresAt}</p>
                </div>
                <div className="rounded-xl bg-[#F5F7FA] p-3">
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Jours restants</p>
                  <p className={`text-sm font-semibold mt-0.5 ${service.daysLeft > 7 ? "text-emerald-600" : service.daysLeft > 0 ? "text-amber-600" : "text-[#1A1D26]"}`}>
                    {service.daysLeft === -1 ? "∞" : `${service.daysLeft}j`}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F5F7FA] p-3">
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Renouvellement</p>
                  <p className="text-sm font-semibold text-[#1A1D26] mt-0.5">{service.autoRenew ? "Automatique" : "—"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === TAB: Historique === */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1A1D26]">Historique de facturation</h2>
            <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#E8ECF1] text-xs font-medium text-[#6B7280] hover:bg-[#F5F7FA] transition-colors">
              <Download className="h-3.5 w-3.5" /> Exporter
            </button>
          </div>

          <div className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] divide-y divide-[#F1F3F7]">
            {billingHistory.map((event) => (
              <div key={event.id} className="flex items-center justify-between px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`rounded-xl p-2.5 shrink-0 ${event.type === "recharge" ? "bg-emerald-50" : event.type === "refund" ? "bg-red-50" : "bg-orange-50"}`}>
                    {event.type === "recharge" ? (
                      <Plus className={`h-4 w-4 text-emerald-500`} />
                    ) : (
                      <CreditCard className={`h-4 w-4 ${event.type === "refund" ? "text-red-400" : "text-orange-500"}`} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1A1D26] truncate">{event.label}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{event.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${event.type === "recharge" ? "text-emerald-600" : "text-[#1A1D26]"}`}>
                      {event.type === "recharge" ? "+" : "-"}{format(event.amount)}
                    </p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">{event.date}</p>
                  </div>
                  {event.receiptUrl && (
                    <button className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                      <FileText className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowRechargeModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F3F7]">
              <h3 className="text-base font-semibold text-[#1A1D26]">Recharger mon solde</h3>
              <button onClick={() => setShowRechargeModal(false)} className="p-2 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* Current balance */}
              <div className="rounded-xl bg-[#F5F7FA] p-4 text-center">
                <p className="text-xs text-[#6B7280] mb-1">Solde actuel</p>
                <p className="text-2xl font-bold text-[#1A1D26]">{format(billingBalance)}</p>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Montant de recharge</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full h-12 px-4 rounded-xl border border-[#E8ECF1] bg-white text-lg font-semibold text-[#1A1D26] placeholder:text-[#D1D5DB] focus:outline-none focus:border-[#2B7FFF]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#9CA3AF]">{currency}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {[5000, 10000, 20000, 50000].map((amt) => (
                    <button
                      key={amt}
                      className="flex-1 h-8 rounded-lg border border-[#E8ECF1] text-xs font-medium text-[#6B7280] hover:border-[#2B7FFF] hover:text-[#2B7FFF] hover:bg-[#EBF2FF] transition-colors"
                    >
                      {amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment method */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Moyen de paiement</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 rounded-xl border-2 border-[#2B7FFF] bg-[#EBF2FF] p-3.5 cursor-pointer">
                    <input type="radio" name="payMethod" defaultChecked className="sr-only" />
                    <div className="rounded-lg bg-amber-100 p-2">
                      <Smartphone className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1D26]">Mobile Money</p>
                      <p className="text-[11px] text-[#6B7280]">MTN, Moov, Orange</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border-2 border-[#E8ECF1] p-3.5 cursor-pointer hover:border-[#2B7FFF]/50">
                    <input type="radio" name="payMethod" className="sr-only" />
                    <div className="rounded-lg bg-blue-100 p-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1D26]">FedaPay / CinetPay</p>
                      <p className="text-[11px] text-[#6B7280]">Carte Visa/Mastercard</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-t border-[#F1F3F7]">
              <button onClick={() => setShowRechargeModal(false)} className="flex-1 h-10 rounded-xl border border-[#E8ECF1] text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors">
                Annuler
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors">
                <Wallet className="h-4 w-4" />
                Recharger
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
