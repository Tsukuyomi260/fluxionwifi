"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Palette,
  Image,
  Type,
  SlidersHorizontal,
  Crown,
  Download,
  Printer,
  Square,
  Save,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Eye,
  FolderOpen,
  ShoppingCart,
  LayoutDashboard,
  Receipt,
  BookOpen,
  Wand2,
  Play,
  Paintbrush,
  Video,
  Package,
  ClipboardList,
} from "lucide-react";

type SidebarItem = "atelier" | "galerie" | "creations" | "annonce" | "pack" | "commandes";
type ContentTab = "style" | "contenu" | "format";

interface PaletteItem {
  name: string;
  colors: [string, string, string];
  pro?: boolean;
}

const palettes: PaletteItem[] = [
  { name: "Mes couleurs", colors: ["#F59E0B", "#F97316", "#EF4444"] },
  { name: "Nuit & or", colors: ["#1E1B4B", "#F59E0B", "#EF4444"] },
  { name: "FLUXIONWIFI", colors: ["#2B7FFF", "#6366F1", "#2B7FFF"] },
  { name: "Wax", colors: ["#F97316", "#EF4444", "#F59E0B"] },
  { name: "Savane", colors: ["#D97706", "#92400E", "#F59E0B"], pro: true },
  { name: "Lagune", colors: ["#2563EB", "#06B6D4", "#0EA5E9"] },
  { name: "Corail", colors: ["#EC4899", "#F43F5E", "#FB7185"] },
  { name: "Soleil (Impression)", colors: ["#FACC15", "#F59E0B", "#EF4444"] },
  { name: "Bleu & jaune (Impression)", colors: ["#2563EB", "#3B82F6", "#FACC15"], pro: true },
  { name: "Néon", colors: ["#A855F7", "#EC4899", "#06B6D4"] },
  { name: "Menthe", colors: ["#10B981", "#34D399", "#6EE7B7"] },
  { name: "Forêt", colors: ["#065F46", "#10B981", "#34D399"], pro: true },
  { name: "Royal", colors: ["#7C3AED", "#EC4899", "#F472B6"] },
  { name: "Encre & orange", colors: ["#6B7280", "#D97706", "#F59E0B"], pro: true },
  { name: "Tomate", colors: ["#EF4444", "#F97316", "#DC2626"] },
  { name: "Citron (clair)", colors: ["#FACC15", "#FDE68A", "#EF4444"] },
  { name: "Cobalt", colors: ["#1D4ED8", "#2563EB", "#EF4444"] },
  { name: "Framboise", colors: ["#DB2777", "#EC4899", "#F472B6"] },
  { name: "Émeraude", colors: ["#059669", "#10B981", "#FACC15"], pro: true },
  { name: "Mandarine", colors: ["#EA580C", "#F97316", "#FB923C"] },
  { name: "Kraft (clair)", colors: ["#D97706", "#F59E0B", "#FDE68A"], pro: true },
  { name: "Sable (clair)", colors: ["#92400E", "#D4A574", "#FDE68A"], pro: true },
  { name: "Pastel (clair)", colors: ["#F9A8D4", "#C4B5FD", "#A5F3FC"], pro: true },
  { name: "Papier (clair)", colors: ["#1E293B", "#475569", "#EF4444"] },
];

type Family = "Prix géant" | "Enseigne peinte" | "Lumière profonde" | "Devant le titre";

const STYLES: { name: string; family: Family; tags: string[] }[] = [
  ...["Prix géant", "Diagonale", "Prix vertical", "Trio de prix", "Escalier", "Pastille", "Soldes", "Rayures", "Damier", "Ruban", "Flèche"].map((name) => ({ name, family: "Prix géant" as Family, tags: [] as string[] })),
  ...["Enseigne peinte", "Étiquette", "Tampon", "Bulle BD", "Affichette", "Sticker"].map((name) => ({ name, family: "Enseigne peinte" as Family, tags: [] as string[] })),
  ...["Lumière profonde", "Signal", "Chrono", "Mur de prix"].map((name) => ({ name, family: "Lumière profonde" as Family, tags: [] as string[] })),
  ...["Devant le titre", "Couverture", "Duotone", "Aurore", "Nuée de signal", "Ticket d'or", "Enseigne néon", "Trame photo", "Soie numérique", "Kente", "Ville isométrique", "Typo 3D", "Rétro 80", "Interférences", "Art déco", "Papier découpé", "Topographie", "Botanique", "Ardoise", "Pop BD", "Glitch", "Une de magazine", "Réseau maillé", "Bauhaus", "Suisse"].map((name) => ({ name, family: "Devant le titre" as Family, tags: [] as string[] })),
];

