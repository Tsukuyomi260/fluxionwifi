"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  Globe,
  LayoutDashboard,
  Menu,
  Package,
  PlusCircle,
  Printer,
  Radio,
  Repeat,
  Router,
  Settings,
  Shield,
  Star,
  Tag,
  Users,
  X,
} from "lucide-react";
import { useRouters } from "@/hooks/use-routers";
import { useSessions } from "@/hooks/use-sessions";
import { ConsoleStoreProvider } from "@/components/console/console-store";

type Item = { label: string; href: string; icon: React.ComponentType<{ className?: string }>; badge?: boolean };

// Même arborescence que EVISIONS CONSOLE.
const SECTIONS: { label: string | null; items: Item[] }[] = [
  { label: null, items: [{ label: "Tableau de bord", href: "/console", icon: LayoutDashboard }] },
  {
    label: "HOTSPOT",
    items: [
      { label: "Profils tarifaires", href: "/console/profiles", icon: Tag },
      { label: "Générer des tickets", href: "/console/generate", icon: PlusCircle },
      { label: "Stock / Utilisateurs", href: "/console/stock", icon: Users },
      { label: "Tickets en ligne", href: "/console/sessions", icon: Radio, badge: true },
      { label: "Sessions & conso", href: "/console/sessions", icon: Activity },
    ],
  },
  { label: "INVENTAIRE", items: [{ label: "Inventaire", href: "/console/inventory", icon: Package }] },
  {
    label: "RÉSEAU",
    items: [
      { label: "Routeurs", href: "/console/routers", icon: Router },
      { label: "Routeurs indépendants", href: "/console/routers", icon: Star },
      { label: "Tunnel MikHmon VPN", href: "/vpn", icon: Shield },
      { label: "Coordinateur de mode", href: "/console/mode", icon: Repeat },
    ],
  },
  { label: "IMPRESSION", items: [{ label: "Impression rapide", href: "/console/print", icon: Printer }] },
  { label: "PARAMÈTRES", items: [{ label: "Configuration tickets", href: "/console/settings", icon: Settings }] },
];

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { routers } = useRouters();
  const { activeSessions, loading: sl } = useSessions();

  // Un href présent deux fois n'est surligné qu'une fois (premier élément).
  const seen = new Set<string>();

  return (
    <ConsoleStoreProvider>
      <div className="-m-4 flex min-h-full bg-[#F3F4F6] lg:-m-6">
        {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

        <aside
          className={`fixed left-0 top-0 z-50 flex h-screen w-[240px] shrink-0 flex-col overflow-y-auto bg-[#1E293B] transition-transform duration-200 lg:sticky lg:z-auto ${
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-base font-bold">
              <span className="text-[#2B7FFF]">FLUXION</span>
              <span className="text-emerald-400"> CONSOLE</span>
            </h2>
            <button onClick={() => setOpen(false)} aria-label="Fermer le menu" className="rounded p-1 text-slate-400 hover:text-white lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-3 pb-4">
            {SECTIONS.map((section, si) => (
              <div key={si}>
                {section.label && <p className="px-3 pb-1.5 pt-5 text-[10px] font-bold uppercase tracking-wider text-slate-500">{section.label}</p>}
                {section.items.map((item) => {
                  const first = !seen.has(item.href);
                  seen.add(item.href);
                  const active = first && (item.href === "/console" ? pathname === "/console" : pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active ? "bg-[#2B7FFF] text-white" : "text-slate-300 hover:bg-[#334155] hover:text-white"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.badge && !sl && activeSessions.length > 0 && (
                        <span className="ml-auto rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">{activeSessions.length}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Barre du haut */}
          <div className="flex items-center justify-between bg-[#1F2937] px-5 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setOpen(true)} aria-label="Ouvrir le menu" className="rounded-lg p-1.5 text-white hover:bg-[#374151] lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-bold lg:hidden">
                <span className="text-[#2B7FFF]">FLUXION</span>
                <span className="text-emerald-400"> CONSOLE</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select className="h-8 min-w-[180px] appearance-none rounded-lg bg-[#374151] pl-3 pr-8 text-xs text-white focus:outline-none">
                  <option>Tous les routeurs (global)</option>
                  {routers.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-white/60" />
              </div>
              <span className="hidden rounded-lg bg-[#374151] px-3 py-1.5 text-xs font-semibold text-white sm:inline">FLUXIONWIFI</span>
            </div>
          </div>

          {/* Bandeau portail */}
          <div className="mx-5 mt-4 flex items-center justify-between rounded-lg bg-amber-400 px-4 py-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-900" />
              <span className="text-sm font-semibold text-amber-900">Portail à publier</span>
              <span className="rounded bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white">1</span>
              <span className="ml-1 hidden text-xs text-amber-900/80 sm:inline">4/8</span>
            </div>
            <Link href="/portal" className="flex items-center gap-1 text-xs font-semibold text-amber-900 hover:text-amber-700">
              <Globe className="h-3.5 w-3.5" /> Publier <ChevronDown className="h-3 w-3 -rotate-90" />
            </Link>
          </div>

          <div className="p-4 lg:p-6">{children}</div>
        </div>
      </div>
    </ConsoleStoreProvider>
  );
}
