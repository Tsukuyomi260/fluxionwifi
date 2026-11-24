"use client";

import { useState, type ReactNode } from "react";
import { BookText, Link2, Trash2, Users, X } from "lucide-react";

function Modal({ title, icon, onClose, children }: { title: string; icon: ReactNode; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[#2D3A63] bg-[#16213E] p-5 text-slate-100 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold text-amber-300">{icon} {title}</h3>
          <button onClick={onClose} aria-label="Fermer" className="rounded-full bg-white/10 p-1.5 hover:bg-white/20"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

interface LinkedAccount { id: string; login: string; label: string }

export function LinkedAccountsModal({ currentName, onClose }: { currentName: string; onClose: () => void }) {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([{ id: "a0", login: currentName, label: "Compte principal" }]);
  const [adding, setAdding] = useState(false);
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
  const [active, setActive] = useState("a0");

  function link(e: React.FormEvent) {
    e.preventDefault();
    if (!login.trim() || !pass) return;
    const id = `a${accounts.length + Date.now() % 1000}`;
    setAccounts((a) => [...a, { id, login: login.trim(), label: "Compte lié" }]);
    setActive(id);
    setLogin("");
    setPass("");
    setAdding(false);
  }

  return (
    <Modal title="Comptes Associés" icon={<Users className="h-4 w-4" />} onClose={onClose}>
      <ul className="space-y-2">
        {accounts.map((a) => (
          <li key={a.id} className="flex items-center gap-2">
            <button onClick={() => setActive(a.id)} className={`flex-1 rounded-lg px-3 py-2 text-left text-sm font-semibold ${active === a.id ? "bg-emerald-500 text-white" : "bg-[#0F172A] text-slate-200 hover:bg-[#1E293B]"}`}>
              {a.login} <span className="ml-1 text-xs font-normal opacity-80">· {a.label}</span>
            </button>
            {a.id !== "a0" && (
              <button onClick={() => setAccounts((x) => x.filter((y) => y.id !== a.id))} aria-label="Délier ce compte" className="rounded-lg bg-white/10 p-2 text-red-300 hover:bg-white/20"><Trash2 className="h-4 w-4" /></button>
            )}
          </li>
        ))}
      </ul>

      {adding ? (
        <form onSubmit={link} className="mt-4 space-y-2">
          <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Identifiant du compte" className="h-10 w-full rounded-lg border border-[#2D3A63] bg-[#0F172A] px-3 text-sm placeholder:text-slate-500 focus:border-amber-300 focus:outline-none" />
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Mot de passe" className="h-10 w-full rounded-lg border border-[#2D3A63] bg-[#0F172A] px-3 text-sm placeholder:text-slate-500 focus:border-amber-300 focus:outline-none" />
          <div className="flex gap-2">
            <button type="button" onClick={() => setAdding(false)} className="h-9 flex-1 rounded-full bg-slate-500/40 text-sm hover:bg-slate-500/60">Annuler</button>
            <button className="h-9 flex-1 rounded-full bg-sky-500 text-sm font-medium text-white hover:bg-sky-600">Lier</button>
          </div>
          <p className="text-[11px] text-slate-400">Démonstration : la liaison réelle de comptes sera gérée par le back-end.</p>
        </form>
      ) : (
        <div className="mt-4 text-center">
          <button onClick={() => setAdding(true)} className="inline-flex h-9 items-center gap-2 rounded-full bg-sky-500 px-5 text-sm font-medium text-white hover:bg-sky-600">
            <Link2 className="h-4 w-4" /> Lier un nouveau compte
          </button>
        </div>
      )}
    </Modal>
  );
}

const LOG = [
  ["09:12:04", "Connexion de l'administrateur principal : FLUXIONWIFI."],
  ["09:12:05", "Chargement des comptes associés terminé."],
  ["09:12:06", "Authentification réussie. Interface utilisateur chargée."],
  ["09:14:20", "Profil tarifaire « 1GB-24H » créé."],
  ["09:16:41", "Lot de 10 tickets généré (profil 1GB-24H)."],
  ["09:18:02", "Revendeur FLX-FLU-002-SITE : limite de crédit modifiée."],
  ["10:03:37", "Règlement reçu : crédit de FLX-FLU-001-SITE soldé."],
  ["10:41:12", "Portail captif : prévisualisation mise à jour (login.html)."],
];

export function ActivityLogModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Journal d'Activités" icon={<BookText className="h-4 w-4" />} onClose={onClose}>
      <div className="max-h-80 overflow-y-auto rounded-lg bg-[#0F172A] p-3 font-mono text-[11px] leading-relaxed text-slate-200">
        {LOG.map(([t, m]) => (
          <p key={t}><span className="text-slate-400">[{t}]</span> {m}</p>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-slate-400">Exemple d&apos;entrées : le journal réel sera alimenté par le back-end.</p>
    </Modal>
  );
}
