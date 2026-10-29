"use client";

import { useState } from "react";
import {
  BookOpen,
  Search,
  Play,
  Clock,
  ChevronRight,
  Star,
  Filter,
  CheckCircle,
  Lock,
  Wifi,
  Router,
  CreditCard,
  Shield,
  Palette,
  Settings,
  Users,
  Globe,
  Smartphone,
  ChevronDown,
  ExternalLink,
  Award,
  Zap,
  Eye,
} from "lucide-react";

type TutorialLevel = "beginner" | "intermediate" | "advanced";
type TutorialCategory = "getting-started" | "router" | "portal" | "billing" | "vpn" | "advanced";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: TutorialCategory;
  level: TutorialLevel;
  duration: string;
  videoUrl?: string;
  completed: boolean;
  steps: number;
  views: number;
  featured?: boolean;
}

const categories: { key: TutorialCategory | "all"; label: string; icon: typeof BookOpen }[] = [
  { key: "all", label: "Tous", icon: BookOpen },
  { key: "getting-started", label: "Premiers pas", icon: Zap },
  { key: "router", label: "Routeurs", icon: Router },
  { key: "portal", label: "Portail captif", icon: Palette },
  { key: "billing", label: "Facturation", icon: CreditCard },
  { key: "vpn", label: "VPN", icon: Shield },
  { key: "advanced", label: "Avancé", icon: Settings },
];

const levelConfig: Record<TutorialLevel, { label: string; color: string; bg: string }> = {
  beginner: { label: "Débutant", color: "text-emerald-600", bg: "bg-emerald-50" },
  intermediate: { label: "Intermédiaire", color: "text-amber-600", bg: "bg-amber-50" },
  advanced: { label: "Avancé", color: "text-red-500", bg: "bg-red-50" },
};

const tutorials: Tutorial[] = [
  {
    id: "T01",
    title: "Configurer votre premier routeur MikroTik",
    description: "Apprenez à connecter et configurer un routeur MikroTik avec FLUXIONWIFI en moins de 10 minutes.",
    category: "getting-started",
    level: "beginner",
    duration: "8 min",
    completed: true,
    steps: 6,
    views: 3420,
    featured: true,
  },
  {
    id: "T02",
    title: "Créer et vendre des tickets WiFi",
    description: "Générez des tickets WiFi, configurez les tarifs et commencez à vendre via Mobile Money.",
    category: "getting-started",
    level: "beginner",
    duration: "5 min",
    completed: true,
    steps: 4,
    views: 2890,
    featured: true,
  },
  {
    id: "T03",
    title: "Personnaliser votre portail captif avec le Studio",
    description: "Utilisez l'éditeur visuel pour créer un portail captif à l'image de votre marque.",
    category: "portal",
    level: "beginner",
    duration: "12 min",
    completed: false,
    steps: 8,
    views: 1850,
    featured: true,
  },
  {
    id: "T04",
    title: "Gérer plusieurs sites avec l'Interopérabilité",
    description: "Ajoutez plusieurs routeurs, configurez les zones géographiques et synchronisez vos configurations.",
    category: "router",
    level: "intermediate",
    duration: "15 min",
    completed: false,
    steps: 10,
    views: 1240,
  },
  {
    id: "T05",
    title: "Configurer un tunnel VPN WireGuard",
    description: "Mettez en place un accès distant sécurisé à votre réseau via WireGuard.",
    category: "vpn",
    level: "intermediate",
    duration: "10 min",
    completed: false,
    steps: 7,
    views: 980,
  },
  {
    id: "T06",
    title: "Comprendre la facturation et les abonnements",
    description: "Tour complet du système de facturation : formules, recharges, renouvellements et historique.",
    category: "billing",
    level: "beginner",
    duration: "6 min",
    completed: false,
    steps: 5,
    views: 2100,
  },
  {
    id: "T07",
    title: "Activer le roaming inter-sites",
    description: "Permettez à vos clients d'utiliser un seul ticket sur tous vos hotspots.",
    category: "router",
    level: "intermediate",
    duration: "8 min",
    completed: false,
    steps: 5,
    views: 870,
  },
  {
    id: "T08",
    title: "Ajouter des publicités à votre portail captif",
    description: "Monétisez votre WiFi en affichant des bannières et vidéos pré-roll avant la connexion.",
    category: "portal",
    level: "beginner",
    duration: "7 min",
    completed: false,
    steps: 4,
    views: 1560,
  },
  {
    id: "T09",
    title: "Configuration avancée RADIUS",
    description: "Profils de bande passante, limitation par groupe, fair-use policy et accounting.",
    category: "advanced",
    level: "advanced",
    duration: "20 min",
    completed: false,
    steps: 12,
    views: 650,
  },
  {
    id: "T10",
    title: "Gestion des vendeurs terrain",
    description: "Créez des comptes vendeurs, attribuez des quotas et suivez leurs ventes en temps réel.",
    category: "getting-started",
    level: "beginner",
    duration: "6 min",
    completed: false,
    steps: 5,
    views: 1380,
  },
  {
    id: "T11",
    title: "Migrer de RouterOS 6 à RouterOS 7",
    description: "Guide pas-à-pas pour mettre à jour vos routeurs MikroTik sans perte de configuration.",
    category: "advanced",
    level: "advanced",
    duration: "18 min",
    completed: false,
    steps: 9,
    views: 420,
  },
  {
    id: "T12",
    title: "Utiliser l'application mobile FLUXIONWIFI",
    description: "Gérez vos hotspots, vendez des tickets et suivez vos revenus depuis votre smartphone.",
    category: "getting-started",
    level: "beginner",
    duration: "4 min",
    completed: false,
    steps: 3,
    views: 2350,
  },
];

