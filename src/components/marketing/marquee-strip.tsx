"use client";

import { motion } from "motion/react";

const items = [
  "Orange Money",
  "MTN MoMo",
  "Moov Money",
  "Wave",
  "FedaPay",
  "CinetPay",
  "MikroTik",
  "WireGuard",
  "RADIUS",
  "Portail captif",
];

export function MarqueeStrip() {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-[#E8ECF1] bg-white py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
      <motion.div
        className="flex w-max gap-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((t, i) => (
          <span
            key={i}
            className="whitespace-nowrap rounded-full border border-[#E8ECF1] bg-[#F5F7FA] px-5 py-2 text-sm font-medium text-[#374151]"
          >
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
