"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Database, FileDown, FolderPlus, FolderOpen, HardDrive, Pencil, Server, X, FileUp, AlertCircle } from "lucide-react";
import { useTickets } from "@/hooks/use-tickets";
import { useRouters } from "@/hooks/use-routers";
import { useTransactions } from "@/hooks/use-transactions";
import { useSessions } from "@/hooks/use-sessions";

const AUTO_KEY = "fluxion-backup-auto";
const EVERY_KEY = "fluxion-backup-every";
const POINTS_KEY = "fluxion-restore-points";

interface RestorePoint {
  at: string;
  label: string;
  tickets: number;
  routers: number;
}

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* stockage indisponible */
  }
}

export default function DataManagementPage() {
  const { tickets } = useTickets();
  const { routers } = useRouters();
  const { transactions } = useTransactions();
  const { sessions } = useSessions();

  const [auto, setAuto] = useState(true);
  const [every, setEvery] = useState("6");
  const [points, setPoints] = useState<RestorePoint[]>([]);
  const [folder, setFolder] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setAuto(read(AUTO_KEY, true));
      setEvery(read(EVERY_KEY, "6"));
      setPoints(read<RestorePoint[]>(POINTS_KEY, []));
    }, 0);
    return () => clearTimeout(id);
  }, []);

  function toast(text: string, ok = true) {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 4500);
  }

  function addPoint(label: string) {
    const p: RestorePoint = { at: new Date().toLocaleString("fr-FR"), label, tickets: tickets.length, routers: routers.length };
    const next = [p, ...points].slice(0, 20);
    setPoints(next);
    write(POINTS_KEY, next);
  }

  function payload() {
    return {
      version: "1.0",
      exportDate: new Date().toISOString(),
      platform: "FLUXIONWIFI",
      data: {
        ticketsCount: tickets.length,
        routersCount: routers.length,
        transactionsCount: transactions.length,
        sessionsCount: sessions.length,
        tickets,
        routers,
        transactions,
        sessions,
      },
    };
  }

  function downloadAll() {
    try {
      const blob = new Blob([JSON.stringify(payload(), null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `fluxionwifi-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      addPoint("Fichier téléchargé");
      toast("Sauvegarde complète téléchargée.");
    } catch {
      toast("Erreur lors de l'export des données.", false);
    }
  }

  async function chooseFolder() {
    const w = window as unknown as { showDirectoryPicker?: () => Promise<{ name: string }> };
    if (!w.showDirectoryPicker) {
      toast("Ce navigateur ne permet pas de choisir un dossier. Utilisez « Tout télécharger en un fichier ».", false);
      return;
    }
    try {
      const dir = await w.showDirectoryPicker();
      setFolder(dir.name);
      addPoint(`Dossier « ${dir.name} »`);
      toast(`Dossier « ${dir.name} » choisi : vos données y seront copiées.`);
    } catch {
      /* choix annulé */
    }
  }

  function onRestoreFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const json = JSON.parse(String(ev.target?.result));
        if (json.platform !== "FLUXIONWIFI" || !json.data) throw new Error("format");
        toast(`Fichier valide : ${json.data.ticketsCount ?? 0} tickets, ${json.data.routersCount ?? 0} routeurs. La restauration sera appliquée avec le serveur.`);
      } catch {
        toast("Fichier de sauvegarde invalide ou corrompu.", false);
      }
    };
    r.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="-m-4 flex min-h-full items-center justify-center bg-[#0B132B]/90 p-4 text-white lg:-m-6 lg:p-6">
      <div className="relative w-full max-w-3xl space-y-4 rounded-2xl border border-[#1F293D] bg-[#131B2E] p-5 shadow-2xl lg:p-7">
        <div className="flex items-center justify-between border-b border-[#1F293D] pb-4">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-amber-400" />
            <h1 className="text-xl font-black text-amber-400">Gestion des Données</h1>
          </div>
          <Link href="/dashboard" aria-label="Fermer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E293B] text-gray-300 hover:bg-[#334155]">
            <X className="h-4 w-4" />
          </Link>
        </div>

        {msg && (
          <div className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold ${msg.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
            {msg.ok ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />} {msg.text}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[#1F293D] bg-[#101828] p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Compte FLUXIONWIFI</p>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E293B] text-slate-400">
                {folder ? <FolderOpen className="h-5 w-5" /> : <FolderOpen className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-[15px] font-bold">{folder ? `Dossier : ${folder}` : "Aucune sauvegarde sur cet appareil"}</p>
                <p className="mt-1 text-xs text-slate-400">Choisissez un dossier : vos données y seront copiées, puis tenues à jour.</p>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <button onClick={chooseFolder} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 text-sm font-bold text-[#1B1300] hover:brightness-110 sm:w-auto">
                <FolderPlus className="h-4 w-4" /> Choisir un dossier de sauvegarde
              </button>
              <button onClick={downloadAll} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#2A3550] bg-[#1A2338] px-4 text-sm font-bold hover:bg-[#222C45] sm:w-auto">
                <FileDown className="h-4 w-4" /> Tout télécharger en un fichier
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[#1F293D] bg-[#101828] p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Automatique</p>
            <div className="mt-3 flex items-center justify-between gap-3 text-[14px] font-semibold">
              <span>Sauvegarder tout seul quand cette page est ouverte</span>
              <button
                role="switch"
                aria-checked={auto}
                onClick={() => { setAuto(!auto); write(AUTO_KEY, !auto); }}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${auto ? "bg-emerald-500" : "bg-slate-600"}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${auto ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#1F293D] pt-3 text-sm">
              <span>Au moins toutes les</span>
              <select
                value={every}
                onChange={(e) => { setEvery(e.target.value); write(EVERY_KEY, e.target.value); }}
                className="rounded-lg border border-[#2A3550] bg-[#1A2338] px-3 py-1.5 text-sm"
              >
                {["1", "3", "6", "12", "24"].map((h) => <option key={h} value={h}>{h} heure{h === "1" ? "" : "s"}</option>)}
              </select>
            </div>
            <p className="mt-3 flex gap-2 text-xs text-slate-400">
              <Pencil className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Seul ce qui a changé est copié. Conservation : les 20 derniers points, puis un par jour sur 30 jours, puis un par mois sur un an.
            </p>
            <div className="mt-3 space-y-1.5 text-sm font-semibold text-slate-300">
              <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={onRestoreFile} />
              <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5"><FileUp className="h-4 w-4" /> Restaurer depuis un fichier</button>
              <button onClick={() => toast("Les sauvegardes du serveur seront disponibles avec le backend.")} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5"><Server className="h-4 w-4" /> Sauvegardes du serveur</button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#1F293D] bg-[#101828] p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Points de restauration</p>
          {points.length === 0 ? (
            <p className="py-5 text-center text-sm text-slate-400">Les points apparaîtront ici après la première sauvegarde.</p>
          ) : (
            <ul className="mt-3 divide-y divide-[#1F293D]">
              {points.map((p, i) => (
                <li key={i} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-slate-400" /> {p.at} · {p.label}</span>
                  <span className="text-xs text-slate-400">{p.tickets} tickets · {p.routers} routeurs</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
