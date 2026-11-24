"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useConsoleStore, type CodeSettings } from "./console-store";

const field = "h-10 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1D26] focus:border-[#2B7FFF] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20";

export function describeFormat(s: CodeSettings): string {
  return `${s.length} caractères · ${s.mode === "userpass" ? "user + mot de passe" : "voucher (user = mot de passe)"}`;
}

export function previewCode(s: CodeSettings): string {
  const a = s.charset === "digits" ? "4829173650" : s.charset === "letters" ? "KQWZMRTXBN" : "K4Q9ZM2RT7";
  return s.prefix + a.repeat(4).slice(0, s.length);
}

/** Formulaire de format des codes, partagé entre « Générer des tickets » et « Configuration tickets ». */
export function CodeSettingsForm({ onSaved, submitLabel = "Enregistrer" }: { onSaved?: () => void; submitLabel?: string }) {
  const { settings, updateSettings } = useConsoleStore();
  const [draft, setDraft] = useState<CodeSettings>(settings);
  const [saved, setSaved] = useState(false);

  function save(e: React.FormEvent) {
    e.preventDefault();
    updateSettings({ ...draft, length: Math.min(12, Math.max(4, Math.round(draft.length) || 5)) });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    onSaved?.();
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <p className="mb-1.5 text-sm font-medium text-[#374151]">Type d&apos;identifiants</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { v: "userpass", t: "Utilisateur + mot de passe", d: "Deux codes distincts" },
            { v: "voucher", t: "Voucher", d: "Utilisateur = mot de passe" },
          ].map((o) => (
            <button
              type="button"
              key={o.v}
              onClick={() => setDraft({ ...draft, mode: o.v as CodeSettings["mode"] })}
              className={`rounded-lg border px-3 py-2.5 text-left text-sm ${draft.mode === o.v ? "border-[#2B7FFF] bg-[#EBF2FF]" : "border-[#E5E7EB] hover:bg-[#F9FAFB]"}`}
            >
              <span className="font-medium text-[#1A1D26]">{o.t}</span>
              <span className="block text-xs text-[#6B7280]">{o.d}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-[#374151]">
          Longueur
          <input type="number" min={4} max={12} className={`${field} mt-1.5`} value={draft.length} onChange={(e) => setDraft({ ...draft, length: Number(e.target.value) })} />
        </label>
        <label className="text-sm font-medium text-[#374151]">
          Caractères
          <select className={`${field} mt-1.5`} value={draft.charset} onChange={(e) => setDraft({ ...draft, charset: e.target.value as CodeSettings["charset"] })}>
            <option value="digits">Chiffres seulement</option>
            <option value="letters">Lettres seulement</option>
            <option value="alnum">Lettres et chiffres</option>
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-[#374151]">
        Préfixe (facultatif)
        <input className={`${field} mt-1.5`} placeholder="ex. FX-" value={draft.prefix} onChange={(e) => setDraft({ ...draft, prefix: e.target.value.toUpperCase().slice(0, 6) })} />
      </label>

      <div className="rounded-lg bg-[#F3F4F6] px-4 py-3 text-sm">
        <span className="text-[#6B7280]">Exemple : </span>
        <span className="font-mono font-semibold text-[#1A1D26]">{previewCode(draft)}</span>
      </div>

      <button className="flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-medium text-white hover:bg-emerald-600">
        {saved ? <Check className="h-4 w-4" /> : null} {saved ? "Enregistré" : submitLabel}
      </button>
    </form>
  );
}
