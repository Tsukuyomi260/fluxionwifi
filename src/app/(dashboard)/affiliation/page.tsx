"use client";

import { useState } from "react";
import {
  Gift,
  Copy,
  CheckCircle,
  Users,
  Wallet,
  TrendingUp,
  Link2,
  Share2,
  Clock,
  ChevronDown,
  Search,
  Eye,
  ArrowRight,
  X,
  Send,
  Smartphone,
  Star,
  Award,
  Target,
  Zap,
  ExternalLink,
  Download,
  MessageCircle,
} from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";

type ReferralStatus = "active" | "trial" | "expired";

interface Referral {
  id: string;
  name: string;
  email: string;
  date: string;
  plan: string;
  status: ReferralStatus;
  earned: number;
}

interface Commission {
  id: string;
  referral: string;
  type: string;
  amount: number;
  date: string;
  status: "paid" | "pending";
}

const demoReferrals: Referral[] = [
  { id: "R01", name: "Alain K.", email: "al***@gmail.com", date: "25 Oct 2026", plan: "Pro", status: "active", earned: 3000 },
  { id: "R02", name: "Fatou D.", email: "fa***@yahoo.fr", date: "20 Oct 2026", plan: "Pro", status: "active", earned: 3000 },
  { id: "R03", name: "Ibrahim S.", email: "ib***@gmail.com", date: "18 Oct 2026", plan: "Starter", status: "trial", earned: 0 },
  { id: "R04", name: "Marie C.", email: "ma***@outlook.com", date: "10 Oct 2026", plan: "Pro", status: "active", earned: 6000 },
  { id: "R05", name: "Kodjo A.", email: "ko***@gmail.com", date: "5 Oct 2026", plan: "Pro", status: "expired", earned: 3000 },
  { id: "R06", name: "Awa B.", email: "aw***@gmail.com", date: "28 Sep 2026", plan: "Enterprise", status: "active", earned: 12000 },
];

const demoCommissions: Commission[] = [
  { id: "C01", referral: "Alain K.", type: "Abonnement Pro", amount: 3000, date: "25 Oct 2026", status: "pending" },
  { id: "C02", referral: "Fatou D.", type: "Abonnement Pro", amount: 3000, date: "20 Oct 2026", status: "paid" },
  { id: "C03", referral: "Marie C.", type: "Renouvellement Pro", amount: 3000, date: "15 Oct 2026", status: "paid" },
  { id: "C04", referral: "Marie C.", type: "Abonnement Pro", amount: 3000, date: "10 Oct 2026", status: "paid" },
  { id: "C05", referral: "Kodjo A.", type: "Abonnement Pro", amount: 3000, date: "5 Oct 2026", status: "paid" },
  { id: "C06", referral: "Awa B.", type: "Abonnement Enterprise", amount: 12000, date: "28 Sep 2026", status: "paid" },
];

const statusConfig: Record<ReferralStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Actif", color: "text-emerald-600", bg: "bg-emerald-50" },
  trial: { label: "Essai", color: "text-amber-600", bg: "bg-amber-50" },
  expired: { label: "Expiré", color: "text-gray-500", bg: "bg-gray-100" },
};

