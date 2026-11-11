"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  Check,
  ChevronRight,
  Zap,
  Server,
  Monitor,
  Globe,
  CreditCard,
  Settings,
  RefreshCw,
  Info,
} from "lucide-react";

type IntegrationMode = "manuel" | "radius" | "mikhmon" | "fai";

interface Step {
  id: string;
  title: string;
  done: boolean;
}

const modes: {
  key: IntegrationMode;
  name: string;
  icon: typeof Monitor;
  desc: string;
}[] = [
  {
    key: "manuel",
    name: "Manuel",
    icon: Monitor,
    desc: "Vos tickets viennent de VOTRE MikHmon. Le moins d'automatisme, le plus simple à démarrer.",
  },
  {
    key: "radius",
    name: "Serveur RADIUS",
    icon: Server,
    desc: "Le ticket est créé à la demande, comme en MikHmon VPN, mais les comptes vivent sur le serveur RADIUS — centralisé, pour plusieurs routeurs.",
  },
  {
    key: "mikhmon",
    name: "MikHmon VPN",
    icon: Zap,
    desc: "Le ticket est créé sur le routeur au moment de la vente. Aucun stock à gérer.",
  },
  {
    key: "fai",
    name: "Mode FAI",
    icon: Globe,
    desc: "Pour un Fournisseur d'Accès Internet agréé qui couvre des promoteurs de wifi zone : tickets par RADIUS, prélèvement sur leurs ventes.",
  },
];

