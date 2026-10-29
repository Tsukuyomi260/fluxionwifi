"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Lock,
  Bell,
  Globe,
  Shield,
  Smartphone,
  Mail,
  Camera,
  Eye,
  EyeOff,
  Save,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Key,
  LogOut,
  Trash2,
  Monitor,
  Moon,
  MapPin,
  Phone,
  Building,
  CreditCard,
  Clock,
  Wifi,
  ToggleLeft,
  ToggleRight,
  X,
  Copy,
  RefreshCw,
} from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";

type SettingsTab = "profile" | "security" | "notifications" | "preferences" | "api";

export default function SettingsPage() {
  const { country, currency } = useCurrency();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText("fwf_live_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6");
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const tabs: { key: SettingsTab; label: string; icon: typeof User }[] = [
    { key: "profile", label: "Profil", icon: User },
    { key: "security", label: "Sécurité", icon: Lock },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "preferences", label: "Préférences", icon: Settings },
    { key: "api", label: "API", icon: Key },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B1E4D]">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gérez votre compte et vos préférences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-56 shrink-0">
          {/* Mobile: horizontal scroll */}
          <div className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? "bg-[#2B7FFF] text-white"
                    : "text-gray-600 hover:bg-[#F5F7FA]"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Profile */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Avatar */}
              <div className="rounded-2xl border border-[#E8ECF1] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h2 className="text-sm font-semibold text-[#0B1E4D] mb-4">Photo de profil</h2>
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2B7FFF] to-[#0B1E4D] flex items-center justify-center text-2xl font-bold text-white">
                      PE
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#2B7FFF] border-2 border-white flex items-center justify-center hover:bg-[#2563EB] transition-colors">
                      <Camera className="h-3.5 w-3.5 text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0B1E4D]">Paterne EZIN</p>
                    <p className="text-xs text-gray-400 mt-0.5">JPG, PNG — max 2 Mo</p>
                    <div className="flex gap-2 mt-2">
                      <button className="rounded-lg border border-[#E8ECF1] px-3 py-1 text-xs font-medium text-gray-600 hover:bg-[#F5F7FA] transition-colors">
                        Changer
                      </button>
                      <button className="rounded-lg px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal info */}
              <div className="rounded-2xl border border-[#E8ECF1] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h2 className="text-sm font-semibold text-[#0B1E4D] mb-4">Informations personnelles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom complet</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="text" defaultValue="Paterne EZIN" className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="email" defaultValue="ezingodson@gmail.com" className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="tel" defaultValue="+229 60 00 00 00" className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Pays</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select className="w-full appearance-none rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20" defaultValue="BJ">
                        <option value="BJ">Bénin</option>
                        <option value="CI">Côte d&apos;Ivoire</option>
                        <option value="SN">Sénégal</option>
                        <option value="TG">Togo</option>
                        <option value="CM">Cameroun</option>
                        <option value="CD">Congo-Kinshasa (RDC)</option>
                        <option value="CG">Congo-Brazzaville</option>
                        <option value="GA">Gabon</option>
                        <option value="ML">Mali</option>
                        <option value="BF">Burkina Faso</option>
                        <option value="NE">Niger</option>
                        <option value="GN">Guinée</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business info */}
              <div className="rounded-2xl border border-[#E8ECF1] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h2 className="text-sm font-semibold text-[#0B1E4D] mb-4">Informations de l&apos;entreprise</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom de l&apos;entreprise</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="text" placeholder="Votre entreprise" className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom du réseau</label>
                    <div className="relative">
                      <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="text" defaultValue="Mon Réseau" className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all ${
                    saved
                      ? "bg-emerald-500 text-white"
                      : "bg-[#2B7FFF] text-white hover:bg-[#2563EB]"
                  }`}
                >
                  {saved ? <><CheckCircle className="h-4 w-4" /> Enregistré</> : <><Save className="h-4 w-4" /> Enregistrer</>}
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Change password */}
              <div className="rounded-2xl border border-[#E8ECF1] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h2 className="text-sm font-semibold text-[#0B1E4D] mb-4">Changer le mot de passe</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Mot de passe actuel</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]" />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Nouveau mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type={showNewPassword ? "text" : "password"} placeholder="••••••••" className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]" />
                      <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirmer le nouveau mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]" />
                    </div>
                  </div>
                  <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-[#2B7FFF] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2563EB] transition-colors">
                    <Lock className="h-4 w-4" />
                    Mettre à jour
                  </button>
                </div>
              </div>

              {/* 2FA */}
              <div className="rounded-2xl border border-[#E8ECF1] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-[#0B1E4D]">Authentification à deux facteurs</h2>
                    <p className="text-xs text-gray-500 mt-1">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-[#2B7FFF] px-4 py-2 text-sm font-medium text-[#2B7FFF] hover:bg-blue-50 transition-colors">
                    <Shield className="h-4 w-4" />
                    Activer
                  </button>
                </div>
              </div>

              {/* Sessions */}
              <div className="rounded-2xl border border-[#E8ECF1] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h2 className="text-sm font-semibold text-[#0B1E4D] mb-4">Sessions actives</h2>
                <div className="space-y-3">
                  {[
                    { device: "Chrome · Windows 11", location: "Cotonou, Bénin", time: "Maintenant", current: true },
                    { device: "Safari · iPhone 15", location: "Cotonou, Bénin", time: "Il y a 2h", current: false },
                    { device: "Firefox · Ubuntu", location: "Porto-Novo, Bénin", time: "Il y a 1 jour", current: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-[#F5F7FA] p-3">
                      <div className="flex items-center gap-3">
                        <Monitor className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-[#0B1E4D]">
                            {s.device}
                            {s.current && <span className="ml-2 text-xs text-emerald-600 font-normal">(cette session)</span>}
                          </p>
                          <p className="text-xs text-gray-400">{s.location} · {s.time}</p>
                        </div>
                      </div>
                      {!s.current && (
                        <button className="rounded-lg px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">
                          Révoquer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger zone */}
              <div className="rounded-2xl border border-red-200 bg-red-50/30 p-6">
                <h2 className="text-sm font-semibold text-red-600 mb-2">Zone dangereuse</h2>
                <p className="text-xs text-gray-500 mb-4">Ces actions sont irréversibles. Procédez avec précaution.</p>
                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="h-4 w-4" />
                    Déconnecter partout
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer le compte
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E8ECF1] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h2 className="text-sm font-semibold text-[#0B1E4D] mb-4">Notifications par email</h2>
                <div className="space-y-4">
                  {[
                    { label: "Ventes de tickets", desc: "Recevez un email à chaque vente", enabled: true },
                    { label: "Routeur hors ligne", desc: "Alerte quand un routeur se déconnecte", enabled: true },
                    { label: "Renouvellement d'abonnement", desc: "Rappel avant chaque renouvellement", enabled: true },
                    { label: "Solde insuffisant", desc: "Alerte quand le solde facturation est bas", enabled: true },
                    { label: "Nouveau filleul", desc: "Notification quand quelqu'un s'inscrit via votre lien", enabled: false },
                    { label: "Newsletter FLUXIONWIFI", desc: "Nouveautés, mises à jour et conseils", enabled: false },
                  ].map((n) => (
                    <div key={n.label} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#0B1E4D]">{n.label}</p>
                        <p className="text-xs text-gray-400">{n.desc}</p>
                      </div>
                      <button className="text-[#2B7FFF]">
                        {n.enabled ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7 text-gray-300" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E8ECF1] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h2 className="text-sm font-semibold text-[#0B1E4D] mb-4">Notifications push</h2>
                <div className="space-y-4">
                  {[
                    { label: "Alertes critiques", desc: "Routeur offline, paiement échoué", enabled: true },
                    { label: "Rapports quotidiens", desc: "Résumé des ventes et connexions", enabled: false },
                    { label: "Mises à jour système", desc: "Nouvelles fonctionnalités et maintenance", enabled: true },
                  ].map((n) => (
                    <div key={n.label} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#0B1E4D]">{n.label}</p>
                        <p className="text-xs text-gray-400">{n.desc}</p>
                      </div>
                      <button className="text-[#2B7FFF]">
                        {n.enabled ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7 text-gray-300" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleSave} className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all ${saved ? "bg-emerald-500 text-white" : "bg-[#2B7FFF] text-white hover:bg-[#2563EB]"}`}>
                  {saved ? <><CheckCircle className="h-4 w-4" /> Enregistré</> : <><Save className="h-4 w-4" /> Enregistrer</>}
                </button>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E8ECF1] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h2 className="text-sm font-semibold text-[#0B1E4D] mb-4">Affichage</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Langue</label>
                    <div className="relative max-w-xs">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select className="w-full appearance-none rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20">
                        <option>Français</option>
                        <option>English</option>
                        <option>Português</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Devise</label>
                    <div className="relative max-w-xs">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="text" value={`${currency} (${country?.name || "—"})`} readOnly className="w-full rounded-xl border border-[#E8ECF1] bg-gray-100 pl-10 pr-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">La devise est liée à votre pays de résidence</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Fuseau horaire</label>
                    <div className="relative max-w-xs">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select className="w-full appearance-none rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20">
                        <option>Africa/Porto-Novo (GMT+1)</option>
                        <option>Africa/Abidjan (GMT+0)</option>
                        <option>Africa/Lagos (GMT+1)</option>
                        <option>Africa/Douala (GMT+1)</option>
                        <option>Africa/Kinshasa (GMT+1)</option>
                        <option>Africa/Dakar (GMT+0)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E8ECF1] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h2 className="text-sm font-semibold text-[#0B1E4D] mb-4">Tickets WiFi</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Format des tickets</label>
                    <div className="relative max-w-xs">
                      <select className="w-full appearance-none rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-4 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20">
                        <option>Numérique (8 chiffres)</option>
                        <option>Alphanumérique (6 caractères)</option>
                        <option>Alphanumérique (8 caractères)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#0B1E4D]">Impression automatique</p>
                      <p className="text-xs text-gray-400">Imprimer le ticket après chaque vente</p>
                    </div>
                    <button className="text-gray-300"><ToggleLeft className="h-7 w-7" /></button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#0B1E4D]">Envoi par SMS</p>
                      <p className="text-xs text-gray-400">Envoyer le code ticket par SMS au client</p>
                    </div>
                    <button className="text-[#2B7FFF]"><ToggleRight className="h-7 w-7" /></button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleSave} className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all ${saved ? "bg-emerald-500 text-white" : "bg-[#2B7FFF] text-white hover:bg-[#2563EB]"}`}>
                  {saved ? <><CheckCircle className="h-4 w-4" /> Enregistré</> : <><Save className="h-4 w-4" /> Enregistrer</>}
                </button>
              </div>
            </div>
          )}

          {/* API */}
          {activeTab === "api" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E8ECF1] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h2 className="text-sm font-semibold text-[#0B1E4D] mb-2">Clé API</h2>
                <p className="text-xs text-gray-500 mb-4">Utilisez cette clé pour intégrer FLUXIONWIFI dans vos propres applications.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 rounded-xl bg-[#F5F7FA] border border-[#E8ECF1] px-4 py-2.5 flex items-center gap-2">
                    <Key className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-600 font-mono truncate">
                      {showApiKey ? "fwf_live_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" : "fwf_live_sk_••••••••••••••••••••••••"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowApiKey(!showApiKey)} className="rounded-xl border border-[#E8ECF1] px-3 py-2.5 text-gray-500 hover:bg-[#F5F7FA] transition-colors">
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={copyApiKey}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                        apiKeyCopied ? "bg-emerald-500 text-white" : "border border-[#E8ECF1] text-gray-600 hover:bg-[#F5F7FA]"
                      }`}
                    >
                      {apiKeyCopied ? <><CheckCircle className="h-4 w-4" /> Copié</> : <><Copy className="h-4 w-4" /> Copier</>}
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors">
                    <RefreshCw className="h-4 w-4" />
                    Régénérer la clé
                  </button>
                  <p className="text-xs text-gray-400 mt-2">
                    <AlertTriangle className="inline h-3 w-3 text-amber-500 mr-1" />
                    Régénérer la clé invalide immédiatement l&apos;ancienne
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E8ECF1] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h2 className="text-sm font-semibold text-[#0B1E4D] mb-2">Webhooks</h2>
                <p className="text-xs text-gray-500 mb-4">Recevez des notifications en temps réel dans votre application.</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">URL du webhook</label>
                    <input type="url" placeholder="https://votre-app.com/webhook/fluxionwifi" className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Événements</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Vente de ticket", checked: true },
                        { label: "Connexion client", checked: true },
                        { label: "Routeur en ligne", checked: false },
                        { label: "Routeur hors ligne", checked: true },
                        { label: "Paiement reçu", checked: true },
                        { label: "Renouvellement", checked: false },
                      ].map((e) => (
                        <label key={e.label} className="flex items-center gap-2 rounded-lg border border-[#E8ECF1] p-2.5 cursor-pointer hover:bg-[#F5F7FA]">
                          <input type="checkbox" defaultChecked={e.checked} className="rounded border-gray-300 text-[#2B7FFF] focus:ring-[#2B7FFF]" />
                          <span className="text-xs text-[#0B1E4D]">{e.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleSave} className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${saved ? "bg-emerald-500 text-white" : "bg-[#2B7FFF] text-white hover:bg-[#2563EB]"}`}>
                    {saved ? <><CheckCircle className="h-4 w-4" /> Enregistré</> : <><Save className="h-4 w-4" /> Enregistrer</>}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E8ECF1] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h2 className="text-sm font-semibold text-[#0B1E4D] mb-2">Documentation API</h2>
                <p className="text-xs text-gray-500 mb-3">Consultez la documentation complète pour intégrer FLUXIONWIFI.</p>
                <div className="flex flex-wrap gap-3">
                  {["Guide de démarrage", "Référence API", "Exemples de code"].map((d) => (
                    <button key={d} className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8ECF1] px-3 py-2 text-xs font-medium text-gray-600 hover:bg-[#F5F7FA] transition-colors">
                      <BookOpen className="h-3.5 w-3.5" />
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete account modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-[#0B1E4D] mb-2">Supprimer votre compte ?</h2>
              <p className="text-sm text-gray-500 mb-6">
                Cette action est irréversible. Toutes vos données, routeurs, tickets et configurations seront définitivement supprimés.
              </p>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1.5 text-left">
                  Tapez <span className="font-mono font-bold text-red-500">SUPPRIMER</span> pour confirmer
                </label>
                <input type="text" placeholder="SUPPRIMER" className="w-full rounded-xl border border-red-200 bg-red-50/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 rounded-xl border border-[#E8ECF1] py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition-colors">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
