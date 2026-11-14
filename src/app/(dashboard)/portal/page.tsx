"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wifi,
  Info,
  Server,
  Palette,
  CreditCard,
  Layers,
  Tag,
  Puzzle,
  MessageSquare,
  Megaphone,
  Gift,
  ShieldCheck,
  Link2,
  Terminal,
  Download,
  Maximize2,
  RotateCcw,
  Smartphone,
  Check,
  Eye,
  Lock,
  ExternalLink,
  ChevronRight,
  Save,
} from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import { useUser } from "@/hooks/use-user";

type PortalTab =
  | "general"
  | "mikrotik"
  | "visuel"
  | "paiement"
  | "mode"
  | "tarifs"
  | "integration"
  | "sms"
  | "infos"
  | "fidelite"
  | "verification"
  | "lier";

type PreviewTab = "login" | "paiement" | "mikhmon" | "tarifs";

interface ThemePreset {
  id: string;
  name: string;
  bgGradient: string;
  color1: string;
  color2: string;
  color3: string;
}

const themePresets: ThemePreset[] = [
  {
    id: "classic",
    name: "Classic",
    bgGradient: "from-amber-500 via-orange-600 to-amber-700",
    color1: "#F59E0B",
    color2: "#0B1E4D",
    color3: "#FFFFFF",
  },
  {
    id: "afro",
    name: "Afro Wax",
    bgGradient: "from-orange-600 via-red-600 to-amber-500",
    color1: "#EA580C",
    color2: "#18181B",
    color3: "#FACC15",
  },
  {
    id: "fluxion",
    name: "Fluxion Blue",
    bgGradient: "from-blue-600 via-indigo-700 to-blue-900",
    color1: "#2B7FFF",
    color2: "#0B1E4D",
    color3: "#60A5FA",
  },
  {
    id: "cyber",
    name: "Cyber Neon",
    bgGradient: "from-purple-900 via-indigo-950 to-black",
    color1: "#A855F7",
    color2: "#06B6D4",
    color3: "#EC4899",
  },
  {
    id: "wave",
    name: "Lagune Wave",
    bgGradient: "from-cyan-600 via-teal-700 to-emerald-800",
    color1: "#0EA5E9",
    color2: "#042F2E",
    color3: "#34D399",
  },
  {
    id: "sunset",
    name: "Sunset",
    bgGradient: "from-rose-500 via-purple-600 to-indigo-800",
    color1: "#F43F5E",
    color2: "#4C1D95",
    color3: "#FDE047",
  },
];

