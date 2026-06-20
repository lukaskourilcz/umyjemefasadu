/**
 * Brand logo - the real Umyjeme Fasádu mark (Poseidon mascot with a
 * pressure-washer lance, magenta "UMYJEME FASÁDU" wordmark, black roofline
 * and cyan water splash). The artwork lives as an optimized SVG in
 * ./logo.svg and is inlined here via Vite's `?raw` import so it scales
 * crisply at any size and keeps a single source of truth.
 *
 * Both variants render the same full emblem; they differ only in size:
 *   variant="compact" - small, ~36px tall, wrapped in a home link (nav, footer).
 *   variant="full"    - large emblem for the hero.
 */
import logoRaw from "../assets/logo.svg?raw";
import logoNavRaw from "../assets/logo-nav.svg?raw";

type Variant = "compact" | "full";
type Source = "default" | "nav";

// Pull the artwork (everything inside <svg>…</svg>) and the viewBox straight
// from each optimized file, so editing the .svg is all it takes to update.
function parse(raw: string) {
  return {
    viewBox: raw.match(/viewBox="([^"]*)"/)?.[1] ?? "0 0 100 100",
    inner: raw.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, ""),
  };
}
const ART: Record<Source, ReturnType<typeof parse>> = {
  default: parse(logoRaw),
  nav: parse(logoNavRaw),
};

export default function Logo({
  className = "",
  variant = "compact",
  height = 36,
  source = "default",
}: {
  className?: string;
  variant?: Variant;
  height?: number;
  source?: Source;
}) {
  const label = "Umyjeme Fasádu";
  const art = ART[source];

  const svg = (
    <svg
      viewBox={art.viewBox}
      height={height}
      role="img"
      aria-label={label}
      className={variant === "compact" ? undefined : className}
      style={{ display: "block", width: "auto" }}
      dangerouslySetInnerHTML={{ __html: art.inner }}
    />
  );

  if (variant === "compact") {
    return (
      <a
        href="#top"
        className={`inline-flex ${className}`}
        aria-label={`${label}, domů`}
      >
        {svg}
      </a>
    );
  }

  return svg;
}
