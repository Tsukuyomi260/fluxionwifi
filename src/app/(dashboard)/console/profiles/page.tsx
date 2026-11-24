"use client";

import { useState } from "react";
import { Layers, Pencil, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { useConsoleStore, type TariffProfile } from "@/components/console/console-store";
import { useCurrency } from "@/hooks/use-currency";

const field = "h-11 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";
const hint = "mt-1 text-xs text-[#6B7280]";
const code = "text-pink-600";

const empty: Omit<TariffProfile, "id"> = {
  name: "",
  sessionDuration: "",
  validity: "",
  rateLimit: "",
  quotaValue: 0,
  quotaUnit: "Go",
  devices: 1,
  price: 0,
  reducedRate: "",
};

export default function ProfilesPage() {
  const { profiles, saveProfile, deleteProfile } = useConsoleStore();
  const { currency } = useCurrency();
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const { updated } = saveProfile(form);
    setMessage(updated ? `Profil « ${form.name.trim()} » mis à jour.` : `Profil « ${form.name.trim()} » créé.`);
    setForm(empty);
  }

  function edit(p: TariffProfile) {
    const { id, ...rest } = p;
    void id;
    setForm(rest);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#1A1D26]">Profils tarifaires</h1>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="flex items-center gap-2 bg-emerald-500 px-5 py-3 text-base font-semibold text-white">
          <Plus className="h-5 w-5" /> Nouveau profil
        </div>
        <form onSubmit={submit} className="space-y-4 p-5">
          {message && <div className="rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">{message}</div>}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#1A1D26]" htmlFor="pf-name">Nom du profil</label>
            <input id="pf-name" className={field} placeholder="ex: 1jour, 1h, 2Go" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#1A1D26]" htmlFor="pf-dur">Durée de session (uptime cumulé)</label>
            <input id="pf-dur" className={field} placeholder="ex: 1h, 1d, 2w (vide = illimité)" value={form.sessionDuration} onChange={(e) => setForm({ ...form, sessionDuration: e.target.value })} />
            <p className={hint}>Format MikroTik : s, m, h, d, w (ex. <span className={code}>1h, 1d, 2w, 1d12h</span>).</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#1A1D26]" htmlFor="pf-val">Validité après 1<sup>er</sup> login</label>
            <input id="pf-val" className={field} placeholder="ex: 30d (vide = aucune)" value={form.validity} onChange={(e) => setForm({ ...form, validity: e.target.value })} />
            <p className={hint}>Même format MikroTik : s, m, h, d, w (ex. <span className={code}>30d, 1w</span>).</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#1A1D26]" htmlFor="pf-rate">Bande passante (Rate-Limit)</label>
            <input id="pf-rate" className={field} placeholder="ex: 2M/2M" value={form.rateLimit} onChange={(e) => setForm({ ...form, rateLimit: e.target.value })} />
            <p className={hint}>Format MikroTik : <span className={code}>montée/descente</span> avec k, M ou G (ex. <span className={code}>2M/2M, 512k/1M</span>).</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#1A1D26]" htmlFor="pf-quota">Quota data (vide / 0 = illimité)</label>
            <div className="flex">
              <input id="pf-quota" type="number" min={0} className={`${field} rounded-r-none`} value={form.quotaValue} onChange={(e) => setForm({ ...form, quotaValue: Number(e.target.value) })} />
              <select aria-label="Unité du quota" className="h-11 rounded-r-lg border border-l-0 border-[#D1D5DB] bg-white px-3 text-sm" value={form.quotaUnit} onChange={(e) => setForm({ ...form, quotaUnit: e.target.value as "Mo" | "Go" })}>
                <option>Mo</option>
                <option>Go</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#1A1D26]" htmlFor="pf-dev">Appareils simultanés</label>
              <input id="pf-dev" type="number" min={1} className={field} value={form.devices} onChange={(e) => setForm({ ...form, devices: Math.max(1, Number(e.target.value)) })} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#1A1D26]" htmlFor="pf-price">Prix ({currency})</label>
              <input id="pf-price" type="number" min={0} className={field} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#1A1D26]" htmlFor="pf-red">
              Débit réduit après quota <span className="font-normal text-[#6B7280]">(vide = le ticket est coupé, comportement actuel)</span>
            </label>
            <input id="pf-red" className={field} placeholder="ex: 256k/256k" value={form.reducedRate} onChange={(e) => setForm({ ...form, reducedRate: e.target.value })} />
            <p className={hint}>Quand le quota est consommé, le ticket reste utilisable au débit indiqué jusqu&apos;à la fin de sa validité, au lieu d&apos;être coupé.</p>
          </div>

          <button className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 text-sm font-semibold text-white hover:bg-emerald-600">
            <Save className="h-4 w-4" /> Créer / mettre à jour
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-[#1A1D26]">
            <Layers className="h-5 w-5 text-[#6B7280]" /> Profils existants
          </h2>
          <button aria-label="Actualiser" onClick={() => setMessage(null)} className="rounded p-1 text-[#9CA3AF] hover:text-[#374151]"><RefreshCw className="h-4 w-4" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-xs font-semibold text-[#1A1D26]">
              <tr className="border-b border-[#E5E7EB]">
                <th className="px-5 py-3">Profil</th>
                <th className="px-3 py-3">Durée</th>
                <th className="px-3 py-3">Validité</th>
                <th className="px-3 py-3">Débit</th>
                <th className="px-3 py-3">Quota</th>
                <th className="px-3 py-3">Appareils</th>
                <th className="px-3 py-3 text-right">Prix ({currency})</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F5]">
              {profiles.length === 0 && (
                <tr><td colSpan={8} className="py-10 text-center text-[#6B7280]">Aucun profil. Créez le premier ci-dessus.</td></tr>
              )}
              {profiles.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAFBFC]">
                  <td className="px-5 py-3 font-semibold text-[#1A1D26]">{p.name}</td>
                  <td className="px-3 py-3 text-[#4B5563]">{p.sessionDuration || "—"}</td>
                  <td className="px-3 py-3 text-[#4B5563]">{p.validity || "—"}</td>
                  <td className="px-3 py-3 text-[#4B5563]">{p.rateLimit || "—"}</td>
                  <td className="px-3 py-3 text-[#4B5563]">{p.quotaValue ? `${p.quotaValue} ${p.quotaUnit}` : "∞"}</td>
                  <td className="px-3 py-3 text-[#4B5563]">{p.devices}</td>
                  <td className="px-3 py-3 text-right font-semibold text-[#1A1D26]">{p.price.toLocaleString("fr-FR")}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button aria-label={`Modifier ${p.name}`} onClick={() => edit(p)} className="rounded-lg border border-[#E5E7EB] p-1.5 text-[#4B5563] hover:bg-[#F3F4F6]"><Pencil className="h-4 w-4" /></button>
                      {confirmId === p.id ? (
                        <button onClick={() => { deleteProfile(p.id); setConfirmId(null); }} className="rounded-lg bg-red-500 px-2.5 text-xs font-medium text-white">Confirmer</button>
                      ) : (
                        <button aria-label={`Supprimer ${p.name}`} onClick={() => setConfirmId(p.id)} className="rounded-lg border border-red-200 p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
