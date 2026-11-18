"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Zap, Ticket, Wallet, Wifi, Activity } from "lucide-react";
import RotatingText from "@/components/ui/rotating-text";

const ease = [0.16, 1, 0.3, 1] as const;

const chips = [
  { label: "Tickets", sub: "Prépayés" },
  { label: "Mobile Money", sub: "Intégré" },
  { label: "VPN", sub: "WireGuard" },
  { label: "24/7", sub: "Supervision" },
];

function Gauge({ label, value, color }: { label: string; value: number; color: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <svg width="68" height="68" viewBox="0 0 68 68" className="-rotate-90">
        <circle cx="34" cy="34" r={r} fill="none" stroke="#E8ECF1" strokeWidth="6" />
        <motion.circle
          cx="34"
          cy="34"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.6, delay: 0.9, ease }}
        />
      </svg>
      <span className="-mt-[46px] text-sm font-bold text-[#1A1D26]">{value}%</span>
      <span className="mt-[26px] text-[11px] text-[#6B7280]">{label}</span>
    </div>
  );
}

function DashboardMockup() {
  const bars = [38, 62, 45, 80, 55, 92, 70];
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[#2B7FFF]/25 via-[#7C9CFF]/10 to-[#0B1E4D]/10 blur-3xl" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease }}
        className="relative rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-semibold text-[#1A1D26]">Routeur Cotonou-01</span>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
            En ligne
          </span>
        </div>

        <div className="mt-5 flex justify-around">
          <Gauge label="CPU" value={14} color="#2B7FFF" />
          <Gauge label="RAM" value={38} color="#10B981" />
          <Gauge label="Sessions" value={72} color="#F59E0B" />
        </div>

        <div className="mt-6 flex h-24 items-end gap-2">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-md bg-gradient-to-t from-[#2B7FFF] to-[#7CB0FF]"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.8, delay: 1 + i * 0.08, ease }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-[#9CA3AF]">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
            <span key={i} className="flex-1 text-center">
              {d}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Floating: payment */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease }}
        className="absolute -right-2 -top-5 sm:-right-8"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-3 rounded-xl border border-[#E8ECF1] bg-white px-4 py-3 shadow-xl"
        >
          <div className="rounded-lg bg-emerald-50 p-2">
            <Wallet className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-[11px] text-[#6B7280]">Paiement reçu</p>
            <p className="text-sm font-bold text-[#1A1D26]">+ 500 FCFA</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating: ticket */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.5, ease }}
        className="absolute -bottom-6 -left-2 sm:-left-8"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-3 rounded-xl border border-[#E8ECF1] bg-white px-4 py-3 shadow-xl"
        >
          <div className="rounded-lg bg-[#EBF2FF] p-2">
            <Ticket className="h-4 w-4 text-[#2B7FFF]" />
          </div>
          <div>
            <p className="text-[11px] text-[#6B7280]">Ticket vendu</p>
            <p className="text-sm font-bold text-[#1A1D26]">Pass 24h · x3</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating: wifi */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.8, ease }}
        className="absolute -right-1 bottom-10 hidden sm:block"
      >
        <motion.div
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-2xl bg-[#2B7FFF] p-3 shadow-xl shadow-[#2B7FFF]/30"
        >
          <Wifi className="h-6 w-6 text-white" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(#C7D6F5 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        <motion.div
          className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#2B7FFF]/20 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-[#7C9CFF]/20 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-14 lg:flex-row lg:gap-16">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#EBF2FF] px-4 py-1.5 text-sm font-medium text-[#2B7FFF]"
            >
              <Zap className="h-4 w-4" />
              Plateforme de gestion WiFi pour l&apos;Afrique
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="text-4xl font-bold leading-[1.15] text-[#0B1E4D] sm:text-5xl xl:text-6xl"
            >
              Gérez vos zones WiFi.
              <span className="mt-2 flex justify-center lg:justify-start">
                <RotatingText
                  texts={["Encaissez en Mobile Money", "Vendez vos tickets", "Supervisez à distance", "Connectez l'Afrique"]}
                  mainClassName="px-3 sm:px-4 bg-[#2B7FFF] text-white overflow-hidden py-1 sm:py-1.5 rounded-xl justify-center"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.02}
                  splitLevelClassName="overflow-hidden pb-0.5"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2600}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#6B7280] lg:mx-0"
            >
              FLUXIONWIFI vous permet de monétiser vos hotspots MikroTik avec des tickets prépayés,
              des portails captifs personnalisés et le paiement Mobile Money intégré.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <Link
                href="/register"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2B7FFF] px-6 text-base font-medium text-white shadow-lg shadow-[#2B7FFF]/30 transition-all hover:bg-[#1A6BE6] hover:shadow-xl sm:w-auto"
              >
                Créer mon compte
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#D1D5DB] bg-white px-6 text-base font-medium text-[#374151] transition-colors hover:bg-[#F5F7FA] sm:w-auto"
              >
                <Activity className="h-4 w-4" />
                Comment ça marche
              </a>
            </motion.div>
            <p className="mt-4 text-xs text-[#9CA3AF]">Gratuit · Aucune carte requise</p>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {chips.map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.1, ease }}
                  whileHover={{ y: -3 }}
                  className="rounded-xl border border-[#E8ECF1] bg-white/80 px-3 py-2.5 text-left backdrop-blur"
                >
                  <p className="text-sm font-semibold text-[#0B1E4D]">{c.label}</p>
                  <p className="text-[11px] text-[#6B7280]">{c.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mockup */}
          <div className="w-full flex-1 px-2 sm:px-8 lg:px-0">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
