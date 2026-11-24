"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, LogOut, Search, Smartphone, User, XCircle } from "lucide-react";
import { useReseller } from "@/components/reseller/reseller-context";
import { RESELLER, formatDate } from "@/lib/reseller-data";

export default function PlusPage() {
  const { sales } = useReseller();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<null | { found: boolean; label?: string; at?: string }>(null);

  function verify(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim();
    if (!c) return;
    const s = sales.find((x) => x.code === c);
    setResult(s ? { found: true, label: s.profileName, at: s.at } : { found: false });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0B1E4D]">Plus</h1>

      <section className="rounded-[14px] border border-[#E5E7EB] bg-white p-5">
        <h2 className="flex items-center gap-2 font-semibold text-[#1A1D26]">
          <Search className="h-4 w-4 text-[#2B7FFF]" /> Vérifier un ticket
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">Entrez le code pour savoir s&apos;il a bien été vendu par votre compte.</p>
        <form onSubmit={verify} className="mt-3 flex gap-2">
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setResult(null);
            }}
            placeholder="Ex. 48201937"
            inputMode="numeric"
            className="h-11 flex-1 rounded-xl border border-[#D1D5DB] px-4 font-mono text-sm focus:border-[#2B7FFF] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20"
          />
          <button className="h-11 rounded-xl bg-[#2B7FFF] px-5 text-sm font-medium text-white hover:bg-[#1A6BE6]">Vérifier</button>
        </form>
        {result && (
          <div
            className={`mt-3 flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
              result.found ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
            }`}
          >
            {result.found ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : <XCircle className="mt-0.5 h-4 w-4" />}
            {result.found
              ? `Ticket valide : ${result.label}, vendu le ${formatDate(result.at!)}.`
              : "Aucun ticket vendu par votre compte avec ce code."}
          </div>
        )}
      </section>

      <section className="rounded-[14px] border border-[#E5E7EB] bg-white p-5">
        <h2 className="flex items-center gap-2 font-semibold text-[#1A1D26]">
          <User className="h-4 w-4 text-[#2B7FFF]" /> Mon profil
        </h2>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[#6B7280]">Nom</dt>
            <dd className="font-medium text-[#1A1D26]">{RESELLER.name}</dd>
          </div>
          <div>
            <dt className="text-[#6B7280]">Identifiant</dt>
            <dd className="font-mono font-medium text-[#1A1D26]">{RESELLER.loginId}</dd>
          </div>
          <div>
            <dt className="text-[#6B7280]">Commission</dt>
            <dd className="font-medium text-[#1A1D26]">{RESELLER.commissionRate} %</dd>
          </div>
          <div>
            <dt className="text-[#6B7280]">Réseau</dt>
            <dd className="font-medium text-[#1A1D26]">{RESELLER.network}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-[14px] border border-[#E5E7EB] bg-white p-5">
        <h2 className="flex items-center gap-2 font-semibold text-[#1A1D26]">
          <Smartphone className="h-4 w-4 text-[#2B7FFF]" /> Application mobile
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Sur votre téléphone, ouvrez le menu du navigateur puis « Ajouter à l&apos;écran d&apos;accueil » pour vendre comme avec une application.
        </p>
      </section>

      <Link
        href="/vendeur/connexion"
        className="flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" /> Se déconnecter
      </Link>
    </div>
  );
}
