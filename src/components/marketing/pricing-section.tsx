"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle, Star } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import { PRO_ANNUAL_MONTHS, PRO_MONTHLY_CDF, convertFromCDF, formatAmount } from "@/lib/pricing";

const ease = [0.16, 1, 0.3, 1] as const;

export function PricingSection() {
  const { currency } = useCurrency();
  const [annual, setAnnual] = useState(false);
  const monthly = convertFromCDF(PRO_MONTHLY_CDF, currency);
  const proPrice = annual ? monthly * PRO_ANNUAL_MONTHS : monthly;

  const plans = [
    {
      name: "Starter",
      price: "Gratuit",
      period: "",
      description: "Pour démarrer et tester la plateforme",
      features: ["1 routeur", "100 tickets/mois", "1 portail captif", "Support email"],
      cta: "Commencer gratuitement",
      highlighted: false,
    },
    {
      name: "Pro",
      price: formatAmount(proPrice),
      period: annual ? `${currency}/an` : `${currency}/mois`,
      description: annual ? "2 mois offerts avec la facturation annuelle" : "Pour les opérateurs WiFi actifs",
      features: ["5 routeurs", "Tickets illimités", "Portails personnalisés", "VPN inclus", "Gestion vendeurs", "Support prioritaire"],
      cta: "Essai gratuit 14 jours",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Sur mesure",
      period: "",
      description: "Pour les grandes organisations",
      features: ["Routeurs illimités", "API complète", "Console RADIUS", "Multi-sites", "Account manager dédié", "SLA garanti"],
      cta: "Nous contacter",
      highlighted: false,
    },
  ];

  return (
    <div>
      <div className="mb-10 flex justify-center">
        <div className="relative inline-flex rounded-full border border-[#E5E7EB] bg-white p-1 text-sm font-medium">
          {[
            { label: "Mensuel", value: false },
            { label: "Annuel", value: true },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              onClick={() => setAnnual(o.value)}
              className={`relative z-10 rounded-full px-5 py-2 transition-colors ${
                annual === o.value ? "text-white" : "text-[#374151]"
              }`}
            >
              {annual === o.value && (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-[#2B7FFF]"
                  transition={{ type: "spring", damping: 28, stiffness: 320 }}
                />
              )}
              {o.label}
              {o.value && <span className="ml-1.5 text-[10px] font-semibold opacity-90">-17%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.12, ease }}
            whileHover={{ y: -6 }}
            className="relative"
          >
            {plan.highlighted && (
              <div className="absolute -inset-1 rounded-[18px] bg-gradient-to-br from-[#2B7FFF] via-[#7CB0FF] to-[#0B1E4D] opacity-60 blur-md" />
            )}
            <div
              className={`relative flex h-full flex-col rounded-[14px] p-6 ${
                plan.highlighted
                  ? "bg-[#0B1E4D] text-white shadow-xl"
                  : "border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              }`}
            >
              {plan.highlighted && (
                <div className="mb-4 inline-flex w-fit items-center gap-1 rounded-full bg-[#2B7FFF] px-3 py-1 text-xs font-medium text-white">
                  <Star className="h-3 w-3" /> Populaire
                </div>
              )}
              <h3 className={`text-lg font-semibold ${plan.highlighted ? "text-white" : "text-[#1A1D26]"}`}>{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <motion.span
                  key={plan.price}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-3xl font-bold ${plan.highlighted ? "text-white" : "text-[#1A1D26]"}`}
                >
                  {plan.price}
                </motion.span>
                {plan.period && (
                  <span className={`text-sm ${plan.highlighted ? "text-white/70" : "text-[#6B7280]"}`}>{plan.period}</span>
                )}
              </div>
              <p className={`mt-2 text-sm ${plan.highlighted ? "text-white/70" : "text-[#6B7280]"}`}>{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle className={`h-4 w-4 shrink-0 ${plan.highlighted ? "text-[#7CB0FF]" : "text-emerald-500"}`} />
                    <span className={plan.highlighted ? "text-white/90" : "text-[#374151]"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-6 flex h-11 items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-[#2B7FFF] text-white hover:bg-[#1A6BE6]"
                    : "border border-[#D1D5DB] text-[#374151] hover:bg-[#F5F7FA]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
