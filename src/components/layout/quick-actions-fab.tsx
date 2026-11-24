"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  MessageCircle,
  Smartphone,
  Search,
  UserPlus,
  Wallet,
  Clock,
  Printer,
  Bot,
} from "lucide-react";

interface QuickAction {
  label: string;
  icon: typeof MessageCircle;
  bg: string;
  href?: string;
}

const actions: QuickAction[] = [
  {
    label: "Messagerie revendeurs",
    icon: MessageCircle,
    bg: "bg-emerald-500",
    href: "/sellers",
  },
  {
    label: "Application mobile",
    icon: Smartphone,
    bg: "bg-orange-500",
    href: "/downloads",
  },
  {
    label: "Vérifier un ticket",
    icon: Search,
    bg: "bg-[#2B7FFF]",
    href: "/console/stock",
  },
  {
    label: "Enregistrement clients",
    icon: UserPlus,
    bg: "bg-teal-500",
    href: "/console/sessions",
  },
  {
    label: "Historique des ventes",
    icon: Clock,
    bg: "bg-slate-600",
    href: "/finance/billing",
  },
  {
    label: "Imprimer",
    icon: Printer,
    bg: "bg-violet-600",
    href: "/console/print",
  },
];

export function QuickActionsFab() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const fabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleAction = (action: QuickAction) => {
    setOpen(false);
    if (action.href) router.push(action.href);
  };

  return (
    <>
      {/* FAB vertical stack */}
      <div ref={fabRef} className="fixed bottom-20 right-2 lg:bottom-8 lg:right-3 z-40 flex flex-col items-end gap-2">
        {/* Action items */}
        {actions.map((action, i) => (
          <button
            key={action.label}
            onClick={() => handleAction(action)}
            className="flex items-center gap-2 origin-bottom-right"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "scale(1) translateY(0)" : `scale(0.3) translateY(${(actions.length - i) * 6}px)`,
              transition: `all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) ${open ? i * 0.05 : (actions.length - 1 - i) * 0.02}s`,
              pointerEvents: open ? "auto" : "none",
            }}
          >
            <span className="rounded-lg bg-[#1A1D26] px-2.5 py-1 text-[11px] font-medium text-white whitespace-nowrap shadow-lg">
              {action.label}
            </span>
            <div className={`w-10 h-10 rounded-full ${action.bg} shadow-lg flex items-center justify-center hover:scale-110 transition-transform`}>
              <action.icon className="h-4.5 w-4.5 text-white" />
            </div>
          </button>
        ))}

        {/* Main toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="group relative w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl"
          style={{
            background: open
              ? "linear-gradient(135deg, #ef4444, #dc2626)"
              : "linear-gradient(135deg, #2B7FFF, #0B1E4D)",
          }}
        >
          {!open && (
            <span className="absolute inset-0 rounded-full animate-ping bg-[#2B7FFF]/25" style={{ animationDuration: "2.5s" }} />
          )}
          <div
            className="transition-transform duration-300"
            style={{ transform: open ? "rotate(135deg)" : "rotate(0deg)" }}
          >
            {open ? <X className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
          </div>
        </button>
      </div>

      {/* "Une question ?" label */}
      {!open && (
        <div className="fixed bottom-[76px] right-[62px] lg:bottom-[28px] lg:right-[60px] z-40 pointer-events-none">
          <span className="rounded-lg bg-[#1A1D26] px-2.5 py-1 text-[10px] font-medium text-white/80 whitespace-nowrap shadow">
            Une question ?
          </span>
        </div>
      )}
    </>
  );
}
