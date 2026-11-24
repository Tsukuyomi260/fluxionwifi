"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Check, Info, Lock, Plus, X } from "lucide-react";

type Mode = "manuel" | "radius" | "mikhmon" | "fai";

const MODES: { key: Mode; name: string; desc: string; bolt?: boolean; globe?: boolean }[] = [
  { key: "manuel", name: "Manuel", desc: "Vos tickets viennent de VOTRE MikHmon. Le moins d'automatisme, le plus simple à démarrer." },
  { key: "radius", name: "Serveur RADIUS", desc: "Le ticket est créé à la demande, comme en MikHmon VPN, mais les comptes vivent sur le serveur RADIUS — centralisé, pour plusieurs routeurs." },
  { key: "mikhmon", name: "MikHmon VPN", bolt: true, desc: "Le ticket est créé sur le routeur au moment de la vente. Aucun stock à gérer." },
  { key: "fai", name: "Mode FAI", globe: true, desc: "Pour un Fournisseur d'Accès Internet agréé qui couvre des promoteurs de wifi zone : tickets par RADIUS, prélèvement sur leurs ventes." },
];

const MODE_LABEL: Record<Mode, string> = {
  manuel: "manuel (import MikHmon)",
  radius: "RADIUS natif (stock pré-créé)",
  mikhmon: "MikHmon VPN",
  fai: "FAI",
};

type StepId = "choix" | "souscription" | "coordinateur" | "versions" | "routeur" | "walled" | "profils" | "config" | "agregateur" | "publication";

interface StepDef {
  id: StepId;
  title: string;
  tier: "preparer" | "poser" | "publier";
}

const STEPS: StepDef[] = [
  { id: "choix", title: "Choix de l'intégration", tier: "preparer" },
  { id: "souscription", title: "Souscription", tier: "preparer" },
  { id: "coordinateur", title: "Le Coordinateur", tier: "preparer" },
  { id: "versions", title: "Version de RouterOS", tier: "preparer" },
  { id: "routeur", title: "Intégration du routeur — RADIUS", tier: "poser" },
  { id: "walled", title: "Walled Garden", tier: "poser" },
  { id: "profils", title: "Création des profils", tier: "poser" },
  { id: "config", title: "Configuration du portail", tier: "publier" },
  { id: "agregateur", title: "Choix de l'agrégateur de paiement", tier: "publier" },
  { id: "publication", title: "Publication du portail captif", tier: "publier" },
];

const TIERS: { key: StepDef["tier"]; label: string; hint: string }[] = [
  { key: "preparer", label: "PRÉPARER", hint: "Votre compte et votre matériel" },
  { key: "poser", label: "POSER", hint: "S'ouvre une fois le palier précédent franchi" },
  { key: "publier", label: "PUBLIER", hint: "S'ouvre une fois le palier précédent franchi" },
];

const ROUTERS_COUNT = 8;

const btn = "rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-bold text-slate-200 hover:bg-white/10";
const btnPrimary = "rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3.5 py-2 text-[13px] font-bold text-white hover:brightness-110";

