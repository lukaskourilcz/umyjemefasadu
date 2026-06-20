import { useEffect, useState } from "react";

/**
 * Returns true once the page has scrolled past `threshold` pixels. Used for
 * scroll-triggered chrome (e.g. the nav background, the sticky call bar).
 */
export function useScrolledPast(threshold: number): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return past;
}
