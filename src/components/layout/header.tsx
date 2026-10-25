"use client";

import Image from "next/image";
import { Bell, Menu, Search, LogOut } from "lucide-react";

interface HeaderProps {
  networkName?: string;
  userName?: string;
  onMenuToggle?: () => void;
}

export function Header({
  networkName = "Mon Réseau",
  userName = "Utilisateur",
  onMenuToggle,
}: HeaderProps) {
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
          <Image src="/logo.jpg" alt="Fluxion WiFi" width={28} height={28} className="rounded-lg" />
          <span className="font-bold text-[#0B1E4D]">Fluxion WiFi</span>
        </div>
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold text-[#1A1D26]">{networkName}</h1>
          <p className="text-xs text-muted-foreground">Bienvenue sur votre tableau de bord</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl border border-border bg-[#F5F7FA] text-sm text-muted-foreground hover:border-primary/30 transition-colors">
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Rechercher...</span>
        </button>

        <button className="relative p-2 rounded-xl hover:bg-[#F5F7FA] transition-colors">
          <Bell className="h-5 w-5 text-[#6B7280]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        <div className="flex items-center gap-2 ml-1 pl-3 border-l border-border">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="hidden md:block text-sm font-medium text-[#1A1D26]">{userName}</span>
          <button className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B7280] hover:text-red-500 transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