const TAGS: Record<string, string[]> = {
  Wow: ["Aurore", "Nuée de signal", "Ticket d'or", "Enseigne néon"],
  Moderne: ["Duotone", "Suisse", "Bauhaus", "Couverture"],
  Afrique: ["Kente"],
  Luxe: ["Art déco", "Ticket d'or"],
  Nuit: ["Enseigne néon", "Aurore", "Lumière profonde"],
  Naturel: ["Botanique", "Topographie", "Papier découpé"],
  Doux: ["Soie numérique", "Aurore"],
  "3D": ["Typo 3D", "Ville isométrique"],
  Tech: ["Réseau maillé", "Glitch", "Interférences", "Signal"],
  "Art génératif": ["Topographie", "Réseau maillé", "Nuée de signal"],
  "Op-art": ["Rayures", "Damier", "Interférences"],
  Rétro: ["Rétro 80", "Pop BD", "Art déco"],
  Fun: ["Sticker", "Bulle BD", "Pop BD", "Tampon"],
  Éditorial: ["Une de magazine", "Couverture", "Suisse"],
  Minimal: ["Suisse", "Étiquette", "Affichette"],
};
for (const [tag, names] of Object.entries(TAGS)) for (const n of names) STYLES.find((x) => x.name === n)?.tags.push(tag);

const FILTERS = ["Tous", "Prix géant", "Enseigne peinte", "Lumière profonde", "Devant le titre", ...Object.keys(TAGS)];
const LIGHTS = ["Aucune", "Douce", "Intense"] as const;

