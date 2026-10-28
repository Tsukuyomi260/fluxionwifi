"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  X,
  Smartphone,
  MessageCircle,
  HeadphonesIcon,
  BookOpen,
  Ticket,
  Router,
  Palette,
} from "lucide-react";

interface QuickAction {
  label: string;
  icon: typeof Zap;
  color: string;
  bg: string;
  href?: string;
  onClick?: () => void;
}

const actions: QuickAction[] = [
  {
    label: "Application mobile",
    icon: Smartphone,
    color: "text-[#2B7FFF]",
    bg: "bg-[#2B7FFF]",
    href: "/app",
  },
  {
    label: "Ticket d'assistance",
    icon: HeadphonesIcon,
    color: "text-violet-600",
    bg: "bg-violet-600",
    href: "/support",
  },
  {
    label: "Discussions & Support",
    icon: MessageCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-600",
    href: "/support",
  },
  {
    label: "Agent FLUXIONWIFI",
    icon: Router,
    color: "text-amber-600",
    bg: "bg-amber-500",
    href: "/interop",
  },
  {
    label: "Studio portail",
    icon: Palette,
    color: "text-pink-600",
    bg: "bg-pink-500",
    href: "/studio",
  },
  {
    label: "Tutoriels",
    icon: BookOpen,
    color: "text-cyan-600",
    bg: "bg-cyan-500",
    href: "/tutorials",
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
    if (action.href) {
      router.push(action.href);
    }
    action.onClick?.();
  };

  return (
    <div ref={fabRef} className="fixed bottom-20 right-5 lg:bottom-8 lg:right-8 z-40">
      {/* Action items */}
      <div className="absolute bottom-16 right-0 flex flex-col-reverse items-end gap-3 mb-2">
        {actions.map((action, i) => (
          <button
            key={action.label}
            onClick={() => handleAction(action)}
            className="flex items-center gap-2.5 origin-bottom-right"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "scale(1) translateY(0)" : `scale(0.3) translateY(${(actions.length - i) * 8}px)`,
              transition: `all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${open ? i * 0.06 : (actions.length - 1 - i) * 0.03}s`,
              pointerEvents: open ? "auto" : "none",
            }}
          >
            {/* Label pill */}
            <span className="rounded-lg bg-[#0B1E4D] px-3 py-1.5 text-xs font-medium text-white whitespace-nowrap shadow-lg">
              {action.label}
            </span>
            {/* Icon circle */}
            <div className={`w-11 h-11 rounded-full ${action.bg} shadow-lg flex items-center justify-center hover:scale-110 transition-transform`}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
          </button>
        ))}
      </div>

      {/* Main FAB button */}
      <button
        onClick={() => setOpen(!open)}
        className="group relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl"
        style={{
          background: open
            ? "linear-gradient(135deg, #ef4444, #dc2626)"
            : "linear-gradient(135deg, #2B7FFF, #0B1E4D)",
        }}
      >
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping bg-[#2B7FFF]/30" style={{ animationDuration: "2s" }} />
        )}

        {/* Rotating icon */}
        <div
          className="transition-transform duration-300 ease-in-out"
          style={{ transform: open ? "rotate(135deg)" : "rotate(0deg)" }}
        >
          {open ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Zap className="h-6 w-6 text-white" />
          )}
        </div>

        {/* Label */}
        {!open && (
          <span
            className="absolute right-[calc(100%+10px)] rounded-lg bg-[#0B1E4D] px-3 py-1.5 text-xs font-medium text-white whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          >
            Actions rapides
          </span>
        )}
      </button>
    </div>
  );
}
