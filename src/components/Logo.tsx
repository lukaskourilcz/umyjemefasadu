/**
 * Brand logo - the real Umyjeme Fasádu mark (Poseidon mascot with a
 * pressure-washer lance, magenta "UMYJEME FASÁDU" wordmark, black roofline
 * and cyan water splash).
 *
 * Two artworks: the standalone vector (`logo.svg`, used in the footer) and a
 * delivery-optimised WebP nav emblem (`/media/logo-nav.webp`, ~25 kB) that
 * replaces the heavy 860 kB raster-backed SVG. Both render as <img> so the nav
 * artwork loads as a separate cacheable asset instead of being inlined into the
 * JS bundle. Size is driven by the caller via `height` (and/or responsive
 * height classes in `className`).
 */
import logoUrl from "../assets/logo.svg";

type Source = "default" | "nav";

const SRC: Record<Source, string> = {
  default: logoUrl,
  nav: "/media/logo-nav.webp",
};

export default function Logo({
  className = "",
  height = 36,
  source = "default",
}: {
  className?: string;
  height?: number;
  source?: Source;
}) {
  return (
    <img
      src={SRC[source]}
      alt="Umyjeme Fasádu"
      height={height}
      loading={source === "nav" ? "eager" : "lazy"}
      decoding="async"
      className={className}
      style={{ display: "block", width: "auto" }}
    />
  );
}
