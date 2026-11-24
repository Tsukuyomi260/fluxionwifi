"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Printer, Settings, Ticket, UserPlus, Wand2, X, Zap } from "lucide-react";
import { useConsoleStore } from "@/components/console/console-store";
import { CodeSettingsForm, describeFormat } from "@/components/console/code-settings";
import { INITIAL_PARTNERS } from "@/lib/partners-data";

const field = "h-11 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";
const label = "mb-1.5 block text-sm font-semibold text-[#1A1D26]";

export default function GeneratePage() {
  const { profiles, settings, lastLot, generate, createSpecific, suggestUser } = useConsoleStore();
  const [profileId, setProfileId] = useState("");
  const [seller, setSeller] = useState("Moi (admin)");
  const [quantity, setQuantity] = useState(10);
  const [showConfig, setShowConfig] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const [spProfile, setSpProfile] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [spError, setSpError] = useState<string | null>(null);
  const [spInfo, setSpInfo] = useState<string | null>(null);

  function create(e: React.FormEvent) {
    e.preventDefault();
    setInfo(null);
    if (!profileId) return setError("Choisissez un profil.");
    if (quantity < 1 || quantity > 1000) return setError("La quantité doit être comprise entre 1 et 1000.");
    setError(null);
    const lot = generate(profileId, quantity, seller);
    if (lot) setInfo(`${lot.count} ticket(s) créé(s).`);
  }

  function createOne(e: React.FormEvent) {
    e.preventDefault();
    setSpInfo(null);
    const pid = spProfile || profileId;
    if (!pid) return setSpError("Choisissez un profil.");
    const res = createSpecific(pid, user, pass);
    if (!res.ok) return setSpError(res.error);
    setSpError(null);
    setSpInfo(`Ticket « ${res.ticket.user} » créé.`);
    setUser("");
    setPass("");
  }

  const profileName = (id: string) => profiles.find((p) => p.id === id)?.name ?? "—";
  const profileSelect = (value: string, onChange: (v: string) => void) => (
    <select className={field} value={value} onChange={(e) => onChange(e.target.value)} aria-label="Profil">
      <option value="">— Choisir un profil —</option>
      {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
    </select>
  );

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#1A1D26]">Générer des tickets</h1>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="flex items-center gap-2 bg-emerald-500 px-5 py-3 text-base font-semibold text-white">
          <Ticket className="h-5 w-5" /> Générer des tickets
        </div>
        <form onSubmit={create} className="space-y-4 p-5">
          {error && <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>}
          {info && <div className="rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">{info}</div>}

          <div>
            <label className={label}>Profil</label>
            {profileSelect(profileId, setProfileId)}
          </div>
          <div>
            <label className={label} htmlFor="g-seller">Vendeur affiché sur le ticket <span className="font-normal text-[#6B7280]">(« Vendu par »)</span></label>
            <select id="g-seller" className={field} value={seller} onChange={(e) => setSeller(e.target.value)}>
              <option>Moi (admin)</option>
              {INITIAL_PARTNERS.map((p) => <option key={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="g-qty">Quantité</label>
            <input id="g-qty" type="number" min={1} max={1000} className={field} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          </div>
          <div>
            <p className={label}>Format des codes</p>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-[#E5E7EB] p-3">
              <p className="text-xs text-[#6B7280]">{describeFormat(settings)}</p>
              <button type="button" onClick={() => setShowConfig(true)} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#D1D5DB] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6]">
                <Settings className="h-4 w-4" /> Configurer
              </button>
            </div>
          </div>
          <button className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 text-sm font-semibold text-white hover:bg-emerald-600">
            <Zap className="h-4 w-4" /> Créer les tickets
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] border-t-4 border-t-teal-500 bg-white">
        <div className="flex items-center gap-2 border-b border-[#E5E7EB] px-5 py-3 text-base font-semibold text-[#1A1D26]">
          <UserPlus className="h-5 w-5" /> Créer un ticket spécifique
        </div>
        <form onSubmit={createOne} className="space-y-4 p-5">
          <p className="text-xs leading-relaxed text-[#6B7280]">
            Crée <b>un seul ticket</b> avec des identifiants choisis. Utilise le <b>profil</b> et le <b>vendeur</b> sélectionnés ci-dessus (ticket destiné à l&apos;impression). Laissez le mot de passe vide pour un code unique (voucher : utilisateur = mot de passe).
          </p>
          {spError && <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{spError}</div>}
          {spInfo && <div className="rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">{spInfo}</div>}
          <div>
            <label className={label}>Profil du ticket</label>
            {profileSelect(spProfile || profileId, setSpProfile)}
          </div>
          <div>
            <label className={label} htmlFor="sp-user">Nom d&apos;utilisateur <span className="text-red-500">*</span></label>
            <input id="sp-user" className={field} placeholder="ex. EMMA001" value={user} onChange={(e) => setUser(e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="sp-pass">Mot de passe <span className="font-normal text-[#6B7280]">(optionnel)</span></label>
            <input id="sp-pass" className={field} placeholder="laisser vide = voucher" value={pass} onChange={(e) => setPass(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setUser(suggestUser())} className="flex h-11 items-center gap-2 rounded-lg border border-[#D1D5DB] px-5 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6]">
              <Wand2 className="h-4 w-4" /> Suggérer
            </button>
            <button className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-teal-500 text-sm font-semibold text-white hover:bg-teal-600">
              <UserPlus className="h-4 w-4" /> Créer ce ticket
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3">
          <h2 className="flex items-center gap-2 text-base font-semibold text-[#1A1D26]"><Eye className="h-5 w-5" /> Aperçu du dernier lot</h2>
          {lastLot && (
            <Link href="/console/print" className="flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] px-3 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6]">
              <Printer className="h-4 w-4" /> Imprimer
            </Link>
          )}
        </div>
        {!lastLot ? (
          <p className="px-5 py-8 text-center text-sm text-[#6B7280]">Aucun lot créé pour l&apos;instant.</p>
        ) : (
          <div className="p-5">
            <p className="mb-3 text-sm text-[#6B7280]">
              Profil <b className="text-[#1A1D26]">{profileName(lastLot.lot.profileId)}</b> · {lastLot.lot.count} ticket(s) · vendu par {lastLot.lot.seller}
            </p>
            <div className="max-h-64 overflow-auto rounded-lg border border-[#E5E7EB]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#F9FAFB] text-left text-xs text-[#6B7280]"><tr><th className="px-4 py-2">Utilisateur</th><th className="px-4 py-2">Mot de passe</th></tr></thead>
                <tbody className="divide-y divide-[#F0F2F5] font-mono">
                  {lastLot.tickets.slice(0, 50).map((t) => <tr key={t.id}><td className="px-4 py-2">{t.user}</td><td className="px-4 py-2">{t.password}</td></tr>)}
                </tbody>
              </table>
            </div>
            {lastLot.tickets.length > 50 && <p className="mt-2 text-xs text-[#6B7280]">… et {lastLot.tickets.length - 50} autres.</p>}
          </div>
        )}
      </div>

      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1A1D26]">Format des codes</h3>
              <button onClick={() => setShowConfig(false)} aria-label="Fermer" className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F3F4F6]"><X className="h-5 w-5" /></button>
            </div>
            <CodeSettingsForm onSaved={() => setShowConfig(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
