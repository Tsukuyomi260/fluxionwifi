import { display } from "./fonts";

export function SectionTitle({
  eyebrow,
  title,
  accent,
  subtitle,
  light = false,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-12 text-center">
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
          light ? "bg-white/10 text-white/80" : "bg-[#EBF2FF] text-[#2B7FFF]"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`${display.className} mt-4 text-4xl leading-[1.1] sm:text-5xl ${
          light ? "text-white" : "text-[#0B1E4D]"
        }`}
      >
        {title} <span className={`italic ${light ? "text-[#7CB0FF]" : "text-[#2B7FFF]"}`}>{accent}</span>
      </h2>
      {subtitle && (
        <p className={`mx-auto mt-4 max-w-xl ${light ? "text-white/70" : "text-[#6B7280]"}`}>{subtitle}</p>
      )}
    </div>
  );
}
