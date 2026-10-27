"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, Lock, LogIn } from "lucide-react";
import { login } from "./actions";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#0B1E4D]">Bon retour !</h2>
        <p className="mt-1.5 text-sm text-[#6B7280]">
          Connectez-vous pour accéder à votre tableau de bord
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
        </div>
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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[#374151]">Mot de passe</label>
            <Link href="/forgot-password" className="text-xs text-[#2B7FFF] hover:underline font-medium">
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              required
              className="flex h-11 w-full rounded-xl border border-[#D1D5DB] bg-[#F9FAFB] pl-10 pr-10 text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF] focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
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
              <LogIn className="h-4 w-4" />
              Se connecter
            </>
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E8ECF1]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-[#9CA3AF]">ou</span>
        </div>
      </div>

      <Link
        href="/register"
        className="flex h-11 w-full items-center justify-center rounded-xl border-2 border-[#E8ECF1] text-sm font-semibold text-[#374151] transition-all hover:border-[#2B7FFF]/30 hover:text-[#2B7FFF] hover:bg-[#EBF2FF]/50"
      >
        Créer un compte
      </Link>
    </div>
  );
}
