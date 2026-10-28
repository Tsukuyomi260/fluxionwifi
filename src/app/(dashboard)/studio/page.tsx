"use client";

import { useState } from "react";
import {
  Palette,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Copy,
  Trash2,
  Edit3,
  X,
  Monitor,
  Smartphone,
  Image,
  Type,
  Wifi,
  CheckCircle,
  Clock,
  Globe,
  Star,
  Layout,
  Layers,
  Upload,
  ChevronDown,
  ExternalLink,
  Paintbrush,
  PanelTop,
  Megaphone,
  QrCode,
  SlidersHorizontal,
  AlignLeft,
  AlignCenter,
  Bold,
  Italic,
  MousePointerClick,
  Undo2,
  Redo2,
  Save,
  Zap,
  Crown,
} from "lucide-react";

interface Portal {
  id: string;
  name: string;
  status: "active" | "draft" | "archived";
  template: string;
  lastModified: string;
  linkedRouters: number;
  views: number;
  conversions: number;
  thumbnail: string;
}

const demoPortals: Portal[] = [
  {
    id: "P001",
    name: "Portail Cotonou Principal",
    status: "active",
    template: "Moderne",
    lastModified: "Il y a 2h",
    linkedRouters: 3,
    views: 1245,
    conversions: 892,
    thumbnail: "gradient-blue",
  },
  {
    id: "P002",
    name: "Portail Ganhi Mall",
    status: "active",
    template: "Commercial",
    lastModified: "Il y a 1 jour",
    linkedRouters: 1,
    views: 567,
    conversions: 423,
    thumbnail: "gradient-purple",
  },
  {
    id: "P003",
    name: "Portail Événement Spécial",
    status: "draft",
    template: "Événementiel",
    lastModified: "Il y a 3 jours",
    linkedRouters: 0,
    views: 0,
    conversions: 0,
    thumbnail: "gradient-orange",
  },
  {
    id: "P004",
    name: "Portail Porto-Novo",
    status: "archived",
    template: "Minimaliste",
    lastModified: "Il y a 2 sem",
    linkedRouters: 0,
    views: 2340,
    conversions: 1890,
    thumbnail: "gradient-green",
  },
];

