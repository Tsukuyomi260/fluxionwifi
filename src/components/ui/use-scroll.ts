"use client";

import { useEffect, useState } from "react";

export function useScroll(threshold: number = 0): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function getScrollTop(): number {
      const mainEl = document.querySelector("main");
      if (mainEl && mainEl.scrollHeight > mainEl.clientHeight) {
        return mainEl.scrollTop;
      }
      return window.scrollY || document.documentElement.scrollTop || 0;
    }

    function handleScroll() {
      setScrolled(getScrollTop() > threshold);
    }

    handleScroll();
    // capture: true permet d'intercepter les événements scroll de <main> ET de window
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", handleScroll, { capture: true });
  }, [threshold]);

  return scrolled;
}
