"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, Info, Plus, Trash2, TriangleAlert } from "lucide-react";

export type ExtraTab = "mode" | "tarifs" | "integration" | "sms" | "infos" | "fidelite" | "verification" | "lier";

const box = "rounded-xl border border-[#334155] bg-[#0F172A]/60 p-4";
const title = "text-sm font-bold text-white";
const hint = "text-xs text-gray-400";
const input = "w-full rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none";

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-xs font-semibold text-gray-200">
      {label}
      <button role="switch" aria-checked={on} onClick={() => onChange(!on)} className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-emerald-500" : "bg-slate-600"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
      </button>
    </label>
  );
}

function ConsoleLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/25">
      <ExternalLink className="h-3.5 w-3.5" /> {children}
    </Link>
  );
}

/* ───── Mode d'intégration ───── */
const MODES = [
  { key: "manual", label: "Manuel (import MikHmon)", desc: "Vos tickets viennent de VOTRE MikHmon. Le moins d'automatisme, le plus simple à démarrer." },
  { key: "radius", label: "Serveur RADIUS", desc: "Le ticket est créé à la demande, comme en MikHmon VPN, mais les comptes vivent sur le serveur RADIUS : centralisé, pour plusieurs routeurs." },
  { key: "vpn", label: "MikHmon VPN", desc: "Le ticket est créé sur le routeur au moment de la vente. Aucun stock à gérer." },
  { key: "fai", label: "Mode FAI", desc: "Pour un Fournisseur d'Accès Internet agréé qui couvre des promoteurs de wifi zone : tickets par RADIUS, prélèvement sur leurs ventes." },
];

