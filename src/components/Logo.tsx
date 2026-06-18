/**
 * Brand logo — the real Umyjeme Fasádu mark (Poseidon mascot with a
 * pressure-washer lance, magenta "UMYJEME FASÁDU" wordmark, black roofline
 * and cyan water splash). The artwork lives as an optimized SVG in
 * ./logo.svg and is inlined here via Vite's `?raw` import so it scales
 * crisply at any size and keeps a single source of truth.
 *
 * Both variants render the same full emblem; they differ only in size:
 *   variant="compact" — small, ~36px tall, wrapped in a home link (nav, footer).
 *   variant="full"    — large emblem for the hero.
 */
import logoRaw from "./logo.svg?raw";

type Variant = "compact" | "full";

// Pull the artwork (everything inside <svg>…</svg>) and the viewBox straight
// from the optimized file, so editing logo.svg is all it takes to update both.
const VIEW_BOX = logoRaw.match(/viewBox="([^"]*)"/)?.[1] ?? "0 0 100 100";
const INNER = logoRaw.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

export default function Logo({
  className = "",
  variant = "compact",
  height = 36,
}: {
  className?: string;
  variant?: Variant;
  height?: number;
}) {
  const label = "Umyjeme Fasádu";

  const svg = (
    <svg
      viewBox={VIEW_BOX}
      height={height}
      role="img"
      aria-label={label}
      className={variant === "compact" ? undefined : className}
      style={{ display: "block", width: "auto" }}
      dangerouslySetInnerHTML={{ __html: INNER }}
    />
  );

  if (variant === "compact") {
    return (
      <a
        href="#top"
        className={`inline-flex ${className}`}
        aria-label={`${label} — domů`}
      >
        {svg}
      </a>
    );
  }

  return svg;
}
