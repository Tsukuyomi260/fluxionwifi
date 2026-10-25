"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: Supabase auth
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

      <div>
        <h2 className="text-2xl font-bold text-[#1A1D26]">Connexion</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Connectez-vous pour accéder à votre tableau de bord
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[#374151]">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[#374151]">
              Mot de passe
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#2B7FFF] hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#2B7FFF] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1A6BE6] disabled:pointer-events-none disabled:opacity-50 shadow-sm"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
        </button>
      </form>

      <p className="text-center text-sm text-[#6B7280]">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-[#2B7FFF] hover:underline font-medium">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
