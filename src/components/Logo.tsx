/**
 * Brand logo - the real Umyjeme Fasádu mark (Poseidon mascot with a
 * pressure-washer lance, magenta "UMYJEME FASÁDU" wordmark, black roofline
 * and cyan water splash).
 *
 * Two artworks: the standalone vector (`logo.svg`, used in the footer) and a
 * transparent, delivery-optimised WebP nav emblem. Size is driven by the
 * caller via `height` (and/or responsive height classes in `className`).
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
      {...(source === "nav" ? { fetchpriority: "high" } : {})}
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
