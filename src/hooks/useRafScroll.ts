import { useEffect, useRef } from "react";

/**
 * Runs `onFrame` on scroll and resize, throttled to one call per animation
 * frame, and once on mount. The latest `onFrame` is always used (kept in a ref),
 * so callers can close over fresh state/props without re-subscribing.
 *
 * Encapsulates the requestAnimationFrame + passive-listener + cleanup boilerplate
 * shared by the scroll-driven hero animations.
 */
export function useRafScroll(onFrame: () => void): void {
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      onFrameRef.current();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}
