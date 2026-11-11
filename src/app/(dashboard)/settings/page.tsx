"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import {
  Users,
  Shield,
  LayoutDashboard,
  LogOut,
  Handshake,
  Search,
  BarChart3,
  Package,
  FileText,
  Star,
  UserCheck,
  HeadphonesIcon,
  Loader2,
  X,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
} from "lucide-react";

const toolCards = [
  {
    name: "Gérer mon Affiliation",
    icon: Handshake,
    href: "#",
    desc: "Programme de parrainage",
  },
  {
    name: "Trouver un ticket vendu",
    icon: Search,
    href: "#",
    desc: "Rechercher par code",
  },
  {
    name: "Rapports de Ventes Globales",
    icon: BarChart3,
    href: "/sellers",
    desc: "Statistiques de ventes",
  },
  {
    name: "Gestion Globale des Stocks",
    icon: Package,
    href: "/console/stock",
    desc: "Inventaire tickets",
  },
  {
    name: "Logs d'Activités Système",
    icon: FileText,
    href: "#",
    desc: "Journal système",
  },
  {
    name: "Suivi des Abonnements",
    icon: Star,
    href: "/finance/billing",
    desc: "Facturation & plans",
  },
  {
    name: "Clients Identifiés & Connexions",
    icon: UserCheck,
    href: "/console/sessions",
    desc: "Sessions actives",
  },
  {
    name: "Gestion Demandes Clients",
    icon: HeadphonesIcon,
    href: "#",
    desc: "Support client",
  },
];

export default function SettingsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "??";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#2B7FFF]" />
      </div>
    );
  }

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-gradient-to-br from-[#1a2a1a] via-[#1F2937] to-[#2a1f1a] p-4 lg:p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold italic text-orange-400 mb-5">
        Sélecteur de Compte
      </h1>

      {/* Top action buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => setShowAccountModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2B7FFF] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors"
        >
          <Users className="h-4 w-4" />
          Gérer les Comptes
        </button>
        <button
          onClick={() => setShowSecurityModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#374151] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4B5563] transition-colors"
        >
          <Shield className="h-4 w-4" />
          Sécurité
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-[#374151] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4B5563] transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          Tableau de bord
        </Link>
        <button className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition-colors">
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>

      {/* Outils et Rapports section */}
      <div className="rounded-2xl bg-[#1a2e1a]/60 border border-[#2a3e2a] p-6 lg:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <span className="text-orange-400">🛠</span> Outils et Rapports
          </h2>
          <div className="w-32 h-1 bg-orange-400 mx-auto mt-3 rounded-full" />
        </div>

        {/* Cards grid — 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {toolCards.map((card) => (
            <Link
              key={card.name}
              href={card.href}
              className="flex items-center gap-4 rounded-xl bg-[#2a3e2a]/80 border border-[#3a4e3a] px-5 py-4 hover:bg-[#3a4e3a] transition-colors group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-400/20">
                <card.icon className="h-5 w-5 text-orange-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate group-hover:text-orange-300 transition-colors">
                  {card.name}
                </p>
                <p className="text-xs text-slate-400 truncate">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-slate-500 mt-8 uppercase tracking-widest">
        Propulsé par FLUXIONWIFI
      </p>

      {/* Gérer les Comptes modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAccountModal(false)}
          />
          <div className="relative w-full max-w-lg max-h-[85vh] bg-[#1F2937] border border-[#374151] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#374151]">
              <h3 className="text-lg font-semibold text-white">
                Gestion du Compte
              </h3>
              <button
                onClick={() => setShowAccountModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#374151] text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2B7FFF] to-[#0B1E4D] flex items-center justify-center text-xl font-bold text-white">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user?.email || "—"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Administrateur
                  </p>
                </div>
              </div>

              {/* Infos */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      defaultValue=""
                      placeholder="Votre nom"
                      className="w-full rounded-xl border border-[#374151] bg-[#111827] pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2B7FFF]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      defaultValue={user?.email || ""}
                      readOnly
                      className="w-full rounded-xl border border-[#374151] bg-[#111827] pl-10 pr-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="tel"
                      defaultValue=""
                      placeholder="+229 00 00 00 00"
                      className="w-full rounded-xl border border-[#374151] bg-[#111827] pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2B7FFF]"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                  saved
                    ? "bg-emerald-500 text-white"
                    : "bg-[#2B7FFF] text-white hover:bg-[#1A6BE6]"
                }`}
              >
                {saved ? (
                  <>
                    <CheckCircle className="h-4 w-4" /> Enregistré
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Enregistrer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sécurité modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSecurityModal(false)}
          />
          <div className="relative w-full max-w-lg max-h-[85vh] bg-[#1F2937] border border-[#374151] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#374151]">
              <h3 className="text-lg font-semibold text-white">Sécurité</h3>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#374151] text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <h4 className="text-sm font-semibold text-white">
                Changer le mot de passe
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-[#374151] bg-[#111827] pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2B7FFF]"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-[#374151] bg-[#111827] pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2B7FFF]"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-[#374151] bg-[#111827] pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2B7FFF]"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                  saved
                    ? "bg-emerald-500 text-white"
                    : "bg-[#2B7FFF] text-white hover:bg-[#1A6BE6]"
                }`}
              >
                {saved ? (
                  <>
                    <CheckCircle className="h-4 w-4" /> Mis à jour
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" /> Mettre à jour
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
