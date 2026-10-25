"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Ticket, Wallet, Globe, MoreHorizontal } from "lucide-react";

const mobileNav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Portail", href: "/portal", icon: Globe },
  { name: "Tickets", href: "/tickets", icon: Ticket },
  { name: "Solde", href: "/finance/balance", icon: Wallet },
  { name: "Plus", href: "/settings", icon: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8ECF1] bg-white">
      <ul className="flex justify-around">
        {mobileNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 px-3 text-[11px] font-medium transition-colors",
                  isActive
                    ? "text-[#2B7FFF]"
                    : "text-[#9CA3AF] hover:text-[#6B7280]"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