export default function IntegrationPage() {
  const [mode, setMode] = useState<Mode>("radius");
  const [reopen, setReopen] = useState(false);
  const [done, setDone] = useState<Record<StepId, boolean>>({
    choix: true, souscription: true, coordinateur: true, versions: false, routeur: true, walled: false,
    profils: true, config: true, agregateur: true, publication: true,
  });
  const [guided, setGuided] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const refs = useRef<Partial<Record<StepId, HTMLDivElement | null>>>({});

  const doneCount = STEPS.filter((s) => done[s.id]).length;
  const progress = Math.round((doneCount / STEPS.length) * 100);
  const nextStep = STEPS.find((s) => !done[s.id]);
  const walledLocked = !done.versions;

  function say(m: string) {
    setNote(m);
    setTimeout(() => setNote(null), 3500);
  }

  function mark(id: StepId, v = true) {
    setDone((d) => ({ ...d, [id]: v }));
  }

  function guideMe() {
    setGuided(true);
    if (nextStep) refs.current[nextStep.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    else say("Toutes les étapes sont faites.");
  }

  function reset() {
    setDone({ choix: false, souscription: false, coordinateur: false, versions: false, routeur: false, walled: false, profils: false, config: false, agregateur: false, publication: false });
    setMode("radius");
  }

  const R = 56;
  const C = 2 * Math.PI * R;

  const card = (id: StepId, extra = "") =>
    `rounded-2xl border p-5 ${done[id] ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/10 bg-white/[0.03]"} ${guided && nextStep?.id === id ? "border-violet-400 ring-2 ring-violet-400/50" : ""} ${extra}`;

  function Head({ id, title, info }: { id: StepId; title: string; info?: string }) {
    return (
      <div className="flex items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${done[id] ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-300"}`}>
          {done[id] ? <Check className="h-5 w-5" /> : <span className="text-sm font-bold">{STEPS.findIndex((s) => s.id === id) + 1}</span>}
        </span>
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <h3 className="text-[16px] font-extrabold text-white">{title}</h3>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider ${done[id] ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-slate-300"}`}>{done[id] ? "FAIT" : "À FAIRE"}</span>
        </div>
        {info && (
          <span title={info} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/20 text-[10px] italic text-slate-400">i</span>
        )}
      </div>
    );
  }

  const setRef = (id: StepId) => (el: HTMLDivElement | null) => { refs.current[id] = el; };

  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] flex-col bg-gradient-to-br from-[#0E1022] via-[#10122B] to-[#0B0D1E] text-white lg:-m-6 lg:flex-row">
      {/* Colonne gauche */}
      <aside className="shrink-0 border-b border-white/10 p-5 lg:w-[300px] lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-[22px] font-extrabold text-sky-300">
            <span className="h-5 w-5 rounded-full bg-gradient-to-br from-sky-200 to-violet-400" /> Mon intégration
          </h1>
          <Link href="/dashboard" aria-label="Fermer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/15"><X className="h-4 w-4" /></Link>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <div className="relative h-[120px] w-[120px]">
            <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
              <defs>
                <linearGradient id="ring" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#22D3EE" /></linearGradient>
              </defs>
              <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
              <circle cx="64" cy="64" r={R} fill="none" stroke="url(#ring)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(progress / 100) * C} ${C}`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[26px] font-extrabold">{progress}%</span>
              <span className="text-[10px] tracking-widest text-slate-400">PRÊT</span>
            </div>
          </div>
          <p className="mt-4 text-[16px] font-extrabold">🚀 {progress === 100 ? "Vous êtes prêt !" : "Vous y êtes presque"}</p>
          <p className="mt-1 text-center text-[13px] text-slate-400">{doneCount} sur {STEPS.length} · mode {MODE_LABEL[mode]}</p>
          <div className="mt-3 flex w-full gap-1">
            {STEPS.map((s) => (
              <span key={s.id} className={`h-1 flex-1 rounded-full ${done[s.id] ? "bg-gradient-to-r from-sky-400 to-violet-400" : "bg-white/10"}`} />
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          <button onClick={guideMe} className="h-11 w-full rounded-xl border border-white/10 bg-white/5 text-[14px] font-bold text-slate-200 hover:bg-white/10">Guide-moi pas à pas</button>
          <button onClick={() => setGuided(false)} className={`h-11 w-full rounded-xl border text-[14px] font-bold ${!guided ? "border-violet-400 bg-violet-500/20 text-white" : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"}`}>Je suis à l&apos;aise</button>
        </div>
      </aside>

      {/* Contenu */}
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 space-y-8 overflow-y-auto p-5 lg:p-6">
          {note && <p className="rounded-lg bg-violet-500/20 px-3 py-2 text-sm text-violet-100">{note}</p>}

          {TIERS.map((tier) => {
            const list = STEPS.filter((s) => s.tier === tier.key);
            const n = list.filter((s) => done[s.id]).length;
            return (
              <div key={tier.key}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-[13px] font-extrabold tracking-wider text-slate-300">{tier.label}</span>
                  <span className="text-[13px] text-slate-500">{tier.hint}</span>
                  <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-bold ${n === list.length ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-slate-300"}`}>{n}/{list.length}</span>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  {tier.key === "preparer" && (
                    <>
                      <div ref={setRef("choix")} className={card("choix", "lg:col-span-2")}>
                        <Head id="choix" title="Choix de l'intégration" info="Où naissent vos tickets ? Ce choix se change à tout moment." />
                        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          {MODES.map((m) => (
                            <button
                              key={m.key}
                              disabled={!reopen && done.choix}
                              onClick={() => setMode(m.key)}
                              className={`rounded-xl border p-3.5 text-left transition-colors ${mode === m.key ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 bg-white/[0.03]"} ${!reopen && done.choix ? "cursor-default" : "hover:border-white/30"}`}
                            >
                              <span className="flex items-center gap-1.5 text-[14px] font-extrabold">{m.bolt && <span className="text-amber-400">⚡</span>}{m.globe && <span>🌐</span>}{m.name}</span>
                              <span className="mt-1.5 block text-[12px] leading-relaxed text-slate-400">{m.desc}</span>
                            </button>
                          ))}
                        </div>
                        <div className="mt-4 flex gap-2">
                          {done.choix && !reopen && <button onClick={() => setReopen(true)} className={btn}>Rouvrir</button>}
                          {(!done.choix || reopen) && (
                            <button onClick={() => { mark("choix"); setReopen(false); say(`Mode « ${MODE_LABEL[mode]} » enregistré.`); }} className={btnPrimary}>Enregistrer ce choix</button>
                          )}
                        </div>
                      </div>

                      <div ref={setRef("souscription")} className={card("souscription")}>
                        <Head id="souscription" title="Souscription" info="Abonnement à la plateforme." />
                        <div className="mt-4 flex gap-2">
                          <Link href="/finance/billing" onClick={() => mark("souscription")} className={btn}>Ouvrir la page</Link>
                        </div>
                      </div>

                      <div ref={setRef("coordinateur")} className={card("coordinateur")}>
                        <Head id="coordinateur" title="Le Coordinateur" info="Petit programme installé sur le routeur." />
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link href="/portal" className={btn}>Revoir la commande d&apos;installation</Link>
                          <Link href="/console/mode" className={btn}>Changer de méthode</Link>
                        </div>
                      </div>

                      <div ref={setRef("versions")} className={`${card("versions", "lg:col-span-2")} ${!done.versions ? "border-cyan-400/60" : ""}`}>
                        <Head id="versions" title="Version de RouterOS" info="Le script livré dépend de la version." />
                        <p className="mt-3 text-[13px] leading-relaxed text-slate-300">RouterOS v7 enregistré, mais 2 routeur(s) annoncent v6 : les scripts livrés ne conviendront pas à ceux-là.</p>
                        <p className="mt-1 text-[12px] italic text-slate-500">La syntaxe des scripts diffère entre v6 et v7 : sans cette version, le script livré peut être refusé par votre routeur.</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button onClick={guideMe} className={btnPrimary}>Guide-moi</button>
                          <button onClick={() => mark("versions", !done.versions)} className={btn}>{done.versions ? "Annuler" : "J'ai fait cette étape"}</button>
                          <Link href="/vpn" className={btn}>Ouvrir la page</Link>
                        </div>
                      </div>
                    </>
                  )}

                  {tier.key === "poser" && (
                    <>
                      <div ref={setRef("routeur")} className={card("routeur")}>
                        <Head id="routeur" title="Intégration du routeur — RADIUS" info="Routeurs reliés au serveur RADIUS." />
                        <p className="mt-3 text-[13px] leading-relaxed text-slate-300">
                          {ROUTERS_COUNT} routeur(s) sur le RADIUS FLUXIONWIFI. L&apos;interopérabilité en accepte plusieurs : chaque routeur ajouté partage le même stock de tickets et les mêmes profils.
                        </p>
                        <div className="mt-4">
                          <Link href="/vpn" className={`${btn} inline-flex items-center gap-1.5`}><Plus className="h-4 w-4 text-violet-300" /> Ajouter un autre routeur</Link>
                        </div>
                      </div>

                      <div ref={setRef("walled")} className={`${card("walled")} ${walledLocked ? "opacity-70" : ""}`}>
                        <div className="flex items-center gap-3">
                          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${done.walled ? "bg-emerald-500" : "bg-white/10"}`}>
                            {done.walled ? <Check className="h-5 w-5" /> : <Lock className="h-4 w-4 text-amber-400" />}
                          </span>
                          <h3 className="text-[16px] font-extrabold">Walled Garden</h3>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider ${done.walled ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-slate-300"}`}>{done.walled ? "FAIT" : "À FAIRE"}</span>
                          <span title="Sites accessibles sans ticket" className="ml-auto flex h-5 w-5 items-center justify-center rounded-full border border-white/20 text-[10px] italic text-slate-400">i</span>
                        </div>
                        {walledLocked ? (
                          <p className="mt-3 text-[12px] text-slate-500">Se débloque après l&apos;étape « Version de RouterOS ».</p>
                        ) : (
                          <div className="mt-4 flex gap-2">
                            <button onClick={() => mark("walled", !done.walled)} className={btn}>{done.walled ? "Annuler" : "J'ai fait cette étape"}</button>
                            <Link href="/portal" className={btn}>Ouvrir la page</Link>
                          </div>
                        )}
                      </div>

                      <div ref={setRef("profils")} className={card("profils")}>
                        <Head id="profils" title="Création des profils" info="Forfaits, durées et prix." />
                        <div className="mt-4"><Link href="/console/profiles" className={btn}>Ouvrir la console</Link></div>
                      </div>
                    </>
                  )}

                  {tier.key === "publier" && (
                    <>
                      <div ref={setRef("config")} className={card("config")}>
                        <Head id="config" title="Configuration du portail" info="Nom, couleurs, modèle." />
                        <div className="mt-4"><Link href="/portal" className={btn}>Ouvrir la page</Link></div>
                      </div>

                      <div ref={setRef("agregateur")} className={card("agregateur")}>
                        <Head id="agregateur" title="Choix de l'agrégateur de paiement" info="FlexPay, Moneroo, FedaPay…" />
                        <div className="mt-4"><Link href="/portal" className={btn}>Ouvrir la page</Link></div>
                      </div>

                      <div ref={setRef("publication")} className={card("publication")}>
                        <Head id="publication" title="Publication du portail captif" info="À refaire après chaque modification." />
                        <p className="mt-3 text-[13px] leading-relaxed text-slate-300">
                          Republiez après toute modification des tarifs, des couleurs ou du modèle — sans quoi vos clients continuent de voir l&apos;ancienne version. Vous pouvez aussi publier VOTRE propre portail à la place du modèle.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button onClick={() => { mark("publication"); say("Portail republié."); }} className={btnPrimary}>Republier le portail</button>
                          <button onClick={() => say("Import d'un portail (.zip) : disponible avec le serveur.")} className={btn}>Importer mon portail (.zip)</button>
                          <Link href="/portal" className={btn}>Ouvrir la page</Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          <p className="flex items-center gap-2 text-xs text-slate-500"><Info className="h-3.5 w-3.5" /> Les étapes se valident automatiquement quand vous les terminez dans les pages concernées.</p>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 px-5 py-3">
          <button onClick={reset} className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2 text-[13px] font-bold text-red-300 hover:bg-red-500/20">Réinitialiser</button>
          <button onClick={() => say("Intégration actualisée.")} className={btn}>Actualiser</button>
        </div>
      </section>
    </div>
  );
}
