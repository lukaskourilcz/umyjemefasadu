import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useContent } from "../content";

// Reading time scales with quote length.
const quoteMs = (text: string) => Math.min(6000 + text.length * 55, 16000);

/**
 * One quote at a time; it holds long enough to read (progress bar shows how
 * long), then the next one animates in. No rotation under reduced-motion.
 */
export default function QuoteRotator() {
  const { quotesLabel, quotes: QUOTES } = useContent().whyUs;
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const safeIndex = index % Math.max(QUOTES.length, 1);

  useEffect(() => {
    if (reduced || QUOTES.length === 0) return;
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % QUOTES.length),
      quoteMs(QUOTES[safeIndex].text),
    );
    return () => clearTimeout(id);
  }, [index, reduced, QUOTES, safeIndex]);

  if (QUOTES.length === 0) return null;
  const q = QUOTES[safeIndex];

  return (
    <div
      className="mt-12 border-t pt-6"
      style={{ borderColor: "var(--color-eucalyptus)" }}
    >
      <span className="micro-label text-botanical-ink/50">{quotesLabel}</span>

      {/* key remount re-runs the entrance animation per quote */}
      <figure key={index} className="quote-in mx-auto min-h-44 max-w-[400px]">
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
