"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  Search,
  BookOpen,
  Wrench,
  Bookmark,
  LayoutDashboard,
  Receipt,
  Headphones,
  CheckCircle,
  Download,
  Clock,
  User,
  ChevronRight,
  X,
  Volume2,
  Film,
  Sparkles,
  Shield,
  Radio,
  ExternalLink,
} from "lucide-react";

interface Tutorial {
  id: string;
  title: string;
  duration: string;
  category: "fluxion" | "technique";
  audience?: string;
  description: string;
  thumbnail?: string;
  views: number;
}

const tutorialsData: Tutorial[] = [
  {
    id: "T01",
    title: "FLUXIONWIFI en 48 secondes : Présentation générale",
    duration: "0:48",
    category: "fluxion",
    audience: "Tous",
    description: "Découvrez en moins d'une minute comment automatiser la vente de tickets WiFi par Mobile Money.",
    views: 4520,
  },
  {
    id: "T02",
    title: "Brancher et initialiser votre premier routeur MikroTik",
    duration: "4:15",
    category: "fluxion",
    audience: "Débutant",
    description: "Câblage, reset usine et premier branchement avec le script automatique FLUXIONWIFI.",
    views: 3810,
  },
  {
    id: "T03",
    title: "Installer le script automatique FLUXIONWIFI (.rsc)",
    duration: "3:30",
    category: "fluxion",
    audience: "Technicien",
    description: "Importation du script de synchronisation dans WinBox et vérification de la connexion.",
    views: 2940,
  },
  {
    id: "T04",
    title: "Créer des profils de tickets (Durée, Débit, Prix)",
    duration: "2:50",
    category: "fluxion",
    audience: "Promoteur",
    description: "Définissez vos tarifs en FCFA/devise locale et vos forfaits horaires, journaliers ou hebdomadaires.",
    views: 3100,
  },
  {
    id: "T05",
    title: "Activer les paiements Mobile Money (FedaPay, CinetPay, FeexPay)",
    duration: "5:20",
    category: "fluxion",
    audience: "Promoteur",
    description: "Renseignez vos clés API et commencez à encaisser 24h/24 directement sur votre compte.",
    views: 2680,
  },
  {
    id: "T06",
    title: "Personnaliser le portail captif : Logo, Couleurs et Textes",
    duration: "4:00",
    category: "fluxion",
    audience: "Promoteur",
    description: "Modifiez l'apparence de votre page de connexion pour valoriser l'image de votre WiFi zone.",
    views: 1950,
  },
  {
    id: "T07",
    title: "Générer et imprimer des séries de tickets physiques",
    duration: "3:10",
    category: "fluxion",
    audience: "Revendeur",
    description: "Export PDF prêt à découper avec QR code et identifiants uniques.",
    views: 2240,
  },
  {
    id: "T08",
    title: "Ajouter et gérer des comptes revendeurs avec commissions",
    duration: "4:45",
    category: "fluxion",
    audience: "Promoteur",
    description: "Déléguez la vente physique tout en gardant le contrôle absolu sur votre trésorerie.",
    views: 1730,
  },
  {
    id: "T09",
    title: "Connecter son routeur au VPN FLUXIONWIFI (SSTP & WireGuard)",
    duration: "6:10",
    category: "technique",
    audience: "Technicien",
    description: "Accédez à distance à WinBox même derrière un routeur 4G sans adresse IP publique.",
    views: 3410,
  },
  {
    id: "T10",
    title: "Configuration avancée des antennes d'extension (TP-Link, Ubiquiti)",
    duration: "8:40",
    category: "technique",
    audience: "Technicien",
    description: "Paramétrer des points d'accès en mode pont (Bridge) pour étendre la couverture de votre zone.",
    views: 2890,
  },
];