export default function IntegrationPage() {
  const [selectedMode, setSelectedMode] = useState<IntegrationMode>("radius");
  const [steps, setSteps] = useState<Step[]>([
    { id: "choix", title: "Choix de l'intégration", done: true },
    { id: "souscription", title: "Souscription", done: true },
    { id: "coordinateur", title: "Le Coordinateur", done: true },
    { id: "portail", title: "Portail Captif", done: false },
    { id: "tickets", title: "Création de Tickets", done: false },
    { id: "routeur", title: "Configuration Routeur", done: false },
    { id: "vendeurs", title: "Ajout de Vendeurs", done: false },
    { id: "paiement", title: "Paiement Mobile", done: false },
    { id: "test", title: "Test de Connexion", done: false },
    { id: "lancement", title: "Lancement", done: false },
  ]);

  const doneCount = steps.filter((s) => s.done).length;
  const progress = Math.round((doneCount / steps.length) * 100);
  const currentPhase = Math.ceil(
    ((doneCount + 1) / steps.length) * 4
  );

  function toggleStep(id: string) {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s))
    );
  }

  function handleReset() {
    setSteps((prev) => prev.map((s) => ({ ...s, done: false })));
    setSelectedMode("radius");
  }

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-[#0F172A] p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar */}
        <div className="lg:w-72 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-violet-400">
              Mon intégration
            </h1>
            <Link
              href="/dashboard"
              className="p-1.5 rounded-lg hover:bg-[#1E293B] text-slate-400"
            >
              <X className="h-5 w-5" />
            </Link>
          </div>

          {/* Progress ring */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="10"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 3.52} ${352 - progress * 3.52}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {progress}%
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400">
                  Prêt
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-white">
              🚀 {progress >= 100 ? "Vous êtes prêt !" : "Vous y êtes presque"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {doneCount} sur {steps.length} · mode{" "}
              {modes.find((m) => m.key === selectedMode)?.name}
            </p>
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`h-3 w-3 rounded-full transition-colors ${
                  s.done ? "bg-emerald-500" : "bg-[#334155]"
                }`}
              />
            ))}
          </div>

          <div className="space-y-2">
            <button className="w-full rounded-xl border border-[#334155] px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-[#1E293B] transition-colors">
              Guide-moi pas à pas
            </button>
            <button className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
              Je suis à l&apos;aise
            </button>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 min-w-0">
          {/* Phase header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Préparer
              </span>
              <span className="text-sm text-slate-500">
                Votre compte et votre matériel
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-400">
              {Math.min(currentPhase, 4)}/4
            </span>
          </div>

          {/* Step 1: Choix de l'intégration */}
          <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  steps[0].done
                    ? "bg-emerald-500"
                    : "bg-[#334155]"
                }`}
              >
                {steps[0].done ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <span className="text-xs font-bold text-slate-400">1</span>
                )}
              </div>
              <h2 className="text-base font-bold text-white">
                Choix de l&apos;intégration
              </h2>
              {steps[0].done && (
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                  Fait
                </span>
              )}
              <button className="ml-auto p-1 rounded-lg hover:bg-[#334155] text-slate-500">
                <Info className="h-4 w-4" />
              </button>
            </div>

            {/* Mode cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {modes.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setSelectedMode(m.key)}
                  className={`rounded-xl p-4 text-left transition-all ${
                    selectedMode === m.key
                      ? "bg-[#0F172A] border-2 border-emerald-500 shadow-lg shadow-emerald-500/10"
                      : "bg-[#0F172A] border border-[#334155] hover:border-[#475569]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <m.icon
                      className={`h-4 w-4 ${
                        selectedMode === m.key
                          ? "text-emerald-400"
                          : "text-slate-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        selectedMode === m.key
                          ? "text-emerald-400"
                          : "text-white"
                      }`}
                    >
                      {m.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {m.desc}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={() => toggleStep("choix")}
              className="inline-flex items-center gap-2 rounded-lg bg-[#334155] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-[#475569] transition-colors"
            >
              Rouvrir
            </button>
          </div>

          {/* Step 2: Souscription */}
          <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-5 mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  steps[1].done
                    ? "bg-emerald-500"
                    : "bg-[#334155]"
                }`}
              >
                {steps[1].done ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <span className="text-xs font-bold text-slate-400">2</span>
                )}
              </div>
              <h2 className="text-base font-bold text-white">Souscription</h2>
              {steps[1].done && (
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                  Fait
                </span>
              )}
              <button className="ml-auto p-1 rounded-lg hover:bg-[#334155] text-slate-500">
                <Info className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 ml-11">
              <Link
                href="/finance/billing"
                className="inline-flex items-center gap-2 rounded-lg bg-[#334155] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-[#475569] transition-colors"
              >
                <CreditCard className="h-4 w-4" />
                Ouvrir la page
              </Link>
            </div>
          </div>

          {/* Step 3: Le Coordinateur */}
          <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-5 mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  steps[2].done
                    ? "bg-emerald-500"
                    : "bg-[#334155]"
                }`}
              >
                {steps[2].done ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <span className="text-xs font-bold text-slate-400">3</span>
                )}
              </div>
              <h2 className="text-base font-bold text-white">
                Le Coordinateur
              </h2>
              {steps[2].done && (
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                  Fait
                </span>
              )}
              <button className="ml-auto p-1 rounded-lg hover:bg-[#334155] text-slate-500">
                <Info className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 ml-11 space-y-2">
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#334155] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-[#475569] transition-colors">
                <Settings className="h-4 w-4" />
                Revoir la commande d&apos;installation
              </button>
              <button className="block inline-flex items-center gap-2 rounded-lg bg-[#334155] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-[#475569] transition-colors">
                <RefreshCw className="h-4 w-4" />
                Changer de méthode
              </button>
            </div>
          </div>

          {/* Remaining steps checklist */}
          <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-5 mb-4">
            <h3 className="text-sm font-bold text-white mb-3">
              Étapes restantes
            </h3>
            <div className="space-y-2">
              {steps.slice(3).map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => toggleStep(s.id)}
                  className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-left hover:bg-[#0F172A] transition-colors"
                >
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                      s.done ? "bg-emerald-500" : "bg-[#334155]"
                    }`}
                  >
                    {s.done ? (
                      <Check className="h-3.5 w-3.5 text-white" />
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400">
                        {i + 4}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      s.done ? "text-emerald-400 line-through" : "text-slate-300"
                    }`}
                  >
                    {s.title}
                  </span>
                  {s.done && (
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase ml-auto">
                      Fait
                    </span>
                  )}
                  {!s.done && (
                    <ChevronRight className="h-4 w-4 text-slate-500 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 px-5 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Réinitialiser
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-[#1E293B] border border-[#334155] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#334155] transition-colors">
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
