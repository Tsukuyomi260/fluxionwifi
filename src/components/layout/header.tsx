"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  Search,
  LogOut,
  User,
  Settings,
  X,
  Sparkles,
  ChevronDown,
  Wifi,
  ExternalLink,
} from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { useUser } from "@/hooks/use-user";
import { useScroll } from "@/components/ui/use-scroll";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuToggle?: () => void;
}

const searchablePages = [
  { name: "Tableau de bord", href: "/dashboard", category: "Général" },
  { name: "Portail Captif", href: "/portal", category: "WiFi" },
  { name: "Tickets WiFi", href: "/tickets", category: "WiFi" },
  { name: "Console Hotspot", href: "/console", category: "Technique" },
  { name: "Sessions & Conso", href: "/console/sessions", category: "Technique" },
  { name: "Routeurs", href: "/console/routers", category: "Technique" },
  { name: "Stock & Utilisateurs", href: "/console/stock", category: "Technique" },
  { name: "Impression rapide", href: "/console/print", category: "Technique" },
  { name: "Vendeurs", href: "/sellers", category: "Opérations" },
  { name: "VPN & Accès distant", href: "/vpn", category: "Opérations" },
  { name: "Mon Solde", href: "/finance/balance", category: "Financier" },
  { name: "Facturation", href: "/finance/billing", category: "Financier" },
  { name: "Interopérabilité", href: "/interop", category: "Financier" },
  { name: "Studio", href: "/studio", category: "Outils" },
  { name: "Support", href: "/support", category: "Outils" },
  { name: "Tutoriels", href: "/tutorials", category: "Outils" },
  { name: "Affiliation", href: "/affiliation", category: "Outils" },
  { name: "Paramètres", href: "/settings", category: "Compte" },
  { name: "Mon Compte", href: "/account", category: "Compte" },
];

