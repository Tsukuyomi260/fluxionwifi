"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck, Coins, Copy, Check, Gift, Handshake, HeartHandshake, History, KeyRound, LayoutGrid, Link2, MessageSquare, PiggyBank,
  PieChart, Receipt, Send, Hourglass, UserPen, Users, Wallet, Wifi, X, ArrowLeftRight, Banknote,
} from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import { useUser } from "@/hooks/use-user";

const PROFILE_KEY = "fluxion-withdraw-profile";
const MIN_WITHDRAW = 1000;

interface Filleul {
  name: string;
  at: string;
  source: string;
  gains: number;
}

// Données de démonstration (remplacées par la base au back-end).
const FILLEULS: Filleul[] = [
  { name: "Associé 1", at: "06/11/2026", source: "signup_backend_local", gains: 0 },
  { name: "Associé 2", at: "20/09/2026", source: "reconciliation_referredBy", gains: 0 },
];
const COMMISSIONS: { date: string; client: string; amount: number; description: string }[] = [];
const WITHDRAWALS: { date: string; amount: number; status: string }[] = [];

const CHIPS: { label: string; icon: typeof Coins; cls: string }[] = [
  { label: "Recharges crédits", icon: Coins, cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
  { label: "Abonnements", icon: CalendarCheck, cls: "border-sky-500/30 bg-sky-500/10 text-sky-300" },
  { label: "Portails captifs", icon: Wifi, cls: "border-violet-500/30 bg-violet-500/10 text-violet-300" },
  { label: "Transferts de solde", icon: ArrowLeftRight, cls: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
  { label: "Frais d'intégration", icon: KeyRound, cls: "border-red-500/30 bg-red-500/10 text-red-300" },
  { label: "SMS OTP", icon: MessageSquare, cls: "border-teal-500/30 bg-teal-500/10 text-teal-300" },
];

function Section({ title, icon: Icon, children }: { title: string; icon: typeof History; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0F1A3A]/70 p-5 sm:p-6">
      <h3 className="mb-4 flex items-center gap-3 rounded-lg border-l-4 border-amber-400 bg-gradient-to-r from-amber-400/10 to-transparent px-4 py-3 text-[17px] font-bold text-amber-300">
        <Icon className="h-5 w-5" /> {title}
      </h3>
      {children}
    </section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="bg-gradient-to-r from-[#16275C] to-[#0B1230] px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-amber-300">{children}</th>;
}

export default function AffiliationPage() {
  const { currency } = useCurrency();
  const { user } = useUser();
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("1000");
  const [transfer, setTransfer] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [profile, setProfile] = useState({ first: "", last: "", address: "", phone: "" });
  const profileRef = useRef<HTMLElement>(null);

  const code = (user?.email?.split("@")[0] || "FLUXI").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) || "FLUXI";
  const link = `https://fluxionwifi.tech/register?ref=${code}`;

  const gains = FILLEULS.reduce((n, f) => n + f.gains, 0);
  const available = gains;
  const pending = 0;
  const withdrawn = WITHDRAWALS.reduce((n, w) => n + w.amount, 0);
  const fmt = (n: number) => `${n.toLocaleString("fr-FR")} ${currency}`;
  const balance = 1800; // solde de la plateforme (démo)
  const subscription = 58310;

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const p = localStorage.getItem(PROFILE_KEY);
        if (p) setProfile(JSON.parse(p));
      } catch {
        /* stockage indisponible */
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  function say(m: string) {
    setMsg(m);
    setTimeout(() => setMsg(null), 4500);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible */
    }
  }

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch { /* indisponible */ }
    say("Profil de retrait enregistré.");
  }

  function withdraw() {
    const n = Number(amount);
    if (!profile.phone) return say("Renseignez d'abord votre profil de retrait (numéro Mobile Money).");
    if (available < MIN_WITHDRAW) return say(`Solde minimum de ${fmt(MIN_WITHDRAW)} requis.`);
    if (!n || n < MIN_WITHDRAW || n > available) return say(`Montant invalide : entre ${fmt(MIN_WITHDRAW)} et ${fmt(available)}.`);
    say("Demande de retrait enregistrée (démonstration : le traitement se fera avec le backend).");
  }

  const cards: { title: string; value: string; sub: string; color: string; icon: typeof Users; num: string }[] = [
    { title: "Mes filleuls", value: `${FILLEULS.length}`, sub: "filleul(s)", color: "border-t-red-500", icon: Users, num: "text-red-400" },
    { title: "Total des gains", value: fmt(gains), sub: `${COMMISSIONS.length} commission(s)`, color: "border-t-emerald-500", icon: Coins, num: "text-emerald-400" },
    { title: "Solde disponible", value: fmt(available), sub: "Prêt pour retrait", color: "border-t-sky-500", icon: Wallet, num: "text-sky-400" },
    { title: "Demandes en attente", value: fmt(pending), sub: "0 demande(s)", color: "border-t-amber-500", icon: Hourglass, num: "text-amber-400" },
    { title: "Total retiré", value: fmt(withdrawn), sub: `${WITHDRAWALS.length} retrait(s)`, color: "border-t-violet-500", icon: PiggyBank, num: "text-violet-400" },
  ];

  const input = "h-[52px] w-full rounded-lg border border-white/20 bg-[#0A1230] px-4 text-center text-lg font-bold text-amber-300 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none";
  const field = "h-11 w-full rounded-lg border border-white/15 bg-[#0A1230] px-4 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none";

  return (
    <div className="-m-4 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0B1330] via-[#101B45] to-[#0A1028] p-4 text-white lg:-m-6 lg:p-8">
      <div className="mx-auto max-w-[1200px] space-y-5">
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <h1 className="inline-flex items-center gap-3 border-b-2 border-amber-400 pb-2 text-[28px] font-extrabold text-amber-300">
            <Handshake className="h-7 w-7" /> Mon Espace Affiliation
          </h1>
          <Link href="/account" aria-label="Fermer" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:bg-white/10"><X className="h-5 w-5" /></Link>
        </div>

        {msg && <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">{msg}</p>}

        {/* Lien de parrainage */}
        <section className="rounded-2xl border border-white/10 bg-[#0F1A3A]/70 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-[19px] font-bold text-amber-300"><Link2 className="h-5 w-5" /> Mon Lien de Parrainage</h2>
          <p className="mt-3 text-center text-[15px] text-slate-200">
            Partagez ce lien unique. Pour chaque inscription, vous recevrez une commission de <b className="text-emerald-400">10%</b> sur :
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {CHIPS.map((c) => (
              <span key={c.label} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${c.cls}`}><c.icon className="h-3.5 w-3.5" /> {c.label}</span>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input readOnly value={link} className="h-[50px] flex-1 rounded-xl border border-white/15 bg-[#0A1230] px-4 font-medium text-amber-300" />
            <button onClick={copyLink} className="inline-flex h-[50px] items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 font-bold text-[#1B1300] hover:bg-amber-300">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copié" : "Copier"}
            </button>
          </div>
        </section>

        {/* Tableau de bord financier */}
        <section className="rounded-2xl border border-white/10 bg-[#0F1A3A]/70 p-5 sm:p-6">
          <h2 className="flex items-center justify-center gap-2 border-b border-amber-400/40 pb-3 text-[20px] font-extrabold uppercase text-amber-300"><PieChart className="h-5 w-5" /> Tableau de bord financier</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map((c) => (
              <div key={c.title} className={`rounded-xl border border-white/10 border-t-[3px] ${c.color} bg-white/[0.04] p-4 text-center`}>
                <c.icon className={`mx-auto h-9 w-9 ${c.num}`} />
                <p className="mt-2 text-[13px] font-bold uppercase text-slate-200">{c.title}</p>
                <p className={`mt-1 text-[20px] font-extrabold ${c.num}`}>{c.value}</p>
                <p className="text-xs text-slate-400">{c.sub}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg border-l-4 border-amber-400 bg-amber-400/10 px-4 py-3 text-sm text-slate-200">
            <b className="text-amber-300">Information :</b> Le solde disponible exclut les demandes en attente et déjà validées
          </p>
        </section>

        {/* Demande de retrait */}
        <section className="rounded-2xl border border-white/10 bg-[#0F1A3A]/70 p-5 text-center sm:p-6">
          <h2 className="flex items-center justify-center gap-2 text-[20px] font-extrabold uppercase text-amber-300"><Banknote className="h-5 w-5" /> Demande de retrait</h2>
          <p className="mx-auto mt-4 max-w-md rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-amber-200">
            Solde minimum de {fmt(MIN_WITHDRAW)} requis. Disponible: {fmt(available)}
          </p>
          <label className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold" htmlFor="amt"><Coins className="h-4 w-4 text-amber-400" /> Montant souhaité :</label>
          <input id="amt" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={`${input} mx-auto mt-2 max-w-[400px]`} />
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button onClick={() => profileRef.current?.scrollIntoView({ behavior: "smooth" })} className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-100 px-6 text-sm font-bold text-[#1A1D26] hover:bg-white"><UserPen className="h-4 w-4" /> Profil de retrait</button>
            <button onClick={withdraw} className="inline-flex h-11 items-center gap-2 rounded-full bg-amber-500 px-6 text-sm font-bold text-[#1B1300] hover:bg-amber-400"><Send className="h-4 w-4" /> Demander un retrait</button>
          </div>
        </section>

        {/* Utiliser mon gain */}
        <section className="rounded-2xl border border-white/10 bg-[#0F1A3A]/70 p-5 text-center sm:p-6">
          <h2 className="flex items-center justify-center gap-2 text-[20px] font-extrabold uppercase text-amber-300"><ArrowLeftRight className="h-5 w-5" /> Utiliser mon gain</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300">
            Gain disponible : {fmt(available)} · Solde actuel : {fmt(balance)} ({fmt(balance)} une fois transféré)
          </p>
          <label className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold"><Coins className="h-4 w-4 text-amber-400" /> Montant à transférer vers mon solde ({currency}) :</label>
          <input type="number" value={transfer} onChange={(e) => setTransfer(e.target.value)} placeholder="Montant" className={`${input} mx-auto mt-2 max-w-[400px]`} />
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => (Number(transfer) > 0 && Number(transfer) <= available ? say("Transfert enregistré (démonstration).") : say("Montant invalide ou supérieur au gain disponible."))}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-amber-500 px-6 text-sm font-bold text-[#1B1300] hover:bg-amber-400"
            >
              <Wallet className="h-4 w-4" /> Transférer vers mon solde
            </button>
            <button onClick={() => say("Paiement de l'abonnement : solde insuffisant.")} className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-100 px-6 text-sm font-bold text-[#1A1D26] hover:bg-white">
              <CalendarCheck className="h-4 w-4" /> Payer mon abonnement ({fmt(subscription)})
            </button>
          </div>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-400">
            Abonnement annuel — 2 options — prolonge l&apos;échéance du 23/07/2027. Votre gain paie {fmt(available)}, votre solde complète {fmt(subscription - available)} — solde insuffisant.
          </p>
        </section>

        <Section title="Historique des Commissions" icon={Receipt}>
          <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-sm">
            <thead><tr><Th>Date</Th><Th>Client</Th><Th>Montant</Th><Th>Description</Th></tr></thead>
            <tbody>
              {COMMISSIONS.length === 0 && <tr><td colSpan={4} className="px-4 py-4 italic text-slate-300">Aucune commission enregistrée.</td></tr>}
              {COMMISSIONS.map((c, i) => <tr key={i} className="border-b border-white/10"><td className="px-4 py-3">{c.date}</td><td className="px-4 py-3">{c.client}</td><td className="px-4 py-3">{fmt(c.amount)}</td><td className="px-4 py-3">{c.description}</td></tr>)}
            </tbody>
          </table></div>
        </Section>

        <Section title="Mes Filleuls" icon={Users}>
          <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-sm">
            <thead><tr><Th>Filleul</Th><Th>Inscrit le</Th><Th>Source</Th><Th>Gains générés</Th></tr></thead>
            <tbody>
              {FILLEULS.map((f) => (
                <tr key={f.name} className="border-b border-white/10">
                  <td className="px-4 py-3 font-bold">{f.name}</td>
                  <td className="px-4 py-3">{f.at}</td>
                  <td className="px-4 py-3"><span className="rounded bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300">{f.source}</span></td>
                  <td className="px-4 py-3 text-slate-400">{f.gains > 0 ? fmt(f.gains) : "— Pas encore"}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </Section>

        <Section title="Historique des Retraits" icon={History}>
          <div className="overflow-x-auto"><table className="w-full min-w-[480px] text-sm">
            <thead><tr><Th>Date</Th><Th>Montant</Th><Th>Statut</Th></tr></thead>
            <tbody>
              {WITHDRAWALS.length === 0 && <tr><td colSpan={3} className="px-4 py-4 italic text-slate-300">Aucune demande de retrait.</td></tr>}
              {WITHDRAWALS.map((w, i) => <tr key={i} className="border-b border-white/10"><td className="px-4 py-3">{w.date}</td><td className="px-4 py-3">{fmt(w.amount)}</td><td className="px-4 py-3">{w.status}</td></tr>)}
            </tbody>
          </table></div>
        </Section>

        <section ref={profileRef} className="rounded-2xl border border-white/10 bg-[#0F1A3A]/70 p-5 sm:p-6">
          <h3 className="mb-4 flex items-center gap-3 rounded-lg border-l-4 border-amber-400 bg-gradient-to-r from-amber-400/10 to-transparent px-4 py-3 text-[17px] font-bold text-amber-300"><UserPen className="h-5 w-5" /> Profil de Retrait</h3>
          <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1.5 block text-sm font-semibold">Prénom :</label><input className={field} placeholder="Votre prénom" value={profile.first} onChange={(e) => setProfile({ ...profile, first: e.target.value })} /></div>
            <div><label className="mb-1.5 block text-sm font-semibold">Nom :</label><input className={field} placeholder="Votre nom" value={profile.last} onChange={(e) => setProfile({ ...profile, last: e.target.value })} /></div>
            <div><label className="mb-1.5 block text-sm font-semibold">Adresse :</label><input className={field} placeholder="Votre adresse / Ville" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} /></div>
            <div><label className="mb-1.5 block text-sm font-semibold">Numéro de retrait (Mobile Money) :</label><input type="tel" className={field} placeholder="Ex: 97000000" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
            <div className="sm:col-span-2"><button className="inline-flex h-11 items-center gap-2 rounded-full bg-amber-500 px-6 text-sm font-bold text-[#1B1300] hover:bg-amber-400"><Gift className="h-4 w-4" /> Enregistrer le Profil</button></div>
          </form>
        </section>

        <p className="flex items-center justify-center gap-2 pb-4 text-xs text-slate-500"><HeartHandshake className="h-3.5 w-3.5" /> <LayoutGrid className="hidden" /> PROPULSÉ PAR <b className="text-slate-300">FLUXIONWIFI</b></p>
      </div>
    </div>
  );
}
