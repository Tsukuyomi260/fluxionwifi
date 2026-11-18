"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useTransform, motion } from "motion/react";

const stats = [
  { value: 10, suffix: " min", label: "Pour être opérationnel" },
  { value: 24, suffix: "/7", label: "Supervision à distance" },
  { value: 100, suffix: "%", label: "Optimisé pour mobile" },
  { value: 4, suffix: "", label: "Étapes de l'inscription à la vente" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, mv, value]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function StatsCounter() {
  return (
    <section className="relative overflow-hidden bg-[#0B1E4D] px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#2B7FFF]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#7C9CFF]/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="text-center"
          >
            <p className="text-4xl font-bold text-white sm:text-5xl">
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-sm text-white/70">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