export default function StudioPage() {
  const [activeSidebar, setActiveSidebar] = useState<SidebarItem>("atelier");
  const [activeTab, setActiveTab] = useState<ContentTab>("style");
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [filter, setFilter] = useState("Tous");
  const [light, setLight] = useState<(typeof LIGHTS)[number]>("Douce");
  const [title, setTitle] = useState("1500");
  const [subtitle, setSubtitle] = useState("Wi-Fi");
  const [details, setDetails] = useState("À PARTIR DE · 1 GO · 24 HEURES");
  const [brand, setBrand] = useState("FLUXIONWIFI");
  const styleName = STYLES[templateIndex].name;
  const visible = STYLES.map((st, i) => ({ st, i })).filter(({ st }) => filter === "Tous" || st.family === filter || st.tags.includes(filter));
  const mode = templateIndex % 6;
  const glow = light === "Aucune" ? 0 : light === "Douce" ? 0.22 : 0.5;

  function surprise() {
    setSelectedPalette(Math.floor(Math.random() * palettes.length));
    setTemplateIndex(Math.floor(Math.random() * STYLES.length));
    setLight(LIGHTS[Math.floor(Math.random() * LIGHTS.length)]);
  }

  const currentPalette = palettes[selectedPalette];

  const sidebarSections = [
    {
      title: "CRÉER",
      items: [
        { key: "atelier" as SidebarItem, label: "Atelier", icon: Paintbrush },
        { key: "galerie" as SidebarItem, label: "Galerie des styles", icon: Eye },
        { key: "creations" as SidebarItem, label: "Mes créations", icon: FolderOpen },
      ],
    },
    {
      title: "COMMANDER",
      items: [
        { key: "annonce" as SidebarItem, label: "Annonce vidéo", icon: Video },
        { key: "pack" as SidebarItem, label: "Pack Studio Pro", icon: Package },
        { key: "commandes" as SidebarItem, label: "Mes commandes", icon: ClipboardList },
      ],
    },
  ];

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-[#0F172A] flex">
      {/* Left Sidebar */}
      <div className="hidden lg:flex w-60 shrink-0 flex-col bg-[#1E1B3A] border-r border-[#2D2A5A]">
        {/* Logo */}
        <div className="px-5 py-5">
          <h1 className="text-lg font-extrabold">
            <span className="text-white">FLUXIONWIFI</span>{" "}
            <span className="text-pink-400">STUDIO</span>
          </h1>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-5">
          {sidebarSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSidebar(item.key)}
                    className={`flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      activeSidebar === item.key
                        ? "bg-[#2B7FFF]/20 text-[#2B7FFF] border-l-2 border-[#2B7FFF]"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Ailleurs */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              AILLEURS
            </p>
            <div className="space-y-0.5">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                Tableau de bord
              </Link>
              <Link
                href="/finance/billing"
                className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Receipt className="h-4 w-4 shrink-0" />
                Facturation
              </Link>
              <Link
                href="/tutorials"
                className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Play className="h-4 w-4 shrink-0" />
                Tutoriel vidéo
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-[#1E293B] bg-[#0F172A]">
          {/* Template navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTemplateIndex((i) => Math.max(0, i - 1))}
              className="p-1.5 rounded-lg hover:bg-[#1E293B] text-slate-400"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-400">
                {styleName}
              </span>
              <span className="text-xs text-slate-500">
                {STYLES[templateIndex].family}
              </span>
            </div>
            <button
              onClick={() => setTemplateIndex((i) => Math.min(STYLES.length - 1, i + 1))}
              className="p-1.5 rounded-lg hover:bg-[#1E293B] text-slate-400"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button onClick={surprise} className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E293B] border border-[#334155] px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-[#334155] transition-colors">
              <Sparkles className="h-3.5 w-3.5" />
              Surprends-moi
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-pink-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-pink-600 transition-colors">
              <Download className="h-3.5 w-3.5" />
              Exporter
            </button>
            <button className="p-2 rounded-lg hover:bg-[#1E293B] text-slate-400 transition-colors">
              <Printer className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
              <Square className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-[#1E293B] text-slate-400 transition-colors">
              <Save className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Center panel — tabs + palette */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center gap-2 px-4 lg:px-6 py-3">
              {(
                [
                  { key: "style", label: "Style", icon: Palette },
                  { key: "contenu", label: "Contenu", icon: Type },
                  { key: "format", label: "Format", icon: SlidersHorizontal },
                ] as { key: ContentTab; label: string; icon: typeof Palette }[]
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-[#2B7FFF] to-[#6366F1] text-white shadow-lg shadow-[#2B7FFF]/20"
                      : "text-slate-400 hover:text-white hover:bg-[#1E293B]"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-6">
              {activeTab === "style" && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                    Palette
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {palettes.map((p, i) => (
                      <button
                        key={p.name}
                        onClick={() => setSelectedPalette(i)}
                        className={`relative rounded-xl p-3 transition-all ${
                          selectedPalette === i
                            ? "ring-2 ring-amber-400 bg-[#1E293B]"
                            : "bg-[#111827] border border-[#1E293B] hover:border-[#334155]"
                        }`}
                      >
                        {p.pro && (
                          <span className="absolute top-1.5 right-1.5 bg-emerald-500 rounded-full p-0.5">
                            <Crown className="h-2.5 w-2.5 text-white" />
                          </span>
                        )}
                        <div className="flex gap-1 mb-2">
                          {p.colors.map((c, ci) => (
                            <div
                              key={ci}
                              className="flex-1 h-8 rounded-md first:rounded-l-lg last:rounded-r-lg"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-center text-slate-300 truncate">
                          {p.name}
                        </p>
                      </button>
                    ))}
                  </div>

                  <h3 className="mt-6 mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Lumière</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {LIGHTS.map((l) => (
                      <button
                        key={l}
                        onClick={() => setLight(l)}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${light === l ? "bg-amber-400 text-black" : "bg-[#111827] border border-[#1E293B] text-slate-300 hover:border-[#334155]"}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>

                  <h3 className="mt-6 mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Style</h3>
                  <p className="mb-2 text-[11px] text-slate-500">Variation</p>
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {FILTERS.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${filter === f ? "bg-pink-500 text-white" : "bg-[#111827] border border-[#1E293B] text-slate-300 hover:border-[#334155]"}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                    {visible.map(({ st, i }) => (
                      <button
                        key={st.name}
                        onClick={() => setTemplateIndex(i)}
                        className={`rounded-xl p-2.5 text-left transition-all ${templateIndex === i ? "ring-2 ring-pink-400 bg-[#1E293B]" : "bg-[#111827] border border-[#1E293B] hover:border-[#334155]"}`}
                      >
                        <div className="mb-2 flex h-14 items-center justify-center rounded-lg" style={{ background: `linear-gradient(135deg, ${currentPalette.colors[0]}, ${currentPalette.colors[1]})` }}>
                          <span className="text-lg font-black text-white" style={{ transform: i % 6 === 1 ? "rotate(-8deg)" : undefined, writingMode: i % 6 === 2 ? "vertical-rl" : undefined }}>1500</span>
                        </div>
                        <p className="truncate text-[11px] font-semibold text-slate-200">{st.name}</p>
                      </button>
                    ))}
                    {visible.length === 0 && <p className="col-span-full py-4 text-center text-xs text-slate-500">Aucun style dans cette variation.</p>}
                  </div>
                </div>
              )}

              {activeTab === "contenu" && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Titre principal
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-xl border border-[#334155] bg-[#111827] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2B7FFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Sous-titre
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full rounded-xl border border-[#334155] bg-[#111827] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2B7FFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Détails offre
                    </label>
                    <input
                      type="text"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full rounded-xl border border-[#334155] bg-[#111827] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2B7FFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Nom de la marque
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full rounded-xl border border-[#334155] bg-[#111827] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2B7FFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Logo
                    </label>
                    <div className="rounded-xl border-2 border-dashed border-[#334155] p-8 text-center cursor-pointer hover:border-[#2B7FFF] transition-colors">
                      <Image className="h-6 w-6 text-slate-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">Cliquez ou glissez votre logo</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "format" && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Format de sortie
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Affiche A3", desc: "297 × 420 mm" },
                        { label: "Bâche 1×2m", desc: "1000 × 2000 mm" },
                        { label: "Flyer A5", desc: "148 × 210 mm" },
                        { label: "Story Instagram", desc: "1080 × 1920 px" },
                        { label: "Post Facebook", desc: "1200 × 630 px" },
                        { label: "Vidéo courte", desc: "1080 × 1920 px (15s)" },
                      ].map((f) => (
                        <button
                          key={f.label}
                          className="rounded-xl bg-[#111827] border border-[#334155] p-3 text-left hover:border-[#2B7FFF] transition-colors"
                        >
                          <p className="text-sm font-medium text-white">{f.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Qualité
                    </label>
                    <div className="flex gap-2">
                      {["Standard", "HD", "Impression"].map((q) => (
                        <button
                          key={q}
                          className="rounded-lg bg-[#111827] border border-[#334155] px-4 py-2 text-xs font-medium text-slate-300 hover:border-[#2B7FFF] transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Preview Panel */}
          <div className="hidden md:flex w-80 lg:w-96 shrink-0 border-l border-[#1E293B] bg-[#111827] items-center justify-center p-6">
            <div className="w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 relative">
              {/* Poster preview */}
              <div
                className="w-full h-full flex flex-col items-center justify-between p-6 relative"
                style={{
                  backgroundColor: currentPalette.colors[0],
                  backgroundImage:
                    mode === 4
                      ? `repeating-linear-gradient(45deg, transparent 0 14px, ${currentPalette.colors[1]}33 14px 28px)`
                      : mode === 5
                        ? `conic-gradient(${currentPalette.colors[1]}22 25%, transparent 0 50%, ${currentPalette.colors[1]}22 0 75%, transparent 0)`
                        : undefined,
                  backgroundSize: mode === 5 ? "36px 36px" : undefined,
                }}
              >
                {glow > 0 && <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(circle at 50% 38%, rgba(255,255,255,${glow}), transparent 62%)` }} />}
                {/* Decorative top */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-30" style={{ backgroundColor: currentPalette.colors[1] }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-tr-full opacity-20" style={{ backgroundColor: currentPalette.colors[2] }} />

                {/* Brand */}
                <div className="relative z-10 text-center mt-4">
                  <p className="text-xs font-bold tracking-[0.3em] text-white/90 uppercase">
                    {brand}
                  </p>
                  <p className="text-3xl font-black text-white mt-1" style={{ color: currentPalette.colors[2] }}>
                    FC
                  </p>
                </div>

                {/* Price */}
                <div className="relative z-10 text-center">
                  <p
                    className={`font-black text-white leading-none tracking-tight ${mode === 2 ? "text-6xl" : "text-7xl"}`}
                    style={{
                      transform: mode === 1 ? "rotate(-8deg)" : undefined,
                      writingMode: mode === 2 ? "vertical-rl" : undefined,
                      border: mode === 3 ? `4px solid ${currentPalette.colors[2]}` : undefined,
                      padding: mode === 3 ? "8px 16px" : undefined,
                      borderRadius: mode === 3 ? 12 : undefined,
                    }}
                  >
                    {title}
                  </p>
                </div>

                {/* Details */}
                <div className="relative z-10 text-center space-y-2 mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                    {details}
                  </p>
                  <p className="text-2xl font-black text-white">
                    {subtitle}
                  </p>
                  {/* QR placeholder */}
                  <div className="mx-auto w-12 h-12 rounded bg-white/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-sm bg-white/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
