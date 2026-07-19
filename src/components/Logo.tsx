/**
 * Brand logo - the real Umyjeme Fasádu mark (Poseidon mascot with a
 * pressure-washer lance, magenta "UMYJEME FASÁDU" wordmark, black roofline
 * and cyan water splash).
 *
 * Two artworks: the standalone vector (`logo.svg`, used in the footer) and the
 * larger raster-backed nav emblem (`logo-nav.svg`). Both are imported as URLs
 * and rendered as <img> so the heavy nav artwork loads as a separate cacheable
 * asset instead of being inlined into the JS bundle. Size is driven by the
 * caller via `height` (and/or responsive height classes in `className`).
 */
import logoUrl from "../assets/logo.svg";
import logoNavUrl from "../assets/logo-nav.svg";

type Source = "default" | "nav";

const SRC: Record<Source, string> = {
  default: logoUrl,
  nav: logoNavUrl,
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
      className={className}
      style={{ display: "block", width: "auto" }}
    />
  );
}