export default function AffiliationPage() {
  const { currency } = useCurrency();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"referrals" | "commissions">("referrals");
  const [search, setSearch] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const affiliateCode = "PATERNE-FWF2026";
  const affiliateLink = `https://fluxionwifi.com/ref/${affiliateCode}`;

  const totalEarned = demoReferrals.reduce((s, r) => s + r.earned, 0);
  const pendingAmount = demoCommissions.filter((c) => c.status === "pending").reduce((s, c) => s + c.amount, 0);
  const activeReferrals = demoReferrals.filter((r) => r.status === "active").length;
  const commissionRate = 20;

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredReferrals = demoReferrals.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCommissions = demoCommissions.filter((c) =>
    c.referral.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (n: number) => n.toLocaleString("fr-FR") + " " + currency;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1E4D]">Programme d&apos;affiliation</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gagnez {commissionRate}% de commission sur chaque abonnement référé
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#2B7FFF] bg-white px-4 py-2.5 text-sm font-medium text-[#2B7FFF] hover:bg-blue-50 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Partager
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2B7FFF] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2563EB] transition-colors"
          >
            <Wallet className="h-4 w-4" />
            Retirer
          </button>
        </div>
      </div>

      {/* Affiliate link card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0B1E4D] via-[#122B66] to-[#1A3A7A] p-5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#2B7FFF]/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#2B7FFF]/15 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="h-4 w-4 text-[#5BA0FF]" />
            <span className="text-sm font-medium text-white/70">Votre lien d&apos;affiliation</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2.5 flex items-center">
              <span className="text-sm text-white/90 truncate flex-1 font-mono">{affiliateLink}</span>
            </div>
            <button
              onClick={copyLink}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                copied
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-[#0B1E4D] hover:bg-white/90"
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copier
                </>
              )}
            </button>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs text-white/40">Code : <span className="font-mono text-white/60">{affiliateCode}</span></span>
            <span className="text-xs text-white/40">·</span>
            <span className="text-xs text-white/40">Commission : <span className="text-[#5BA0FF] font-semibold">{commissionRate}%</span> sur chaque paiement</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Gains totaux", value: fmt(totalEarned), icon: TrendingUp, color: "text-[#2B7FFF]", bg: "bg-blue-50" },
          { label: "En attente", value: fmt(pendingAmount), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Filleuls actifs", value: activeReferrals, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total filleuls", value: demoReferrals.length, icon: Gift, color: "text-violet-600", bg: "bg-violet-50" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#E8ECF1] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3">
              <div className={`rounded-xl ${s.bg} p-2.5`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0B1E4D]">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-sm font-semibold text-[#0B1E4D] mb-4">Comment ça fonctionne</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "1", icon: Share2, title: "Partagez votre lien", desc: "Envoyez votre lien d'affiliation à vos contacts ou partagez-le sur les réseaux sociaux.", color: "text-[#2B7FFF]", bg: "bg-blue-50" },
            { step: "2", icon: Users, title: "Ils s'inscrivent", desc: "Vos filleuls créent un compte et souscrivent à une formule payante via votre lien.", color: "text-violet-600", bg: "bg-violet-50" },
            { step: "3", icon: Wallet, title: "Vous gagnez 20%", desc: "Recevez 20% de commission sur chaque paiement de vos filleuls, sans limite de durée.", color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <div className={`shrink-0 w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0B1E4D]">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-[#F5F7FA] p-1 w-fit">
        <button
          onClick={() => setActiveTab("referrals")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "referrals" ? "bg-white text-[#0B1E4D] shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Filleuls
        </button>
        <button
          onClick={() => setActiveTab("commissions")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "commissions" ? "bg-white text-[#0B1E4D] shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Commissions
        </button>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="p-4 border-b border-[#E8ECF1]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === "referrals" ? "Rechercher un filleul..." : "Rechercher une commission..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
            />
          </div>
        </div>

        {activeTab === "referrals" && (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8ECF1]">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Filleul</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Date</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Formule</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Statut</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">Gains</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReferrals.map((r) => {
                    const st = statusConfig[r.status];
                    return (
                      <tr key={r.id} className="border-b border-[#E8ECF1] last:border-0 hover:bg-[#F5F7FA]/50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2B7FFF] to-[#0B1E4D] flex items-center justify-center text-xs font-bold text-white">
                              {r.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#0B1E4D]">{r.name}</p>
                              <p className="text-xs text-gray-400">{r.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-600">{r.date}</td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-0.5 text-xs font-medium text-[#2B7FFF]">
                            {r.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center rounded-lg ${st.bg} px-2.5 py-1 text-xs font-medium ${st.color}`}>
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className={`text-sm font-semibold ${r.earned > 0 ? "text-emerald-600" : "text-gray-400"}`}>
                            {r.earned > 0 ? `+${fmt(r.earned)}` : "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-[#E8ECF1]">
              {filteredReferrals.map((r) => {
                const st = statusConfig[r.status];
                return (
                  <div key={r.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2B7FFF] to-[#0B1E4D] flex items-center justify-center text-xs font-bold text-white">
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0B1E4D]">{r.name}</p>
                          <p className="text-xs text-gray-400">{r.date}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center rounded-lg ${st.bg} px-2 py-0.5 text-xs font-medium ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Formule {r.plan}</span>
                      <span className={`font-semibold ${r.earned > 0 ? "text-emerald-600" : "text-gray-400"}`}>
                        {r.earned > 0 ? `+${fmt(r.earned)}` : "—"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === "commissions" && (
          <>
            <div className="hidden lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8ECF1]">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Filleul</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Type</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Date</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Statut</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommissions.map((c) => (
                    <tr key={c.id} className="border-b border-[#E8ECF1] last:border-0 hover:bg-[#F5F7FA]/50 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-medium text-[#0B1E4D]">{c.referral}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{c.type}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{c.date}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${
                          c.status === "paid" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        }`}>
                          {c.status === "paid" ? "Payé" : "En attente"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-sm font-semibold text-emerald-600">+{fmt(c.amount)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden divide-y divide-[#E8ECF1]">
              {filteredCommissions.map((c) => (
                <div key={c.id} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-[#0B1E4D]">{c.referral}</p>
                    <span className="text-sm font-semibold text-emerald-600">+{fmt(c.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{c.type} · {c.date}</span>
                    <span className={c.status === "paid" ? "text-emerald-600" : "text-amber-600"}>
                      {c.status === "paid" ? "Payé" : "En attente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {((activeTab === "referrals" && filteredReferrals.length === 0) || (activeTab === "commissions" && filteredCommissions.length === 0)) && (
          <div className="py-12 text-center">
            <Gift className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Aucun résultat</p>
          </div>
        )}
      </div>

      {/* Withdraw modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-[#E8ECF1]">
              <h2 className="text-lg font-bold text-[#0B1E4D]">Retirer mes gains</h2>
              <button onClick={() => setShowWithdrawModal(false)} className="rounded-lg p-1.5 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="rounded-xl bg-[#F5F7FA] p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Solde disponible</p>
                <p className="text-2xl font-bold text-[#0B1E4D]">{fmt(totalEarned)}</p>
                <p className="text-xs text-amber-600 mt-1">{fmt(pendingAmount)} en attente de validation</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Montant à retirer</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF] pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">{currency}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {[5000, 10000, 20000].map((v) => (
                    <button key={v} className="flex-1 rounded-lg border border-[#E8ECF1] py-1.5 text-xs font-medium text-gray-600 hover:bg-[#F5F7FA] transition-colors">
                      {v.toLocaleString("fr-FR")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Moyen de paiement</label>
                <div className="space-y-2">
                  {[
                    { label: "Mobile Money", desc: "MTN, Moov, Orange", icon: Smartphone, selected: true },
                    { label: "Virement bancaire", desc: "Compte bancaire", icon: Wallet, selected: false },
                  ].map((m) => (
                    <label key={m.label} className={`flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer transition-colors ${
                      m.selected ? "border-[#2B7FFF] bg-blue-50/50" : "border-[#E8ECF1] hover:bg-[#F5F7FA]"
                    }`}>
                      <input type="radio" name="withdraw-method" defaultChecked={m.selected} className="sr-only" />
                      <div className={`rounded-xl p-2 ${m.selected ? "bg-[#2B7FFF]" : "bg-gray-100"}`}>
                        <m.icon className={`h-4 w-4 ${m.selected ? "text-white" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0B1E4D]">{m.label}</p>
                        <p className="text-xs text-gray-400">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Numéro de téléphone</label>
                <input
                  type="tel"
                  placeholder="+229 XX XX XX XX"
                  className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowWithdrawModal(false)} className="flex-1 rounded-xl border border-[#E8ECF1] py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B7FFF] py-2.5 text-sm font-medium text-white hover:bg-[#2563EB] transition-colors">
                  <Send className="h-4 w-4" />
                  Retirer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-[#E8ECF1]">
              <h2 className="text-lg font-bold text-[#0B1E4D]">Partager votre lien</h2>
              <button onClick={() => setShowShareModal(false)} className="rounded-lg p-1.5 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "WhatsApp", color: "bg-emerald-500 hover:bg-emerald-600", icon: MessageCircle },
                { label: "Facebook", color: "bg-blue-600 hover:bg-blue-700", icon: Globe },
                { label: "Telegram", color: "bg-sky-500 hover:bg-sky-600", icon: Send },
                { label: "Email", color: "bg-gray-700 hover:bg-gray-800", icon: ExternalLink },
              ].map((s) => (
                <button key={s.label} className={`w-full flex items-center gap-3 rounded-xl ${s.color} px-4 py-3 text-white text-sm font-medium transition-colors`}>
                  <s.icon className="h-5 w-5" />
                  Partager sur {s.label}
                </button>
              ))}
              <button
                onClick={() => { copyLink(); setShowShareModal(false); }}
                className="w-full flex items-center gap-3 rounded-xl border border-[#E8ECF1] px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[#F5F7FA] transition-colors"
              >
                <Copy className="h-5 w-5 text-gray-400" />
                Copier le lien
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
