import Image from "next/image";
import { Wifi, Globe, Ticket, Shield, Terminal, Smartphone } from "lucide-react";

const features = [
  { icon: Globe, label: "Portail Captif" },
  { icon: Ticket, label: "Tickets WiFi" },
  { icon: Shield, label: "VPN Sécurisé" },
  { icon: Terminal, label: "Console RADIUS" },
  { icon: Smartphone, label: "Mobile Money" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1E4D] via-[#122B66] to-[#1A3A7A]" />

        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#2B7FFF]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-[#2B7FFF]/15 blur-3xl" />
        <div className="absolute top-1/3 right-0 w-40 h-40 rounded-full bg-[#2B7FFF]/8 blur-2xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center gap-10 p-10 xl:p-12 w-full h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="FLUXIONWIFI"
              width={48}
              height={48}
              className="rounded-xl shadow-lg"
            />
            <span className="text-[22px] font-bold text-white tracking-tight">FLUXIONWIFI</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-1.5 w-fit">
            <Wifi className="h-4 w-4 text-[#2B7FFF]" />
            <span className="text-sm font-medium text-white/90">Plateforme #1 en Afrique</span>
          </div>

          {/* Headline */}
          <h1 className="text-[2rem] xl:text-[2.5rem] font-bold text-white leading-[1.15]">
            Gérez vos zones WiFi.
            <br />
            <span className="text-[#5BA0FF]">Encaissez en Mobile Money.</span>
          </h1>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2.5">
            {features.map((f) => (
              <div
                key={f.label}
                className="inline-flex items-center gap-2 rounded-xl bg-white/[0.07] backdrop-blur-sm border border-white/[0.08] px-3.5 py-2 transition-colors hover:bg-white/[0.12]"
              >
                <f.icon className="h-4 w-4 text-[#5BA0FF]" />
                <span className="text-[13px] font-medium text-white/80">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-xs text-white/30">
            &copy; 2026 FLUXIONWIFI &middot; Connecte votre monde
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col bg-[#F5F7FA]">
        {/* Mobile header */}
        <div className="lg:hidden px-5 pt-6 pb-2">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.jpg" alt="FLUXIONWIFI" width={36} height={36} className="rounded-xl" />
            <span className="text-lg font-bold text-[#0B1E4D]">FLUXIONWIFI</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-[420px]">
            <div className="rounded-2xl bg-white border border-[#E8ECF1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
