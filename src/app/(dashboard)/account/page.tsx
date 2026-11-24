"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookText,
  Boxes,
  Gift,
  LayoutDashboard,
  LogOut,
  Receipt,
  Search,
  ShieldCheck,
  Stethoscope,
  UserCircle,
  Users,
  Wifi,
  BarChart3,
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useCurrency } from "@/hooks/use-currency";
import { createClient } from "@/lib/supabase/client";
import { getCountries } from "@/lib/currency";
import { logout } from "@/app/(auth)/actions";
import { LinkedAccountsModal, ActivityLogModal } from "@/components/account/account-modals";
import { TicketVerifyModal } from "@/components/account/ticket-verify-modal";

type Modal = null | "accounts" | "journal" | "verify";

const field = "h-11 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1D26] focus:border-[#2B7FFF] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20";

export default function AccountPage() {
  const { user, displayName } = useUser();
  const { country, currency } = useCurrency();
  const [modal, setModal] = useState<Modal>(null);
  const [form, setForm] = useState({ name: "", phone: "", country: "CD" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: (user.user_metadata?.full_name as string) || "",
      phone: (user.user_metadata?.phone as string) || "",
      country: country.code,
    });
  }, [user, country.code]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ data: { full_name: form.name.trim(), phone: form.phone.trim(), country: form.country } });
      if (error) throw error;
      // Miroir dans la table profiles (devise et pays utilisés par le reste de la plateforme).
      if (user) {
        await supabase.from("profiles").update({ full_name: form.name.trim(), phone: form.phone.trim(), country: form.country }).eq("id", user.id);
      }
      const c = getCountries().find((x) => x.code === form.country);
      setMsg({ ok: true, text: `Profil enregistré. Devise : ${c?.currency.code ?? currency}.` });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Impossible d'enregistrer le profil." });
    } finally {
      setSaving(false);
    }
  }

  const tools: { label: string; desc: string; icon: React.ComponentType<{ className?: string }>; href?: string; action?: Modal }[] = [
    { label: "Gérer mon Affiliation", desc: "Parrainage et commissions", icon: Gift, href: "/affiliation" },
    { label: "Trouver un ticket vendu", desc: "Vérifier l'état d'un ticket", icon: Search, action: "verify" },
    { label: "Rapports de Ventes Globales", desc: "Ventes par période et par profil", icon: BarChart3, href: "/console/inventory" },
    { label: "Gestion Globale des Stocks", desc: "Tickets par profil et par lot", icon: Boxes, href: "/console/stock" },
    { label: "Logs d'Activités Système", desc: "Journal des actions du compte", icon: BookText, action: "journal" },
    { label: "Suivi des Abonnements", desc: "Formule, facturation, services", icon: Receipt, href: "/finance/billing" },
    { label: "Clients Identifiés & Connexions", desc: "Sessions et appareils connectés", icon: Wifi, href: "/console/sessions" },
    { label: "Gestion Demandes Clients", desc: "Tickets d'assistance", icon: Stethoscope, href: "/support" },
  ];

  const tile = "group flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#2B7FFF]/40 hover:shadow-md";

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1E4D]">Mon compte</h1>
        <p className="mt-1 text-sm text-[#6B7280]">Gérez votre profil, vos comptes associés et accédez aux outils et rapports.</p>
      </div>

      {/* Sélecteur de compte */}
      <section className="rounded-[14px] border border-[#E5E7EB] bg-white p-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Sélecteur de compte</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[220px] flex-1 items-center gap-3 rounded-xl bg-[#F5F7FA] px-4 py-3">
            <UserCircle className="h-8 w-8 text-[#2B7FFF]" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#1A1D26]">{displayName}</p>
              <p className="truncate text-xs text-[#6B7280]">{user?.email ?? "—"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setModal("accounts")} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#EBF2FF] px-4 text-sm font-medium text-[#2B7FFF] hover:bg-[#DCE9FF]"><Users className="h-4 w-4" /> Gérer les comptes</button>
            <Link href="/settings" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#EBF2FF] px-4 text-sm font-medium text-[#2B7FFF] hover:bg-[#DCE9FF]"><ShieldCheck className="h-4 w-4" /> Sécurité</Link>
            <Link href="/dashboard" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#EBF2FF] px-4 text-sm font-medium text-[#2B7FFF] hover:bg-[#DCE9FF]"><LayoutDashboard className="h-4 w-4" /> Tableau de bord</Link>
            <form action={logout}>
              <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-500 px-4 text-sm font-medium text-white hover:bg-red-600"><LogOut className="h-4 w-4" /> Déconnexion</button>
            </form>
          </div>
        </div>
      </section>

      {/* Outils et rapports */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-[#1A1D26]">Outils et rapports</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {tools.map((t) => {
            const inner = (
              <>
                <div className="rounded-xl bg-[#EBF2FF] p-2.5 text-[#2B7FFF]"><t.icon className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1A1D26]">{t.label}</p>
                  <p className="text-xs text-[#6B7280]">{t.desc}</p>
                </div>
              </>
            );
            return t.href ? (
              <Link key={t.label} href={t.href} className={tile}>{inner}</Link>
            ) : (
              <button key={t.label} onClick={() => setModal(t.action ?? null)} className={tile}>{inner}</button>
            );
          })}
        </div>
      </section>

      {/* Profil */}
      <section className="rounded-[14px] border border-[#E5E7EB] bg-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-[#1A1D26]">Profil et pays</h2>
        <p className="mb-4 text-xs text-[#6B7280]">Le pays détermine la devise des prix et des ventes ({currency} actuellement).</p>
        <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-[#374151]">Nom complet
            <input className={`${field} mt-1.5`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="text-sm font-medium text-[#374151]">Téléphone
            <input className={`${field} mt-1.5`} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={country.phonePrefix} />
          </label>
          <label className="text-sm font-medium text-[#374151]">Email
            <input className={`${field} mt-1.5 bg-[#F9FAFB] text-[#6B7280]`} value={user?.email ?? ""} readOnly />
          </label>
          <label className="text-sm font-medium text-[#374151]">Pays
            <select className={`${field} mt-1.5`} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
              {getCountries().map((c) => <option key={c.code} value={c.code}>{c.name} ({c.currency.code})</option>)}
            </select>
          </label>
          <div className="sm:col-span-2">
            {msg && <p className={`mb-3 rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{msg.text}</p>}
            <button disabled={saving || !user} className="h-11 rounded-xl bg-[#2B7FFF] px-6 text-sm font-medium text-white hover:bg-[#1A6BE6] disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Enregistrement…" : "Enregistrer"}</button>
          </div>
        </form>
      </section>

      {modal === "accounts" && <LinkedAccountsModal currentName={displayName} onClose={() => setModal(null)} />}
      {modal === "journal" && <ActivityLogModal onClose={() => setModal(null)} />}
      {modal === "verify" && <TicketVerifyModal onClose={() => setModal(null)} />}
    </div>
  );
}
