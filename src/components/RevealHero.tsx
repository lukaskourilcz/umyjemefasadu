import { useEffect, useRef, useState } from "react";
import { useRafScroll } from "../hooks/useRafScroll";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { clamp } from "../lib/utils";
import { useContent } from "../content";

/**
 * Scroll-driven before/after hero.
 *
 * The section is a tall scroll "track"; an inner panel pins (sticky) and fills
 * the viewport while you scroll through it. Scroll progress (0 → 1) drives a
 * vertical reveal: at the top you see the dirty "before" image, and scrolling
 * down wipes the clean "after" image in from the top, with a horizontal divider
 * following the reveal edge - no dragging.
 *
 * Progress is published as a single CSS custom property (`--p`) on the pinned
 * panel, so every moving part (clip-path, divider, labels) is declarative and
 * one style write happens per frame.
 *
 * Real photos drop straight in: pass `before` / `after` image paths and the
 * placeholder panels become <img> automatically.
 */
type Props = {
  before?: string; // e.g. "/reference/dum-pred.jpg"
  after?: string; // e.g. "/reference/dum-po.jpg"
  label?: string;
};

export default function RevealHero({ before, after, label }: Props) {
  const rh = useContent().revealHero;
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [mobile, setMobile] = useState(false);
  const [dragProgress, setDragProgress] = useState(50);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1199px)");
    const sync = () => setMobile(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (mobile) {
      panelRef.current?.style.setProperty("--p", (dragProgress / 100).toFixed(2));
    }
  }, [mobile, dragProgress]);

  useRafScroll(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (mobile) {
      panel.style.setProperty("--p", (dragProgress / 100).toFixed(2));
      return;
    }
    if (reduced) {
      // Static, balanced split so the before/after still reads without motion.
      panel.style.setProperty("--p", "0.5");
      return;
    }
    const track = trackRef.current;
    if (!track) return;
    const navH =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
      ) || 0;
    const rect = track.getBoundingClientRect();
    // The panel pins just under the nav (top: var(--nav-h)). Reveal begins the
    // instant the track's top reaches that pin line, so progress tracks how far
    // we've scrolled past it - starting on the very first scroll.
    const distance = rect.height - panel.offsetHeight;
    const progress =
      distance > 0 ? clamp((navH - rect.top) / distance, 0, 1) : 0;
    panel.style.setProperty("--p", progress.toFixed(4));
  });

  const hasPhotos = Boolean(before && after);

  return (
    <section
      ref={trackRef}
      aria-label="Porovnání fasády před vyčištěním a po vyčištění"
      // Short scroll track: the reveal completes in well under one extra
      // viewport so the value proposition below arrives quickly (shorter
      // still on phones, where scroll distance is expensive).
      className={`relative ${mobile ? "h-[520px]" : reduced ? "" : "h-[160vh]"}`}
      style={!mobile && reduced ? { height: "auto" } : undefined}
    >
      <div
        ref={panelRef}
        className="overflow-hidden"
        style={{
          // `--p` is updated on scroll; everything below reads it.
          ["--p" as string]: "0",
          position: mobile || reduced ? "relative" : "sticky",
          top: mobile ? 0 : "var(--nav-h, 76px)",
          height: mobile ? "520px" : reduced
            ? "min(78vh, 620px)"
            : "calc(100svh - var(--nav-h, 76px))",
        }}
      >
        {mobile && (
          <input
            type="range"
            min="0"
            max="100"
            value={dragProgress}
            onChange={(event) => setDragProgress(Number(event.target.value))}
            aria-label="Porovnání fasády před a po"
            className="absolute inset-0 z-20 m-0 h-full w-full cursor-ns-resize opacity-0"
            style={{ touchAction: "pan-y" }}
          />
        )}
        {/* AFTER - clean, full-frame. Revealed from the top down as --p grows. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: "inset(0 0 calc((1 - var(--p)) * 100%) 0)" }}
        >
          <Layer src={after} kind="after" show={hasPhotos} />
        </div>

        {/* BEFORE - dirty, sits underneath and shows wherever AFTER hasn't
            wiped in yet. */}
        <div
          className="absolute inset-0 -z-10"
          aria-hidden={hasPhotos ? undefined : true}
        >
          <Layer src={before} kind="before" show={hasPhotos} />
        </div>

        {/* Editorial headline: anchored low and left, with one continuous scrim
            instead of a separate glass rectangle behind every line. */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end ${mobile ? "px-5 pb-8" : "px-8 pb-14 lg:px-[max(48px,calc((100vw-1320px)/2))] lg:pb-16"}`}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 -z-10 h-[72%]"
            style={{ background: "linear-gradient(0deg,rgba(16,24,32,.76) 0%,rgba(16,24,32,.28) 52%,rgba(16,24,32,0) 100%)" }}
          />
          <h1
            className="rise-in flex max-w-[9ch] flex-col items-start uppercase"
            style={{
              fontFamily: "var(--font-hero)",
              fontSize: mobile ? "54px" : "clamp(76px, 9vw, 132px)",
              fontWeight: 700,
              lineHeight: 0.79,
              letterSpacing: "-0.025em",
              textShadow: "0 3px 26px rgba(16,24,32,0.4)",
              color: "var(--color-cream-paper)",
            }}
          >
            {rh.headlineLines.map((line, i) => (
              <span
                key={i}
                className={i === 1 ? "ml-[.28em]" : i === 2 ? "ml-[.08em]" : ""}
              >
                {line}
              </span>
            ))}
          </h1>
        </div>

        {/* Horizontal divider tracking the reveal edge */}
        <div
          className="pointer-events-none absolute inset-x-0"
          style={{
            top: "calc(var(--p) * 100%)",
            transform: "translateY(-50%)",
          }}
        >
          <div
            className="h-0.5 w-full"
            style={{
              backgroundColor: "var(--color-cream-paper)",
              opacity: 0.85,
            }}
          />
        </div>

        {/* Segmented state indicator stays legible at every reveal position. */}
        <div className="pointer-events-none absolute right-4 top-4 z-10 grid w-[270px] grid-cols-2 overflow-hidden rounded-[12px] border border-white/25 bg-botanical-ink/70 p-1 shadow-[0_8px_24px_rgba(16,24,32,.18)] backdrop-blur-md sm:right-7 sm:top-6 sm:w-[300px]">
          <div className="relative overflow-hidden rounded-[9px] px-3 py-2 text-cream-paper">
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-botanical-ink"
              style={{ opacity: "calc(1 - var(--p))" }}
            />
            <span className="relative flex items-center gap-2">
              <span className="font-fragment-mono text-[9px] text-cream-paper/50">01</span>
              <span className="font-fragment-mono text-[9px] font-bold uppercase tracking-[.08em] sm:text-[10px]">
                {rh.labelBeforePrefix} {rh.labelBeforeSuffix}
              </span>
            </span>
          </div>
          <div className="relative overflow-hidden rounded-[9px] px-3 py-2 text-cream-paper">
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-cyan-deep"
              style={{ opacity: "var(--p)" }}
            />
            <span className="relative flex items-center gap-2">
              <span className="font-fragment-mono text-[9px] text-cream-paper/60">02</span>
              <span className="font-fragment-mono text-[9px] font-bold uppercase tracking-[.08em] sm:text-[10px]">
                {rh.labelAfterPrefix} {rh.labelAfterSuffix}
              </span>
            </span>
          </div>
        </div>

        {/* Bottom overlay: caption + scroll cue (cue fades as you progress) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div
            className="absolute inset-x-0 bottom-0 h-40"
            style={{
              background:
                "linear-gradient(0deg, rgba(16,24,32,0.55) 0%, rgba(16,24,32,0) 100%)",
            }}
          />
          <div className={`container-page relative flex items-end justify-between gap-4 pb-8 ${mobile ? "hidden" : ""}`}>
            <div className="flex flex-wrap items-center gap-3">
              {/* Konverzní tlačítko jen na telefonech - od sm výš už stejné
                  tlačítko drží lepicí lišta nahoře, dvakrát ho tu nechceme. */}
              <a href="#kontakt" className="btn-primary pointer-events-auto sm:hidden">
                {rh.cta}
              </a>
              {label && (
                <p
                  className="font-bold text-cream-paper"
                  style={{ fontSize: "clamp(15px, 2.5vw, 19px)" }}
                >
                  {label}
                </p>
              )}
            </div>
            {!reduced && (
              <span
                className="micro-label flex items-center gap-2 text-cream-paper"
                style={{ opacity: "calc(1 - var(--p))" }}
              >
                {rh.scrollCue}
                <svg
                  width="14"
                  height="20"
                  viewBox="0 0 14 20"
                  aria-hidden="true"
                >
                  <path
                    d="M7 2 V16 M3 12 L7 16 L11 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Layer({
  src,
  kind,
  show,
}: {
  src?: string;
  kind: "before" | "after";
  show: boolean;
}) {
  if (show && src) {
    return (
      <img
        src={src}
        alt={kind === "before" ? "Fasáda před čištěním" : "Fasáda po čištění"}
        className="absolute inset-0 h-full w-full object-cover object-top"
        // Dim the "before" photo (brightness + slight transparency) so the
        // clean reveal reads brighter by contrast as it wipes in.
        style={{
          filter: kind === "before" ? "brightness(0.8)" : undefined,
          opacity: kind === "before" ? 0.9 : undefined,
        }}
      />
    );
  }
  // Placeholder until real photos are supplied - dirty vs. clean tonal split.
  const isBefore = kind === "before";
  return (
    <div
      className="absolute inset-0"
      style={{
        background: isBefore
          ? "linear-gradient(160deg, #9aa7af 0%, #7f8d95 55%, #6f7d85 100%)"
          : "linear-gradient(160deg, #d7eefb 0%, #bfe4fa 55%, #a7d8f6 100%)",
      }}
    />
  );
}
