"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { useCurrency } from "@/hooks/use-currency";
import { convertFromCDF, formatAmount } from "@/lib/pricing";
import {
  Monitor,
  Wrench,
  HardHat,
  ShoppingCart,
  Clock,
  Star,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Loader2,
  Ticket,
} from "lucide-react";

type ServiceCategory =
  | "fluxionwifi"
  | "maintenance"
  | "installation"
  | "equipement";

const categories: {
  key: ServiceCategory;
  name: string;
  icon: typeof Monitor;
  desc: string;
  sub: string;
}[] = [
  {
    key: "fluxionwifi",
    name: "FLUXIONWIFI",
    icon: Monitor,
    desc: "À distance ou sur site",
    sub: "11 services",
  },
  {
    key: "maintenance",
    name: "Maintenance réseau",
    icon: Wrench,
    desc: "Diagnostic, réglages, intervention",
    sub: "8 services",
  },
  {
    key: "installation",
    name: "Installation sur site",
    icon: HardHat,
    desc: "Routeur, Starlink, antenne, déport",
    sub: "7 services",
  },
  {
    key: "equipement",
    name: "Vente d'équipement",
    icon: ShoppingCart,
    desc: "Équipements neufs et d'occasion",
    sub: "Neuf et occasion",
  },
];

interface ServiceItem {
  name: string;
  desc?: string;
  tag: string; // "Gratuit" | "Prioritaire" | prix
  price?: number; // en CDF
}

const serviceDetails: Record<Exclude<ServiceCategory, "equipement">, ServiceItem[]> = {
  fluxionwifi: [
    { name: "Intégration du système", tag: "Prioritaire" },
    { name: "Activation du service VPN", tag: "Prioritaire" },
    { name: "Gestion et ajout de tickets", tag: "Prioritaire" },
    { name: "Mise à jour du portail captif", tag: "Prioritaire" },
    { name: "Gestion des bonus fidélité client", tag: "Prioritaire" },
    { name: "Gestion des données", tag: "Prioritaire" },
    { name: "Création d'un partenaire revendeur", tag: "Prioritaire" },
    { name: "Impression de tickets", tag: "Prioritaire" },
    { name: "Création de compte associé", tag: "Prioritaire" },
    { name: "Activation de l'identification des clients", tag: "Prioritaire" },
    { name: "Autre", tag: "Prioritaire" },
  ],
  maintenance: [
    { name: "Diagnostic du routeur — gratuit (offre promotionnelle)", desc: "Diagnostic du routeur gratuit — offre promotionnelle", tag: "Gratuit" },
    { name: "Intervention sur le routeur", tag: "Prioritaire" },
    { name: "Diagnostic des antennes — gratuit (offre promotionnelle)", desc: "Diagnostic des antennes gratuit — offre promotionnelle", tag: "Gratuit" },
    { name: "Intervention sur les antennes", tag: "Prioritaire" },
    { name: "Diagnostic du réseau — gratuit (offre promotionnelle)", desc: "Diagnostic du réseau gratuit — offre promotionnelle", tag: "Gratuit" },
    { name: "Intervention sur le réseau", tag: "Prioritaire" },
    { name: "Installation de routeur MikroTik", tag: "Prioritaire" },
    { name: "Intervention à distance — Archiver les rapports MikHmon", desc: "Nous archivons puis retirons du boîtier les rapports de vente MikHmon de plus d'un mois (sauvegarde conservée chez nous). Le boîtier et MikHmon redeviennent rapides.", tag: "Prioritaire" },
  ],
  installation: [
    { name: "Installation de routeur (MikroTik…)", tag: "", price: 36000 },
    { name: "Installation de kit Starlink", tag: "", price: 67500 },
    { name: "Installation d'antenne réseau", tag: "", price: 6750 },
    { name: "Liaison point à point (déport)", tag: "", price: 90000 },
    { name: "Pack WiFi zone — Essentiel", desc: "Routeur + accessoires + système de vente physique et en ligne", tag: "", price: 292500 },
    { name: "Pack WiFi zone — Complet", desc: "Routeur + accessoires + antennes + système de vente physique et en ligne + VPN de gestion à distance", tag: "", price: 472500 },
    { name: "Autre installation", tag: "", price: 40500 },
  ],
};

