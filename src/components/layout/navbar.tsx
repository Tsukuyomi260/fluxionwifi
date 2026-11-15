"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, User as UserIcon, ArrowRight, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useScroll } from "@/components/ui/use-scroll";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Comment ça marche", href: "#how-it-works" },
  { label: "Tarifs", href: "#pricing" },
];

/* ─── Avatar avec initiales et dégradé ───────────────────────────────── */
function UserAvatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #008EFF 0%, #0044BD 100%)",
        fontSize: size * 0.38,
      }}
    >
      {initials || "U"}
    </div>
  );
}

/* ─── Navbar Flottante Morphing ──────────────────────────────────────── */
export function Navbar() {
  const router = useRouter();
  const scrolled = useScroll(10);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Scroll lock quand le menu mobile est ouvert */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* Écoute Supabase Auth */
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }: { data: { user: import("@supabase/supabase-js").User | null } }) => {
      setAuthUser(data.user ?? null);
      if (data.user) {
        const meta = data.user.user_metadata;
        const name =
          meta?.full_name ||
          meta?.nom ||
          data.user.email?.split("@")[0] ||
          "Utilisateur";
        setUserName(name);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_: string, session: import("@supabase/supabase-js").Session | null) => {
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        const meta = session.user.user_metadata;
        setUserName(
          meta?.full_name ||
          meta?.nom ||
          session.user.email?.split("@")[0] ||
          "Utilisateur"
        );
      } else {
        setUserName("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* Ferme le dropdown profil lors d'un clic extérieur */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setProfileDropdownOpen(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  const isLoggedIn = !!authUser;

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-300 ease-out",
        scrolled
          ? "top-3 sm:top-4 px-3 sm:px-6"
          : "top-0 px-0"
      )}
    >
      <div
        className={cn(
          "mx-auto transition-all duration-300 ease-out",
          scrolled
            ? "max-w-4xl rounded-2xl bg-white/95 supports-[backdrop-filter]:bg-white/80 backdrop-blur-xl border border-[#E8ECF1] shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-4 sm:px-6 h-14 flex items-center justify-between"
            : "max-w-7xl bg-white/90 backdrop-blur-md border-b border-[#E8ECF1] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="FLUXIONWIFI"
            width={32}
            height={32}
            className="rounded-lg sm:rounded-xl transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-base sm:text-lg font-bold text-[#0B1E4D] tracking-tight">
            FLUXIONWIFI
          </span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#6B7280] hover:text-[#0B1E4D] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          {isLoggedIn ? (
            <div ref={dropdownRef} className="relative flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 h-9 rounded-xl bg-[#EBF2FF] px-3.5 text-xs font-semibold text-[#2B7FFF] hover:bg-[#DCE8FF] transition-colors"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Tableau de bord
              </Link>

              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#2B7FFF]/20 transition-all"
                aria-label="Menu profil"
              >
                <UserAvatar name={userName} size={32} />
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-[#6B7280] transition-transform duration-200",
                    profileDropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Menu Profil Déroulant */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-12 w-56 rounded-2xl bg-white border border-[#E8ECF1] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-[#E8ECF1] mb-1">
                    <p className="text-xs text-[#9CA3AF]">Connecté en tant que</p>
                    <p className="text-sm font-semibold text-[#0B1E4D] truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-[#6B7280] truncate">
                      {authUser?.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-[#6B7280]" />
                    Tableau de bord
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors"
                  >
                    <UserIcon className="h-3.5 w-3.5 text-[#6B7280]" />
                    Mon compte
                  </Link>
                  <div className="border-t border-[#E8ECF1] my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[#374151] hover:text-[#0B1E4D] px-3 py-2 transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold text-white transition-all shadow-sm hover:shadow-md hover:brightness-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #008EFF 0%, #2B7FFF 60%, #0044BD 100%)",
                }}
              >
                <span>Commencer</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Déclencheur Mobile */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-xl text-[#0B1E4D] hover:bg-[#F5F7FA] transition-colors"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu Déroulant Mobile */}
      {mobileOpen && (
        <div className="md:hidden mx-3 mt-2 rounded-2xl bg-white/98 backdrop-blur-xl border border-[#E8ECF1] shadow-2xl p-5 animate-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-[#1A1D26] hover:text-[#2B7FFF] py-2 border-b border-[#F0F2F5] transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-3">
              {isLoggedIn ? (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-[#F5F7FA]">
                    <UserAvatar name={userName} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#0B1E4D] truncate">
                        {userName}
                      </p>
                      <p className="text-xs text-[#6B7280] truncate">
                        {authUser?.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-[#2B7FFF] text-white text-sm font-semibold hover:bg-[#1A6BE6] transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Aller au Tableau de bord
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full h-10 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Se déconnecter
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center w-full h-10 rounded-xl border border-[#D1D5DB] text-[#374151] text-sm font-semibold hover:bg-[#F5F7FA] transition-colors"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-1.5 w-full h-10 rounded-xl text-white text-sm font-semibold shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #008EFF 0%, #2B7FFF 60%, #0044BD 100%)",
                    }}
                  >
                    <span>Créer un compte</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
