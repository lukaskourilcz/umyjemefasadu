import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

// TODO: nahraďte skutečnými referencemi zákazníků.
const QUOTES = [
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fasáda vypadá jako nová, sed do eiusmod tempor incididunt ut labore et dolore.",
    name: "Jana N.",
    meta: "Brno · mytí fasády",
  },
  {
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    name: "Miroslav K.",
    meta: "Vyškov · čištění střechy",
  },
  {
    text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    name: "SVJ Letná",
    meta: "Hodonín · fasáda + nano",
  },
];

// Reading time scales with quote length.
const quoteMs = (text: string) => Math.min(3200 + text.length * 40, 10000);

/**
 * One quote at a time; it holds long enough to read (progress bar shows how
 * long), then the next one animates in. No rotation under reduced-motion.
 */
export default function QuoteRotator() {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % QUOTES.length),
      quoteMs(QUOTES[index].text),
    );
    return () => clearTimeout(id);
  }, [index, reduced]);

  const q = QUOTES[index];

  return (
    <div
      className="mt-12 max-w-[400px] border-t pt-6"
      style={{ borderColor: "var(--color-eucalyptus)" }}
    >
      <div className="flex items-baseline justify-between">
        <span className="micro-label text-botanical-ink/50">Řekli o nás</span>
        <span
          className="font-fragment-mono text-botanical-ink/40"
          style={{ fontSize: "12px", letterSpacing: "0.02em" }}
        >
          {index + 1} / {QUOTES.length}
        </span>
      </div>

      {/* key remount re-runs the entrance animation per quote */}
      <figure key={index} className="quote-in m-0 min-h-44">
        <blockquote
          className="mt-4 text-botanical-ink"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(16px, 1.3vw, 19px)",
            lineHeight: 1.45,
            maxWidth: "38ch",
            textIndent: "-0.45em",
          }}
        >
          &bdquo;{q.text}&ldquo;
        </blockquote>

        {/* Attribution - right-aligned, eased off the edge */}
        <figcaption className="mt-5 pr-6 text-right">
          <div
            className="text-botanical-ink"
            style={{ fontSize: "14px", fontWeight: 700 }}
          >
            {q.name}
          </div>
          <div
            className="font-fragment-mono mt-0.5 text-botanical-ink/50"
            style={{ fontSize: "12px", letterSpacing: "0.02em" }}
          >
            {q.meta}
          </div>
        </figcaption>
      </figure>

      {/* Time-to-next-quote indicator, synced to the hold duration */}
      {!reduced && (
        <span
          className="mt-5 block h-[2px] w-full overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--color-lichen)" }}
        >
          <span
            key={index}
            className="progress-fill block h-full w-full rounded-full"
            style={{
              backgroundColor: "var(--color-forest-floor)",
              animationDuration: `${quoteMs(q.text)}ms`,
            }}
          />
        </span>
      )}
    </div>
  );
}
