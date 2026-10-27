"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone, MapPin, UserPlus } from "lucide-react";
import { register } from "./actions";
import { getCountries } from "@/lib/currency";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (formData.get("password") !== formData.get("confirmPassword")) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    const result = await register(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  const countries = getCountries();

  const inputBase =
    "flex h-11 w-full rounded-xl border border-[#D1D5DB] bg-[#F9FAFB] text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF] focus:bg-white transition-all";

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#0B1E4D]">Créez votre compte</h2>
        <p className="mt-1.5 text-sm text-[#6B7280]">
          Commencez à gérer vos zones WiFi en quelques minutes
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name + Email row */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-[#374151]">Nom complet</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input id="name" name="name" type="text" placeholder="Jean Dupont" required
                className={`${inputBase} pl-10 pr-4`} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-[#374151]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input id="email" name="email" type="email" placeholder="vous@exemple.com" required
                className={`${inputBase} pl-10 pr-4`} />
            </div>
          </div>
        </div>

        {/* Country + Phone row */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="country" className="text-sm font-medium text-[#374151]">Pays</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
              <select
                id="country"
                name="country"
                required
                className={`${inputBase} pl-10 pr-4 appearance-none cursor-pointer`}
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">Sélectionnez</option>
                {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
              <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm font-medium text-[#374151]">Téléphone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder={countries.find(c => c.code === selectedCountry)?.phonePrefix || "+xxx"}
                required
                className={`${inputBase} pl-10 pr-4`}
              />
            </div>
          </div>
        </div>

        {/* Password + Confirm row */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-[#374151]">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 caractères"
                required
                minLength={8}
                className={`${inputBase} pl-10 pr-10`}
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
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-[#374151]">Confirmation</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Retapez le mot de passe"
                required
                minLength={8}
                className={`${inputBase} pl-10 pr-4`}
              />
            </div>
          </div>
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2B7FFF] px-4 text-sm font-semibold text-white transition-all hover:bg-[#1A6BE6] hover:shadow-lg hover:shadow-[#2B7FFF]/25 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Créer mon compte
              </>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-[#9CA3AF]">
          En vous inscrivant, vous acceptez nos conditions d&apos;utilisation
        </p>
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
        href="/login"
        className="flex h-11 w-full items-center justify-center rounded-xl border-2 border-[#E8ECF1] text-sm font-semibold text-[#374151] transition-all hover:border-[#2B7FFF]/30 hover:text-[#2B7FFF] hover:bg-[#EBF2FF]/50"
      >
        J&apos;ai déjà un compte
      </Link>
    </div>
  );
}
