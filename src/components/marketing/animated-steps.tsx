"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  { step: "01", title: "Créez votre compte", description: "Inscription gratuite en 2 minutes" },
  { step: "02", title: "Configurez votre routeur", description: "Connectez votre MikroTik en quelques clics" },
  { step: "03", title: "Personnalisez votre portail", description: "Choisissez un thème et ajoutez votre logo" },
  { step: "04", title: "Vendez vos tickets", description: "Commencez à générer des revenus immédiatement" },
];

export function AnimatedSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Desktop horizontal */}
      <div className="hidden lg:block">
        <div className="relative max-w-4xl mx-auto">
          {/* Steps row */}
          <div className="flex items-start justify-between">
            {steps.map((s, i) => (
              <div
                key={s.step}
                className="relative flex flex-col items-center text-center w-1/4 z-10"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.6s ease ${0.3 + i * 0.4}s, transform 0.6s ease ${0.3 + i * 0.4}s`,
                }}
              >
                <div className="relative">
                  <svg className="h-14 w-14" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="26" fill="white" stroke="#E8ECF1" strokeWidth="2" />
                    <circle
                      cx="28" cy="28" r="26"
                      fill="none"
                      stroke="#2B7FFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="163.36"
                      strokeDashoffset={visible ? "0" : "163.36"}
                      style={{
                        transition: `stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1) ${0.5 + i * 0.4}s`,
                      }}
                      transform="rotate(-90 28 28)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-sm font-bold text-[#2B7FFF]"
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "scale(1)" : "scale(0.5)",
                        transition: `all 0.4s ease ${0.7 + i * 0.4}s`,
                      }}
                    >
                      {s.step}
                    </span>
                  </div>
                  {visible && (
                    <div
                      className="absolute inset-0 rounded-full border-2 border-[#2B7FFF] animate-step-pulse"
                      style={{ animationDelay: `${1.0 + i * 0.4}s` }}
                    />
                  )}
                </div>
                <h3 className="mt-4 text-base font-semibold text-[#1A1D26]">{s.title}</h3>
                <p className="mt-2 text-sm text-[#6B7280] max-w-[180px]">{s.description}</p>
              </div>
            ))}
          </div>

          {/* 3 separate line segments between circles */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute top-7 h-[2px] bg-[#E8ECF1]"
              style={{
                left: `calc(${12.5 + i * 25}% + 30px)`,
                right: `calc(${62.5 - i * 25}% + 30px)`,
              }}
            >
              <div
                className="h-full bg-[#2B7FFF] origin-left"
                style={{
                  transform: visible ? "scaleX(1)" : "scaleX(0)",
                  transition: `transform 0.6s cubic-bezier(0.4,0,0.2,1) ${0.7 + i * 0.4}s`,
                }}
              />
              {visible && (
                <span
                  className="step-dot"
                  style={{ animationDelay: `${1.0 + i * 0.5}s` }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile vertical */}
      <div className="lg:hidden">
        <div className="relative pl-10">
          <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-[#E8ECF1]">
            <div
              className="w-full bg-[#2B7FFF] origin-top"
              style={{
                height: visible ? "100%" : "0%",
                transition: "height 2s cubic-bezier(0.4,0,0.2,1) 0.3s",
              }}
            />
          </div>

          <div className="space-y-10">
            {steps.map((s, i) => (
              <div
                key={s.step}
                className="relative flex items-start gap-5"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-15px)",
                  transition: `opacity 0.6s ease ${0.4 + i * 0.35}s, transform 0.6s ease ${0.4 + i * 0.35}s`,
                }}
              >
                <div className="absolute -left-10">
                  <div className="relative">
                    <svg className="h-10 w-10" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="18" fill="white" stroke="#E8ECF1" strokeWidth="2" />
                      <circle
                        cx="20" cy="20" r="18"
                        fill="none"
                        stroke="#2B7FFF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="113.1"
                        strokeDashoffset={visible ? "0" : "113.1"}
                        style={{ transition: `stroke-dashoffset 0.7s ease ${0.5 + i * 0.35}s` }}
                        transform="rotate(-90 20 20)"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#2B7FFF]">
                      {s.step}
                    </span>
                  </div>
                </div>
                <div className="pt-1.5">
                  <h3 className="text-base font-semibold text-[#1A1D26]">{s.title}</h3>
                  <p className="mt-1 text-sm text-[#6B7280]">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .step-dot {
          position: absolute;
          top: 50%;
          left: 0;
          width: 6px;
          height: 6px;
          margin-top: -3px;
          border-radius: 50%;
          background: #2B7FFF;
          box-shadow: 0 0 8px rgba(43, 127, 255, 0.6);
          opacity: 0;
          animation: travelDot 1.2s ease-in-out forwards;
        }
        @keyframes travelDot {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        :global(.animate-step-pulse) {
          animation: stepPulse 1s ease-out forwards;
          opacity: 0;
        }
        @keyframes stepPulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