function ModeTab() {
  const [mode, setMode] = useState("radius");
  return (
    <div className="space-y-3">
      <h3 className={title}>Mode d&apos;intégration</h3>
      <p className={hint}>Où naissent vos tickets ? Choisissez le mode qui correspond à votre installation.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {MODES.map((m) => (
          <button key={m.key} onClick={() => setMode(m.key)} className={`rounded-xl border p-4 text-left transition-colors ${mode === m.key ? "border-amber-400 bg-amber-400/10" : "border-[#334155] bg-[#0F172A]/60 hover:border-slate-500"}`}>
            <span className="flex items-center gap-2 text-sm font-bold text-white">
              <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${mode === m.key ? "border-amber-400" : "border-slate-500"}`}>{mode === m.key && <span className="h-2 w-2 rounded-full bg-amber-400" />}</span>
              {m.label}
            </span>
            <span className="mt-2 block text-xs leading-relaxed text-gray-400">{m.desc}</span>
          </button>
        ))}
      </div>
      <ConsoleLink href="/console/mode">Coordinateur de mode (Console)</ConsoleLink>
    </div>
  );
}

/* ───── Tarifs ───── */
const TARIFS: [string, number][] = [
  ["Illimité-Promotion-1D", 2000], ["illimité-7D", 12500], ["illimité-30D", 25000], ["1GB-24H", 1500], ["2GB-2D", 2000], ["3GB-4D", 4500], ["4GB-7D", 5500], ["5GB-30D", 10000],
];

function TarifsTab() {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  return (
    <div className="space-y-3">
      <h3 className={title}>Tarifs et tickets WiFi</h3>
      <p className={hint}>Ordre et masquage des forfaits sur le portail. Les prix et durées se règlent dans les profils de la Console.</p>
      <div className={`${box} divide-y divide-[#334155] p-0`}>
        {TARIFS.map(([name, price]) => (
          <div key={name} className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs">
            <span className={`font-semibold ${hidden[name] ? "text-gray-500 line-through" : "text-white"}`}>{name}</span>
            <span className="flex items-center gap-3">
              <span className="text-gray-400">{price.toLocaleString("fr-FR")}</span>
              <button onClick={() => setHidden((h) => ({ ...h, [name]: !h[name] }))} className="rounded-md border border-[#334155] px-2 py-1 text-[11px] text-gray-300 hover:bg-white/5">{hidden[name] ? "Afficher" : "Masquer"}</button>
            </span>
          </div>
        ))}
      </div>
      <ConsoleLink href="/console/profiles">Profils tarifaires (Console)</ConsoleLink>
    </div>
  );
}

/* ───── Intégration ───── */
function IntegrationTab() {
  const [opts, setOpts] = useState({ momo: true, lost: true, loyalty: true, chat: true, ads: false });
  const rows: [keyof typeof opts, string][] = [
    ["momo", "Paiement Mobile Money (tableau des tarifs, paiement par tarif)"],
    ["lost", "Recherche ticket payé non reçu"],
    ["loyalty", "Section Bonus fidélité"],
    ["chat", "Bulle Chat & discussion"],
    ["ads", "Publicité dynamique (bannière + annonce)"],
  ];
  return (
    <div className="space-y-3">
      <h3 className={title}>Présence automatique sur vos portails</h3>
      <div className={`${box} space-y-2.5`}>
        {rows.map(([k, label]) => (
          <label key={k} className="flex cursor-pointer items-center gap-3 text-xs text-gray-200">
            <input type="checkbox" checked={opts[k]} onChange={(e) => setOpts((o) => ({ ...o, [k]: e.target.checked }))} className="h-4 w-4 rounded accent-emerald-500" />
            {label}
          </label>
        ))}
      </div>
      <p className={`${hint} flex gap-2`}><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Republiez le portail après toute modification pour que vos clients voient la nouvelle version.</p>
    </div>
  );
}

/* ───── Ticket SMS ───── */
function SmsTab() {
  const [on, setOn] = useState(false);
  const [payer, setPayer] = useState<"me" | "client">("me");
  return (
    <div className="space-y-3">
      <h3 className={title}>Envoi du ticket par SMS</h3>
      <div className={`${box} space-y-4`}>
        <Toggle on={on} onChange={setOn} label="Envoyer le ticket par SMS après l'achat" />
        <div>
          <p className="mb-2 text-xs font-semibold text-gray-300">Qui paie le SMS ?</p>
          <div className="flex gap-2">
            {([["me", "Moi (promoteur)"], ["client", "Le client"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setPayer(k)} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${payer === k ? "bg-amber-400 text-black" : "bg-[#1E293B] text-gray-300"}`}>{l}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-[#1E293B] px-3 py-2 text-xs">
          <span className="text-gray-300">Crédits Ticket SMS : <b className="text-white">10</b></span>
          <Link href="/finance/billing" className="font-bold text-amber-300 hover:underline">Recharger mes crédits</Link>
        </div>
      </div>
      <p className={hint}>Si le SMS ne part pas, vérifiez vos crédits et le numéro saisi par le client.</p>
    </div>
  );
}

/* ───── Infos ───── */
function InfosTab() {
  const [lines, setLines] = useState([
    "Connexion haut débit et stable.",
    "Support technique disponible 24/7.",
    "Paiement 100% sécurisé par nos partenaires.",
    "Idéal pour le télétravail et les études.",
    "Consultez nos offres spéciales en magasin.",
  ]);
  const [draft, setDraft] = useState("");
  return (
    <div className="space-y-3">
      <h3 className={title}>Messages affichés sur le portail</h3>
      <div className="space-y-2">
        {lines.map((l, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={l} onChange={(e) => setLines((ls) => ls.map((x, j) => (j === i ? e.target.value : x)))} className={input} />
            <button onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))} aria-label="Supprimer" className="flex h-8 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white hover:bg-emerald-600"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Nouveau message…" className={input} />
        <button
          onClick={() => { if (draft.trim()) { setLines((ls) => [...ls, draft.trim()]); setDraft(""); } }}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-amber-400 px-3 text-xs font-bold text-black"
        >
          <Plus className="h-3.5 w-3.5" /> Ajouter
        </button>
      </div>
    </div>
  );
}

/* ───── Fidélité ───── */
function FideliteTab() {
  const [on, setOn] = useState(true);
  const [tiers, setTiers] = useState([{ spend: 10000, reward: "1GB-24H" }, { spend: 25000, reward: "illimité-7D" }]);
  return (
    <div className="space-y-3">
      <h3 className={title}>Bonus fidélité client</h3>
      <div className={`${box} space-y-4`}>
        <Toggle on={on} onChange={setOn} label="Activer le bonus fidélité sur le portail" />
        <div className={on ? "" : "pointer-events-none opacity-50"}>
          <p className="mb-2 text-xs font-semibold text-gray-300">Paliers de cumul → ticket offert</p>
          <div className="space-y-2">
            {tiers.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="text-gray-400">Dès</span>
                <input type="number" min={0} value={t.spend} onChange={(e) => setTiers((ts) => ts.map((x, j) => (j === i ? { ...x, spend: +e.target.value } : x)))} className={`${input} w-28`} />
                <span className="text-gray-400">offrir</span>
                <input value={t.reward} onChange={(e) => setTiers((ts) => ts.map((x, j) => (j === i ? { ...x, reward: e.target.value } : x)))} className={input} />
                <button onClick={() => setTiers((ts) => ts.filter((_, j) => j !== i))} aria-label="Supprimer" className="flex h-8 w-9 shrink-0 items-center justify-center rounded-md border border-[#334155] text-gray-300 hover:bg-white/5"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setTiers((ts) => [...ts, { spend: 50000, reward: "" }])} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:underline"><Plus className="h-3.5 w-3.5" /> Ajouter un palier</button>
        </div>
      </div>
    </div>
  );
}

/* ───── Vérification ───── */
function VerificationTab() {
  const [on, setOn] = useState(false);
  const [mode, setMode] = useState<"phone" | "otp">("phone");
  return (
    <div className="space-y-3">
      <h3 className={title}>Identification des clients</h3>
      <div className={`${box} space-y-4`}>
        <Toggle on={on} onChange={setOn} label="Demander une identification avant la connexion" />
        <div className={`flex flex-col gap-2 ${on ? "" : "pointer-events-none opacity-50"}`}>
          {([["phone", "Numéro de téléphone"], ["otp", "Numéro + code SMS (OTP)"]] as const).map(([k, l]) => (
            <label key={k} className="flex cursor-pointer items-center gap-2 text-xs text-gray-200">
              <input type="radio" name="verif" checked={mode === k} onChange={() => setMode(k)} className="accent-amber-400" /> {l}
            </label>
          ))}
        </div>
      </div>
      <p className={`${hint} flex gap-2`}><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Le mode OTP consomme des crédits SMS.</p>
    </div>
  );
}

/* ───── Lier le routeur ───── */
function LierTab() {
  const [copied, setCopied] = useState(false);
  const cmd = `/tool fetch url="https://VOTRE-DOMAINE/api/coordinator/install.rsc" mode=https dst-path=fluxion-install.rsc; /import fluxion-install.rsc`;
  return (
    <div className="space-y-3">
      <h3 className={title}>Lier le routeur</h3>
      <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 text-xs leading-relaxed text-violet-100">
        Collez la commande dans <b>New Terminal</b> de WinBox : le routeur télécharge puis installe automatiquement la dernière version du portail publiée. <b>Aucun script à coller manuellement</b> par la suite.
      </div>
      <div className={`${box} space-y-3`}>
        <p className="text-sm font-bold text-white">Coordinateur</p>
        <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          Aucun coordinateur n&apos;a encore été vu sur ce compte. Vérifiez d&apos;abord que le routeur est allumé et connecté à Internet, puis collez la commande ci-dessous.
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-[#0B1220] p-3 font-mono text-[11px] text-emerald-300">{cmd}</pre>
        <button
          onClick={async () => { try { await navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* indisponible */ } }}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-black"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copié" : "Copier la commande"}
        </button>
      </div>
    </div>
  );
}

export function PortalExtraTab({ tab }: { tab: ExtraTab }) {
  return (
    <>
      {tab === "mode" && <ModeTab />}
      {tab === "tarifs" && <TarifsTab />}
      {tab === "integration" && <IntegrationTab />}
      {tab === "sms" && <SmsTab />}
      {tab === "infos" && <InfosTab />}
      {tab === "fidelite" && <FideliteTab />}
      {tab === "verification" && <VerificationTab />}
      {tab === "lier" && <LierTab />}
    </>
  );
}
