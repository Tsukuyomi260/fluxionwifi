import { Construction } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function ComingSoon({ title, description, icon: Icon = Construction }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-2xl bg-[#EBF2FF] p-4 mb-4">
        <Icon className="h-8 w-8 text-[#2B7FFF]" />
      </div>
      <h2 className="text-xl font-bold text-[#1A1D26]">{title}</h2>
      <p className="mt-2 text-sm text-[#6B7280] max-w-md">
        {description}
      </p>
      <span className="mt-4 inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">
        Bientôt disponible
      </span>
    </div>
  );
}
