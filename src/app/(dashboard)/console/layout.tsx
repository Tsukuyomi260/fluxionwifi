"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Router,
  Package,
  Printer,
  Activity,
} from "lucide-react";

const consoleNav = [
  { name: "Vue d'ensemble", href: "/console", icon: LayoutDashboard, exact: true },
  { name: "Sessions & Conso", href: "/console/sessions", icon: Activity },
  { name: "Routeurs", href: "/console/routers", icon: Router },
  { name: "Stock & Utilisateurs", href: "/console/stock", icon: Package },
  { name: "Impression rapide", href: "/console/print", icon: Printer },
];

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1A1D26]">Console Hotspot</h2>
        <p className="text-sm text-[#6B7280] mt-0.5">
          Gérez votre réseau WiFi comme un pro — tickets, sessions, routeurs, impression
        </p>
      </div>

      {/* Inner horizontal navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {consoleNav.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                isActive
                  ? "bg-[#2B7FFF] text-white shadow-sm"
                  : "text-[#6B7280] hover:bg-[#F5F7FA] hover:text-[#1A1D26]"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
