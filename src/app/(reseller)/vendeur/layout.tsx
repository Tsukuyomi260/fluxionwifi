"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ticket, History, Wallet, MessageSquare, LayoutGrid, LogOut } from "lucide-react";
import { ResellerProvider, useReseller } from "@/components/reseller/reseller-context";
import { RESELLER, formatCdf } from "@/lib/reseller-data";

const nav = [
  { href: "/vendeur", label: "Vendre", icon: Ticket },
  { href: "/vendeur/historique", label: "Historique", icon: History },
  { href: "/vendeur/credit", label: "Crédit", icon: Wallet },
  { href: "/vendeur/messages", label: "Messages", icon: MessageSquare },
  { href: "/vendeur/plus", label: "Plus", icon: LayoutGrid },
];

function isActive(pathname: string, href: string) {
  return href === "/vendeur" ? pathname === "/vendeur" : pathname.startsWith(href);
}

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { balance } = useReseller();

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#E5E7EB] bg-white lg:flex">
        <div className="flex items-center gap-2 px-6 py-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width={30} height={30} className="rounded-lg" />
          <span className="text-base font-bold text-[#0B1E4D]">{RESELLER.network}</span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((n) => {
            const active = isActive(pathname, n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-[#EBF2FF] text-[#2B7FFF]" : "text-[#4B5563] hover:bg-[#F5F7FA]"
                }`}
              >
                <n.icon className="h-5 w-5" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[#E5E7EB] p-4">
          <p className="text-sm font-semibold text-[#1A1D26]">{RESELLER.name}</p>
          <p className="font-mono text-xs text-[#6B7280]">{RESELLER.loginId}</p>
          <Link href="/vendeur/connexion" className="mt-3 flex items-center gap-2 text-sm text-red-500 hover:text-red-600">
            <LogOut className="h-4 w-4" /> Déconnexion
          </Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        {/* Barre du haut */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E5E7EB] bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" width={28} height={28} className="rounded-lg" />
            <span className="text-sm font-bold text-[#0B1E4D]">{RESELLER.name}</span>
          </div>
          <p className="hidden text-sm text-[#6B7280] lg:block">
            Bienvenue, <span className="font-semibold text-[#1A1D26]">{RESELLER.name}</span>
          </p>
          <Link
            href="/vendeur/credit"
            className="inline-flex items-center gap-2 rounded-full bg-[#EBF2FF] px-4 py-1.5 text-sm font-semibold text-[#2B7FFF]"
          >
            <Wallet className="h-4 w-4" />
            {formatCdf(balance)}
          </Link>
        </header>

        <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 lg:px-8 lg:pb-10">{children}</main>
      </div>

      {/* Navigation basse mobile */}
      <nav className="fixed inset-x-3 bottom-3 z-30 flex justify-around rounded-2xl border border-[#E5E7EB] bg-white p-1.5 shadow-xl lg:hidden">
        {nav.map((n) => {
          const active = isActive(pathname, n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-medium ${
                active ? "bg-[#EBF2FF] text-[#2B7FFF]" : "text-[#6B7280]"
              }`}
            >
              <n.icon className="h-5 w-5" />
              {n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function ResellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ResellerProvider>
      {pathname === "/vendeur/connexion" ? children : <Shell>{children}</Shell>}
    </ResellerProvider>
  );
}