export default function TutorialsPage() {
  const [activeTab, setActiveTab] = useState<"fluxion" | "technique" | "mes">("fluxion");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState<Tutorial | null>(null);

  const filteredTutorials = tutorialsData.filter((t) => {
    const matchesTab = activeTab === "mes" ? true : t.category === activeTab;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-[#0F172A] text-white flex flex-col lg:flex-row">
      {/* Sidebar APPRENDRE / MON ESPACE */}
      <aside className="w-full lg:w-64 bg-[#111827] border-r border-[#1F2937] shrink-0 p-4 lg:p-5 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Logo Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#1F2937]">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#2B7FFF] to-blue-400 flex items-center justify-center shadow-lg shadow-[#2B7FFF]/20">
              <Film className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-wide text-white">
                FLUXIONWIFI
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                Tutoriels
              </p>
            </div>
          </div>

          {/* Section APPRENDRE */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">
              Apprendre
            </p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("fluxion")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "fluxion"
                    ? "bg-[#2B7FFF] text-white shadow-md shadow-[#2B7FFF]/25"
                    : "text-gray-300 hover:bg-[#1F2937] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-4 w-4" />
                  <span>Tutoriels FLUXIONWIFI</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  43
                </span>
              </button>

              <button
                onClick={() => setActiveTab("technique")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "technique"
                    ? "bg-[#2B7FFF] text-white shadow-md shadow-[#2B7FFF]/25"
                    : "text-gray-300 hover:bg-[#1F2937] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wrench className="h-4 w-4" />
                  <span>Techniques</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                  2
                </span>
              </button>

              <button
                onClick={() => setActiveTab("mes")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "mes"
                    ? "bg-[#2B7FFF] text-white shadow-md shadow-[#2B7FFF]/25"
                    : "text-gray-300 hover:bg-[#1F2937] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bookmark className="h-4 w-4" />
                  <span>Mes tutoriels</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section MON ESPACE */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">
              Mon Espace
            </p>
            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-300 hover:bg-[#1F2937] hover:text-white transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 text-gray-400" />
                <span>Tableau de bord</span>
              </Link>
              <Link
                href="/finance/billing"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-300 hover:bg-[#1F2937] hover:text-white transition-colors"
              >
                <Receipt className="h-4 w-4 text-gray-400" />
                <span>Facturation</span>
              </Link>
              <Link
                href="/support"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-300 hover:bg-[#1F2937] hover:text-white transition-colors"
              >
                <Headphones className="h-4 w-4 text-gray-400" />
                <span>Assistance</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Clé USB Pack Offline Promo */}
        <div className="mt-6 p-3.5 rounded-xl bg-gradient-to-br from-blue-950/60 to-indigo-950/60 border border-blue-800/30">
          <div className="flex items-center gap-2 text-blue-300 text-xs font-bold mb-1">
            <Download className="h-3.5 w-3.5" />
            <span>Mode Hors-Ligne</span>
          </div>
          <p className="text-[11px] text-gray-300 mb-2">
            Téléchargez l&apos;intégralité des 43 vidéos pour formation locale sur clé USB (358 Mo).
          </p>
          <button className="w-full py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 text-[11px] font-semibold border border-blue-500/30 transition-all">
            Télécharger le pack (ZIP)
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-[#1F2937]/60">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">≡</span>
            <span className="text-sm font-bold text-gray-200">Tutoriels</span>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-2 text-xs text-gray-300 hover:text-white bg-[#1F2937] px-3 py-1.5 rounded-xl border border-[#374151] transition-colors"
          >
            <User className="h-3.5 w-3.5 text-emerald-400" />
            <span>Mon compte</span>
          </Link>
        </div>

        {/* Hero Blue Banner (from 19-tutoriels.jpg) */}
        <section className="rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 lg:p-8 shadow-xl text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-white/10 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-semibold text-blue-100">
              <Volume2 className="h-3.5 w-3.5 text-amber-300" />
              <span>TUTORIELS ANIMÉS, AVEC LA VOIX</span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
              Apprenez en quelques minutes
            </h2>

            <p className="text-sm text-blue-100/90 leading-relaxed">
              Les guides de FLUXIONWIFI sont gratuits. Pour aller plus loin, les tutoriels techniques couvrent
              MikroTik, routeurs et antennes.
            </p>

            {/* 4 Stats Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                <p className="text-xl font-black text-white">43</p>
                <p className="text-[11px] text-blue-200">tutoriels gratuits</p>
              </div>
              <div className="bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                <p className="text-xl font-black text-amber-300">2</p>
                <p className="text-[11px] text-blue-200">tutoriels techniques</p>
              </div>
              <div className="bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                <p className="text-xl font-black text-emerald-300">134 min</p>
                <p className="text-[11px] text-blue-200">de vidéo gratuite</p>
              </div>
              <div className="bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4 text-amber-400" />
                  <p className="text-xl font-black text-white">358 Mo</p>
                </div>
                <p className="text-[11px] text-blue-200">tout, sans Internet (clé USB)</p>
              </div>
            </div>

            {/* Search Input */}
            <div className="pt-2">
              <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un tutoriel..."
                  className="w-full rounded-xl bg-white text-gray-900 pl-10 pr-4 py-2.5 text-xs font-medium placeholder:text-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Video Spotlight Card */}
        <section className="rounded-2xl bg-[#111827] border border-[#1F2937] p-5 lg:p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left Thumbnail with Play Button */}
            <div
              onClick={() => setActiveVideo(tutorialsData[0])}
              className="relative aspect-video rounded-xl bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-indigo-900/40 flex flex-col items-center justify-center cursor-pointer group overflow-hidden shadow-inner"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_70%)]" />
              <div className="text-center space-y-2 z-10">
                <p className="text-xs font-bold tracking-widest text-amber-300 uppercase">
                  VOICI LA SOLUTION
                </p>
                <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <Play className="h-6 w-6 text-black fill-black ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-bold text-gray-200">
                0:48
              </span>
            </div>

            {/* Right Info */}
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400">
                <Sparkles className="h-3.5 w-3.5" />
                PRÉSENTATION
              </span>
              <h3 className="text-xl font-bold text-white">
                FLUXIONWIFI en 48 secondes
              </h3>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Vente en ligne par Mobile Money, 24h/24</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Revendeurs suivis au franc près</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>FLUXION VPN + MikHmon en ligne</span>
                </li>
              </ul>
              <button
                onClick={() => setActiveVideo(tutorialsData[0])}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2B7FFF] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-[#2B7FFF]/20"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Regarder la vidéo (48s)</span>
              </button>
            </div>
          </div>
        </section>

        {/* All Tutorials Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              {activeTab === "technique"
                ? "Cours & Guides Techniques"
                : activeTab === "mes"
                ? "Vos Tutoriels Sauvegardés"
                : "Tous les tutoriels FLUXIONWIFI"}
            </h3>
            <span className="text-xs text-gray-500 font-medium">
              {filteredTutorials.length} vidéo{filteredTutorials.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTutorials.map((tut) => (
              <div
                key={tut.id}
                onClick={() => setActiveVideo(tut)}
                className="rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#2B7FFF]/40 p-4 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1F2937] text-blue-300">
                      {tut.audience || "Guide"}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
                      <Clock className="h-3 w-3" />
                      {tut.duration}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#2B7FFF] transition-colors line-clamp-2">
                    {tut.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 line-clamp-2">
                    {tut.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1F2937] flex items-center justify-between text-[11px] text-gray-400">
                  <span>{tut.views.toLocaleString()} vues</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#2B7FFF]">
                    Lire <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#1F2937]">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-[#2B7FFF]" />
                <h3 className="text-xs font-bold text-white truncate max-w-md">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1F2937]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Video Simulation Canvas */}
            <div className="aspect-video bg-black flex flex-col items-center justify-center p-6 text-center space-y-3 relative">
              <div className="h-16 w-16 rounded-full bg-[#2B7FFF]/20 border border-[#2B7FFF]/40 flex items-center justify-center text-[#2B7FFF]">
                <Film className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Lecture : {activeVideo.title}</p>
                <p className="text-xs text-gray-400 mt-1">Durée : {activeVideo.duration} · Voix explicative en français</p>
              </div>
              <div className="w-full max-w-xs bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#2B7FFF] h-full w-1/3 animate-pulse" />
              </div>
            </div>

            <div className="p-4 bg-[#0F172A] flex items-center justify-between text-xs text-gray-300">
              <p>{activeVideo.description}</p>
              <button
                onClick={() => setActiveVideo(null)}
                className="px-3 py-1.5 rounded-lg bg-[#1F2937] hover:bg-[#374151] text-white text-xs font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
