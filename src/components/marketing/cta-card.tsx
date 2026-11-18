"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { display } from "./fonts";

export function CtaCard() {
  return (
    <div className="relative isolate overflow-hidden rounded-[14px] bg-[#0B1E4D] px-6 py-16 text-center sm:px-12 sm:py-20">
      <motion.div
        className="absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full bg-[#2B7FFF]/40 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-16 -z-10 h-80 w-80 rounded-full bg-[#7C9CFF]/30 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#7CB0FF 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <h2 className={`${display.className} mx-auto max-w-2xl text-4xl leading-[1.1] text-white sm:text-5xl`}>
        Prêt à connecter <span className="italic text-[#7CB0FF]">votre monde ?</span>
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-white/70">
        Rejoignez les opérateurs WiFi qui utilisent FLUXIONWIFI pour gérer et monétiser leurs hotspots.
      </p>
      <Link
        href="/register"
        className="group mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-base font-medium text-[#0B1E4D] shadow-lg transition-all hover:bg-[#EBF2FF]"
      >
        Créer mon compte gratuitement
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
      <p className="mt-4 text-xs text-white/50">Essai gratuit • Aucune carte bancaire requise</p>
    </div>
  );
}
