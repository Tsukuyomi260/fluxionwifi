import React from "react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

interface Footer7Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Produit",
    links: [
      { name: "Fonctionnalités", href: "/#features" },
      { name: "Comment ça marche", href: "/#how-it-works" },
      { name: "Tarifs", href: "/#pricing" },
    ],
  },
  {
    title: "Compte",
    links: [
      { name: "Se connecter", href: "/login" },
      { name: "Créer un compte", href: "/register" },
      { name: "Tableau de bord", href: "/dashboard" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { name: "Aide", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Confidentialité", href: "#" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaFacebook className="size-5" />, href: "#", label: "Facebook" },
  { icon: <FaInstagram className="size-5" />, href: "#", label: "Instagram" },
  { icon: <FaTwitter className="size-5" />, href: "#", label: "Twitter" },
  { icon: <FaLinkedin className="size-5" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Conditions d'utilisation", href: "#" },
  { name: "Politique de confidentialité", href: "#" },
];

export const Footer7 = ({
  logo = {
    url: "/",
    src: "/logo.svg",
    alt: "FLUXIONWIFI",
    title: "FLUXIONWIFI",
  },
  sections = defaultSections,
  description = "Plateforme de gestion et de monétisation de hotspots WiFi MikroTik pour l'Afrique. Connectez votre monde.",
  socialLinks = defaultSocialLinks,
  copyright = `© 2026 FLUXIONWIFI. Tous droits réservés.`,
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <footer className="border-t border-[#E8ECF1] bg-[#F5F7FA] px-4 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex w-full flex-col justify-between gap-12 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            {/* Logo */}
            <div className="flex items-center gap-2 lg:justify-start">
              <Link href={logo.url} className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt={logo.alt} title={logo.title} className="h-8 rounded-lg" />
                <h2 className="text-xl font-semibold text-[#0B1E4D]">{logo.title}</h2>
              </Link>
            </div>
            <p className="max-w-[90%] text-sm leading-relaxed text-[#6B7280] sm:max-w-[70%]">
              {description}
            </p>
            <ul className="flex items-center space-x-5 text-[#6B7280]">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="font-medium transition-colors hover:text-[#2B7FFF]">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full grid-cols-2 gap-8 md:grid-cols-3 lg:gap-16">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-[#0B1E4D]">{section.title}</h3>
                <ul className="space-y-3 text-sm text-[#6B7280]">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx} className="font-medium transition-colors hover:text-[#2B7FFF]">
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-[#E8ECF1] py-8 text-xs font-medium text-[#6B7280] md:flex-row md:items-center md:text-left">
          <p className="order-2 md:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row md:gap-6">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="transition-colors hover:text-[#2B7FFF]">
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
