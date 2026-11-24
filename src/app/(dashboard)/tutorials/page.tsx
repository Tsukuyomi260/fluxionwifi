"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Play, Search, BookOpen, Wrench, Bookmark, LayoutDashboard, Receipt, Headphones, CheckCircle, Download, Clock, User, X, Volume2,
  Film, Sparkles, Lock, Check,
} from "lucide-react";
import { FREE_TUTORIALS, GETTING_STARTED_IDS, TECH_TUTORIALS, toSeconds, type Audience, type Theme, type Tutorial } from "@/lib/tutorials-data";
import { useCurrency } from "@/hooks/use-currency";
import { convertFromCDF, formatAmount } from "@/lib/pricing";

type Tab = "fluxion" | "technique" | "mes";
type Sort = "new" | "views" | "short" | "path";
type AudFilter = "Tous" | Audience | "Non vus";

const THEMES: ("Tous les thèmes" | Theme)[] = ["Tous les thèmes", "Prise en main", "Ventes et tickets", "Portail captif", "Routeurs et réseau", "Compte, argent et aide", "Vos clients"];
const AUDIENCES: AudFilter[] = ["Tous", "Promoteur", "Technicien réseau", "Revendeur", "Client final", "Non vus"];
const SORTS: { key: Sort; label: string }[] = [
  { key: "new", label: "Nouveautés" },
  { key: "views", label: "Les plus vus" },
  { key: "short", label: "Les plus courts" },
  { key: "path", label: "Parcours conseillé" },
];
const SEEN_KEY = "fluxion-tutorials-seen";
const UNLOCK_KEY = "fluxion-tutorials-unlocked";