const templates = [
  {
    id: "T1",
    name: "Moderne",
    desc: "Design épuré avec gradient et animations",
    gradient: "from-[#2B7FFF] to-[#0B1E4D]",
    popular: true,
  },
  {
    id: "T2",
    name: "Commercial",
    desc: "Espace pub intégré, idéal pour monétiser",
    gradient: "from-violet-500 to-purple-700",
    popular: false,
  },
  {
    id: "T3",
    name: "Minimaliste",
    desc: "Simple et rapide, connexion en un clic",
    gradient: "from-gray-600 to-gray-900",
    popular: false,
  },
  {
    id: "T4",
    name: "Événementiel",
    desc: "Parfait pour festivals, conférences",
    gradient: "from-orange-400 to-red-500",
    popular: false,
  },
  {
    id: "T5",
    name: "Premium",
    desc: "Haut de gamme avec vidéo en fond",
    gradient: "from-amber-400 to-amber-700",
    premium: true,
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Actif", color: "text-emerald-600", bg: "bg-emerald-50" },
  draft: { label: "Brouillon", color: "text-amber-600", bg: "bg-amber-50" },
  archived: { label: "Archivé", color: "text-gray-500", bg: "bg-gray-100" },
};

const gradientMap: Record<string, string> = {
  "gradient-blue": "from-[#2B7FFF] to-[#0B1E4D]",
  "gradient-purple": "from-violet-500 to-purple-700",
  "gradient-orange": "from-orange-400 to-red-500",
  "gradient-green": "from-emerald-400 to-teal-700",
};

type EditorTab = "design" | "content" | "ads" | "settings";

export default function StudioPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editorTab, setEditorTab] = useState<EditorTab>("design");
  const [editorPortal, setEditorPortal] = useState<Portal | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = demoPortals.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeCount = demoPortals.filter((p) => p.status === "active").length;
  const totalViews = demoPortals.reduce((s, p) => s + p.views, 0);
  const totalConversions = demoPortals.reduce((s, p) => s + p.conversions, 0);
  const conversionRate = totalViews > 0 ? Math.round((totalConversions / totalViews) * 100) : 0;

  const stats = [
    { label: "Portails actifs", value: activeCount, icon: Layout, color: "text-[#2B7FFF]", bg: "bg-blue-50" },
    { label: "Vues totales", value: totalViews.toLocaleString("fr-FR"), icon: Eye, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Connexions", value: totalConversions.toLocaleString("fr-FR"), icon: MousePointerClick, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Taux conversion", value: `${conversionRate}%`, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const openEditor = (portal: Portal) => {
    setEditorPortal(portal);
    setShowEditor(true);
    setEditorTab("design");
  };

  // Editor view
  if (showEditor && editorPortal) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {/* Editor toolbar */}
        <div className="border-b border-[#E8ECF1] bg-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEditor(false)}
              className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            <div className="h-5 w-px bg-[#E8ECF1]" />
            <Palette className="h-5 w-5 text-[#2B7FFF]" />
            <span className="font-semibold text-[#0B1E4D] text-sm">{editorPortal.name}</span>
            <span className={`inline-flex items-center rounded-lg ${statusConfig[editorPortal.status].bg} px-2 py-0.5 text-xs font-medium ${statusConfig[editorPortal.status].color}`}>
              {statusConfig[editorPortal.status].label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-[#E8ECF1] overflow-hidden">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`p-2 ${previewMode === "desktop" ? "bg-[#2B7FFF] text-white" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`p-2 ${previewMode === "mobile" ? "bg-[#2B7FFF] text-white" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
            <button className="rounded-lg p-2 hover:bg-gray-100 text-gray-400">
              <Undo2 className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-2 hover:bg-gray-100 text-gray-400">
              <Redo2 className="h-4 w-4" />
            </button>
            <div className="h-5 w-px bg-[#E8ECF1]" />
            <button className="inline-flex items-center gap-2 rounded-lg border border-[#E8ECF1] px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
              <Eye className="h-4 w-4" />
              Aperçu
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#2B7FFF] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#2563EB]">
              <Save className="h-4 w-4" />
              Enregistrer
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left panel - tools */}
          <div className="w-72 border-r border-[#E8ECF1] bg-white flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-[#E8ECF1]">
              {([
                { key: "design", label: "Design", icon: Paintbrush },
                { key: "content", label: "Contenu", icon: Type },
                { key: "ads", label: "Publicité", icon: Megaphone },
                { key: "settings", label: "Config", icon: SlidersHorizontal },
              ] as { key: EditorTab; label: string; icon: typeof Paintbrush }[]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setEditorTab(tab.key)}
                  className={`flex-1 py-2.5 text-xs font-medium flex flex-col items-center gap-1 border-b-2 transition-colors ${
                    editorTab === tab.key
                      ? "border-[#2B7FFF] text-[#2B7FFF]"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {editorTab === "design" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Couleurs</label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Fond principal</span>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2B7FFF] to-[#0B1E4D] border border-gray-200 cursor-pointer" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Bouton</span>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#2B7FFF] border border-gray-200 cursor-pointer" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Texte</span>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-[#E8ECF1]" />

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Logo</label>
                    <div className="rounded-xl border-2 border-dashed border-[#E8ECF1] p-6 text-center cursor-pointer hover:border-[#2B7FFF] hover:bg-blue-50/30 transition-colors">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Cliquez ou glissez votre logo</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, SVG — max 2 Mo</p>
                    </div>
                  </div>

                  <div className="h-px bg-[#E8ECF1]" />

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Image de fond</label>
                    <div className="rounded-xl border-2 border-dashed border-[#E8ECF1] p-6 text-center cursor-pointer hover:border-[#2B7FFF] hover:bg-blue-50/30 transition-colors">
                      <Image className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Image ou vidéo de fond</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, MP4 — max 10 Mo</p>
                    </div>
                  </div>

                  <div className="h-px bg-[#E8ECF1]" />

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Coins des boutons</label>
                    <input type="range" min="0" max="24" defaultValue="12" className="w-full accent-[#2B7FFF]" />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Carré</span>
                      <span>Arrondi</span>
                    </div>
                  </div>
                </>
              )}

              {editorTab === "content" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Titre</label>
                    <input
                      type="text"
                      defaultValue="Bienvenue sur notre WiFi"
                      className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
                    />
                    <div className="flex gap-1 mt-2">
                      <button className="rounded-lg p-1.5 hover:bg-gray-100"><Bold className="h-3.5 w-3.5 text-gray-500" /></button>
                      <button className="rounded-lg p-1.5 hover:bg-gray-100"><Italic className="h-3.5 w-3.5 text-gray-500" /></button>
                      <button className="rounded-lg p-1.5 bg-gray-100"><AlignCenter className="h-3.5 w-3.5 text-gray-600" /></button>
                      <button className="rounded-lg p-1.5 hover:bg-gray-100"><AlignLeft className="h-3.5 w-3.5 text-gray-500" /></button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Sous-titre</label>
                    <input
                      type="text"
                      defaultValue="Connectez-vous en un clic"
                      className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
                    />
                  </div>

                  <div className="h-px bg-[#E8ECF1]" />

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Méthode de connexion</label>
                    <div className="space-y-2">
                      {[
                        { label: "Code ticket", desc: "L'utilisateur entre un code", checked: true },
                        { label: "Numéro de téléphone", desc: "Vérification par SMS", checked: true },
                        { label: "Connexion libre", desc: "Accès gratuit avec pub", checked: false },
                      ].map((m) => (
                        <label key={m.label} className="flex items-start gap-2.5 rounded-xl border border-[#E8ECF1] p-3 cursor-pointer hover:bg-[#F5F7FA]">
                          <input type="checkbox" defaultChecked={m.checked} className="mt-0.5 rounded border-gray-300 text-[#2B7FFF] focus:ring-[#2B7FFF]" />
                          <div>
                            <p className="text-sm font-medium text-[#0B1E4D]">{m.label}</p>
                            <p className="text-xs text-gray-400">{m.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-[#E8ECF1]" />

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Texte du bouton</label>
                    <input
                      type="text"
                      defaultValue="Se connecter"
                      className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Conditions d&apos;utilisation</label>
                    <textarea
                      defaultValue="En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité."
                      rows={3}
                      className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF] resize-none"
                    />
                  </div>
                </>
              )}

              {editorTab === "ads" && (
                <>
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                    <div className="flex items-start gap-2">
                      <Megaphone className="h-4 w-4 text-[#2B7FFF] mt-0.5 shrink-0" />
                      <p className="text-xs text-[#0B1E4D]">
                        Monétisez votre portail en affichant des publicités avant la connexion WiFi.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Bannière publicitaire</label>
                    <div className="rounded-xl border-2 border-dashed border-[#E8ECF1] p-6 text-center cursor-pointer hover:border-[#2B7FFF] hover:bg-blue-50/30 transition-colors">
                      <Image className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Image bannière (728×90)</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Lien de la pub</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
                    />
                  </div>

                  <div className="h-px bg-[#E8ECF1]" />

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Vidéo pré-roll</label>
                    <div className="rounded-xl border-2 border-dashed border-[#E8ECF1] p-6 text-center cursor-pointer hover:border-[#2B7FFF] hover:bg-blue-50/30 transition-colors">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Vidéo avant connexion (15-30s)</p>
                      <p className="text-xs text-gray-400 mt-1">MP4 — max 20 Mo</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Durée d&apos;affichage</label>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 pr-9">
                        <option>5 secondes</option>
                        <option>10 secondes</option>
                        <option>15 secondes</option>
                        <option>30 secondes</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </>
              )}

              {editorTab === "settings" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Nom du portail</label>
                    <input
                      type="text"
                      defaultValue={editorPortal.name}
                      className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Routeurs liés</label>
                    <div className="space-y-2">
                      {["Hotspot Cotonou Centre", "Hotspot Ganhi Mall", "Hotspot Porto-Novo Gare"].map((r) => (
                        <label key={r} className="flex items-center gap-2.5 rounded-xl border border-[#E8ECF1] p-3 cursor-pointer hover:bg-[#F5F7FA]">
                          <input type="checkbox" defaultChecked={r !== "Hotspot Porto-Novo Gare"} className="rounded border-gray-300 text-[#2B7FFF] focus:ring-[#2B7FFF]" />
                          <span className="text-sm text-[#0B1E4D]">{r}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-[#E8ECF1]" />

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Redirection après connexion</label>
                    <input
                      type="url"
                      placeholder="https://votre-site.com"
                      defaultValue=""
                      className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
                    />
                    <p className="text-xs text-gray-400 mt-1">Laissez vide pour afficher la page par défaut</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Langue</label>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 pr-9">
                        <option>Français</option>
                        <option>Anglais</option>
                        <option>Portugais</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Collecte de données</label>
                    <div className="space-y-2">
                      {[
                        { label: "Email", checked: false },
                        { label: "Numéro de téléphone", checked: true },
                        { label: "Nom complet", checked: false },
                      ].map((d) => (
                        <label key={d.label} className="flex items-center gap-2.5 rounded-xl border border-[#E8ECF1] p-3 cursor-pointer hover:bg-[#F5F7FA]">
                          <input type="checkbox" defaultChecked={d.checked} className="rounded border-gray-300 text-[#2B7FFF] focus:ring-[#2B7FFF]" />
                          <span className="text-sm text-[#0B1E4D]">{d.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Center - preview */}
          <div className="flex-1 bg-[#F5F7FA] flex items-center justify-center p-8 overflow-auto">
            <div className={`${previewMode === "mobile" ? "w-[375px]" : "w-full max-w-[900px]"} transition-all duration-300`}>
              <div className={`rounded-2xl overflow-hidden shadow-2xl border border-gray-200 ${previewMode === "mobile" ? "aspect-[9/16]" : "aspect-[16/9]"}`}>
                {/* Simulated portal preview */}
                <div className={`w-full h-full bg-gradient-to-br ${gradientMap[editorPortal.thumbnail] || "from-[#2B7FFF] to-[#0B1E4D]"} flex flex-col items-center justify-center p-8 relative`}>
                  {/* Decorative */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/15 blur-3xl" />
                  </div>

                  <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
                    {/* Logo placeholder */}
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/20">
                      <Wifi className="h-8 w-8 text-white" />
                    </div>

                    <h2 className={`${previewMode === "mobile" ? "text-xl" : "text-2xl"} font-bold text-white mb-2`}>
                      Bienvenue sur notre WiFi
                    </h2>
                    <p className="text-white/70 text-sm mb-8">
                      Connectez-vous en un clic
                    </p>

                    {/* Form */}
                    <div className="w-full space-y-3">
                      <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 text-left">
                        <span className="text-white/50 text-sm">Entrez votre code ticket</span>
                      </div>
                      <button className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-[#0B1E4D] hover:bg-white/90 transition-colors">
                        Se connecter
                      </button>
                    </div>

                    {/* Ad banner placeholder */}
                    <div className="mt-8 w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 p-3">
                      <div className="flex items-center gap-2 justify-center">
                        <Megaphone className="h-3.5 w-3.5 text-white/40" />
                        <span className="text-xs text-white/40">Espace publicitaire</span>
                      </div>
                    </div>

                    <p className="text-white/30 text-xs mt-6">
                      Propulsé par FLUXIONWIFI
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main list view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1E4D]">Studio</h1>
          <p className="text-sm text-gray-500 mt-1">
            Créez et personnalisez vos portails captifs WiFi
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2B7FFF] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2563EB] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouveau portail
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[#E8ECF1] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-xl ${s.bg} p-2.5`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0B1E4D]">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un portail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#E8ECF1] bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none rounded-xl border border-[#E8ECF1] bg-white pl-3 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="draft">Brouillons</option>
            <option value="archived">Archivés</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Portal cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((portal) => {
          const st = statusConfig[portal.status];
          return (
            <div
              key={portal.id}
              className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden group"
            >
              {/* Thumbnail */}
              <div
                className={`h-36 bg-gradient-to-br ${gradientMap[portal.thumbnail]} relative flex items-center justify-center cursor-pointer`}
                onClick={() => openEditor(portal)}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-[#0B1E4D]">
                      <Edit3 className="h-4 w-4" />
                      Modifier
                    </div>
                  </div>
                </div>
                <Wifi className="h-10 w-10 text-white/30" />
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center rounded-lg ${st.bg} px-2 py-0.5 text-xs font-medium ${st.color}`}>
                    {st.label}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[#0B1E4D] text-sm">{portal.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Modèle {portal.template} · {portal.lastModified}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === portal.id ? null : portal.id)}
                      className="rounded-lg p-1.5 hover:bg-gray-100"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                    {menuOpen === portal.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-[#E8ECF1] bg-white shadow-lg py-1">
                          <button
                            onClick={() => { openEditor(portal); setMenuOpen(null); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-[#F5F7FA]"
                          >
                            <Edit3 className="h-4 w-4" /> Modifier
                          </button>
                          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-[#F5F7FA]">
                            <Copy className="h-4 w-4" /> Dupliquer
                          </button>
                          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-[#F5F7FA]">
                            <ExternalLink className="h-4 w-4" /> Aperçu
                          </button>
                          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-[#F5F7FA]">
                            <QrCode className="h-4 w-4" /> QR Code
                          </button>
                          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" /> Supprimer
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" />
                    {portal.linkedRouters} routeur(s)
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {portal.views.toLocaleString("fr-FR")} vues
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MousePointerClick className="h-3.5 w-3.5" />
                    {portal.conversions.toLocaleString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-[#E8ECF1]">
              <h2 className="text-lg font-bold text-[#0B1E4D]">Nouveau portail captif</h2>
              <button onClick={() => setShowCreateModal(false)} className="rounded-lg p-1.5 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom du portail</label>
                <input
                  type="text"
                  placeholder="Ex : Portail Hôtel de Ville"
                  className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Choisissez un modèle</label>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map((t) => (
                    <label
                      key={t.id}
                      className="relative rounded-xl border-2 border-[#E8ECF1] overflow-hidden cursor-pointer hover:border-[#2B7FFF] transition-colors group"
                    >
                      <input type="radio" name="template" className="sr-only peer" defaultChecked={t.id === "T1"} />
                      <div className="peer-checked:border-[#2B7FFF] peer-checked:ring-2 peer-checked:ring-[#2B7FFF]/20 rounded-xl">
                        <div className={`h-20 bg-gradient-to-br ${t.gradient} flex items-center justify-center relative`}>
                          <Wifi className="h-6 w-6 text-white/40" />
                          {t.popular && (
                            <div className="absolute top-2 right-2">
                              <span className="inline-flex items-center gap-1 rounded-md bg-white/20 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-medium text-white">
                                <Star className="h-2.5 w-2.5" /> Populaire
                              </span>
                            </div>
                          )}
                          {"premium" in t && t.premium && (
                            <div className="absolute top-2 right-2">
                              <span className="inline-flex items-center gap-1 rounded-md bg-white/20 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-medium text-white">
                                <Crown className="h-2.5 w-2.5" /> Premium
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-semibold text-[#0B1E4D]">{t.name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{t.desc}</p>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 opacity-0 peer-checked:opacity-100">
                        <CheckCircle className="h-5 w-5 text-[#2B7FFF] bg-white rounded-full" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-xl border border-[#E8ECF1] py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B7FFF] py-2.5 text-sm font-medium text-white hover:bg-[#2563EB] transition-colors">
                  <Palette className="h-4 w-4" />
                  Créer et personnaliser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
