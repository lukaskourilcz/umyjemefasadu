import { useEffect } from "react";

/**
 * Reveals elements carrying the `.fade-up` class as they scroll into view by
 * adding `.in-view` once (then unobserving). Reduced-motion users get the final
 * state immediately via CSS. Call once near the app root.
 */
export function useFadeUpReveal(): void {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".fade-up");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