function readSet(key: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export default function TutorialsPage() {
  const { currency } = useCurrency();
  const [tab, setTab] = useState<Tab>("fluxion");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("path");
  const [theme, setTheme] = useState<(typeof THEMES)[number]>("Tous les thèmes");
  const [aud, setAud] = useState<AudFilter>("Tous");
  const [seen, setSeen] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [active, setActive] = useState<{ title: string; duration: string; description: string; id: string } | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setSeen(readSet(SEEN_KEY));
      setUnlocked(readSet(UNLOCK_KEY));
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const totalMinutes = Math.round(FREE_TUTORIALS.reduce((n, t) => n + toSeconds(t.duration), 0) / 60);
  const price = `${formatAmount(convertFromCDF(3887, currency))} ${currency}`;

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    let out = FREE_TUTORIALS.filter((t) => {
      if (theme !== "Tous les thèmes" && t.theme !== theme) return false;
      if (aud === "Non vus") return !seen.includes(t.id);
      if (aud !== "Tous" && !t.audience.includes(aud)) return false;
      if (s && !`${t.title} ${t.description} ${t.theme}`.toLowerCase().includes(s)) return false;
      return true;
    });
    if (aud === "Non vus" && s) out = out.filter((t) => `${t.title} ${t.description}`.toLowerCase().includes(s));
    const order = [...out];
    if (sort === "views") order.sort((a, b) => b.views - a.views);
    else if (sort === "short") order.sort((a, b) => toSeconds(a.duration) - toSeconds(b.duration));
    else if (sort === "new") order.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    else {
      const rank = (t: Tutorial) => {
        const i = GETTING_STARTED_IDS.indexOf(t.title);
        return i === -1 ? 99 : i;
      };
      order.sort((a, b) => rank(a) - rank(b));
    }
    return order;
  }, [q, theme, aud, sort, seen]);

  const featured = FREE_TUTORIALS.find((t) => t.featured)!;
  const starters = GETTING_STARTED_IDS.map((t) => FREE_TUTORIALS.find((x) => x.title === t)!).filter(Boolean);

  function open(t: { title: string; duration: string; description: string; id: string }) {
    setActive(t);
    if (t.id.startsWith("T") && !seen.includes(t.id)) {
      const next = [...seen, t.id];
      setSeen(next);
      try { localStorage.setItem(SEEN_KEY, JSON.stringify(next)); } catch { /* indisponible */ }
    }
  }

  function unlock(id: string) {
    const next = [...unlocked, id];
    setUnlocked(next);
    try { localStorage.setItem(UNLOCK_KEY, JSON.stringify(next)); } catch { /* indisponible */ }
    setNote("Tutoriel débloqué (démonstration : le paiement par solde sera branché avec le backend).");
    setTimeout(() => setNote(null), 4000);
  }

  const navBtn = (k: Tab, label: string, icon: React.ReactNode, badge?: { n: number; cls: string }) => (
    <button
      onClick={() => setTab(k)}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${tab === k ? "bg-[#2B7FFF] text-white shadow-md shadow-[#2B7FFF]/25" : "text-gray-300 hover:bg-[#1F2937] hover:text-white"}`}
    >
      <span className="flex items-center gap-2.5">{icon}{label}</span>
      {badge && <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${badge.cls}`}>{badge.n}</span>}
    </button>
  );

  const card = "rounded-xl border border-[#1F2937] bg-[#111827]";
  const chip = (on: boolean) => `rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${on ? "bg-[#2B7FFF] text-white" : "border border-[#1F2937] bg-[#111827] text-gray-300 hover:border-[#374151]"}`;
  const myTech = TECH_TUTORIALS.filter((t) => unlocked.includes(t.id));

  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] bg-[#0B1120] text-white lg:-m-6">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[#1F2937] bg-[#0F172A] p-4 lg:flex">
        <div className="flex items-center gap-2.5 border-b border-[#1F2937] pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2B7FFF] to-blue-400"><Film className="h-5 w-5 text-white" /></div>
          <div>
            <h1 className="text-sm font-extrabold tracking-wide">FLUXIONWIFI</h1>
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Tutoriels</p>
          </div>
        </div>
        <div className="mt-5">
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Apprendre</p>
          <div className="space-y-1">
            {navBtn("fluxion", "Tutoriels FLUXIONWIFI", <BookOpen className="h-4 w-4" />, { n: FREE_TUTORIALS.length, cls: "bg-emerald-500/20 text-emerald-400" })}
            {navBtn("technique", "Techniques", <Wrench className="h-4 w-4" />, { n: TECH_TUTORIALS.filter((t) => !t.soon).length, cls: "bg-amber-500/20 text-amber-400" })}
            {navBtn("mes", "Mes tutoriels", <Bookmark className="h-4 w-4" />)}
          </div>
        </div>
        <div className="mt-5">
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Mon espace</p>
          {[["/dashboard", "Tableau de bord", LayoutDashboard], ["/finance/billing", "Facturation", Receipt], ["/services", "Assistance", Headphones]].map(([href, label, Icon]) => {
            const I = Icon as typeof LayoutDashboard;
            return (
              <Link key={href as string} href={href as string} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-300 hover:bg-[#1F2937] hover:text-white">
                <I className="h-4 w-4 text-gray-400" /> {label as string}
              </Link>
            );
          })}
        </div>
        <div className="mt-6 rounded-xl border border-blue-800/30 bg-gradient-to-br from-blue-950/60 to-indigo-950/60 p-3.5">
          <p className="mb-1 flex items-center gap-2 text-xs font-bold text-blue-300"><Download className="h-3.5 w-3.5" /> Mode hors-ligne</p>
          <p className="mb-2 text-[11px] text-gray-300">Téléchargez les {FREE_TUTORIALS.length} vidéos pour une formation locale sur clé USB (433 Mo).</p>
          <button onClick={() => { setNote("Le pack hors-ligne sera disponible avec le serveur."); setTimeout(() => setNote(null), 3500); }} className="w-full rounded-lg border border-blue-500/30 bg-blue-600/30 py-1.5 text-[11px] font-semibold text-blue-200 hover:bg-blue-600/50">Télécharger le pack (ZIP)</button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 space-y-6 overflow-y-auto p-4 lg:p-8">
        <div className="flex items-center justify-between border-b border-[#1F2937]/60 pb-2">
          <span className="text-sm font-bold text-gray-200">≡ &nbsp;Tutoriels</span>
          <Link href="/account" className="flex items-center gap-2 rounded-xl border border-[#374151] bg-[#1F2937] px-3 py-1.5 text-xs text-gray-300 hover:text-white"><User className="h-3.5 w-3.5 text-emerald-400" /> Mon compte</Link>
        </div>

        {note && <p className="rounded-lg bg-[#2B7FFF]/20 px-3 py-2 text-sm text-blue-100">{note}</p>}

        {/* Bandeau */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 shadow-xl lg:p-8">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-blue-100"><Volume2 className="h-3.5 w-3.5 text-amber-300" /> TUTORIELS ANIMÉS, AVEC LA VOIX</span>
            <h2 className="text-2xl font-black tracking-tight lg:text-3xl">Apprenez <span className="text-amber-300">en quelques minutes</span></h2>
            <p className="text-sm leading-relaxed text-blue-100/90">Les guides de FLUXIONWIFI sont gratuits. Pour aller plus loin, les tutoriels techniques couvrent MikroTik, routeurs et antennes.</p>
            <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
              {[[String(FREE_TUTORIALS.length), "tutoriels gratuits", "text-amber-300"], [String(TECH_TUTORIALS.filter((t) => !t.soon).length), "tutoriels techniques", "text-white"], [`${totalMinutes} min`, "de vidéo gratuite", "text-emerald-300"], ["433 Mo", "tout, sans Internet (clé USB)", "text-amber-300"]].map(([v, l, c]) => (
                <div key={l} className="rounded-xl border border-white/10 bg-black/20 p-3"><p className={`text-xl font-black ${c}`}>{v}</p><p className="text-[11px] text-blue-200">{l}</p></div>
              ))}
            </div>
            <div className="relative max-w-md pt-2">
              <Search className="absolute left-3.5 top-[calc(50%+4px)] h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un tutoriel…" className="w-full rounded-xl bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-gray-900 shadow-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          </div>
        </section>

        {tab === "fluxion" && (
          <>
            {/* Présentation + à la une */}
            <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <div className={`${card} p-5`}>
                <div className="grid items-center gap-5 md:grid-cols-2">
                  <button onClick={() => open({ id: "P0", title: "FLUXIONWIFI Connect en 48 secondes", duration: "3:14", description: "Vente en ligne par Mobile Money, revendeurs suivis au franc près, VPN + MikHmon en ligne, un ticket valable sur tous vos sites." })} className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-indigo-900/40 bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_70%)]" />
                    <div className="z-10 space-y-2 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-amber-300">Voici la solution</p>
                      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-lg transition-transform group-hover:scale-110"><Play className="ml-0.5 h-6 w-6 fill-black text-black" /></span>
                    </div>
                    <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-gray-200">3:14</span>
                  </button>
                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400"><Sparkles className="h-3.5 w-3.5" /> Présentation</span>
                    <h3 className="text-xl font-bold">FLUXIONWIFI Connect <span className="text-amber-300">en 48 secondes</span></h3>
                    <ul className="space-y-2 text-xs text-gray-300">
                      {["Vente en ligne par Mobile Money, 24h/24", "Revendeurs suivis au franc près", "FLUXION VPN + MikHmon en ligne", "Un ticket valable sur tous vos sites"].map((x) => (
                        <li key={x} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" /> {x}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className={`${card} flex flex-col justify-between p-5`}>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300">À la une</p>
                  <h3 className="mt-2 text-lg font-bold">{featured.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">{featured.description}</p>
                </div>
                <button onClick={() => open(featured)} className="mt-4 inline-flex w-fit items-center gap-2 rounded-xl bg-[#2B7FFF] px-4 py-2.5 text-xs font-bold hover:bg-blue-600"><Play className="h-3.5 w-3.5 fill-white" /> Regarder</button>
              </div>
            </section>

            {/* Pour bien démarrer */}
            <section className="space-y-3">
              <div>
                <h3 className="text-base font-bold">Pour bien démarrer</h3>
                <p className="text-xs text-gray-400">{starters.length} tutoriels, dans l&apos;ordre</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {starters.map((t, i) => (
                  <button key={t.id} onClick={() => open(t)} className={`${card} flex items-center gap-3 p-3 text-left hover:border-[#2B7FFF]/50`}>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2B7FFF]/20 text-sm font-black text-[#2B7FFF]">{i + 1}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold">{t.title}</span><span className="text-[11px] text-gray-400">{t.duration} · {t.steps} étapes</span></span>
                    {seen.includes(t.id) && <Check className="h-4 w-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </section>

            {/* Filtres + liste */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Tutoriels {`FLUXIONWIFI`} · gratuits <span className="font-normal normal-case text-gray-500">— tout pour utiliser FLUXIONWIFI Connect</span></h3>
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-1.5"><span className="mr-1 text-[11px] font-bold uppercase text-gray-500">Trier</span>{SORTS.map((s) => <button key={s.key} onClick={() => setSort(s.key)} className={chip(sort === s.key)}>{s.label}</button>)}</div>
                <div className="flex flex-wrap items-center gap-1.5"><span className="mr-1 text-[11px] font-bold uppercase text-gray-500">Par</span>{AUDIENCES.map((a) => <button key={a} onClick={() => setAud(a)} className={chip(aud === a)}>{a}{a === "Non vus" ? ` ${FREE_TUTORIALS.filter((t) => !seen.includes(t.id)).length}` : ""}</button>)}</div>
                <div className="flex flex-wrap items-center gap-1.5">{THEMES.map((t) => <button key={t} onClick={() => setTheme(t)} className={chip(theme === t)}>{t}</button>)}</div>
              </div>
              <p className="text-xs text-gray-500">{list.length} vidéo{list.length > 1 ? "s" : ""}</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {list.map((t) => (
                  <button key={t.id} onClick={() => open(t)} className={`${card} group flex flex-col justify-between space-y-3 p-4 text-left transition-all hover:border-[#2B7FFF]/40`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-blue-300">{t.theme}</span>
                        <span className="flex items-center gap-1.5">
                          {t.isNew && <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold">Nouveau</span>}
                          {t.views >= 40 && <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-black">Populaire</span>}
                          <span className="flex items-center gap-1 text-[11px] text-gray-400"><Clock className="h-3 w-3" /> {t.duration}</span>
                        </span>
                      </div>
                      <h4 className="line-clamp-2 text-xs font-bold group-hover:text-[#2B7FFF]">{t.title}</h4>
                      <p className="line-clamp-3 text-[11px] text-gray-400">{t.description}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#1F2937] pt-2 text-[11px] text-gray-400">
                      <span>{t.steps} étapes + Expert{t.views ? ` · ${t.views} vues` : ""}</span>
                      <span className="font-semibold text-blue-300">{t.audience.join(" · ")}</span>
                    </div>
                  </button>
                ))}
                {list.length === 0 && <p className="col-span-full py-10 text-center text-sm text-gray-500">Aucun tutoriel ne correspond à ces filtres.</p>}
              </div>
            </section>
          </>
        )}

        {tab === "technique" && (
          <section className="space-y-4">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
              <h3 className="text-base font-bold text-amber-300">Tutoriels techniques · payants — configuration, maintenance, diagnostic</h3>
              <p className="mt-1 text-xs text-gray-300">Le savoir-faire des techniciens FLUXIONWIFI, en tutoriels animés. Routeurs MikroTik, antennes, réseaux : configurer, entretenir et dépanner pas à pas. Paiement unique par le solde ou Mobile Money, accès à vie depuis votre compte.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {TECH_TUTORIALS.map((t) => (
                <div key={t.id} className={`${card} flex flex-col justify-between space-y-3 p-4 ${t.soon ? "opacity-70" : ""}`}>
                  <div className="space-y-2">
                    <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${t.soon ? "bg-slate-600" : "bg-amber-500 text-black"}`}>{t.soon ? "Bientôt" : "Payant"}</span>
                    <h4 className="text-xs font-bold">{t.title}</h4>
                    <p className="text-[11px] text-gray-400">{t.soon ? `${t.desc} · tutoriel technique animé, avec la voix` : t.desc}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#1F2937] pt-2">
                    <div className="text-[11px] text-gray-400">
                      <p className="text-sm font-bold text-white">{t.soon ? `env. ${price}` : price}</p>
                      <p>{t.soon ? "paiement unique, accès à vie" : `${t.topic} · ${t.minutes} · ${t.steps} étapes`}</p>
                    </div>
                    {t.soon ? (
                      <Lock className="h-4 w-4 text-gray-500" />
                    ) : unlocked.includes(t.id) ? (
                      <button onClick={() => open({ id: t.id, title: t.title, duration: t.length, description: t.desc })} className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold">Regarder</button>
                    ) : (
                      <button onClick={() => unlock(t.id)} className="rounded-lg bg-[#2B7FFF] px-3 py-1.5 text-xs font-bold hover:bg-blue-600">Voir le détail</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "mes" && (
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Mes tutoriels — ceux que vous avez débloqués</h3>
            {myTech.length === 0 ? (
              <p className={`${card} p-6 text-sm text-gray-400`}>Vous n&apos;avez encore débloqué aucun tutoriel technique.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {myTech.map((t) => (
                  <button key={t.id} onClick={() => open({ id: t.id, title: t.title, duration: t.length, description: t.desc })} className={`${card} p-4 text-left hover:border-[#2B7FFF]/40`}>
                    <h4 className="text-xs font-bold">{t.title}</h4>
                    <p className="mt-1 text-[11px] text-gray-400">{t.topic} · {t.length}</p>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setActive(null)}>
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#1F2937] bg-[#111827] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#1F2937] p-4">
              <h3 className="flex items-center gap-2 truncate text-xs font-bold"><Play className="h-4 w-4 text-[#2B7FFF]" /> {active.title}</h3>
              <button onClick={() => setActive(null)} aria-label="Fermer" className="rounded-lg p-1 text-gray-400 hover:bg-[#1F2937] hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex aspect-video flex-col items-center justify-center space-y-3 bg-black p-6 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#2B7FFF]/40 bg-[#2B7FFF]/20 text-[#2B7FFF]"><Film className="h-8 w-8" /></span>
              <p className="text-sm font-bold">{active.title}</p>
              <p className="text-xs text-gray-400">Durée : {active.duration} · Voix explicative en français · la vidéo sera disponible avec le serveur</p>
            </div>
            <div className="flex items-center justify-between gap-4 bg-[#0F172A] p-4 text-xs text-gray-300">
              <p>{active.description}</p>
              <button onClick={() => setActive(null)} className="shrink-0 rounded-lg bg-[#1F2937] px-3 py-1.5 font-medium hover:bg-[#374151]">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
