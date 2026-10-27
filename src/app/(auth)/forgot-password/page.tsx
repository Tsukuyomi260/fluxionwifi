"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle, Mail, Send } from "lucide-react";
import { resetPassword } from "./actions";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    setEmail(formData.get("email") as string);
    const result = await resetPassword(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {sent ? (
        <div className="space-y-5 text-center py-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="h-7 w-7 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0B1E4D]">Email envoyé</h2>
            <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
              Si un compte existe avec <span className="font-medium text-[#374151]">{email}</span>, vous recevrez un lien de réinitialisation.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2B7FFF] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à la connexion
          </Link>
        </div>
      ) : (
        <>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#0B1E4D]">Mot de passe oublié ?</h2>
            <p className="mt-1.5 text-sm text-[#6B7280]">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[#374151]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  required
                  className="flex h-11 w-full rounded-xl border border-[#D1D5DB] bg-[#F9FAFB] pl-10 pr-4 text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF] focus:bg-white transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2B7FFF] px-4 text-sm font-semibold text-white transition-all hover:bg-[#1A6BE6] hover:shadow-lg hover:shadow-[#2B7FFF]/25 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Envoyer le lien
                </>
              )}
            </button>
          </form>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1A1D26] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à la connexion
          </Link>
        </>
      )}
    </div>
  );
}
