import Image from "next/image";
import Link from "next/link";
import { getDefaultCountry } from "@/lib/currency";
import {
  Wifi,
  Globe,
  Ticket,
  Wallet,
  Shield,
  Users,
  Smartphone,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import { AnimatedSteps } from "@/components/marketing/animated-steps";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

const features = [
  {
    icon: Globe,
    title: "Portail Captif",
    description: "Pages de connexion WiFi personnalisées avec votre marque et vos couleurs.",
  },
  {
    icon: Ticket,
    title: "Tickets WiFi",
    description: "Créez, générez et vendez des tickets avec codes uniques en quelques clics.",
  },
  {
    icon: Wallet,
    title: "Paiement Mobile Money",
    description: "Acceptez les paiements via FedaPay, CinetPay et tous les opérateurs locaux.",
  },
  {
    icon: Shield,
    title: "VPN & Accès distant",
    description: "Gérez vos routeurs à distance via WireGuard ou SSTP en toute sécurité.",
  },
  {
    icon: Users,
    title: "Gestion des vendeurs",
    description: "Attribuez des stocks de tickets et suivez les performances de votre équipe.",
  },
  {
    icon: Smartphone,
    title: "100% Mobile",
    description: "Interface optimisée pour smartphone. Gérez votre réseau depuis n'importe où.",
  },
];

const cur = getDefaultCountry().currency.code;

const pricing = [
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
    price: "15 000",
    period: `${cur}/mois`,
    description: "Pour les opérateurs WiFi actifs",
    features: [
      "5 routeurs",
      "Tickets illimités",
      "Portails personnalisés",
      "VPN inclus",
      "Gestion vendeurs",
      "Support prioritaire",
    ],
    cta: "Essai gratuit 14 jours",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Sur mesure",
    period: "",
    description: "Pour les grandes organisations",
    features: [
      "Routeurs illimités",
      "API complète",
      "Console RADIUS",
      "Multi-sites",
      "Account manager dédié",
      "SLA garanti",
    ],
    cta: "Nous contacter",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E8ECF1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/logo.jpg" alt="FLUXIONWIFI" width={32} height={32} className="rounded-lg sm:rounded-xl sm:w-9 sm:h-9" />
              <span className="text-base sm:text-lg font-bold text-[#0B1E4D]">FLUXIONWIFI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[#6B7280] hover:text-[#1A1D26] transition-colors">Fonctionnalités</a>
              <a href="#how-it-works" className="text-sm text-[#6B7280] hover:text-[#1A1D26] transition-colors">Comment ça marche</a>
              <a href="#pricing" className="text-sm text-[#6B7280] hover:text-[#1A1D26] transition-colors">Tarifs</a>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login" className="hidden sm:inline text-sm font-medium text-[#374151] hover:text-[#1A1D26] transition-colors">
                Se connecter
              </Link>
              <Link href="/register" className="inline-flex h-9 items-center rounded-xl bg-[#2B7FFF] px-4 text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors shadow-sm">
                Commencer
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal delay={0.1} distance={20}>
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF2FF] px-4 py-1.5 text-sm font-medium text-[#2B7FFF]">
                <Zap className="h-4 w-4" />
                Plateforme #1 de gestion WiFi en Afrique
              </div>
            </div>
          </ScrollReveal>
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <ScrollReveal delay={0.2} distance={25}>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-bold text-[#0B1E4D] leading-tight">
                  Gérez vos zones WiFi.{" "}
                  <span className="text-[#2B7FFF]">Encaissez en Mobile Money.</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.35}>
                <p className="mt-6 text-lg text-[#6B7280] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  FLUXIONWIFI vous permet de monétiser vos hotspots WiFi avec des tickets prépayés,
                  des portails captifs personnalisés et le paiement Mobile Money intégré.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.5}>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                  <Link href="/register" className="inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl bg-[#2B7FFF] px-5 sm:px-6 text-sm sm:text-base font-medium text-white hover:bg-[#1A6BE6] transition-colors shadow-md w-full sm:w-auto">
                    Créer mon compte
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href="#how-it-works" className="inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl border border-[#D1D5DB] px-5 sm:px-6 text-sm sm:text-base font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors w-full sm:w-auto">
                    Comment ça marche
                  </a>
                </div>
                <p className="mt-4 text-xs text-[#9CA3AF] text-center lg:text-left">Gratuit · Aucune carte requise</p>
              </ScrollReveal>
            </div>

            {/* Image */}
            <ScrollReveal delay={0.3} direction="right" distance={40} className="flex-1 w-full max-w-lg lg:max-w-none">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#2B7FFF]/20 to-[#0B1E4D]/10 rounded-3xl blur-2xl" />
                <Image
                  src="/hero-main.jpg"
                  alt="Entrepreneur utilisant un smartphone pour gérer son réseau WiFi"
                  width={600}
                  height={450}
                  className="relative rounded-2xl shadow-2xl object-cover w-full"
                  priority
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-[#0B1E4D]">Tout ce dont vous avez besoin</h2>
              <p className="mt-3 text-[#6B7280] max-w-xl mx-auto">
                Une plateforme complète pour gérer, monétiser et superviser vos zones WiFi.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={0.1 + i * 0.1}>
                <div className="rounded-2xl bg-white border border-[#E8ECF1] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow h-full">
                  <div className="rounded-xl bg-[#EBF2FF] p-3 w-fit">
                    <feature.icon className="h-6 w-6 text-[#2B7FFF]" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[#1A1D26]">{feature.title}</h3>
                  <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-[#0B1E4D]">Opérationnel en 4 étapes</h2>
              <p className="mt-3 text-[#6B7280]">De l&apos;inscription à la première vente en moins de 10 minutes.</p>
            </div>
          </ScrollReveal>
          <AnimatedSteps />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F7FA]">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-[#0B1E4D]">Tarifs simples et transparents</h2>
              <p className="mt-3 text-[#6B7280]">Commencez gratuitement, passez à Pro quand vous êtes prêt.</p>
            </div>
          </ScrollReveal>
          <div className="grid gap-6 lg:grid-cols-3">
            {pricing.map((plan, i) => (
              <ScrollReveal key={plan.name} delay={0.15 * i}>
                <div
                  className={`rounded-2xl p-6 h-full ${
                    plan.highlighted
                      ? "bg-[#0B1E4D] text-white ring-2 ring-[#2B7FFF] shadow-xl scale-[1.02]"
                      : "bg-white border border-[#E8ECF1] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-[#2B7FFF] px-3 py-1 text-xs font-medium text-white mb-4">
                      <Star className="h-3 w-3" /> Populaire
                    </div>
                  )}
                  <h3 className={`text-lg font-semibold ${plan.highlighted ? "text-white" : "text-[#1A1D26]"}`}>
                    {plan.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${plan.highlighted ? "text-white" : "text-[#1A1D26]"}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`text-sm ${plan.highlighted ? "text-white/70" : "text-[#6B7280]"}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className={`mt-2 text-sm ${plan.highlighted ? "text-white/70" : "text-[#6B7280]"}`}>
                    {plan.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`h-4 w-4 shrink-0 ${plan.highlighted ? "text-[#2B7FFF]" : "text-emerald-500"}`} />
                        <span className={plan.highlighted ? "text-white/90" : "text-[#374151]"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`mt-6 block text-center h-11 leading-[44px] rounded-xl text-sm font-medium transition-colors ${
                      plan.highlighted
                        ? "bg-[#2B7FFF] text-white hover:bg-[#1A6BE6]"
                        : "border border-[#D1D5DB] text-[#374151] hover:bg-[#F5F7FA]"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-[#0B1E4D]">Prêt à connecter votre monde ?</h2>
            <p className="mt-4 text-[#6B7280] text-lg">
              Rejoignez les opérateurs WiFi qui utilisent FLUXIONWIFI pour gérer et monétiser leurs hotspots.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <Link href="/register" className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-[#2B7FFF] px-8 text-base font-medium text-white hover:bg-[#1A6BE6] transition-colors shadow-md">
              Créer mon compte gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8ECF1] bg-[#F5F7FA] py-10 px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="none" duration={0.8}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.jpg" alt="FLUXIONWIFI" width={28} height={28} className="rounded-lg" />
              <span className="text-sm font-semibold text-[#0B1E4D]">FLUXIONWIFI</span>
            </div>
            <p className="text-xs text-[#9CA3AF]">
              © 2026 FLUXIONWIFI. Connecte votre monde.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-[#6B7280] hover:text-[#1A1D26]">Conditions</a>
              <a href="#" className="text-xs text-[#6B7280] hover:text-[#1A1D26]">Confidentialité</a>
              <a href="#" className="text-xs text-[#6B7280] hover:text-[#1A1D26]">Contact</a>
            </div>
          </div>
        </ScrollReveal>
      </footer>
    </div>
  );
}
