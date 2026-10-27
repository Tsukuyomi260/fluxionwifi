"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

  const inputClass =
    "flex h-11 w-full rounded-xl border border-[#D1D5DB] bg-white px-4 text-sm text-[#1A1D26] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF] transition-colors";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5 lg:hidden mb-2">
        <Image src="/logo.jpg" alt="FLUXIONWIFI" width={40} height={40} className="rounded-xl" />
        <span className="text-xl font-bold text-[#0B1E4D]">FLUXIONWIFI</span>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#1A1D26]">Créez votre compte</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Inscrivez-vous pour commencer à gérer vos zones WiFi
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-[#374151]">Nom complet</label>
          <input id="name" name="name" type="text" placeholder="Jean Dupont" required className={inputClass} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[#374151]">Email</label>
          <input id="email" name="email" type="email" placeholder="vous@exemple.com" required className={inputClass} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-[#374151]">Téléphone</label>
          <input id="phone" name="phone" type="tel" placeholder={`${countries.find(c => c.code === selectedCountry)?.phonePrefix || "+xxx"} xx xxx xxxx`} required className={inputClass} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="country" className="text-sm font-medium text-[#374151]">Pays</label>
          <select id="country" name="country" required className={inputClass}
            value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
            <option value="">Sélectionnez votre pays</option>
            {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-[#374151]">Mot de passe</label>
          <div className="relative">
            <input id="password" name="password" type={showPassword ? "text" : "password"}
              placeholder="Min. 8 caractères" required minLength={8} className={`${inputClass} pr-10`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-[#374151]">Confirmez le mot de passe</label>
          <input id="confirmPassword" name="confirmPassword" type="password"
            placeholder="Retapez votre mot de passe" required minLength={8} className={inputClass} />
        </div>

        <button type="submit" disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#2B7FFF] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1A6BE6] disabled:pointer-events-none disabled:opacity-50 shadow-sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer mon compte"}
        </button>
      </form>

      <p className="text-center text-sm text-[#6B7280]">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-[#2B7FFF] hover:underline font-medium">Se connecter</Link>
      </p>
    </div>
  );
}