export default function TutorialsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<TutorialCategory | "all">("all");
  const [filterLevel, setFilterLevel] = useState<TutorialLevel | "all">("all");
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const featured = tutorials.filter((t) => t.featured);

  const filtered = tutorials.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "all" || t.category === activeCategory;
    const matchLevel = filterLevel === "all" || t.level === filterLevel;
    return matchSearch && matchCategory && matchLevel;
  });

  const completedCount = tutorials.filter((t) => t.completed).length;
  const progress = Math.round((completedCount / tutorials.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1E4D]">Tutoriels</h1>
          <p className="text-sm text-gray-500 mt-1">
            Apprenez à maîtriser FLUXIONWIFI étape par étape
          </p>
        </div>
        {/* Progress */}
        <div className="flex items-center gap-3 rounded-2xl border border-[#E8ECF1] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <Award className="h-5 w-5 text-amber-500" />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-[#0B1E4D]">{completedCount}/{tutorials.length} terminés</p>
              <span className="text-xs text-gray-400">{progress}%</span>
            </div>
            <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Featured tutorials */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Recommandés pour vous</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featured.map((t) => {
            const lv = levelConfig[t.level];
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTutorial(t)}
                className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden text-left hover:shadow-md hover:border-[#2B7FFF]/30 transition-all group"
              >
                {/* Video thumbnail */}
                <div className="relative h-36 bg-gradient-to-br from-[#0B1E4D] to-[#1A3A7A] flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-[#2B7FFF]/30 blur-2xl" />
                    <div className="absolute bottom-4 right-4 w-20 h-20 rounded-full bg-[#2B7FFF]/20 blur-2xl" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all">
                    <Play className="h-5 w-5 text-white ml-0.5" />
                  </div>
                  <div className="absolute top-3 left-3">
                    {t.completed && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        <CheckCircle className="h-3 w-3" /> Terminé
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-black/40 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white">
                      <Clock className="h-3 w-3" /> {t.duration}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center rounded-md ${lv.bg} px-1.5 py-0.5 text-[10px] font-medium ${lv.color}`}>
                      {lv.label}
                    </span>
                    <span className="text-[10px] text-gray-400">{t.steps} étapes</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#0B1E4D] line-clamp-2">{t.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{t.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un tutoriel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E8ECF1] bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            />
          </div>
          <div className="relative">
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as TutorialLevel | "all")}
              className="appearance-none rounded-xl border border-[#E8ECF1] bg-white pl-3 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <option value="all">Tous les niveaux</option>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === c.key
                  ? "bg-[#2B7FFF] text-white"
                  : "bg-white border border-[#E8ECF1] text-gray-600 hover:bg-[#F5F7FA]"
              }`}
            >
              <c.icon className="h-4 w-4" />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tutorial list */}
      <div className="space-y-3">
        {filtered.map((t) => {
          const lv = levelConfig[t.level];
          const catInfo = categories.find((c) => c.key === t.category);
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTutorial(t)}
              className="w-full rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 text-left hover:shadow-md hover:border-[#2B7FFF]/30 transition-all flex items-center gap-4"
            >
              {/* Play icon */}
              <div className={`shrink-0 w-12 h-12 rounded-xl ${t.completed ? "bg-emerald-50" : "bg-blue-50"} flex items-center justify-center`}>
                {t.completed ? (
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                ) : (
                  <Play className="h-5 w-5 text-[#2B7FFF] ml-0.5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-sm font-semibold text-[#0B1E4D]">{t.title}</h3>
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">{t.description}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                  <span className={`inline-flex items-center rounded-md ${lv.bg} px-1.5 py-0.5 font-medium ${lv.color}`}>
                    {lv.label}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {t.duration}
                  </span>
                  <span>{t.steps} étapes</span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {t.views.toLocaleString("fr-FR")}
                  </span>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-gray-300 shrink-0" />
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Aucun tutoriel trouvé</p>
          </div>
        )}
      </div>

      {/* Tutorial detail modal */}
      {selectedTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Video header */}
            <div className="relative h-48 bg-gradient-to-br from-[#0B1E4D] to-[#1A3A7A] flex items-center justify-center rounded-t-2xl">
              <div className="absolute inset-0 opacity-10 rounded-t-2xl overflow-hidden">
                <div className="absolute top-6 left-6 w-24 h-24 rounded-full bg-[#2B7FFF]/30 blur-3xl" />
                <div className="absolute bottom-6 right-6 w-32 h-32 rounded-full bg-[#2B7FFF]/20 blur-3xl" />
              </div>
              <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all">
                <Play className="h-7 w-7 text-white ml-1" />
              </button>
              <div className="absolute bottom-3 right-3">
                <span className="inline-flex items-center gap-1 rounded-lg bg-black/40 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
                  <Clock className="h-3.5 w-3.5" /> {selectedTutorial.duration}
                </span>
              </div>
              <button
                onClick={() => setSelectedTutorial(null)}
                className="absolute top-3 right-3 rounded-lg bg-black/30 backdrop-blur-sm p-1.5 hover:bg-black/50"
              >
                <span className="sr-only">Fermer</span>
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center rounded-lg ${levelConfig[selectedTutorial.level].bg} px-2 py-0.5 text-xs font-medium ${levelConfig[selectedTutorial.level].color}`}>
                    {levelConfig[selectedTutorial.level].label}
                  </span>
                  <span className="text-xs text-gray-400">{selectedTutorial.steps} étapes · {selectedTutorial.views.toLocaleString("fr-FR")} vues</span>
                </div>
                <h2 className="text-lg font-bold text-[#0B1E4D]">{selectedTutorial.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedTutorial.description}</p>
              </div>

              {/* Steps */}
              <div>
                <h3 className="text-sm font-semibold text-[#0B1E4D] mb-3">Étapes du tutoriel</h3>
                <div className="space-y-2">
                  {Array.from({ length: selectedTutorial.steps }, (_, i) => {
                    const stepTitles: Record<string, string[]> = {
                      T01: ["Prérequis matériel", "Connexion au routeur", "Accès à Winbox/WebFig", "Configuration de l'API", "Ajout dans FLUXIONWIFI", "Test de connexion"],
                      T02: ["Accéder aux tickets", "Configurer les tarifs", "Générer un lot de tickets", "Tester la connexion client"],
                      T03: ["Ouvrir le Studio", "Choisir un modèle", "Personnaliser les couleurs", "Ajouter votre logo", "Modifier les textes", "Configurer la connexion", "Ajouter une publicité", "Publier le portail"],
                    };
                    const titles = stepTitles[selectedTutorial.id];
                    const title = titles ? titles[i] : `Étape ${i + 1}`;
                    const done = selectedTutorial.completed || (i < 2 && !selectedTutorial.completed);
                    return (
                      <div key={i} className={`flex items-center gap-3 rounded-xl p-3 ${done ? "bg-emerald-50/50" : "bg-[#F5F7FA]"}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          done ? "bg-emerald-500 text-white" : "bg-white border border-[#E8ECF1] text-gray-400"
                        }`}>
                          {done ? <CheckCircle className="h-4 w-4" /> : i + 1}
                        </div>
                        <span className={`text-sm ${done ? "text-emerald-700 font-medium" : "text-gray-600"}`}>{title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTutorial(null)}
                  className="flex-1 rounded-xl border border-[#E8ECF1] py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B7FFF] py-2.5 text-sm font-medium text-white hover:bg-[#2563EB] transition-colors">
                  <Play className="h-4 w-4" />
                  {selectedTutorial.completed ? "Revoir" : "Commencer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