export default function PortalPage() {
  const { user } = useUser();
  const { currency } = useCurrency();

  const [activeTab, setActiveTab] = useState<PortalTab>("visuel");
  const [previewTab, setPreviewTab] = useState<PreviewTab>("login");

  // Portal form state
  const [networkName, setNetworkName] = useState(
    user?.user_metadata?.full_name ? `Réseau de ${user.user_metadata.full_name}` : "Réseau de FLUXION WiFi"
  );
  const [contactPhone, setContactPhone] = useState("+229 01 66 00 68 80");
  const [welcomeMessage, setWelcomeMessage] = useState("Connectez-vous pour profiter d'un accès haut débit illimité.");
  
  // MikroTik state
  const [routerIp, setRouterIp] = useState("192.168.88.1");
  const [routerDns, setRouterDns] = useState("wifi.fluxion.zone");
  const [routerosVersion, setRouterosVersion] = useState<"v6" | "v7">("v7");
  const [chapAuth, setChapAuth] = useState(true);

  // Visual Colors state
  const [color1, setColor1] = useState("#F59E0B"); // Principale (amber/gold)
  const [color2, setColor2] = useState("#0B1E4D"); // Secondaire
  const [color3, setColor3] = useState("#FFFFFF"); // Accent
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>(themePresets[0]);

  // Payment settings
  const [aggregator, setAggregator] = useState("fedapay");
  const [liveMode, setLiveMode] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const applyTheme = (theme: ThemePreset) => {
    setSelectedTheme(theme);
    setColor1(theme.color1);
    setColor2(theme.color2);
    setColor3(theme.color3);
  };

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-[#0F172A] text-white p-4 lg:p-6 space-y-6">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Wifi className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span className="text-amber-400">Configuration</span> du Portail Captif
            </h1>
            <p className="text-xs text-gray-400">
              Personnalisation visuelle et technique des pages d&apos;accueil MikroTik
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <Check className="h-3.5 w-3.5" /> Enregistré avec succès !
            </span>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2B7FFF] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-[#2B7FFF]/25"
          >
            <Save className="h-3.5 w-3.5" />
            Enregistrer les modifications
          </button>
        </div>
      </div>

      {/* Pill Navigation Tabs (3 rows exactly matching 05-portail-captif-config.jpg) */}
      <div className="space-y-2">
        {/* Row 1 */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("general")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "general"
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                : "bg-[#1E293B] text-gray-300 hover:text-white hover:bg-[#334155]"
            }`}
          >
            <Info className="h-3.5 w-3.5" />
            Général
          </button>

          <button
            onClick={() => setActiveTab("mikrotik")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "mikrotik"
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                : "bg-[#1E293B] text-gray-300 hover:text-white hover:bg-[#334155]"
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            MikroTik
          </button>

          <button
            onClick={() => setActiveTab("visuel")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "visuel"
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                : "bg-[#1E293B] text-gray-300 hover:text-white hover:bg-[#334155]"
            }`}
          >
            <Palette className="h-3.5 w-3.5" />
            Visuel
          </button>

          <button
            onClick={() => setActiveTab("paiement")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "paiement"
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                : "bg-[#1E293B] text-gray-300 hover:text-white hover:bg-[#334155]"
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            Paiement
            <Lock className="h-3 w-3 opacity-70" />
          </button>
        </div>

        {/* Row 2 */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("mode")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "mode"
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                : "bg-[#1E293B] text-gray-300 hover:text-white hover:bg-[#334155]"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Mode d&apos;intégration
          </button>

          <button
            onClick={() => setActiveTab("tarifs")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "tarifs"
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                : "bg-[#1E293B] text-gray-300 hover:text-white hover:bg-[#334155]"
            }`}
          >
            <Tag className="h-3.5 w-3.5" />
            Tarifs
          </button>

          <button
            onClick={() => setActiveTab("integration")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "integration"
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                : "bg-[#1E293B] text-gray-300 hover:text-white hover:bg-[#334155]"
            }`}
          >
            <Puzzle className="h-3.5 w-3.5" />
            Intégration
          </button>

          <button
            onClick={() => setActiveTab("sms")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "sms"
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                : "bg-[#1E293B] text-gray-300 hover:text-white hover:bg-[#334155]"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Ticket SMS
          </button>
        </div>

        {/* Row 3 + Console link */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("infos")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "infos"
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                : "bg-[#1E293B] text-gray-300 hover:text-white hover:bg-[#334155]"
            }`}
          >
            <Megaphone className="h-3.5 w-3.5" />
            Infos
          </button>

          <button
            onClick={() => setActiveTab("fidelite")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "fidelite"
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                : "bg-[#1E293B] text-gray-300 hover:text-white hover:bg-[#334155]"
            }`}
          >
            <Gift className="h-3.5 w-3.5" />
            Fidélité
          </button>

          <button
            onClick={() => setActiveTab("verification")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "verification"
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                : "bg-[#1E293B] text-gray-300 hover:text-white hover:bg-[#334155]"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Vérification
          </button>

          <button
            onClick={() => setActiveTab("lier")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "lier"
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                : "bg-[#1E293B] text-gray-300 hover:text-white hover:bg-[#334155]"
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            Lier le routeur
          </button>

          {/* FLUXION Console Direct Pill */}
          <Link
            href="/console"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black text-xs font-black shadow-md shadow-orange-500/20 transition-all ml-auto"
          >
            <Terminal className="h-3.5 w-3.5" />
            &gt;_ FLUXION Console
          </Link>
        </div>
      </div>

      {/* Main 2-Column Split: Config Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Config Panel (lg:col-span-6 xl:col-span-7) */}
        <div className="lg:col-span-6 xl:col-span-7 bg-[#111827] border border-[#1F2937] rounded-2xl p-5 lg:p-6 space-y-6 shadow-xl">
          {/* TAB: VISUEL */}
          {activeTab === "visuel" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                  Couleurs du portail
                </h3>
                <button
                  onClick={() => applyTheme(themePresets[0])}
                  className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Réinitialiser
                </button>
              </div>

              {/* 3 Color Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300">
                    Couleur 1 (Principale)
                  </label>
                  <div className="flex items-center gap-2 bg-[#1E293B] p-2 rounded-xl border border-[#334155]">
                    <input
                      type="color"
                      value={color1}
                      onChange={(e) => setColor1(e.target.value)}
                      className="h-8 w-12 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={color1}
                      onChange={(e) => setColor1(e.target.value)}
                      className="w-full bg-transparent text-xs font-mono text-white uppercase focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300">
                    Couleur 2 (Secondaire)
                  </label>
                  <div className="flex items-center gap-2 bg-[#1E293B] p-2 rounded-xl border border-[#334155]">
                    <input
                      type="color"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="h-8 w-12 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="w-full bg-transparent text-xs font-mono text-white uppercase focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300">
                    Couleur 3 (Accent)
                  </label>
                  <div className="flex items-center gap-2 bg-[#1E293B] p-2 rounded-xl border border-[#334155]">
                    <input
                      type="color"
                      value={color3}
                      onChange={(e) => setColor3(e.target.value)}
                      className="h-8 w-12 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={color3}
                      onChange={(e) => setColor3(e.target.value)}
                      className="w-full bg-transparent text-xs font-mono text-white uppercase focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Theme illustrations selector (7 themes) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Modèles de thèmes prédéfinis
                  </h4>
                  <span className="text-[11px] text-gray-500">7 thèmes disponibles</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {themePresets.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => applyTheme(theme)}
                      className={`group relative rounded-xl p-3 text-left border transition-all ${
                        selectedTheme.id === theme.id
                          ? "border-amber-400 bg-[#1E293B] shadow-lg shadow-amber-400/10 ring-1 ring-amber-400"
                          : "border-[#1F2937] bg-[#161F30] hover:border-[#334155]"
                      }`}
                    >
                      <div className={`h-16 rounded-lg bg-gradient-to-br ${theme.bgGradient} mb-2.5 flex items-center justify-center relative overflow-hidden`}>
                        <Wifi className="h-6 w-6 text-white/50" />
                        {selectedTheme.id === theme.id && (
                          <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-white text-black flex items-center justify-center">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                        {theme.name}
                      </p>
                      <div className="flex gap-1.5 mt-1.5">
                        <span className="h-3 w-3 rounded-full border border-black/40" style={{ backgroundColor: theme.color1 }} />
                        <span className="h-3 w-3 rounded-full border border-black/40" style={{ backgroundColor: theme.color2 }} />
                        <span className="h-3 w-3 rounded-full border border-black/40" style={{ backgroundColor: theme.color3 }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                Informations Générales
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Nom du réseau (affiché sur le portail)
                  </label>
                  <input
                    type="text"
                    value={networkName}
                    onChange={(e) => setNetworkName(e.target.value)}
                    placeholder="Ex: Réseau de FLUXION WiFi"
                    className="w-full rounded-xl bg-[#1E293B] border border-[#334155] px-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Numéro de contact / WhatsApp support
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+229 01 66 00 68 80"
                    className="w-full rounded-xl bg-[#1E293B] border border-[#334155] px-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Message de bienvenue
                  </label>
                  <textarea
                    rows={3}
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    className="w-full rounded-xl bg-[#1E293B] border border-[#334155] px-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: MIKROTIK */}
          {activeTab === "mikrotik" && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                Paramètres Routeur MikroTik
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Adresse IP Routeur Hotspot
                  </label>
                  <input
                    type="text"
                    value={routerIp}
                    onChange={(e) => setRouterIp(e.target.value)}
                    className="w-full rounded-xl bg-[#1E293B] border border-[#334155] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Nom DNS Hotspot
                  </label>
                  <input
                    type="text"
                    value={routerDns}
                    onChange={(e) => setRouterDns(e.target.value)}
                    className="w-full rounded-xl bg-[#1E293B] border border-[#334155] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Version RouterOS
                  </label>
                  <select
                    value={routerosVersion}
                    onChange={(e) => setRouterosVersion(e.target.value as "v6" | "v7")}
                    className="w-full rounded-xl bg-[#1E293B] border border-[#334155] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="v7">RouterOS v7 (Recommandé)</option>
                    <option value="v6">RouterOS v6 (Legacy)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Authentification CHAP
                  </label>
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="chap-check"
                      checked={chapAuth}
                      onChange={(e) => setChapAuth(e.target.checked)}
                      className="h-4 w-4 rounded accent-amber-400"
                    />
                    <label htmlFor="chap-check" className="text-xs text-gray-300">
                      Activer MD5 CHAP / $(if chap-id)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAIEMENT */}
          {activeTab === "paiement" && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                Paiement Mobile Money Direct
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Agrégateur de paiement
                  </label>
                  <select
                    value={aggregator}
                    onChange={(e) => setAggregator(e.target.value)}
                    className="w-full rounded-xl bg-[#1E293B] border border-[#334155] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="fedapay">FedaPay (Bénin, Togo, Côte d&apos;Ivoire, Niger)</option>
                    <option value="cinetpay">CinetPay (10+ pays UEMOA / CEMAC)</option>
                    <option value="feexpay">FeexPay (Bénin, Côte d&apos;Ivoire, Togo, Sénégal)</option>
                    <option value="moneyfusion">Money Fusion (Mali, Sénégal, Guinée)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Clé API Publique (Public Key)
                  </label>
                  <input
                    type="text"
                    defaultValue="pk_live_feda_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full rounded-xl bg-[#1E293B] border border-[#334155] px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="live-mode-check"
                    checked={liveMode}
                    onChange={(e) => setLiveMode(e.target.checked)}
                    className="h-4 w-4 rounded accent-amber-400"
                  />
                  <label htmlFor="live-mode-check" className="text-xs font-semibold text-amber-300">
                    Mode Production (Encaisser de vrais paiements Mobile Money)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AUTRES TABS FALLBACK (Tarifs, Mode, SMS, etc.) */}
          {["mode", "tarifs", "integration", "sms", "infos", "fidelite", "verification", "lier"].includes(activeTab) && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 capitalize">
                Configuration : {activeTab}
              </h3>
              <p className="text-xs text-gray-400">
                Paramètres avancés synchronisés automatiquement avec votre routeur MikroTik et la base de données FLUXIONWIFI.
              </p>
              <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-gray-300 space-y-2">
                <p className="font-semibold text-white">Options actives :</p>
                <p>• Synchronisation temps réel FreeRADIUS activée</p>
                <p>• Génération instantanée du ticket après validation du webhook Mobile Money</p>
                <p>• Reconnexion automatique des utilisateurs expirés vers la page de paiement</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Live Preview Panel (lg:col-span-6 xl:col-span-5) */}
        <div className="lg:col-span-6 xl:col-span-5 bg-[#111827] border border-[#1F2937] rounded-2xl p-5 lg:p-6 space-y-4 shadow-xl">
          {/* Preview Navigation Bar (matching 05-portail-captif-config.jpg) */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Prévisualisation en direct
            </h3>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPreviewTab("login")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  previewTab === "login"
                    ? "bg-[#2B7FFF] text-white"
                    : "bg-[#1E293B] text-gray-400 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setPreviewTab("paiement")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  previewTab === "paiement"
                    ? "bg-[#2B7FFF] text-white"
                    : "bg-[#1E293B] text-gray-400 hover:text-white"
                }`}
              >
                Paiement
              </button>
              <button
                onClick={() => setPreviewTab("tarifs")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  previewTab === "tarifs"
                    ? "bg-[#2B7FFF] text-white"
                    : "bg-[#1E293B] text-gray-400 hover:text-white"
                }`}
              >
                Tarifs
              </button>

              <button
                title="Télécharger le fichier template HTML"
                className="p-1 rounded-md bg-amber-500 hover:bg-amber-600 text-black ml-1 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
              <button
                title="Plein écran"
                className="p-1 rounded-md bg-amber-500 hover:bg-amber-600 text-black transition-colors"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Smartphone Simulator */}
          <div className="mx-auto w-full max-w-[340px] rounded-[36px] border-4 border-gray-800 bg-black p-3 shadow-2xl relative">
            {/* Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 h-3.5 w-24 bg-gray-900 rounded-full z-20" />

            {/* Simulated Captive Portal Screen */}
            <div
              className={`rounded-[26px] overflow-hidden min-h-[460px] flex flex-col justify-between p-4 relative text-center text-white bg-gradient-to-br ${selectedTheme.bgGradient}`}
            >
              {/* MikroTik CHAP Banner (matching screenshot: (if chap-id) $(endif)) */}
              <div className="text-[9px] font-mono opacity-60 bg-black/30 rounded py-0.5 px-2 mx-auto">
                $(if chap-id) $(endif)
              </div>

              {/* Center Content */}
              <div className="space-y-4 my-auto">
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white leading-tight drop-shadow">
                    {networkName}
                  </h4>
                  <p className="text-[11px] font-medium text-white/90">
                    {contactPhone}
                  </p>
                </div>

                {previewTab === "login" && (
                  <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
                    <p className="text-[11px] text-white/80">Entrez votre code ticket :</p>
                    <input
                      type="text"
                      disabled
                      placeholder="Code Ticket (ex: FX-8892)"
                      className="w-full rounded-xl bg-white/20 border border-white/20 px-3 py-2 text-xs text-center font-bold tracking-widest text-white placeholder:text-white/50"
                    />
                    <button
                      disabled
                      style={{ backgroundColor: color1 }}
                      className="w-full py-2 rounded-xl text-xs font-black text-black shadow-lg"
                    >
                      Se connecter
                    </button>
                    <p className="text-[10px] text-white/70">
                      Pas de ticket ? Achetez en ligne par Mobile Money
                    </p>
                  </div>
                )}

                {previewTab === "paiement" && (
                  <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3 text-left">
                    <p className="text-[11px] font-bold text-center text-amber-300">
                      Acheter un Pass Internet
                    </p>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between p-2 rounded-lg bg-white/10">
                        <span>1 Heure (Illimité)</span>
                        <span className="font-bold">100 {currency}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-white/10 border border-amber-400">
                        <span>24 Heures (1 Go)</span>
                        <span className="font-bold">500 {currency}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-white/10">
                        <span>7 Jours (5 Go)</span>
                        <span className="font-bold">2 000 {currency}</span>
                      </div>
                    </div>
                    <button
                      disabled
                      style={{ backgroundColor: color1 }}
                      className="w-full py-2 rounded-xl text-xs font-black text-black text-center shadow-lg"
                    >
                      Payer par Mobile Money
                    </button>
                  </div>
                )}

                {previewTab === "tarifs" && (
                  <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2 text-xs text-left">
                    <p className="font-bold text-center text-amber-300">Nos Tarifs Disponibles</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2 rounded bg-white/10 text-center">
                        <p className="font-bold">1 Heure</p>
                        <p className="text-amber-300 font-black">100 {currency}</p>
                      </div>
                      <div className="p-2 rounded bg-white/10 text-center">
                        <p className="font-bold">3 Heures</p>
                        <p className="text-amber-300 font-black">250 {currency}</p>
                      </div>
                      <div className="p-2 rounded bg-white/10 text-center">
                        <p className="font-bold">24 Heures</p>
                        <p className="text-amber-300 font-black">500 {currency}</p>
                      </div>
                      <div className="p-2 rounded bg-white/10 text-center">
                        <p className="font-bold">7 Jours</p>
                        <p className="text-amber-300 font-black">2 000 {currency}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-[10px] text-white/60 pt-2">
                Propulsé par FLUXIONWIFI
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
