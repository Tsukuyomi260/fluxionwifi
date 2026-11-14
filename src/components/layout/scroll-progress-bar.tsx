"use client";

import { useEffect, useState } from "react";

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    function calculateScrollProgress(target?: EventTarget | null) {
      // 1. Essayer d'abord la cible de scroll si c'est un HTMLElement avec overflow
      if (target && target instanceof HTMLElement && target.scrollHeight > target.clientHeight) {
        const maxScroll = target.scrollHeight - target.clientHeight;
        if (maxScroll > 0) {
          return Math.min(Math.max(target.scrollTop / maxScroll, 0), 1);
        }
      }

      // 2. Chercher dans les conteneurs scrollables potentiels (comme le main du dashboard)
      const mainEl = document.querySelector("main");
      if (mainEl && mainEl.scrollHeight > mainEl.clientHeight) {
        const maxScroll = mainEl.scrollHeight - mainEl.clientHeight;
        if (maxScroll > 0) {
          return Math.min(Math.max(mainEl.scrollTop / maxScroll, 0), 1);
        }
      }

      // 3. Fallback sur le document global / window
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        return Math.min(Math.max(window.scrollY / docHeight, 0), 1);
      }

      return 0;
    }

    function onScroll(e: Event) {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setProgress(calculateScrollProgress(e.target));
          ticking = false;
        });
        ticking = true;
      }
    }

    setProgress(calculateScrollProgress());
    // capture: true permet d'intercepter les scrolls sur window ET sur <main> overflow-y-auto
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", () => setProgress(calculateScrollProgress()));

    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", () => setProgress(calculateScrollProgress()));
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left pointer-events-none transition-transform duration-75 ease-out"
      style={{
        transform: `scaleX(${progress})`,
        background: "linear-gradient(90deg, #008EFF 0%, #2B7FFF 50%, #0044BD 100%)",
      }}
    />
  );
}