interface Product { name: string; cond: "Neuf" | "Occasion"; stock: string; price: number }
const catalog: { group: string; items: Product[] }[] = [
  { group: "ANTENNES", items: [
    { name: "Répéteur WiFi", cond: "Neuf", stock: "Sur commande", price: 65000 },
    { name: "TP-Link WA855RE", cond: "Neuf", stock: "Sur commande", price: 90000 },
    { name: "NanoStation M5", cond: "Neuf", stock: "Sur commande", price: 297000 },
    { name: "Lite Beam 5AC Gen 2", cond: "Neuf", stock: "Sur commande", price: 283000 },
    { name: "Unifi AP Pro AC", cond: "Neuf", stock: "Sur commande", price: 486000 },
  ] },
  { group: "CÂBLAGE & ACCESSOIRES", items: [
    { name: "Switch Gigabit 4 ports", cond: "Neuf", stock: "Sur commande", price: 72000 },
    { name: "Pince à sertir", cond: "Neuf", stock: "Sur commande", price: 81000 },
    { name: "Adaptateur PoE 24 V", cond: "Neuf", stock: "Sur commande", price: 81000 },
    { name: "Switch PoE 8 ports Gigabit", cond: "Neuf", stock: "Sur commande", price: 261000 },
  ] },
  { group: "ÉNERGIE (ONDULEUR, SOLAIRE)", items: [
    { name: "Mini onduleur 8 000 mAh", cond: "Neuf", stock: "Sur commande", price: 126000 },
  ] },
  { group: "ROUTEURS", items: [
    { name: "Routeur Huawei", cond: "Occasion", stock: "Plus que 1", price: 90000 },
    { name: "MikroTik RB951", cond: "Neuf", stock: "Sur commande", price: 193500 },
    { name: "MikroTik hAP ax2", cond: "Neuf", stock: "Sur commande", price: 328500 },
    { name: "MikroTik hAP ax3", cond: "Neuf", stock: "Sur commande", price: 463500 },
  ] },
  { group: "STARLINK", items: [
    { name: "Starlink Standard + MikroTik commercial", cond: "Neuf", stock: "Plus que 1", price: 2275000 },
  ] },
];

