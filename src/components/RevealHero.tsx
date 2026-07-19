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

// „Před vyčištěním" — šedý štítek: signalizuje špinavý, zašlý stav.
const LABEL_STYLE = {
  fontSize: "clamp(11px, 1.75vw, 17px)",
  color: "var(--color-cream-paper)",
  textShadow: "0 1px 6px rgba(16,24,32,0.4)",
  backgroundColor: "rgba(95,104,112,0.6)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
} as const;

// „Po vyčištění" — štítek se s odhalením čisté fotky prosvětlí do žluté,
// takže přechod šedá → žlutá signalizuje umytí do čista.
const LABEL_STYLE_AFTER = {
  ...LABEL_STYLE,
  color: "var(--color-botanical-ink)",
  textShadow: "none",
  backgroundColor: "rgba(245,194,52,0.75)",
} as const;

// Glass applied per headline line so the blur sits only behind the text,
// not the empty space between the lines.
const HEADLINE_GLASS = {
  backgroundColor: "rgba(16,24,32,0.1)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
} as const;

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

        {/* Hero headline - vertically centered, offset from the viewport's left
            edge with a clamp so it stays far-left on desktop yet never clips on
            smaller screens. */}
        <div className={`pointer-events-none absolute left-0 right-0 z-10 flex px-5 lg:px-10 ${mobile ? "bottom-7 items-end" : "inset-y-0 items-center"}`}>
          <h1
            className="rise-in flex flex-col items-start gap-0 font-bold uppercase"
            style={{
              fontSize: mobile ? "38px" : "clamp(42px, 11vw, 72px)",
              lineHeight: mobile ? 0.92 : 0.78,
              letterSpacing: "-0.03em",
              textShadow: "0 2px 20px rgba(16,24,32,0.55)",
              // Darker (10%) over the dirty photo, brightening to white as the
              // clean image is revealed (tracks the scroll progress --p).
              color: mobile
                ? "#fbfdfe"
                : "color-mix(in srgb, #e2e4e5, #fbfdfe calc(var(--p, 0) * 100%))",
            }}
          >
            {(mobile ? [rh.headlineLines.join(" ")] : rh.headlineLines).map((line, i) => (
              <span
                key={i}
                className={mobile ? "" : "px-[0.32em] py-[0.22em]"}
                style={mobile ? undefined : HEADLINE_GLASS}
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

        {/* State label in the top-right - "Před" fades out, "Po" fades in as you
            scroll. The prefix/suffix split is anchored at a fixed point so the
            shared word "vyčištění(m)" never moves between the two states. */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute right-[calc(36px_+_6.2*clamp(11px,1.75vw,17px))] top-[20px]"
            style={{ opacity: "calc(1 - var(--p))" }}
          >
            <span
              className="micro-label absolute right-0 top-0 whitespace-nowrap rounded-l-full py-2 pl-3.5 pr-1.5 font-bold"
              style={LABEL_STYLE}
            >
              {rh.labelBeforePrefix}
            </span>
            <span
              className="micro-label absolute left-0 top-0 whitespace-nowrap rounded-r-full py-2 pl-1.5 pr-3.5 font-bold"
              style={LABEL_STYLE}
            >
              {rh.labelBeforeSuffix}
            </span>
          </div>
          <div
            className="absolute right-[calc(36px_+_6.2*clamp(11px,1.75vw,17px))] top-[20px]"
            style={{ opacity: "var(--p)" }}
          >
            <span
              className="micro-label absolute right-0 top-0 whitespace-nowrap rounded-l-full py-2 pl-3.5 pr-1.5 font-bold"
              style={LABEL_STYLE_AFTER}
            >
              {rh.labelAfterPrefix}
            </span>
            <span
              className="micro-label absolute left-0 top-0 whitespace-nowrap rounded-r-full py-2 pl-1.5 pr-3.5 font-bold"
              style={LABEL_STYLE_AFTER}
            >
              {rh.labelAfterSuffix}
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
