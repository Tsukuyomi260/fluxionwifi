"use client";

import { useState, type ReactNode } from "react";
import {
  Banknote,
  Check,
  Copy,
  Eraser,
  HandCoins,
  Inbox,
  Link2,
  List,
  Lock,
  Mail,
  MessageCircle,
  Pencil,
  Save,
  Send,
  Trash2,
  Unlock,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { usePartners } from "./use-partners";
import { formatCdf, formatDate } from "@/lib/reseller-data";
import type { Partner } from "@/lib/partners-data";

type Tab = "partners" | "withdrawals" | "add";
type Sub =
  | { type: "link"; id: string }
  | { type: "settle"; id: string }
  | { type: "journal"; id: string }
  | { type: "edit"; id: string }
  | { type: "message"; id: string }
  | { type: "delete"; id: string }
  | null;

const input =
  "h-11 w-full rounded-lg border border-[#374151] bg-[#1F2937] px-3.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20";
const label = "mb-1.5 block text-sm text-slate-300";

function SubModal({ title, onClose, children, danger = false }: { title: ReactNode; onClose: () => void; children: ReactNode; danger?: boolean }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div
        className={`max-h-[88vh] w-full max-w-md overflow-y-auto rounded-2xl p-6 shadow-2xl ${
          danger ? "bg-gradient-to-br from-[#312E81] to-[#9F1239]" : "border border-[#374151] bg-[#111827]"
        }`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className={`text-lg font-bold ${danger ? "text-amber-300" : "text-white"}`}>{title}</h3>
          <button onClick={onClose} aria-label="Fermer" className="rounded-lg p-1 text-slate-300 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PartnersManager({ onClose }: { onClose: () => void }) {
  const store = usePartners();
  const [tab, setTab] = useState<Tab>("partners");
  const [sub, setSub] = useState<Sub>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", password: "", creditLimit: 0, commission: 0 });
  const [edit, setEdit] = useState({ name: "", password: "", creditLimit: 0, commission: 0 });
  const [msg, setMsg] = useState("");

  const target = sub ? store.partners.find((p) => p.id === sub.id) : undefined;
  const pendingW = store.withdrawals.filter((w) => w.status === "pending").length;

  function openEdit(p: Partner) {
    setEdit({ name: p.name, password: "", creditLimit: p.creditLimit, commission: p.commission });
    setSub({ type: "edit", id: p.id });
  }

  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* presse-papiers indisponible */
    }
  }

  function link(p: Partner) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/vendeur/connexion?id=${encodeURIComponent(p.loginId)}`;
  }

  const tabBtn = (key: Tab, text: string, icon: ReactNode) => (
    <button
      onClick={() => setTab(key)}
      className={`flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors ${
        tab === key ? "bg-amber-400 text-[#1F2937]" : "text-slate-300 hover:bg-white/5"
      }`}
    >
      {icon} {text}
      {key === "withdrawals" && pendingW > 0 && <span className="rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">{pendingW}</span>}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-[#111827] shadow-2xl sm:rounded-2xl">
        {/* En-tête */}
        <div className="flex items-center justify-between bg-amber-400 px-5 py-4 text-[#1F2937]">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Users className="h-5 w-5" /> Gestion Partenaires
          </h2>
          <button onClick={onClose} aria-label="Fermer" className="rounded-lg p-1 hover:bg-black/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto p-4">
          <div className="space-y-1 rounded-xl border border-[#374151] bg-[#1B2440] p-2 sm:flex sm:space-y-0 sm:gap-1">
            {tabBtn("partners", "Partenaires", <Users className="h-4 w-4" />)}
            {tabBtn("withdrawals", "Retraits", <Banknote className="h-4 w-4" />)}
            {tabBtn("add", "Ajouter", <UserPlus className="h-4 w-4" />)}
          </div>

          {/* ------------ Partenaires ------------ */}
          {tab === "partners" &&
            (store.partners.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-400">Aucun partenaire. Utilisez l&apos;onglet Ajouter.</p>
            ) : (
              store.partners.map((p) => (
                <div key={p.id} className="rounded-xl border border-[#374151] bg-[#1B2440] p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="flex items-center gap-2 font-bold text-amber-300">
                      <User className="h-4 w-4" /> {p.name}
                    </p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.status === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                      {p.status === "active" ? "Actif" : "Bloqué"}
                    </span>
                  </div>
                  {p.name !== p.loginId && <p className="-mt-2 mb-3 font-mono text-xs text-slate-400">{p.loginId}</p>}

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { l: "Crédit utilisé", v: formatCdf(p.creditUsed), c: "text-amber-300" },
                      { l: "Limite de crédit", v: formatCdf(p.creditLimit), c: "text-white" },
                      { l: "Commission", v: `${p.commission}%`, c: "text-emerald-400" },
                      { l: "Disponible", v: formatCdf(p.creditLimit - p.creditUsed), c: "text-white" },
                    ].map((b) => (
                      <div key={b.l} className="rounded-lg bg-[#0F172A] px-2 py-2.5 text-center">
                        <p className="text-[11px] text-slate-400">{b.l}</p>
                        <p className={`mt-0.5 text-sm font-bold ${b.c}`}>{b.v}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-medium">
                    <button onClick={() => setSub({ type: "link", id: p.id })} className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25">
                      <Link2 className="h-3.5 w-3.5" /> Lien
                    </button>
                    <button onClick={() => setSub({ type: "settle", id: p.id })} disabled={p.creditUsed <= 0} className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 disabled:cursor-not-allowed disabled:opacity-40">
                      <HandCoins className="h-3.5 w-3.5" /> Solder
                    </button>
                    <button onClick={() => setSub({ type: "journal", id: p.id })} className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-white text-[#1F2937] hover:bg-slate-200">
                      <List className="h-3.5 w-3.5" /> Journal
                    </button>
                    <button onClick={() => openEdit(p)} className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-sky-500/15 text-sky-300 hover:bg-sky-500/25">
                      <Pencil className="h-3.5 w-3.5" /> Modifier
                    </button>
                    <button onClick={() => { setMsg(""); setSub({ type: "message", id: p.id }); }} className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-slate-500/20 text-slate-200 hover:bg-slate-500/30">
                      <Mail className="h-3.5 w-3.5" /> Message
                    </button>
                    <button onClick={() => store.toggleBlock(p.id)} className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25">
                      {p.status === "active" ? <><Lock className="h-3.5 w-3.5" /> Bloquer</> : <><Unlock className="h-3.5 w-3.5" /> Débloquer</>}
                    </button>
                  </div>
                  <button onClick={() => setSub({ type: "delete", id: p.id })} className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-red-900/40 text-xs font-medium text-red-400 hover:bg-red-900/60">
                    <Trash2 className="h-3.5 w-3.5" /> Supprimer
                  </button>
                </div>
              ))
            ))}

          {/* ------------ Retraits ------------ */}
          {tab === "withdrawals" &&
            (store.withdrawals.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-slate-400">
                <Inbox className="h-12 w-12" />
                <p className="mt-3 text-sm">Aucune demande de retrait</p>
              </div>
            ) : (
              store.withdrawals.map((w) => {
                const p = store.partners.find((x) => x.id === w.partnerId);
                return (
                  <div key={w.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#374151] bg-[#1B2440] p-3">
                    <div>
                      <p className="font-medium text-white">{p?.name ?? "Partenaire supprimé"}</p>
                      <p className="text-xs text-slate-400">{formatDate(w.at)} · {formatCdf(w.amount)}</p>
                    </div>
                    {w.status === "pending" ? (
                      <div className="flex gap-2">
                        <button onClick={() => store.decideWithdrawal(w.id, "approved")} aria-label="Approuver" className="rounded-lg bg-emerald-500 p-2 text-white"><Check className="h-4 w-4" /></button>
                        <button onClick={() => store.decideWithdrawal(w.id, "rejected")} aria-label="Refuser" className="rounded-lg bg-red-500/20 p-2 text-red-400"><X className="h-4 w-4" /></button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300">{w.status === "approved" ? "Approuvé" : "Refusé"}</span>
                    )}
                  </div>
                );
              })
            ))}

          {/* ------------ Ajouter ------------ */}
          {tab === "add" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const p = store.createPartner(form);
                setForm({ name: "", password: "", creditLimit: 0, commission: 0 });
                setTab("partners");
                setSub({ type: "link", id: p.id });
              }}
              className="space-y-3 rounded-xl border border-[#374151] bg-[#1B2440] p-4"
            >
              <h3 className="flex items-center gap-2 text-lg font-bold text-amber-300">
                <UserPlus className="h-5 w-5" /> Nouveau partenaire
              </h3>
              <div>
                <label className={label} htmlFor="p-name">Nom du partenaire</label>
                <input id="p-name" className={input} placeholder="Ex: Jean Dupont" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor="p-pass">Mot de passe</label>
                <input id="p-pass" className={input} placeholder="Mot de passe sécurisé (généré si vide)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor="p-limit">Limite de crédit (CDF)</label>
                <input id="p-limit" type="number" min={0} step={1000} className={input} value={form.creditLimit} onChange={(e) => setForm({ ...form, creditLimit: Number(e.target.value) })} />
              </div>
              <div>
                <label className={label} htmlFor="p-com">Commission sur vente (%)</label>
                <input id="p-com" type="number" min={0} max={100} className={input} value={form.commission} onChange={(e) => setForm({ ...form, commission: Number(e.target.value) })} />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button type="button" onClick={() => setForm({ name: "", password: "", creditLimit: 0, commission: 0 })} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#374151] text-sm font-medium text-white hover:bg-[#4B5563]">
                  <Eraser className="h-4 w-4" /> Effacer
                </button>
                <button className="flex h-11 items-center justify-center gap-2 rounded-lg bg-amber-400 text-sm font-bold text-[#1F2937] hover:bg-amber-300">
                  <Save className="h-4 w-4" /> Enregistrer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ------------ Lien d'accès ------------ */}
      {sub?.type === "link" && target && (
        <SubModal title={<span className="flex items-center gap-2"><Link2 className="h-5 w-5" /> Lien d&apos;accès</span>} onClose={() => setSub(null)} danger>
          <p className="text-sm text-slate-200">Lien unique pour <b className="text-amber-300">{target.name}</b></p>
          <p className="mt-3 break-all rounded-lg bg-black/25 p-3 font-mono text-xs text-emerald-300">{link(target)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => copy("link", link(target))} className="flex h-10 items-center gap-2 rounded-full bg-emerald-500 px-4 text-sm font-medium text-white hover:bg-emerald-600">
              {copied === "link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copier le lien
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Votre accès revendeur FLUXIONWIFI\nLien : ${link(target)}\nIdentifiant : ${target.loginId}\nMot de passe : ${target.password}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 items-center gap-2 rounded-full bg-cyan-500 px-4 text-sm font-medium text-white hover:bg-cyan-600"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <button onClick={() => setSub(null)} className="flex h-10 items-center gap-2 rounded-full bg-slate-500/50 px-4 text-sm font-medium text-white hover:bg-slate-500/70">
              <X className="h-4 w-4" /> Fermer
            </button>
          </div>
        </SubModal>
      )}

      {/* ------------ Solder ------------ */}
      {sub?.type === "settle" && target && (
        <SubModal title="Confirmation requise" onClose={() => setSub(null)} danger>
          <p className="text-slate-100">
            Confirmez-vous avoir reçu {target.creditUsed.toLocaleString("fr-FR")} CDF de &quot;{target.name}&quot; et voulez-vous solder son crédit ?
          </p>
          <div className="mt-5 flex gap-2">
            <button onClick={() => setSub(null)} className="flex h-10 items-center gap-2 rounded-full bg-slate-500/50 px-5 text-sm text-white hover:bg-slate-500/70"><X className="h-4 w-4" /> Annuler</button>
            <button onClick={() => { store.settle(target.id); setSub(null); }} className="flex h-10 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-medium text-white hover:bg-emerald-600"><Check className="h-4 w-4" /> Confirmer</button>
          </div>
        </SubModal>
      )}

      {/* ------------ Journal de la dette ------------ */}
      {sub?.type === "journal" && target && (() => {
        const mv = store.movements.filter((m) => m.partnerId === target.id);
        const sales = mv.filter((m) => m.type === "sale");
        const pays = mv.filter((m) => m.type === "payment");
        const salesTotal = sales.reduce((s, m) => s + m.amount, 0);
        const paysTotal = -pays.reduce((s, m) => s + m.amount, 0);
        const adj = mv.filter((m) => m.type === "adjustment").reduce((s, m) => s + m.amount, 0);
        const gap = target.creditUsed - (salesTotal - paysTotal + adj);
        return (
          <SubModal title={<span className="flex items-center gap-2"><List className="h-5 w-5" /> {target.name} — journal de la dette</span>} onClose={() => setSub(null)}>
            <div className="space-y-2 text-sm">
              <div className="rounded-lg bg-[#1B2440] p-3"><p className="text-xs text-slate-400">Dette affichée</p><p className="text-lg font-bold text-white">{target.creditUsed.toLocaleString("fr-FR")}</p></div>
              <div className="rounded-lg bg-[#1B2440] p-3"><p className="text-xs text-slate-400">Ventes cumulées</p><p className="text-lg font-bold text-white">{salesTotal.toLocaleString("fr-FR")}</p><p className="text-xs text-slate-400">{sales.length} vente(s)</p></div>
              <div className="rounded-lg bg-[#1B2440] p-3"><p className="text-xs text-slate-400">Remboursements</p><p className="text-lg font-bold text-white">{paysTotal.toLocaleString("fr-FR")}</p><p className="text-xs text-slate-400">{pays.length} paiement(s)</p></div>
              <div className="rounded-lg bg-[#1B2440] p-3"><p className="text-xs text-slate-400">Écart</p><p className={`text-lg font-bold ${gap === 0 ? "text-emerald-400" : "text-red-400"}`}>{gap.toLocaleString("fr-FR")}</p></div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              L&apos;écart compare la dette affichée à « ventes − remboursements − ajustements ». {gap === 0 ? "Les deux concordent." : "Les deux ne concordent pas : à vérifier."}
            </p>
            <table className="mt-3 w-full text-left text-xs text-slate-200">
              <thead className="text-slate-400"><tr><th className="py-2 font-medium">Date</th><th className="py-2 font-medium">Mouvement</th><th className="py-2 text-right font-medium">Montant</th></tr></thead>
              <tbody className="divide-y divide-[#374151]">
                {mv.length === 0 && <tr><td colSpan={3} className="py-6 text-center text-slate-500">Aucun mouvement.</td></tr>}
                {[...mv].sort((a, b) => b.at.localeCompare(a.at)).map((m) => (
                  <tr key={m.id}>
                    <td className="py-2.5 pr-2">{formatDate(m.at)}</td>
                    <td className="py-2.5 pr-2">{m.note}</td>
                    <td className={`py-2.5 text-right font-semibold ${m.amount > 0 ? "text-red-400" : "text-emerald-400"}`}>{m.amount > 0 ? "+" : ""}{m.amount.toLocaleString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SubModal>
        );
      })()}

      {/* ------------ Modifier ------------ */}
      {sub?.type === "edit" && target && (
        <SubModal title={<span className="flex items-center gap-2"><Pencil className="h-5 w-5" /> Modifier le partenaire</span>} onClose={() => setSub(null)} danger>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              store.updatePartner(target.id, edit);
              setSub(null);
            }}
            className="space-y-3 text-slate-100"
          >
            <div><label className="mb-1 block text-sm">Nom du partenaire :</label><input className={input} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
            <div><label className="mb-1 block text-sm">Nouveau mot de passe :</label><input className={input} placeholder="Nouveau mot de passe (optionnel)" value={edit.password} onChange={(e) => setEdit({ ...edit, password: e.target.value })} /></div>
            <div><label className="mb-1 block text-sm">Limite de crédit (CDF) :</label><input type="number" min={0} step={1000} className={input} value={edit.creditLimit} onChange={(e) => setEdit({ ...edit, creditLimit: Number(e.target.value) })} /></div>
            <div><label className="mb-1 block text-sm">Commission sur vente (%) :</label><input type="number" min={0} max={100} className={input} value={edit.commission} onChange={(e) => setEdit({ ...edit, commission: Number(e.target.value) })} /></div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setSub(null)} className="flex h-10 items-center gap-2 rounded-full bg-slate-500/50 px-5 text-sm text-white hover:bg-slate-500/70"><X className="h-4 w-4" /> Annuler</button>
              <button className="flex h-10 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-medium text-white hover:bg-emerald-600"><Check className="h-4 w-4" /> Enregistrer</button>
            </div>
          </form>
        </SubModal>
      )}

      {/* ------------ Message ------------ */}
      {sub?.type === "message" && target && (
        <SubModal title={<span className="flex items-center gap-2"><Mail className="h-5 w-5" /> Message à {target.name}</span>} onClose={() => setSub(null)}>
          <div className="mb-3 max-h-48 space-y-2 overflow-y-auto">
            {store.messages.filter((m) => m.partnerId === target.id).map((m) => (
              <div key={m.id} className={`flex ${m.from === "owner" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.from === "owner" ? "bg-amber-400 text-[#1F2937]" : "bg-[#1B2440] text-slate-100"}`}>
                  {m.body}
                  <p className="mt-0.5 text-[10px] opacity-60">{formatDate(m.at)}</p>
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!msg.trim()) return;
              store.sendMessage(target.id, msg.trim());
              setMsg("");
            }}
            className="flex gap-2"
          >
            <input className={input} placeholder="Écrire un message…" value={msg} onChange={(e) => setMsg(e.target.value)} />
            <button aria-label="Envoyer" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-[#1F2937] hover:bg-amber-300"><Send className="h-4 w-4" /></button>
          </form>
        </SubModal>
      )}

      {/* ------------ Supprimer ------------ */}
      {sub?.type === "delete" && target && (
        <SubModal title="Confirmation requise" onClose={() => setSub(null)} danger>
          <p className="text-slate-100">Supprimer définitivement le partenaire &quot;{target.name}&quot; ? Son historique sera perdu.</p>
          <div className="mt-5 flex gap-2">
            <button onClick={() => setSub(null)} className="flex h-10 items-center gap-2 rounded-full bg-slate-500/50 px-5 text-sm text-white hover:bg-slate-500/70"><X className="h-4 w-4" /> Annuler</button>
            <button onClick={() => { store.removePartner(target.id); setSub(null); }} className="flex h-10 items-center gap-2 rounded-full bg-red-500 px-5 text-sm font-medium text-white hover:bg-red-600"><Trash2 className="h-4 w-4" /> Supprimer</button>
          </div>
        </SubModal>
      )}
    </div>
  );
}
