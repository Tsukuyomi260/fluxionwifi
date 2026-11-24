"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, LogIn, User } from "lucide-react";
import { RESELLER } from "@/lib/reseller-data";

export default function ConnexionRevendeurPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!String(fd.get("login") ?? "").trim() || !String(fd.get("password") ?? "")) {
      setError("Renseignez votre identifiant et votre mot de passe.");
      return;
    }
    // Démonstration : l'authentification réelle (Supabase) viendra avec le back-end.
    router.push("/vendeur");
  }

  const input =
    "h-11 w-full rounded-xl border border-[#D1D5DB] bg-[#F9FAFB] pl-10 pr-4 text-sm focus:border-[#2B7FFF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B1535] px-4">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[26rem] w-[26rem] rounded-full bg-[#12286B]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#1B2260]/80" />

      <form onSubmit={submit} className="relative w-full max-w-sm rounded-[14px] bg-white p-7 shadow-2xl">
        <div className="mb-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width={44} height={44} className="mx-auto rounded-xl" />
          <h1 className="mt-3 text-xl font-bold text-[#0B1E4D]">Espace revendeur</h1>
          <p className="mt-1 text-sm text-[#6B7280]">{RESELLER.network}</p>
        </div>

        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input name="login" placeholder="Identifiant (ex. FLX-KIL-003-SITE)" autoComplete="username" className={input} />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input name="password" type={show ? "text" : "password"} placeholder="Mot de passe" autoComplete="current-password" className={`${input} pr-11`} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label="Afficher le mot de passe" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6]">
          <LogIn className="h-4 w-4" /> Se connecter
        </button>
        <p className="mt-4 text-center text-xs text-[#9CA3AF]">Identifiants fournis par votre propriétaire de réseau.</p>
      </form>
    </div>
  );
}
