"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Menu, Search, LogOut, User, Settings, X } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { useUser } from "@/hooks/use-user";

interface HeaderProps {
  onMenuToggle?: () => void;
}

const searchablePages = [
  { name: "Tableau de bord", href: "/dashboard" },
  { name: "Portail Captif", href: "/portal" },
  { name: "Tickets", href: "/tickets" },
  { name: "Console RADIUS", href: "/console" },
  { name: "Vendeurs", href: "/sellers" },
  { name: "Mon Solde", href: "/finance/balance" },
  { name: "Facturation", href: "/finance/billing" },
  { name: "VPN", href: "/vpn" },
  { name: "Interopérabilité", href: "/interop" },
  { name: "Studio", href: "/studio" },
  { name: "Support", href: "/support" },
  { name: "Tutoriels", href: "/tutorials" },
  { name: "Affiliation", href: "/affiliation" },
  { name: "Paramètres", href: "/settings" },
  { name: "Mon Compte", href: "/account" },
];

export function Header({ onMenuToggle }: HeaderProps) {
  const { displayName } = useUser();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredPages = searchQuery.trim()
    ? searchablePages.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSearchOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-[#F5F7FA]"
        >
          <Menu className="h-5 w-5 text-[#6B7280]" />
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <Image src="/logo.jpg" alt="FLUXIONWIFI" width={28} height={28} className="rounded-lg" />
          <span className="font-bold text-[#0B1E4D]">FLUXIONWIFI</span>
        </div>
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold text-[#1A1D26]">Mon Réseau</h1>
          <p className="text-xs text-muted-foreground">Bienvenue, {displayName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div ref={searchRef} className="relative">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl border border-border bg-[#F5F7FA] text-sm text-muted-foreground hover:border-primary/30 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Rechercher...</span>
          </button>

          {searchOpen && (
            <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white rounded-2xl border border-[#E8ECF1] shadow-xl z-50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E8ECF1]">
                <Search className="h-4 w-4 text-[#9CA3AF]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une page..."
                  className="flex-1 text-sm outline-none bg-transparent text-[#1A1D26] placeholder:text-[#9CA3AF]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && filteredPages.length > 0) {
                      router.push(filteredPages[0].href);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }
                    if (e.key === "Escape") setSearchOpen(false);
                  }}
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                  <X className="h-4 w-4 text-[#9CA3AF] hover:text-[#6B7280]" />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {searchQuery.trim() === "" ? (
                  <p className="px-4 py-6 text-xs text-center text-[#9CA3AF]">
                    Tapez pour rechercher une page
                  </p>
                ) : filteredPages.length === 0 ? (
                  <p className="px-4 py-6 text-xs text-center text-[#9CA3AF]">
                    Aucun résultat pour &ldquo;{searchQuery}&rdquo;
                  </p>
                ) : (
                  filteredPages.map((page) => (
                    <button
                      key={page.href}
                      onClick={() => {
                        router.push(page.href);
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm text-[#1A1D26] hover:bg-[#F5F7FA] transition-colors"
                    >
                      <Search className="h-3.5 w-3.5 text-[#9CA3AF]" />
                      {page.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-[#F5F7FA] transition-colors">
          <Bell className="h-5 w-5 text-[#6B7280]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative flex items-center gap-2 ml-1 pl-3 border-l border-border">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-xl px-1 py-1 hover:bg-[#F5F7FA] transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="hidden md:block text-sm font-medium text-[#1A1D26] max-w-[120px] truncate">
              {displayName}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl border border-[#E8ECF1] shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E8ECF1]">
                <p className="text-sm font-semibold text-[#1A1D26] truncate">{displayName}</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Gérer votre compte</p>
              </div>
              <div className="py-1">
                <Link
                  href="/account"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                >
                  <User className="h-4 w-4 text-[#6B7280]" />
                  Mon Compte
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                >
                  <Settings className="h-4 w-4 text-[#6B7280]" />
                  Paramètres
                </Link>
              </div>
              <div className="border-t border-[#E8ECF1] py-1">
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Se déconnecter
                  </button>
                </form>
              </div>
            </div>
          )}

          <form action={logout} className="md:hidden">
            <button type="submit" className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B7280] hover:text-red-500 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
