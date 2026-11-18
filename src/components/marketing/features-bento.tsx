"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Globe, Ticket, Wallet, Shield, Users, Smartphone, Check } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

function Card({
  className = "",
  index,
  icon,
  title,
  description,
  children,
}: {
  className?: string;
  index: number;
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease }}
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-xl hover:shadow-[#2B7FFF]/10 ${className}`}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#2B7FFF]/0 blur-2xl transition-colors duration-500 group-hover:bg-[#2B7FFF]/15" />
      <div className="relative w-fit rounded-xl bg-[#EBF2FF] p-3 text-[#2B7FFF]">{icon}</div>
      <h3 className="relative mt-4 text-base font-semibold text-[#1A1D26]">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-[#6B7280]">{description}</p>
      {children && <div className="relative mt-5 flex-1">{children}</div>}
    </motion.div>
  );
}

const operators = ["Orange Money", "MTN MoMo", "Moov Money", "Wave", "FedaPay", "CinetPay"];

export function FeaturesBento() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* 1 Portail */}
      <Card
        index={0}
        className="lg:col-span-2"
        icon={<Globe className="h-6 w-6" />}
        title="Portail Captif"
        description="Pages de connexion WiFi personnalisées avec votre marque et vos couleurs."
      >
        <div className="mx-auto flex max-w-sm items-center gap-4 rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] p-4">
          <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-[#2B7FFF] to-[#0B1E4D]" />
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-2/3 rounded bg-[#0B1E4D]/80" />
            <div className="h-2 w-full rounded bg-[#D1D5DB]" />
            <motion.div
              className="h-7 rounded-lg bg-[#2B7FFF]"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
          </div>
        </div>
      </Card>

      {/* 2 Tickets */}
      <Card
        index={1}
        icon={<Ticket className="h-6 w-6" />}
        title="Tickets WiFi"
        description="Générez et vendez des tickets avec codes uniques en quelques clics."
      >
        <div className="relative h-16">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 flex items-center justify-between rounded-lg border border-dashed border-[#2B7FFF]/40 bg-white px-3 py-2 text-xs font-mono text-[#0B1E4D] shadow-sm"
              style={{ top: i * 8, zIndex: 3 - i, scale: 1 - i * 0.04 }}
              whileHover={{ y: -4 * (i + 1) }}
            >
              <span>FX-{["4K9Q", "7TW2", "B3MD"][i]}</span>
              <span className="text-[#2B7FFF]">24h</span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* 3 Paiement */}
      <Card
        index={2}
        icon={<Wallet className="h-6 w-6" />}
        title="Paiement Mobile Money"
        description="Encaissez via FedaPay, CinetPay et tous les opérateurs locaux."
      >
        <div className="flex flex-wrap gap-1.5">
          {operators.slice(0, 4).map((o) => (
            <span key={o} className="rounded-full bg-[#F5F7FA] px-2.5 py-1 text-[11px] font-medium text-[#374151]">
              {o}
            </span>
          ))}
        </div>
      </Card>

      {/* 4 VPN */}
      <Card
        index={3}
        className="lg:col-span-2"
        icon={<Shield className="h-6 w-6" />}
        title="VPN & Accès distant"
        description="Gérez vos routeurs à distance via WireGuard ou SSTP en toute sécurité."
      >
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <div className="rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-4 py-3 text-xs font-medium text-[#374151]">Vous</div>
          <div className="relative h-0.5 w-16 bg-[#E8ECF1] sm:w-32">
            <motion.span
              className="absolute -top-[3px] h-2 w-2 rounded-full bg-[#2B7FFF] shadow-[0_0_8px_rgba(43,127,255,0.8)]"
              animate={{ left: ["0%", "100%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-[#0B1E4D] px-4 py-3 text-xs font-medium text-white">
            <Shield className="h-3.5 w-3.5 text-[#7CB0FF]" /> WireGuard
          </div>
          <div className="relative h-0.5 w-16 bg-[#E8ECF1] sm:w-32">
            <motion.span
              className="absolute -top-[3px] h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              animate={{ left: ["0%", "100%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
            />
          </div>
          <div className="rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-4 py-3 text-xs font-medium text-[#374151]">MikroTik</div>
        </div>
      </Card>

      {/* 5 Vendeurs */}
      <Card
        index={4}
        className="lg:col-span-2"
        icon={<Users className="h-6 w-6" />}
        title="Gestion des vendeurs"
        description="Attribuez des stocks de tickets et suivez les performances de votre équipe."
      >
        <ul className="space-y-2">
          {[
            { n: "Vendeur A", w: 82 },
            { n: "Vendeur B", w: 56 },
            { n: "Vendeur C", w: 34 },
          ].map((v, i) => (
            <li key={v.n} className="flex items-center gap-3 text-xs text-[#6B7280]">
              <span className="w-16 shrink-0">{v.n}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F0F2F5]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#2B7FFF] to-[#7CB0FF]"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${v.w}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.15, ease }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* 6 Mobile */}
      <Card
        index={5}
        icon={<Smartphone className="h-6 w-6" />}
        title="100% Mobile"
        description="Interface optimisée smartphone. Gérez votre réseau de n'importe où."
      >
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <Check className="h-4 w-4 text-emerald-500" /> Installable, rapide, sans PC
        </div>
      </Card>
    </div>
  );
}