/* ─── Avatar dégradé signature ───────────────────────────────────────── */
function UserAvatar({ name, size = 34 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-sm transition-transform group-hover:scale-105"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #008EFF 0%, #2B7FFF 60%, #0044BD 100%)",
        fontSize: size * 0.38,
      }}
    >
      {initials || "U"}
    </div>
  );
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { displayName, user } = useUser();
  const router = useRouter();
  const scrolled = useScroll(10);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredPages = searchQuery.trim()
    ? searchablePages.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  /* Raccourci clavier Ctrl+K / Cmd+K pour ouvrir la recherche */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* Fermer les menus lors d'un clic extérieur */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-40 transition-all duration-300 ease-out pointer-events-none",
        scrolled ? "top-3 sm:top-4 px-3 sm:px-6" : "top-0 px-0"
      )}
    >
      <div
        className={cn(
          "mx-auto transition-all duration-300 ease-out pointer-events-auto flex items-center justify-between",
          scrolled
            ? "max-w-5xl rounded-2xl bg-white/95 supports-[backdrop-filter]:bg-white/80 backdrop-blur-xl border border-[#E8ECF1] shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-4 sm:px-6 h-14"
            : "w-full bg-white/90 backdrop-blur-md border-b border-[#E8ECF1] px-4 lg:px-6 h-16"
        )}
      >
        {/* Côté Gauche : Logo mobile & Titre / Salutation */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-[#6B7280] hover:bg-[#F5F7FA] transition-colors"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo sur mobile & en mode défilement compact */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="FLUXIONWIFI"
              width={scrolled ? 28 : 32}
              height={scrolled ? 28 : 32}
              className="rounded-lg transition-transform group-hover:scale-105"
            />
            <span
              className={cn(
                "font-bold text-[#0B1E4D] tracking-tight transition-all",
                scrolled ? "text-sm sm:text-base" : "text-base lg:hidden"
              )}
            >
              FLUXIONWIFI
            </span>
          </Link>

          {/* Titre Dashboard Desktop (affiché en haut de page) */}
          <div
            className={cn(
              "hidden lg:flex items-center gap-3 transition-opacity duration-200",
              scrolled && "hidden"
            )}
          >
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[#0B1E4D] tracking-tight">
                  Mon Réseau
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 border border-emerald-200/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Actif
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Bienvenue, <span className="font-semibold text-[#1A1D26]">{displayName}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Côté Droit : Recherche, Cloche, Profil */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Recherche avec raccourci Ctrl+K */}
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={cn(
                "flex items-center gap-2 rounded-full border border-[#E8ECF1] bg-[#F5F7FA] text-xs font-medium text-[#6B7280] hover:bg-white hover:border-[#2B7FFF]/40 hover:shadow-xs transition-all",
                scrolled ? "h-8 px-3" : "h-9 px-3.5"
              )}
              aria-label="Rechercher une page"
            >
              <Search className="h-3.5 w-3.5 text-[#9CA3AF]" />
              <span className="hidden sm:inline">Rechercher...</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-[#D1D5DB] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#6B7280]">
                ⌘K
              </kbd>
            </button>

            {/* Modal / Menu de recherche */}
            {searchOpen && (
              <div className="absolute right-0 top-11 w-72 sm:w-96 rounded-2xl bg-white border border-[#E8ECF1] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#E8ECF1] bg-[#F5F7FA]/60">
                  <Search className="h-4 w-4 text-[#2B7FFF]" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une page, un outil..."
                    className="flex-1 text-xs outline-none bg-transparent text-[#1A1D26] placeholder:text-[#9CA3AF]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && filteredPages.length > 0) {
                        router.push(filteredPages[0].href);
                        setSearchOpen(false);
                        setSearchQuery("");
                      }
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="p-1 rounded-lg hover:bg-white text-[#9CA3AF] hover:text-[#1A1D26] transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto p-1.5">
                  {searchQuery.trim() === "" ? (
                    <div className="px-3 py-6 text-center">
                      <Sparkles className="h-6 w-6 text-[#2B7FFF]/40 mx-auto mb-1.5" />
                      <p className="text-xs font-medium text-[#1A1D26]">Accès rapide</p>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                        Tapez pour filtrer les pages du système
                      </p>
                    </div>
                  ) : filteredPages.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-[#9CA3AF]">
                      Aucune page trouvée pour &ldquo;{searchQuery}&rdquo;
                    </div>
                  ) : (
                    filteredPages.map((page) => (
                      <button
                        key={page.href}
                        onClick={() => {
                          router.push(page.href);
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left text-xs text-[#1A1D26] hover:bg-[#F5F7FA] transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-6 w-6 rounded-lg bg-[#EBF2FF] flex items-center justify-center text-[#2B7FFF] shrink-0">
                            <Search className="h-3 w-3" />
                          </div>
                          <span className="font-semibold truncate">{page.name}</span>
                        </div>
                        <span className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider shrink-0 bg-white border border-[#E8ECF1] px-2 py-0.5 rounded-md">
                          {page.category}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cloche de notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className={cn(
                "relative rounded-xl text-[#6B7280] hover:text-[#0B1E4D] hover:bg-[#F5F7FA] transition-colors",
                scrolled ? "p-1.5" : "p-2"
              )}
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B7FFF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B7FFF]" />
              </span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 top-11 w-72 rounded-2xl bg-white border border-[#E8ECF1] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8ECF1]">
                  <h3 className="text-xs font-bold text-[#0B1E4D]">Notifications</h3>
                  <span className="text-[10px] text-[#2B7FFF] font-semibold">Tout marquer comme lu</span>
                </div>
                <div className="py-4 text-center">
                  <p className="text-xs text-[#6B7280]">Aucune nouvelle alerte</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">Vos routeurs fonctionnent normalement</p>
                </div>
              </div>
            )}
          </div>

          {/* Séparateur subtil */}
          <div className="h-5 w-px bg-[#E8ECF1] mx-0.5" />

          {/* Profil utilisateur dégradé avec dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 sm:pr-2 rounded-full hover:bg-[#F5F7FA] transition-all group"
              aria-label="Menu profil utilisateur"
            >
              <UserAvatar name={displayName} size={scrolled ? 30 : 34} />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-[#0B1E4D] max-w-[120px] truncate leading-tight">
                  {displayName}
                </span>
                <span className="text-[10px] text-[#9CA3AF] leading-tight">
                  Opérateur WiFi
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "hidden md:block h-3.5 w-3.5 text-[#6B7280] transition-transform duration-200",
                  profileOpen && "rotate-180"
                )}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 w-64 rounded-2xl bg-white border border-[#E8ECF1] shadow-2xl p-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Entête avec profil */}
                <div className="px-3 py-2.5 border-b border-[#E8ECF1] mb-1 bg-gradient-to-br from-[#F5F7FA] to-white rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar name={displayName} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#0B1E4D] truncate">
                        {displayName}
                      </p>
                      <p className="text-[11px] text-[#6B7280] truncate">
                        {user?.email || "compte@fluxionwifi.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Liens de profil */}
                <div className="space-y-0.5 py-1">
                  <Link
                    href="/account"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#374151] hover:bg-[#F5F7FA] hover:text-[#0B1E4D] transition-colors"
                  >
                    <User className="h-3.5 w-3.5 text-[#6B7280]" />
                    Mon Compte
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#374151] hover:bg-[#F5F7FA] hover:text-[#0B1E4D] transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5 text-[#6B7280]" />
                    Paramètres
                  </Link>
                  <Link
                    href="/"
                    target="_blank"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#374151] hover:bg-[#F5F7FA] hover:text-[#0B1E4D] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Wifi className="h-3.5 w-3.5 text-[#2B7FFF]" />
                      Site public
                    </div>
                    <ExternalLink className="h-3 w-3 text-[#9CA3AF]" />
                  </Link>
                </div>

                {/* Déconnexion */}
                <div className="border-t border-[#E8ECF1] pt-1 mt-1">
                  <form action={logout}>
                    <button
                      type="submit"
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Se déconnecter
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
