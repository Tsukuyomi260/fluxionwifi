"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: Supabase password reset
    setSent(true);
    setLoading(false);
  }

  const inputClass =
    "flex h-11 w-full rounded-xl border border-[#D1D5DB] bg-white px-4 text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF] transition-colors";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5 lg:hidden mb-4">
        <Image src="/logo.jpg" alt="Fluxion WiFi" width={40} height={40} className="rounded-xl" />
        <span className="text-xl font-bold text-[#0B1E4D]">Fluxion WiFi</span>
      </div>

      {sent ? (
        <div className="space-y-4 text-center">
          <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-bold text-[#1A1D26]">Email envoyé</h2>
          <p className="text-sm text-[#6B7280]">
            Si un compte existe avec {email}, vous recevrez un lien de réinitialisation.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-[#2B7FFF] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1D26]">Mot de passe oublié</h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="reset-email" className="text-sm font-medium text-[#374151]">Email</label>
              <input id="reset-email" type="email" placeholder="vous@exemple.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
            </div>

            <button type="submit" disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#2B7FFF] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1A6BE6] disabled:pointer-events-none disabled:opacity-50 shadow-sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Envoyer le lien"}
            </button>
          </form>

          <Link href="/login"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1A1D26]">
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>
        </>
      )}
    </div>
  );
}
