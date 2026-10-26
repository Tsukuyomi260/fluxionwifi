"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Wallet,
  Ticket,
  Users,
  Terminal,
  Settings,
  Globe,
  Network,
  Palette,
  BookOpen,
  Gift,
  LayoutDashboard,
  Receipt,
  HeadphonesIcon,
  Shield,
} from "lucide-react";

const sections = [
  {
    label: "PRINCIPAL",
    items: [
      { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
      { name: "Portail Captif", href: "/portal", icon: Globe },
      { name: "Tickets", href: "/tickets", icon: Ticket },
    ],
  },
  {
    label: "OPÉRATIONS",
    items: [
      { name: "Console RADIUS", href: "/console", icon: Terminal },
      { name: "Vendeurs", href: "/sellers", icon: Users },
      { name: "VPN", href: "/vpn", icon: Shield },
    ],
  },
  {
    label: "FINANCIER",
    items: [
      { name: "Mon Solde", href: "/finance/balance", icon: Wallet },
      { name: "Facturation", href: "/finance/billing", icon: Receipt },
      { name: "Interopérabilité", href: "/interop", icon: Network },
    ],
  },
  {
    label: "OUTILS",
    items: [
      { name: "Studio", href: "/studio", icon: Palette },
      { name: "Support", href: "/support", icon: HeadphonesIcon },
      { name: "Tutoriels", href: "/tutorials", icon: BookOpen },
      { name: "Affiliation", href: "/affiliation", icon: Gift },
    ],
  },
];

interface SidebarProps {
  mobile?: boolean;
}

export function Sidebar({ mobile = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={
        mobile
          ? "flex flex-col w-[260px] bg-white h-full border-r border-border"
          : "hidden lg:flex lg:flex-col lg:w-[260px] lg:border-r lg:border-border bg-white"
      }
    >
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-border">
        <Image src="/logo.jpg" alt="FLUXIONWIFI" width={36} height={36} className="rounded-lg" />
        <span className="text-base font-bold text-[#0B1E4D]">FLUXIONWIFI</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {sections.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.href || pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-[#6B7280] hover:bg-[#F5F7FA] hover:text-[#1A1D26]"
                      )}
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-primary text-primary-foreground"
              : "text-[#6B7280] hover:bg-[#F5F7FA] hover:text-[#1A1D26]"
          )}
        >
          <Settings className="h-[18px] w-[18px] shrink-0" />
          Paramètres
        </Link>
      </div>
    </aside>
  );
}
