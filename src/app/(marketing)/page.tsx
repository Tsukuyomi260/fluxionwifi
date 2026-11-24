import { AnimatedSteps } from "@/components/marketing/animated-steps";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { HeroSection } from "@/components/marketing/hero-section";
import { MarqueeStrip } from "@/components/marketing/marquee-strip";
import { StatsCounter } from "@/components/marketing/stats-counter";
import { FeaturesBento } from "@/components/marketing/features-bento";
import { PricingSection } from "@/components/marketing/pricing-section";
import { CountriesSection } from "@/components/marketing/countries-section";
import { CtaCard } from "@/components/marketing/cta-card";
import { SectionTitle } from "@/components/marketing/section-title";
import { Footer7 } from "@/components/ui/footer-7";
import { Navbar } from "@/components/layout/navbar";
import { ScrollProgressBar } from "@/components/layout/scroll-progress-bar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white scroll-smooth">
      {/* Scroll Progress Bar & Floating Morphing Navbar */}
      <ScrollProgressBar />
      <Navbar />

      <HeroSection />
      <MarqueeStrip />

      {/* Features */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionTitle
              eyebrow="Fonctionnalités"
              title="Tout ce dont vous avez"
              accent="besoin"
              subtitle="Une plateforme complète pour gérer, monétiser et superviser vos zones WiFi."
            />
          </ScrollReveal>
          <FeaturesBento />
        </div>
      </section>

      <StatsCounter />

      {/* Countries & currencies */}
      <section id="countries" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionTitle
              eyebrow="Couverture"
              title="Présent dans toute"
              accent="l'Afrique"
              subtitle="Chaque pays a sa devise : vos prix et vos paiements s'adaptent automatiquement."
            />
          </ScrollReveal>
          <CountriesSection />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <SectionTitle
              eyebrow="Démarrage"
              title="Opérationnel en"
              accent="4 étapes"
              subtitle="De l'inscription à la première vente en moins de 10 minutes."
            />
          </ScrollReveal>
          <div className="rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFC] px-4 py-12 sm:px-8">
            <AnimatedSteps />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#F5F7FA] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionTitle
              eyebrow="Tarifs"
              title="Simples et"
              accent="transparents"
              subtitle="Commencez gratuitement, passez à Pro quand vous êtes prêt."
            />
          </ScrollReveal>
          <PricingSection />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <CtaCard />
          </ScrollReveal>
        </div>
      </section>

      <Footer7 />
    </div>
  );
}