export default function ServicesPage() {
  const { user } = useUser();
  const { currency } = useCurrency();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [place, setPlace] = useState<"distance" | "site">("distance");
  const [placeNote, setPlaceNote] = useState("");
  const [delivery, setDelivery] = useState<"retrait" | "livraison">("retrait");
  const [cart, setCart] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleContinue() {
    if (step === 1 && name && email) setStep(2);
    else if (step === 2 && selectedCategory) setStep(3);
    else if (step === 3 && selectedCategory === "equipement" && cart.length > 0) {
      setSelectedService(cart.join(", "));
      setStep(4);
    } else if (step === 3 && selectedService) setStep(4);
    else if (step === 4) handleSubmit();
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="-m-4 lg:-m-6 min-h-full bg-[#0F172A] p-4 lg:p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Demande envoyée !
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Un opérateur certifié prendra en charge votre demande sous 5h
            maximum. Vous recevrez une notification par email.
          </p>
          <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-4 mb-6">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>FLUXIONWIFI</span>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-amber-400 font-bold">
                ASSISTANCE
              </span>
            </div>
            <p className="text-sm font-semibold text-white mb-1">
              {selectedCategory
                ? categories.find((c) => c.key === selectedCategory)?.name
                : "—"}
            </p>
            <p className="text-xs text-slate-400">{selectedService || "—"}</p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-[#0F172A] p-4 lg:p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Wrench className="h-5 w-5 text-amber-400" />
          <span className="text-lg font-bold text-amber-400">
            FLUXIONWIFI
          </span>
        </div>
        <Link
          href="/support"
          className="inline-flex items-center gap-2 rounded-lg bg-[#1E293B] border border-[#334155] px-4 py-2 text-sm font-medium text-white hover:bg-[#334155] transition-colors"
        >
          <Ticket className="h-4 w-4" />
          Mes tickets
        </Link>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="h-1 bg-[#1E293B] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2B7FFF] rounded-full transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-slate-500 mb-6">
        Étape {step} sur 4 ·{" "}
        {step === 1
          ? "Vos coordonnées"
          : step === 2
          ? "Votre demande"
          : step === 3
          ? "Détail du service"
          : "Confirmation"}
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: main content */}
        <div className="flex-1 min-w-0">
          {/* Step 1: Hero + Contact form */}
          {step === 1 && (
            <>
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400 mb-4">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  5 opérateurs en ligne maintenant
                </span>
                <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mt-3">
                  Votre WiFi zone{" "}
                  <span className="text-amber-400">ne s&apos;arrête plus.</span>
                </h1>
                <p className="text-sm text-slate-400 mt-3 max-w-lg">
                  Dépannage, maintenance, installation ou équipement :
                  dites-nous ce qu&apos;il vous faut, un opérateur certifié
                  s&apos;en charge — et vous suivez tout, étape par étape.
                </p>
              </div>

              {/* Category cards preview */}
              <div className="mb-8">
                <p className="text-sm font-semibold text-white mb-2">
                  Que vous faut-il ?
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Choisissez maintenant, ou à l&apos;étape suivante.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => {
                        setSelectedCategory(cat.key);
                        setStep(2);
                      }}
                      className="flex items-start gap-3 rounded-xl bg-[#1E293B] border border-[#334155] p-4 text-left hover:border-amber-500/50 transition-colors group"
                    >
                      <div className="rounded-lg bg-[#334155] p-2.5 shrink-0 group-hover:bg-amber-500/20 transition-colors">
                        <cat.icon className="h-5 w-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {cat.name}
                        </p>
                        <p className="text-xs text-slate-400">{cat.desc}</p>
                        <p className="text-xs text-amber-400 mt-1">
                          {cat.sub}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-[#1E293B] border border-[#334155] p-4">
                  <Clock className="h-5 w-5 text-amber-400 mb-2" />
                  <p className="text-sm font-semibold text-white">
                    Réponse sous 1 h
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    En prioritaire ; sous 5 h en gratuit. Délai garanti,
                    affiché avant l&apos;envoi.
                  </p>
                </div>
                <div className="rounded-xl bg-[#1E293B] border border-[#334155] p-4">
                  <Star className="h-5 w-5 text-amber-400 mb-2" />
                  <p className="text-sm font-semibold text-white">
                    Opérateurs certifiés
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Identité vérifiée, notés par les clients.
                  </p>
                </div>
                <div className="rounded-xl bg-[#1E293B] border border-[#334155] p-4">
                  <ShieldCheck className="h-5 w-5 text-amber-400 mb-2" />
                  <p className="text-sm font-semibold text-white">
                    Rien sans votre accord
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Aucune intervention sans votre autorisation écrite.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Category selection */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-amber-400">🔧</span> De quoi
                s&apos;agit-il ?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`rounded-xl p-5 text-left transition-all ${
                      selectedCategory === cat.key
                        ? "bg-[#1E293B] border-2 border-amber-500 shadow-lg shadow-amber-500/10"
                        : "bg-[#1E293B] border border-[#334155] hover:border-[#475569]"
                    }`}
                  >
                    <cat.icon
                      className={`h-6 w-6 mb-3 ${
                        selectedCategory === cat.key
                          ? "text-amber-400"
                          : "text-slate-500"
                      }`}
                    />
                    <p className="text-base font-bold text-white">
                      {cat.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{cat.desc}</p>
                    <p className="text-xs text-amber-400 mt-2">{cat.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Service detail */}
          {step === 3 && selectedCategory && (
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                {categories.find((c) => c.key === selectedCategory)?.name}
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                {categories.find((c) => c.key === selectedCategory)?.desc}
              </p>

              {selectedCategory !== "equipement" && (
                <div className="space-y-2">
                  {serviceDetails[selectedCategory].map((svc) => (
                    <button
                      key={svc.name}
                      onClick={() => setSelectedService(svc.name)}
                      className={`w-full flex items-center gap-3 rounded-xl px-5 py-4 text-left transition-all ${
                        selectedService === svc.name
                          ? "bg-amber-500/10 border-2 border-amber-500"
                          : "bg-[#1E293B] border border-[#334155] hover:border-[#475569]"
                      }`}
                    >
                      <div className={`h-3 w-3 rounded-full border-2 shrink-0 ${selectedService === svc.name ? "border-amber-500 bg-amber-500" : "border-[#475569]"}`} />
                      <span className="flex-1">
                        <span className={`block text-sm font-medium ${selectedService === svc.name ? "text-amber-400" : "text-slate-300"}`}>{svc.name}</span>
                        {svc.desc && <span className="mt-0.5 block text-xs text-slate-500">{svc.desc}</span>}
                      </span>
                      {svc.price ? (
                        <span className="shrink-0 text-sm font-bold text-white">{formatAmount(convertFromCDF(svc.price, currency))} {currency}</span>
                      ) : (
                        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${svc.tag === "Gratuit" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>{svc.tag}</span>
                      )}
                    </button>
                  ))}

                  <div className="mt-5 rounded-xl border border-[#334155] bg-[#1E293B] p-4">
                    <p className="mb-1 text-sm font-bold text-white">Où intervenons-nous ? <span className="text-xs font-normal text-slate-500">Facultatif — accès à distance ou position sur site</span></p>
                    <div className="mt-3 flex gap-2">
                      {(["distance", "site"] as const).map((k) => (
                        <button key={k} onClick={() => setPlace(k)} className={`rounded-lg px-4 py-2 text-xs font-semibold ${place === k ? "bg-amber-500 text-white" : "bg-[#0F172A] text-slate-300 border border-[#334155]"}`}>{k === "distance" ? "À distance" : "Sur site"}</button>
                      ))}
                    </div>
                    {place === "site" && (
                      <div className="mt-3 space-y-2">
                        <button
                          onClick={() => navigator.geolocation?.getCurrentPosition((pos) => setPlaceNote(`Position détectée : ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`), () => setPlaceNote("Position indisponible : saisissez le lieu ci-dessous."))}
                          className="rounded-lg border border-[#334155] bg-[#0F172A] px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-[#334155]"
                        >
                          Détecter ma position
                        </button>
                        <label className="block text-xs text-slate-400">Précisions sur le site (facultatif)</label>
                        <input value={placeNote} onChange={(e) => setPlaceNote(e.target.value)} placeholder="Ex. site de Baka, secteur nord" className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedCategory === "equipement" && (
                <div className="space-y-5">
                  {catalog.map((g) => (
                    <div key={g.group}>
                      <p className="mb-2 text-[11px] font-extrabold tracking-wider text-amber-400">{g.group}</p>
                      <div className="space-y-2">
                        {g.items.map((it) => {
                          const inCart = cart.includes(it.name);
                          return (
                            <div key={it.name} className="flex items-center gap-3 rounded-xl border border-[#334155] bg-[#1E293B] px-4 py-3">
                              <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${it.cond === "Neuf" ? "bg-emerald-500/20 text-emerald-400" : "bg-sky-500/20 text-sky-300"}`}>{it.cond}</span>
                              <span className="flex-1">
                                <span className="block text-sm font-semibold text-white">{it.name}</span>
                                <span className="text-xs text-slate-500">{it.stock}</span>
                              </span>
                              <span className="text-sm font-bold text-white">{formatAmount(convertFromCDF(it.price, currency))} {currency}</span>
                              <button onClick={() => setCart((c) => (inCart ? c.filter((x) => x !== it.name) : [...c, it.name]))} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${inCart ? "bg-emerald-500 text-white" : "bg-amber-500 text-white hover:bg-amber-600"}`}>{inCart ? "Ajouté" : "Ajouter"}</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-4">
                    <p className="text-sm font-bold text-white">{cart.length === 0 ? "Votre panier est vide" : `Panier : ${cart.length} article(s)`}</p>
                    <div className="mt-3 flex gap-2">
                      {(["retrait", "livraison"] as const).map((k) => (
                        <button key={k} onClick={() => setDelivery(k)} className={`rounded-lg px-4 py-2 text-xs font-semibold ${delivery === k ? "bg-amber-500 text-white" : "bg-[#0F172A] text-slate-300 border border-[#334155]"}`}>{k === "retrait" ? "Retrait" : "Livraison"}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Confirmez votre demande
              </h2>
              <div className="rounded-xl bg-[#1E293B] border border-[#334155] p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">Nom</p>
                    <p className="text-sm text-white mt-0.5">{name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">
                      Email
                    </p>
                    <p className="text-sm text-white mt-0.5">{email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">
                      Catégorie
                    </p>
                    <p className="text-sm text-white mt-0.5">
                      {categories.find((c) => c.key === selectedCategory)
                        ?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">
                      Service
                    </p>
                    <p className="text-sm text-white mt-0.5">
                      {selectedService || "—"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Description (optionnel)
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez votre besoin plus en détail..."
                    className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="h-12 w-12 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-slate-400 hover:bg-[#334155] transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={
                (step === 1 && (!name || !email)) ||
                (step === 2 && !selectedCategory) ||
                (step === 3 && (selectedCategory === "equipement" ? cart.length === 0 : !selectedService)) ||
                submitting
              }
              className="flex-1 h-12 rounded-xl bg-amber-500 text-base font-semibold text-white hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : step === 4 ? (
                "Envoyer la demande"
              ) : (
                <>
                  Continuer <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Ticket preview + contact form */}
        <div className="lg:w-80 shrink-0">
          {/* Ticket card */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-5 mb-6 text-white relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Ticket className="h-32 w-32" />
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold">FLUXIONWIFI</span>
              <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                Assistance
              </span>
            </div>
            <p className="text-[10px] uppercase opacity-70">Ticket</p>
            <p className="text-lg font-bold">TK- - - - -</p>
            <div className="mt-3 text-xs opacity-70">
              <p>Réponse</p>
              <p className="text-base font-bold opacity-100">sous 5 h</p>
            </div>
          </div>

          {/* Coordonnées form */}
          <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-5">
            <h3 className="text-sm font-bold text-white mb-1">
              Vos coordonnées
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Pour vous répondre et vous tenir informé à chaque avancée.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Votre nom ou pseudo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="FLUXIONWIFI"
                  className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Votre adresse e-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemple.com"
                  className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Votre téléphone
                </label>
                <div className="flex gap-2">
                  <div className="relative w-24 shrink-0">
                    <select className="w-full appearance-none rounded-xl border border-[#334155] bg-[#0F172A] px-3 pr-7 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500">
                      <option>+229</option>
                      <option>+243</option>
                      <option>+225</option>
                      <option>+221</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="00 00 00 00"
                    className="flex-1 rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  C&apos;est par là que passent les SMS de suivi. Recommandé.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-4">
              Déjà une demande en cours ?{" "}
              <Link
                href="/support"
                className="text-amber-400 hover:underline font-medium"
              >
                Suivre mes tickets
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
